import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { defaultSettings, type SiteSettings } from "@/lib/settings";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await (supabase as any)
      .from("site_settings")
      .select("key, value");

    if (error || !data) {
      return NextResponse.json(defaultSettings);
    }

    const settings: any = { ...defaultSettings };
    for (const row of data) {
      settings[row.key] = { ...settings[row.key], ...row.value };
    }

    return NextResponse.json(settings, {
      headers: { "Cache-Control": "s-maxage=60, stale-while-revalidate" },
    });
  } catch {
    return NextResponse.json(defaultSettings);
  }
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { data: profile } = await (supabase as any)
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
  }

  const updates: Partial<SiteSettings> = await request.json();
  const db = supabase as any;

  for (const [key, value] of Object.entries(updates)) {
    await db.from("site_settings").upsert({ key, value, updated_at: new Date().toISOString() });
  }

  return NextResponse.json({ success: true });
}
