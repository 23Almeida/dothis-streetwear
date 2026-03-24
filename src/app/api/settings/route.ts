import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { defaultSettings, type SiteSettings } from "@/lib/settings";

// Allowed setting keys — prevents injection of arbitrary keys
const ALLOWED_KEYS = new Set(["brand", "announcement", "hero", "social", "contact", "pages", "seo"]);

// Max value size in bytes (16KB per section)
const MAX_VALUE_SIZE = 16 * 1024;

// Simple in-memory rate limiter (per IP, resets each minute)
const rateLimitMap = new Map<string, { count: number; reset: number }>();
function checkRateLimit(ip: string, limit = 30): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || entry.reset < now) {
    rateLimitMap.set(ip, { count: 1, reset: now + 60_000 });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}

// Strip dangerous content from values
function sanitizeValue(value: any): any {
  if (typeof value === "string") {
    return value
      .replace(/javascript:/gi, "")
      .replace(/on\w+\s*=/gi, "")
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .slice(0, 5000);
  }
  if (typeof value === "object" && value !== null) {
    const clean: any = {};
    for (const [k, v] of Object.entries(value)) {
      if (typeof k === "string" && k.length < 100) {
        clean[k] = sanitizeValue(v);
      }
    }
    return clean;
  }
  return value;
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await (supabase as any)
      .from("site_settings")
      .select("key, value");

    if (error || !data) return NextResponse.json(defaultSettings);

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
  // Rate limiting
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
  if (!checkRateLimit(ip, 60)) {
    return NextResponse.json({ error: "Muitas requisições. Aguarde um momento." }, { status: 429 });
  }

  // Auth check
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  // Admin role check (double-verified server-side)
  const { data: profile } = await (supabase as any)
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  // Parse + validate body
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

  // Only allow known keys
  const db = supabase as any;
  for (const [key, value] of Object.entries(updates)) {
    if (!ALLOWED_KEYS.has(key)) continue;
    const clean = sanitizeValue(value);
    await db.from("site_settings").upsert({
      key,
      value: clean,
      updated_at: new Date().toISOString(),
    });
  }

  return NextResponse.json({ success: true });
}
