import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if ((profile as any)?.role !== "admin") return NextResponse.json({ error: "Proibido" }, { status: 403 });

  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "Arquivo não enviado" }, { status: 400 });

  if (!file.type.startsWith("image/")) return NextResponse.json({ error: "Tipo inválido" }, { status: 400 });
  if (file.size > 10 * 1024 * 1024) return NextResponse.json({ error: "Máximo 10MB" }, { status: 400 });

  const ext = file.name.split(".").pop();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const admin = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await admin.storage
    .from("products")
    .upload(path, buffer, { contentType: file.type, upsert: false });

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { data } = admin.storage.from("products").getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}
