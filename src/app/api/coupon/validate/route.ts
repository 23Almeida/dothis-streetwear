import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { code, subtotal } = await request.json();

  if (!code) {
    return NextResponse.json({ error: "Código inválido" }, { status: 400 });
  }

  // Usa service role para bypassar RLS na leitura do cupom
  const adminClient = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  // Usa REST direto com service role para bypassar qualquer filtro do JS client
  const restUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/coupons?code=eq.${encodeURIComponent(code.toUpperCase().trim())}&select=*`;
  const restRes = await fetch(restUrl, {
    headers: {
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY!}`,
    },
  });
  const rows = await restRes.json();
  const coupon = Array.isArray(rows) ? rows[0] ?? null : null;

  if (!coupon || !coupon.is_active) {
    return NextResponse.json({ error: "Cupom não encontrado ou inativo" }, { status: 404 });
  }

  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    return NextResponse.json({ error: "Cupom expirado" }, { status: 400 });
  }

  if (coupon.max_uses !== null && coupon.uses_count >= coupon.max_uses) {
    return NextResponse.json({ error: "Cupom esgotado" }, { status: 400 });
  }

  if (subtotal < coupon.min_order_value) {
    return NextResponse.json({
      error: `Pedido mínimo de R$ ${Number(coupon.min_order_value).toFixed(2).replace(".", ",")} para este cupom`,
    }, { status: 400 });
  }

  if (coupon.first_purchase_only) {
    const { count } = await adminClient
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .neq("status", "cancelled");

    if ((count ?? 0) > 0) {
      return NextResponse.json({ error: "Este cupom é válido apenas para a primeira compra" }, { status: 400 });
    }
  }

  const { data: existingUse } = await adminClient
    .from("coupon_uses")
    .select("id")
    .eq("coupon_id", coupon.id)
    .eq("user_id", user.id)
    .single();

  if (existingUse) {
    return NextResponse.json({ error: "Você já utilizou este cupom" }, { status: 400 });
  }

  let discountAmount = 0;
  if (coupon.type === "percentage") {
    discountAmount = (subtotal * coupon.value) / 100;
  } else {
    discountAmount = Math.min(coupon.value, subtotal);
  }
  discountAmount = Math.round(discountAmount * 100) / 100;

  return NextResponse.json({
    valid: true,
    couponId: coupon.id,
    code: coupon.code,
    discountType: coupon.type,
    discountValue: coupon.value,
    discountAmount,
    description:
      coupon.type === "percentage"
        ? `${coupon.value}% de desconto`
        : `R$ ${Number(coupon.value).toFixed(2).replace(".", ",")} de desconto`,
  });
}
