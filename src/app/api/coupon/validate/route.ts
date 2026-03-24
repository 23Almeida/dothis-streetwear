import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Faça login para usar cupons" }, { status: 401 });
  }

  const { code, subtotal } = await request.json();
  const db = supabase as any;

  const { data: coupon } = await db
    .from("coupons")
    .select("*")
    .eq("code", code.toUpperCase().trim())
    .eq("is_active", true)
    .single();

  if (!coupon) {
    return NextResponse.json({ error: "Cupom inválido ou inativo" }, { status: 400 });
  }

  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    return NextResponse.json({ error: "Este cupom expirou" }, { status: 400 });
  }

  if (coupon.max_uses !== null && coupon.uses_count >= coupon.max_uses) {
    return NextResponse.json({ error: "Este cupom atingiu o limite de usos" }, { status: 400 });
  }

  if (subtotal < coupon.min_order_value) {
    return NextResponse.json({
      error: `Pedido mínimo de R$${Number(coupon.min_order_value).toFixed(2).replace(".", ",")} para este cupom`,
    }, { status: 400 });
  }

  if (coupon.first_purchase_only) {
    const { count } = await db
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .neq("status", "cancelled");

    if ((count ?? 0) > 0) {
      return NextResponse.json({ error: "Este cupom é válido apenas para a primeira compra" }, { status: 400 });
    }
  }

  const { data: existingUse } = await db
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
    couponId: coupon.id,
    code: coupon.code,
    discountAmount,
    description: coupon.type === "percentage"
      ? `${coupon.value}% de desconto`
      : `R$${Number(coupon.value).toFixed(2).replace(".", ",")} de desconto`,
  });
}
