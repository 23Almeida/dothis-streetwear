import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { defaultSettings, type SiteSettings } from "@/lib/settings";

const ALLOWED_KEYS: ReadonlySet<keyof SiteSettings> = new Set([
  "brand", "announcement", "hero", "social", "contact", "pages", "seo", "marquee",
]);

const MAX_VALUE_SIZE = 16 * 1024;

// Rate limiter — cleans expired entries on each check to prevent unbounded growth
const rateLimitMap = new Map<string, { count: number; reset: number }>();
function checkRateLimit(ip: string, limit = 60): boolean {
  const now = Date.now();
  // Purge expired entries to prevent memory leak
  for (const [key, val] of rateLimitMap) {
    if (val.reset < now) rateLimitMap.delete(key);
  }
  const entry = rateLimitMap.get(ip);
  if (!entry || entry.reset < now) {
    rateLimitMap.set(ip, { count: 1, reset: now + 60_000 });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

function sanitizeValue(value: unknown): unknown {
  if (typeof value === "string") {
    return value
      .replace(/javascript:/gi, "")
      .replace(/on\w+\s*=/gi, "")
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .slice(0, 5000);
  }
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    const clean: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (k.length < 100) clean[k] = sanitizeValue(v);
    }
    return clean;
  }
  return value;
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data } = await (supabase as any)
      .from("site_settings")
      .select("key, value");

    if (!data) return NextResponse.json(defaultSettings);

    const settings: any = { ...defaultSettings };
    for (const row of data) {
      if (ALLOWED_KEYS.has(row.key)) {
        settings[row.key] = { ...settings[row.key], ...row.value };
      }
    }

    return NextResponse.json(settings, {
      headers: { "Cache-Control": "s-maxage=30, stale-while-revalidate=60" },
    });
  } catch {
    return NextResponse.json(defaultSettings);
  }
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Muitas requisições. Aguarde um momento." }, { status: 429 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { data: profile } = await (supabase as any)
    .from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  let updates: Partial<SiteSettings>;
  try {
    const text = await request.text();
    if (text.length > MAX_VALUE_SIZE) {
      return NextResponse.json({ error: "Payload muito grande" }, { status: 413 });
    }
    updates = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  // Batch upsert — single DB round trip instead of N sequential writes
  const rows = Object.entries(updates)
    .filter(([key]) => ALLOWED_KEYS.has(key as keyof SiteSettings))
    .map(([key, value]) => ({
      key,
      value: sanitizeValue(value),
      updated_at: new Date().toISOString(),
    }));

  if (rows.length > 0) {
    await (supabase as any).from("site_settings").upsert(rows);
  }

  return NextResponse.json({ success: true });
}
