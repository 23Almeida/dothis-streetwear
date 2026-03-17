import { Resend } from "resend";
import { formatPrice } from "./utils";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const FROM = process.env.RESEND_FROM || "DOTHIS <onboarding@resend.dev>";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "";

interface OrderConfirmationParams {
  customerEmail: string;
  customerName: string;
  orderId: string;
  total: number;
  items: any[];
}

export async function sendOrderConfirmation({
  customerEmail,
  customerName,
  orderId,
  total,
  items,
}: OrderConfirmationParams) {
  if (!resend) return;

  const orderNum = orderId.slice(-8).toUpperCase();
  const itemsHtml = items
    .map(
      (item: any) =>
        `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #222;color:#ccc">${item.product?.name} — ${item.size}</td>
          <td style="padding:8px 0;border-bottom:1px solid #222;color:#fff;text-align:right">×${item.quantity} ${formatPrice(item.price * item.quantity)}</td>
        </tr>`
    )
    .join("");

  const html = `
    <div style="background:#000;color:#fff;font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:40px 24px">
      <h1 style="font-size:24px;font-weight:900;letter-spacing:0.3em;margin-bottom:32px">DOTHIS</h1>
      <h2 style="font-size:18px;font-weight:700;margin-bottom:8px">Pedido Confirmado!</h2>
      <p style="color:#999;margin-bottom:32px">Olá ${customerName}, seu pagamento foi aprovado.</p>

      <div style="background:#111;padding:20px;margin-bottom:24px">
        <p style="color:#666;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 4px">Pedido</p>
        <p style="font-size:20px;font-weight:900;margin:0">#${orderNum}</p>
      </div>

      <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
        ${itemsHtml}
        <tr>
          <td style="padding:12px 0;font-weight:700;font-size:16px">Total</td>
          <td style="padding:12px 0;font-weight:700;font-size:16px;text-align:right">${formatPrice(total)}</td>
        </tr>
      </table>

      <a href="${process.env.NEXT_PUBLIC_APP_URL}/account/orders"
         style="display:inline-block;background:#fff;color:#000;padding:12px 24px;font-weight:700;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;text-decoration:none">
        Ver Meus Pedidos
      </a>

      <p style="color:#444;font-size:11px;margin-top:40px">DOTHIS Streetwear · Obrigado pela compra!</p>
    </div>
  `;

  // Send to customer
  await resend.emails.send({
    from: FROM,
    to: customerEmail,
    subject: `Pedido #${orderNum} confirmado! 🎉`,
    html,
  });

  // Notify admin
  if (ADMIN_EMAIL) {
    await resend.emails.send({
      from: FROM,
      to: ADMIN_EMAIL,
      subject: `Novo pedido #${orderNum} — ${formatPrice(total)}`,
      html: `<p>Novo pedido recebido!</p><p>Pedido: #${orderNum}</p><p>Total: ${formatPrice(total)}</p><p><a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/pedidos">Ver no admin</a></p>`,
    });
  }
}
