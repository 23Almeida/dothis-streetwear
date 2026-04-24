import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin — Pedidos" };

type OrderStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

type Order = {
  id: string;
  status: OrderStatus | string;
  total: number;
  created_at: string;
  profile?: {
    full_name?: string | null;
    email?: string | null;
  } | null;
};

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string }> = {
  pending: { label: "Aguardando", color: "text-yellow-400 bg-yellow-400/10" },
  confirmed: { label: "Confirmado", color: "text-blue-400 bg-blue-400/10" },
  processing: { label: "Em Separação", color: "text-blue-400 bg-blue-400/10" },
  shipped: { label: "Enviado", color: "text-purple-400 bg-purple-400/10" },
  delivered: { label: "Entregue", color: "text-green-400 bg-green-400/10" },
  cancelled: { label: "Cancelado", color: "text-red-400 bg-red-400/10" },
};

function getStatusConfig(statusValue: string) {
  if (statusValue in STATUS_CONFIG) {
    return STATUS_CONFIG[statusValue as OrderStatus];
  }

  return {
    label: statusValue || "Sem status",
    color: "text-neutral-400 bg-neutral-800",
  };
}

export default async function AdminPedidosPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profileData } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileData?.role !== "admin") redirect("/");

  const { data } = await supabase
    .from("orders")
    .select("*, profile:profiles(full_name, email), items:order_items(count)")
    .order("created_at", { ascending: false });

  const orders = (data ?? []) as Order[];

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-xs font-bold tracking-[0.4em] uppercase text-neutral-500 mb-1">
              Admin
            </p>
            <h1 className="text-3xl font-black text-white">Pedidos</h1>
          </div>

          <span className="text-xs text-neutral-600">
            {orders.length} pedidos
          </span>
        </div>

        <div className="border border-white/10">
          <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-white/10 bg-neutral-950">
            <span className="col-span-2 text-xs font-bold tracking-widest uppercase text-neutral-500">
              Pedido
            </span>
            <span className="col-span-3 text-xs font-bold tracking-widest uppercase text-neutral-500">
              Cliente
            </span>
            <span className="col-span-2 text-xs font-bold tracking-widest uppercase text-neutral-500">
              Data
            </span>
            <span className="col-span-2 text-xs font-bold tracking-widest uppercase text-neutral-500">
              Status
            </span>
            <span className="col-span-2 text-xs font-bold tracking-widest uppercase text-neutral-500">
              Total
            </span>
            <span className="col-span-1 text-xs font-bold tracking-widest uppercase text-neutral-500 text-right">
              Ver
            </span>
          </div>

          {orders.map((order) => {
            const status = getStatusConfig(order.status);

            return (
              <div
                key={order.id}
                className="grid grid-cols-12 gap-4 px-4 py-4 border-b border-white/5 hover:bg-white/2 items-center"
              >
                <div className="col-span-2">
                  <p className="text-xs font-mono text-white">
                    #{order.id.slice(-8).toUpperCase()}
                  </p>
                </div>

                <div className="col-span-3">
                  <p className="text-sm text-white truncate">
                    {order.profile?.full_name || "—"}
                  </p>
                  <p className="text-xs text-neutral-600 truncate">
                    {order.profile?.email || "—"}
                  </p>
                </div>

                <div className="col-span-2">
                  <p className="text-xs text-neutral-400">
                    {new Date(order.created_at).toLocaleDateString("pt-BR")}
                  </p>
                </div>

                <div className="col-span-2">
                  <span
                    className={`text-xs font-bold uppercase px-2 py-1 ${status.color}`}
                  >
                    {status.label}
                  </span>
                </div>

                <div className="col-span-2">
                  <p className="text-sm font-bold text-white">
                    {formatPrice(order.total)}
                  </p>
                </div>

                <div className="col-span-1 flex justify-end">
                  <Link
                    href={`/admin/pedidos/${order.id}`}
                    className="text-xs text-neutral-500 hover:text-white transition-colors border border-white/10 hover:border-white/40 px-3 py-1.5"
                  >
                    Abrir
                  </Link>
                </div>
              </div>
            );
          })}

          {orders.length === 0 && (
            <div className="text-center py-16">
              <p className="text-neutral-600 text-sm">Nenhum pedido ainda</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}