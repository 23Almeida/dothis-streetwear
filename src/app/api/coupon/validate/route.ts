import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

  // Fetch coupon
  const { data: coupon } = await (supabase as any)
    .from("coupons")
    .select("*")
    .eq("code", code.toUpperCase().trim())
    .eq("active", true)
    .single();

  if (!coupon) {
    return NextResponse.json({ error: "Cupom não encontrado ou inativo" }, { status: 404 });
  }

  // Check expiry
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    return NextResponse.json({ error: "Cupom expirado" }, { status: 400 });
  }

  // Check max uses
  if (coupon.max_uses !== null && coupon.used_count >= coupon.max_uses) {
    return NextResponse.json({ error: "Cupom esgotado" }, { status: 400 });
  }

  // Check min order
  if (subtotal < coupon.min_order) {
    return NextResponse.json({
      error: `Pedido mínimo de R$ ${Number(coupon.min_order).toFixed(2).replace(".", ",")} para este cupom`,
    }, { status: 400 });
  }

  // Check first purchase only
  if (coupon.first_purchase_only) {
    const { count } = await (supabase as any)
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .neq("status", "cancelled");

    if ((count ?? 0) > 0) {
      return NextResponse.json({ error: "Este cupom é válido apenas para a primeira compra" }, { status: 400 });
    }
  }

  // Check if user already used this coupon
  const { data: existingUse } = await (supabase as any)
    .from("coupon_uses")
    .select("id")
    .eq("coupon_id", coupon.id)
    .eq("user_id", user.id)
    .single();

  if (existingUse) {
    return NextResponse.json({ error: "Você já utilizou este cupom" }, { status: 400 });
  }

  // Calculate discount
  let discountAmount = 0;
  if (coupon.discount_type === "percent") {
    discountAmount = (subtotal * coupon.discount_value) / 100;
  } else {
    discountAmount = Math.min(coupon.discount_value, subtotal);
  }
  discountAmount = Math.round(discountAmount * 100) / 100;

  return NextResponse.json({
    valid: true,
    couponId: coupon.id,
    code: coupon.code,
    discountType: coupon.discount_type,
    discountValue: coupon.discount_value,
    discountAmount,
    description:
      coupon.discount_type === "percent"
        ? `${coupon.discount_value}% de desconto`
        : `R$ ${Number(coupon.discount_value).toFixed(2).replace(".", ",")} de desconto`,
  });
}
