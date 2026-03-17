import { NextRequest, NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { createClient } from "@/lib/supabase/server";

const mp = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN || "TEST-placeholder",
});

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const { items, address, subtotal, shipping, total } = body;

  // 1. Create order in DB
  const { data: order, error: orderError } = await (supabase as any)
    .from("orders")
    .insert({
      user_id: user.id,
      status: "pending",
      subtotal,
      shipping,
      total,
      shipping_address: address,
    })
    .select()
    .single();

  if (orderError || !order) {
    return NextResponse.json({ error: "Erro ao criar pedido" }, { status: 500 });
  }

  // 2. Insert order items
  const orderItems = items.map((item: any) => ({
    order_id: order.id,
    product_id: item.product.id,
    quantity: item.quantity,
    size: item.size,
    color: item.color,
    price: item.product.price,
  }));
  await (supabase as any).from("order_items").insert(orderItems);

  // 3. Build MP preference items
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const mpItems: any[] = items.map((item: any) => ({
    id: item.product.id,
    title: `${item.product.name} (${item.size}${item.color && item.color !== "Único" ? ` / ${item.color}` : ""})`,
    quantity: item.quantity,
    unit_price: Number(item.product.price),
    currency_id: "BRL",
  }));

  if (shipping > 0) {
    mpItems.push({
      id: "frete",
      title: "Frete",
      quantity: 1,
      unit_price: Number(shipping),
      currency_id: "BRL",
    });
  }

  // 4. Create MP Preference
  const preference = new Preference(mp);
  try {
    const mpResponse = await preference.create({
      body: {
        items: mpItems,
        payer: { email: user.email },
        back_urls: {
          success: `${baseUrl}/checkout/sucesso?order_id=${order.id}`,
          failure: `${baseUrl}/checkout/falha?order_id=${order.id}`,
          pending: `${baseUrl}/checkout/pendente?order_id=${order.id}`,
        },
        auto_return: "approved",
        external_reference: order.id,
        notification_url: `${baseUrl}/api/webhooks/mercadopago`,
        statement_descriptor: "DOTHIS",
      },
    });

    return NextResponse.json({
      orderId: order.id,
      initPoint: mpResponse.init_point,
      sandboxInitPoint: mpResponse.sandbox_init_point,
    });
  } catch (err: any) {
    // If MP fails, delete the order and return error
    await (supabase as any).from("orders").delete().eq("id", order.id);
    return NextResponse.json({ error: "Erro ao criar pagamento: " + err.message }, { status: 500 });
  }
}
