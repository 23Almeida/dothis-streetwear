import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const CONTENT_FILE_URL = `${SUPABASE_URL}/storage/v1/object/public/products/_site-content.json`;

export async function POST(req: NextRequest) {
  // Verificar autenticação — usa client normal com session do usuário
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: profileData } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if ((profileData as { role: string } | null)?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const { key, value } = body as { key: string; value: string };

  if (!key || value === undefined) {
    return NextResponse.json({ error: "key and value required" }, { status: 400 });
  }

  // Client com service role para bypassar RLS no Storage
  const serviceClient = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  // Lê o conteúdo atual direto via Storage (sem CDN)
  let current: Record<string, string> = {};
  try {
    const { data: fileData, error: downloadError } = await serviceClient.storage
      .from("products")
      .download("_site-content.json");
    if (fileData && !downloadError) {
      const text = await fileData.text();
      current = JSON.parse(text);
    }
  } catch {}

  // Atualiza a chave
  current[key] = value;

  // Salva de volta no Storage
  const blob = new Blob([JSON.stringify(current)], { type: "application/json" });

  const { error: uploadError } = await serviceClient.storage
    .from("products")
    .upload("_site-content.json", blob, {
      contentType: "application/json",
      upsert: true,
    });

  if (uploadError) {
    console.error("Storage upload failed:", uploadError);
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
