import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createServiceClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if ((profile as any)?.role !== "admin") return NextResponse.json({ error: "Proibido" }, { status: 403 });

  const body = await req.json();
  const { id, variants = [], ...fields } = body;

  const admin = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  let productId = id;

  if (id) {
    const { error } = await admin.from("products").update(fields).eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  } else {
    const { data, error } = await admin.from("products").insert(fields).select().single();
    if (error || !data) return NextResponse.json({ error: error?.message || "Erro ao criar" }, { status: 500 });
    productId = (data as any).id;
  }

  // Atualiza variantes
  if (productId) {
    await admin.from("product_variants").delete().eq("product_id", productId);
    if (variants.length > 0) {
      const { error } = await admin.from("product_variants").insert(
        variants.map((v: any) => ({
          product_id: productId,
          size: v.size,
          color: v.color || "Único",
          stock: v.stock,
          sku: v.sku || `${fields.slug}-${v.size}-${(v.color || "unico")}`.toLowerCase(),
        }))
      );
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true, id: productId });
}
