import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { createAdminClient } from "@/lib/supabase/server";
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

    const supabase = await createAdminClient();

    // Check current order status to prevent duplicate processing
    const { data: currentOrder } = await (supabase as any)
      .from("orders")
      .select("status, coupon_id, user_id")
      .eq("id", orderId)
      .single();

    if (currentOrder?.status === "confirmed") {
      return NextResponse.json({ ok: true }); // Already processed, idempotent
    }

    // Update order status
    const { data: order } = await (supabase as any)
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId)
      .select("*, profile:profiles(full_name, email), items:order_items(*, product:products(name, stock, id))")
      .single();

    // If approved: decrease stock + record coupon use + send email
    if (newStatus === "confirmed" && order) {
      const o = order as any;

      // Decrease stock for each item
      for (const item of o.items || []) {
        const newStock = Math.max(0, (item.product?.stock || 0) - item.quantity);
        await (supabase as any)
          .from("products")
          .update({ stock: newStock })
          .eq("id", item.product?.id);
      }

      // Record coupon usage so it can't be reused
      if (currentOrder?.coupon_id && currentOrder?.user_id) {
        await (supabase as any)
          .from("coupon_uses")
          .insert({
            coupon_id: currentOrder.coupon_id,
            user_id: currentOrder.user_id,
            order_id: orderId,
          })
          .onConflict("coupon_id,user_id")
          .ignoreDuplicates();

        // Increment coupon uses_count
        await (supabase as any).rpc("increment_coupon_uses", {
          p_coupon_id: currentOrder.coupon_id,
        });
      }

      // Send confirmation email
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
    return NextResponse.json({ ok: true }); // Always return 200 to MP
  }
}
