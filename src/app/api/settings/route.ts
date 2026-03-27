import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { defaultSettings, type SiteSettings } from "@/lib/settings";

const ALLOWED_KEYS: ReadonlySet<keyof SiteSettings> = new Set([
  "brand", "announcement", "hero", "social", "contact", "pages", "seo", "marquee", "categories", "newsletter",
]);

const MAX_VALUE_SIZE = 16 * 1024;

const rateLimitMap = new Map<string, { count: number; reset: number }>();
function checkRateLimit(ip: string, limit = 60): boolean {
  const now = Date.now();
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
    const supabase = await createAdminClient();
    const { data, error } = await (supabase as any)
      .from("site_settings")
      .select("key, value");

    if (error) {
      console.error("Settings GET error:", error.message);
      return NextResponse.json(defaultSettings);
    }

    if (!data || data.length === 0) return NextResponse.json(defaultSettings);

    const settings: any = { ...defaultSettings };
    for (const row of data) {
      if (ALLOWED_KEYS.has(row.key)) {
        settings[row.key] = { ...settings[row.key], ...row.value };
      }
    }

    return NextResponse.json(settings);
  } catch {
    return NextResponse.json(defaultSettings);
  }
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Muitas requisições. Aguarde um momento." }, { status: 429 });
  }

  // Accept token from Authorization header (client fetch) or cookie (SSR)
  const authHeader = request.headers.get("Authorization");
  const token = authHeader?.replace("Bearer ", "");

  const adminClient = await createAdminClient();
  let user = null;

  if (token) {
    const { data } = await adminClient.auth.getUser(token);
    user = data.user;
  } else {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    user = data.user;
  }

  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { data: profile } = await (adminClient as any)
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

  const rows = Object.entries(updates)
    .filter(([key]) => ALLOWED_KEYS.has(key as keyof SiteSettings))
    .map(([key, value]) => ({
      key,
      value: sanitizeValue(value),
      updated_at: new Date().toISOString(),
    }));

  if (rows.length > 0) {
    const { error } = await (adminClient as any)
      .from("site_settings")
      .upsert(rows, { onConflict: "key" });

    if (error) {
      console.error("Settings upsert error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}
