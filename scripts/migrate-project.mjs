// One-off: copy this app's Supabase data from the current project (Sydney) to a
// new project (Mumbai). No Docker or pg_dump: rows move as JSON through SQL,
// users through the Auth Admin API with their existing bcrypt hashes, so
// everyone keeps their password.
//
// Reads:
//   source (Sydney):  .env.sydney.local  NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, SUPABASE_DB_URL
//   target (Mumbai):  .env.local         the same three names, now holding the new project
//
//   node scripts/migrate-project.mjs check    preflight only, changes nothing
//   node scripts/migrate-project.mjs copy     schema + users + data, then verify
//   node scripts/migrate-project.mjs verify   compare row counts only
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { resolve6, resolve4 } from "node:dns/promises";

function load(file) {
  const env = {};
  for (const line of readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return env;
}
function project(file) {
  const e = load(file);
  for (const k of ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "SUPABASE_DB_URL"]) {
    if (!e[k]) {
      console.error(`Missing ${k} in ${file}`);
      process.exit(1);
    }
  }
  return {
    url: e.NEXT_PUBLIC_SUPABASE_URL.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, ""),
    service: e.SUPABASE_SERVICE_ROLE_KEY,
    db: e.SUPABASE_DB_URL,
  };
}
const SRC = project(".env.sydney.local");
const DST = project(".env.local");
const mask = (s) => s.replace(/(:\/\/[^:]+:)[^@]+@/, "$1***@");

// App tables in foreign-key order. Generated columns are skipped automatically.
const TABLES = ["packages", "package_images", "package_itinerary", "bookings", "analytics_events"];

function sql(db, query) {
  const r = spawnSync("npx", ["supabase", "db", "query", "--db-url", db, query], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  const out = r.stdout || "";
  const i = out.indexOf("{");
  if (r.status !== 0 || i < 0) throw new Error(`SQL failed on ${mask(db)}: ${(r.stderr || out).slice(-500)}`);
  const parsed = JSON.parse(out.slice(i));
  if (!parsed.rows) throw new Error(`SQL error: ${out.slice(-500)}`);
  return parsed.rows;
}
const lit = (v) => `'${String(v).replace(/'/g, "''")}'`;

async function admin(p, path, init = {}) {
  const res = await fetch(p.url + path, {
    ...init,
    headers: { apikey: p.service, Authorization: `Bearer ${p.service}`, "Content-Type": "application/json", ...(init.headers || {}) },
  });
  const text = await res.text();
  let body;
  try { body = JSON.parse(text); } catch { body = text; }
  return { status: res.status, body };
}

async function regionOf(dbUrl) {
  const host = new URL(dbUrl).hostname;
  const ips = [...(await resolve6(host).catch(() => [])), ...(await resolve4(host).catch(() => []))];
  const ranges = await fetch("https://ip-ranges.amazonaws.com/ip-ranges.json").then((r) => r.json());
  const toBig6 = (ip) => {
    const parts = ip.split("::");
    const head = parts[0] ? parts[0].split(":") : [];
    const tail = parts[1] ? parts[1].split(":") : [];
    const full = [...head, ...Array(8 - head.length - tail.length).fill("0"), ...tail];
    return full.reduce((a, h) => (a << 16n) + BigInt(parseInt(h || "0", 16)), 0n);
  };
  const toBig4 = (ip) => ip.split(".").reduce((a, o) => (a << 8n) + BigInt(o), 0n);
  for (const ip of ips) {
    const v6 = ip.includes(":");
    const list = v6 ? ranges.ipv6_prefixes.map((p) => [p.ipv6_prefix, p.region]) : ranges.prefixes.map((p) => [p.ip_prefix, p.region]);
    const n = v6 ? toBig6(ip) : toBig4(ip);
    const bits = v6 ? 128n : 32n;
    for (const [cidr, region] of list) {
      const [base, len] = cidr.split("/");
      const shift = bits - BigInt(len);
      if (((v6 ? toBig6(base) : toBig4(base)) >> shift) === (n >> shift) && region !== "GLOBAL") return { host, region };
    }
  }
  return { host, region: "unknown" };
}

function counts(db) {
  const q = `select ${[...TABLES, "profiles"].map((t) => `(select count(*) from public.${t}) as ${t}`).join(", ")}, (select count(*) from auth.users) as users`;
  return sql(db, q)[0];
}

async function check() {
  console.log("source:", mask(SRC.db));
  console.log("target:", mask(DST.db));
  const [rs, rd] = await Promise.all([regionOf(SRC.db), regionOf(DST.db)]);
  console.log(`regions: source ${rs.region}, target ${rd.region}`);
  if (rd.region !== "ap-south-1") console.warn("WARNING: target is not ap-south-1 (Mumbai).");
  if (new URL(DST.url).hostname === new URL(SRC.url).hostname || new URL(DST.db).hostname === new URL(SRC.db).hostname) throw new Error(".env.local still points at the Sydney project. Paste the Mumbai values into .env.local first.");
  const health = await admin(DST, "/auth/v1/admin/users?per_page=1");
  if (health.status !== 200) throw new Error(`Target service-role key rejected (${health.status}).`);
  const tables = sql(DST.db, "select count(*)::int as n from information_schema.tables where table_schema='public'")[0].n;
  const users = (await admin(DST, "/auth/v1/admin/users?per_page=50")).body.users?.length ?? 0;
  console.log(`target state: ${tables} public tables, ${users} users`);
  console.log("source counts:", counts(SRC.db));
  return { tables, users };
}

async function copy() {
  const state = await check();
  if (state.users > 0) throw new Error("Target already has users; refusing to copy over them.");

  console.log("\n1/4 schema");
  if (state.tables === 0) {
    const r = spawnSync("npx", ["supabase", "db", "push", "--db-url", DST.db, "--yes"], { stdio: "inherit" });
    if (r.status !== 0) throw new Error("db push failed");
  } else console.log("   public tables already exist, skipping push");

  console.log("\n2/4 users");
  const users = sql(SRC.db, "select id, email, encrypted_password, email_confirmed_at, raw_user_meta_data, created_at from auth.users order by created_at");
  const idMap = new Map();
  for (const u of users) {
    const r = await admin(DST, "/auth/v1/admin/users", {
      method: "POST",
      body: JSON.stringify({
        id: u.id,
        email: u.email,
        password_hash: u.encrypted_password,
        email_confirm: Boolean(u.email_confirmed_at),
        user_metadata: u.raw_user_meta_data ?? {},
      }),
    });
    if (r.status !== 200) throw new Error(`createUser ${u.email}: ${r.status} ${JSON.stringify(r.body).slice(0, 200)}`);
    idMap.set(u.id, r.body.id);
    console.log(`   ${u.email.replace(/^(.{2}).*(@.*)$/, "$1***$2")} ${r.body.id === u.id ? "same id" : "NEW id " + r.body.id}`);
  }
  const remap = [...idMap].filter(([a, b]) => a !== b);

  // Profiles: the signup trigger already created rows; copy role, phone, name.
  const profiles = sql(SRC.db, "select id, full_name, avatar_url, phone, role, created_at from public.profiles");
  for (const p of profiles) {
    const id = idMap.get(p.id) ?? p.id;
    sql(DST.db, `update public.profiles set full_name=${p.full_name === null ? "null" : lit(p.full_name)}, avatar_url=${p.avatar_url === null ? "null" : lit(p.avatar_url)}, phone=${p.phone === null ? "null" : lit(p.phone)}, role=${lit(p.role)}, created_at=${lit(p.created_at)} where id=${lit(id)}`);
  }
  console.log(`   ${profiles.length} profiles updated (roles and phones kept)`);

  console.log("\n3/4 data");
  for (const t of TABLES) {
    const cols = sql(SRC.db, `select column_name from information_schema.columns where table_schema='public' and table_name=${lit(t)} and is_generated='NEVER' order by ordinal_position`).map((r) => r.column_name);
    let rows = sql(SRC.db, `select coalesce(json_agg(t), '[]'::json) as j from (select ${cols.join(",")} from public.${t}) t`)[0].j;
    if (remap.length) rows = rows.map((r) => ({ ...r, ...(r.user_id && idMap.has(r.user_id) ? { user_id: idMap.get(r.user_id) } : {}) }));
    if (!rows.length) { console.log(`   ${t}: 0 rows`); continue; }
    const identity = t === "analytics_events" ? " overriding system value" : "";
    // Copied bookings may have past dates; the insert trigger would reject or
    // re-price them, so it is paused for the copy only.
    const pre = t === "bookings" ? "alter table public.bookings disable trigger bookings_set_total; " : "";
    const post = t === "bookings" ? "; alter table public.bookings enable trigger bookings_set_total" : "";
    const chunk = 500;
    for (let i = 0; i < rows.length; i += chunk) {
      const json = JSON.stringify(rows.slice(i, i + chunk));
      sql(DST.db, `${pre}insert into public.${t} (${cols.join(",")})${identity} select ${cols.join(",")} from json_populate_recordset(null::public.${t}, ${lit(json)})${post}`);
    }
    if (t === "analytics_events") sql(DST.db, "select setval(pg_get_serial_sequence('public.analytics_events','id'), (select coalesce(max(id),1) from public.analytics_events))");
    console.log(`   ${t}: ${rows.length} rows`);
  }

  console.log("\n4/4 storage");
  const objects = sql(SRC.db, "select count(*)::int as n from storage.objects where bucket_id='package-images'")[0].n;
  console.log(objects === 0 ? "   no uploaded files to copy" : `   ${objects} files need copying (not handled by this script)`);
  verify();
}

function verify() {
  const a = counts(SRC.db);
  const b = counts(DST.db);
  let ok = true;
  console.log("\ntable".padEnd(20), "source", "target");
  for (const k of Object.keys(a)) {
    const same = String(a[k]) === String(b[k]);
    ok &&= same;
    console.log(k.padEnd(19), String(a[k]).padStart(6), String(b[k]).padStart(6), same ? "" : "  MISMATCH");
  }
  console.log(ok ? "\nVERIFIED: counts match" : "\nCOUNTS DIFFER");
  if (!ok) process.exitCode = 1;
}

const cmd = process.argv[2];
try {
  if (cmd === "check") await check();
  else if (cmd === "copy") await copy();
  else if (cmd === "verify") verify();
  else console.log("usage: node scripts/migrate-project.mjs <check|copy|verify>");
} catch (e) {
  console.error("\nFAILED:", e.message);
  process.exit(1);
}
