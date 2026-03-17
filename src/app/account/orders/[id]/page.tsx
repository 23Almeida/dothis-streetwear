import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import type { Address } from "@/types";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Detalhes do Pedido" };

const STATUS_STEPS = ["pending", "confirmed", "processing", "shipped", "delivered"];

const STATUS_LABELS: Record<string, string> = {
  pending: "Aguardando",
  confirmed: "Confirmado",
  processing: "Em Separação",
  shipped: "Enviado",
  delivered: "Entregue",
  cancelled: "Cancelado",
};

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ success?: string }>;
}

export default async function OrderDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { success } = await searchParams;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: order } = await supabase
    .from("orders")
    .select("*, items:order_items(*, product:products(name, images, slug, price))")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!order) notFound();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const safeOrder = order as any;
  const currentStep = STATUS_STEPS.indexOf(safeOrder.status);
  const address = safeOrder.shipping_address as Address;

  return (
    <div className="min-h-screen bg-black pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {/* Success Banner */}
        {success && (
          <div className="bg-green-950 border border-green-800 text-green-400 text-sm px-5 py-4 mb-8">
            Pedido realizado com sucesso! Você receberá atualizações por email.
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <Link href="/account/orders" className="text-xs text-neutral-500 hover:text-white tracking-widest uppercase block mb-3">
              ← Meus Pedidos
            </Link>
            <h1 className="text-2xl font-black text-white">
              Pedido #{id.slice(-8).toUpperCase()}
            </h1>
            <p className="text-neutral-500 text-sm mt-1">
              {new Date(safeOrder.created_at).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        {/* Status Timeline */}
        {safeOrder.status !== "cancelled" && (
          <div className="mb-12">
            <div className="flex items-center gap-0">
              {STATUS_STEPS.map((step, i) => (
                <div key={step} className="flex items-center flex-1 last:flex-none">
                  <div className={`flex flex-col items-center gap-1 ${i <= currentStep ? "text-white" : "text-neutral-700"}`}>
                    <div
                      className={`w-3 h-3 rounded-full border-2 transition-colors ${
                        i <= currentStep ? "bg-white border-white" : "bg-transparent border-neutral-700"
                      }`}
                    />
                    <span className="text-[10px] uppercase tracking-wide whitespace-nowrap hidden sm:block">
                      {STATUS_LABELS[step]}
                    </span>
                  </div>
                  {i < STATUS_STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-px mx-2 transition-colors ${
                        i < currentStep ? "bg-white" : "bg-neutral-800"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2">
            <h2 className="text-xs font-bold tracking-widest uppercase text-neutral-400 mb-4">
              Itens do Pedido
            </h2>
            <div className="flex flex-col gap-4">
              {(safeOrder.items as any[]).map((item: any) => (
                <div key={item.id} className="flex gap-4 py-4 border-b border-white/5">
                  <div className="w-16 h-20 bg-neutral-900 relative overflow-hidden flex-shrink-0">
                    {item.product?.images?.[0] && (
                      <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{item.product?.name}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {item.size} · {item.color} · Qtd: {item.quantity}
                    </p>
                    <p className="text-sm font-bold mt-2">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div>
            <div className="bg-neutral-950 border border-white/10 p-5">
              <h2 className="text-xs font-bold tracking-widest uppercase text-neutral-400 mb-4">
                Resumo
              </h2>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Subtotal</span>
                  <span>{formatPrice(safeOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Frete</span>
                  <span>{safeOrder.shipping === 0 ? <span className="text-green-400">Grátis</span> : formatPrice(safeOrder.shipping)}</span>
                </div>
                <hr className="border-white/10 my-1" />
                <div className="flex justify-between font-bold">
                  <span>Total</span>
                  <span>{formatPrice(safeOrder.total)}</span>
                </div>
              </div>

              {address && (
                <div className="mt-6 pt-5 border-t border-white/10">
                  <h3 className="text-xs font-bold tracking-widest uppercase text-neutral-400 mb-3">
                    Entrega
                  </h3>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {address.name}<br />
                    {address.street}, {address.number}{address.complement ? ` - ${address.complement}` : ""}<br />
                    {address.district}, {address.city} - {address.state}<br />
                    CEP {address.zip}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
