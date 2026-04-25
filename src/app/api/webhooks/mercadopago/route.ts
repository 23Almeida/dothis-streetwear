import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { createClient } from "@/lib/supabase/server";
import { sendOrderConfirmation } from "@/lib/email";

const mp = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN || "TEST-placeholder",
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.type !== "payment") {
      return NextResponse.json({ ok: true });
    }

    const paymentId = body.data?.id;
    if (!paymentId) return NextResponse.json({ ok: true });

    const paymentClient = new Payment(mp);
    const payment = await paymentClient.get({ id: paymentId });

    const orderId = payment.external_reference;
    if (!orderId) return NextResponse.json({ ok: true });

    let newStatus = "pending";
    if (payment.status === "approved") newStatus = "confirmed";
    else if (payment.status === "rejected" || payment.status === "cancelled") newStatus = "cancelled";

    const supabase = await createClient();

    // Update order status — seleciona coupon_id e user_id também
    const { data: order } = await (supabase as any)
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId)
      .select("*, coupon_id, user_id, profile:profiles(full_name, email), items:order_items(*, product:products(name, stock, id))")
      .single();

    if (newStatus === "confirmed" && order) {
      const o = order as any;

      // Decrementa estoque de cada item
      for (const item of o.items || []) {
        const newStock = Math.max(0, (item.product?.stock || 0) - item.quantity);
        await (supabase as any)
          .from("products")
          .update({ stock: newStock })
          .eq("id", item.product?.id);
      }

      // Registra uso do cupom
      if (o.coupon_id) {
        await (supabase as any)
          .from("coupon_uses")
          .insert({ coupon_id: o.coupon_id, user_id: o.user_id });

        const { data: coupon } = await (supabase as any)
          .from("coupons")
          .select("used_count")
          .eq("id", o.coupon_id)
          .single();

        if (coupon) {
          await (supabase as any)
            .from("coupons")
            .update({ used_count: (coupon.used_count || 0) + 1 })
            .eq("id", o.coupon_id);
        }
      }

      // Envia email de confirmação
      if (o.profile?.email) {
        await sendOrderConfirmation({
          customerEmail: o.profile.email,
          customerName: o.profile.full_name || "Cliente",
          orderId: orderId,
          total: o.total,
          items: o.items,
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json({ ok: true });
  }
}
