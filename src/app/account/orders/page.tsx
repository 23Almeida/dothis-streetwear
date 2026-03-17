import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Meus Pedidos" };

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: "Aguardando", color: "text-yellow-400" },
  confirmed: { label: "Confirmado", color: "text-blue-400" },
  processing: { label: "Em Separação", color: "text-blue-400" },
  shipped: { label: "Enviado", color: "text-purple-400" },
  delivered: { label: "Entregue", color: "text-green-400" },
  cancelled: { label: "Cancelado", color: "text-red-400" },
};

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/account/orders");

  const { data: orders } = await supabase
    .from("orders")
    .select("*, items:order_items(count)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-black pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center gap-4 mb-10">
          <Link href="/account" className="text-neutral-500 hover:text-white transition-colors text-xs tracking-widest uppercase">
            ← Conta
          </Link>
          <span className="text-neutral-700">/</span>
          <h1 className="text-xs font-bold tracking-widest uppercase text-white">
            Meus Pedidos
          </h1>
        </div>

        {!orders || orders.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-neutral-500 text-sm mb-6">Nenhum pedido encontrado</p>
            <Link href="/shop">
              <span className="text-xs font-bold tracking-widest uppercase text-white hover:text-neutral-300 border-b border-white pb-0.5">
                Ir às Compras
              </span>
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {(orders as any[]).map((order: any) => {
              const statusInfo = STATUS_LABELS[order.status] || {
                label: order.status,
                color: "text-neutral-400",
              };
              return (
                <Link
                  key={order.id}
                  href={`/account/orders/${order.id}`}
                  className="flex items-center justify-between p-5 border border-white/10 hover:border-white/30 transition-colors group"
                >
                  <div>
                    <p className="text-sm font-medium text-white">
                      #{order.id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      {new Date(order.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div className="text-center hidden sm:block">
                    <p className="text-xs text-neutral-500">
                      {Array.isArray(order.items) ? order.items.length : 0} itens
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs font-bold uppercase tracking-widest ${statusInfo.color}`}>
                      {statusInfo.label}
                    </p>
                    <p className="text-sm font-bold text-white mt-1">
                      R$ {order.total.toFixed(2).replace(".", ",")}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
