import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { TablesInsert } from "@/lib/supabase/types";

const EVENTS = new Set(["page_view", "package_view", "booking_started"]);
const DEVICES = new Set(["mobile", "tablet", "desktop"]);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const BOT = /bot|crawl|spider|slurp|facebookexternalhit|preview|headless|lighthouse/i;

export async function POST(request: NextRequest) {
  const ua = request.headers.get("user-agent") ?? "";
  if (BOT.test(ua)) return new NextResponse(null, { status: 204 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad json" }, { status: 400 });
  }

  const event = String(body.event ?? "");
  const path = String(body.path ?? "").slice(0, 200);
  const sessionId = String(body.session_id ?? "").slice(0, 64);
  const device = typeof body.device === "string" && DEVICES.has(body.device) ? body.device : null;
  const packageId = typeof body.package_id === "string" && UUID.test(body.package_id) ? body.package_id : null;
  const referrer = typeof body.referrer === "string" ? body.referrer.slice(0, 120) : null;
  if (!EVENTS.has(event) || !path.startsWith("/") || !sessionId) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const row: TablesInsert<"analytics_events"> = {
    event: event as TablesInsert<"analytics_events">["event"],
    path,
    session_id: sessionId,
    device: device as TablesInsert<"analytics_events">["device"],
    package_id: packageId,
    referrer,
    user_id: user?.id ?? null,
    country: request.headers.get("x-vercel-ip-country") ?? null,
  };
  const { error } = await supabase.from("analytics_events").insert(row);
  if (error) return NextResponse.json({ error: "insert failed" }, { status: 500 });
  return new NextResponse(null, { status: 204 });
}
