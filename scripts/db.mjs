// Database tasks against the hosted Supabase project, no Docker and no CLI login.
// Reads SUPABASE_DB_URL from .env.local (Supabase → Connect → Session pooler).
//
//   npm run db:push    apply supabase/migrations/* in order
//   npm run db:seed    run supabase/seed.sql (idempotent for packages)
//   npm run db:types   regenerate src/lib/supabase/types.ts from the live schema
import { readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const env = {};
try {
  for (const line of readFileSync(".env.local", "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
} catch {
  // no .env.local yet
}

const dbUrl = process.env.SUPABASE_DB_URL ?? env.SUPABASE_DB_URL;
if (!dbUrl) {
  console.error("SUPABASE_DB_URL is not set. Add it to .env.local (see .env.example).");
  process.exit(1);
}

const task = process.argv[2];
const run = (args, opts = {}) =>
  spawnSync("npx", ["supabase", ...args], { stdio: ["inherit", "inherit", "inherit"], ...opts });

let result;
switch (task) {
  case "push":
    result = run(["db", "push", "--db-url", dbUrl, "--yes"]);
    break;
  case "seed": {
    // `db query` sends one prepared statement, so wrap the multi-statement
    // seed in a single DO block.
    const sql = readFileSync("supabase/seed.sql", "utf8");
    result = run(["db", "query", "--db-url", dbUrl, `do $seed$ begin\n${sql}\nend $seed$;`]);
    break;
  }
  case "types": {
    result = run(["gen", "types", "typescript", "--db-url", dbUrl, "--schema", "public"], {
      stdio: ["inherit", "pipe", "inherit"],
    });
    if (result.status === 0) {
      writeFileSync("src/lib/supabase/types.ts", result.stdout);
      console.log("wrote src/lib/supabase/types.ts");
    }
    break;
  }
  default:
    console.error("usage: node scripts/db.mjs <push|seed|types>");
    process.exit(1);
}
process.exit(result.status ?? 1);
