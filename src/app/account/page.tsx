import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { Order } from "@/types";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Minha Conta" };

async function getOrders(userId: string): Promise<Order[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("orders")
      .select("*, items:order_items(*, product:products(name, images, slug))")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5);
    return (data as Order[]) || [];
  } catch {
    return [];
  }
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: "Aguardando", color: "text-yellow-400" },
  confirmed: { label: "Confirmado", color: "text-blue-400" },
  processing: { label: "Em Separação", color: "text-blue-400" },
  shipped: { label: "Enviado", color: "text-purple-400" },
  delivered: { label: "Entregue", color: "text-green-400" },
  cancelled: { label: "Cancelado", color: "text-red-400" },
};

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/account");

  const { data: profileData } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  const profile = profileData as any;

  const orders = await getOrders(user.id);

  return (
    <div className="min-h-screen bg-black pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="flex items-start justify-between mb-12">
          <div>
            <p className="text-xs font-bold tracking-[0.4em] uppercase text-neutral-500 mb-2">
              Conta
            </p>
            <h1 className="text-3xl font-black tracking-tight text-white">
              {profile?.full_name || "Olá!"}
            </h1>
            <p className="text-neutral-500 text-sm mt-1">{user.email}</p>
          </div>
        </div>

        {/* Recent Orders */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-bold tracking-widest uppercase text-white">
              Pedidos Recentes
            </h2>
            <Link
              href="/account/orders"
              className="text-xs text-neutral-500 hover:text-white transition-colors tracking-widest uppercase"
            >
              Ver todos
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-16 border border-white/5">
              <p className="text-neutral-500 text-sm mb-4">Nenhum pedido ainda</p>
              <Link
                href="/shop"
                className="text-xs font-bold tracking-widest uppercase text-white hover:text-neutral-300 transition-colors"
              >
                Ir às Compras →
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
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
                      <p className="text-sm font-medium text-white group-hover:text-neutral-300">
                        Pedido #{order.id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-xs text-neutral-500 mt-1">
                        {new Date(order.created_at).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
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
        </section>
      </div>
    </div>
  );
}
