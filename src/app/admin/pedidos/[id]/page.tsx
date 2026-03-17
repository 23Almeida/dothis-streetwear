import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import type { Address } from "@/types";
import StatusUpdater from "./StatusUpdater";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin — Detalhe do Pedido" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminPedidoDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profileData } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  const profile = profileData as any;
  if (profile?.role !== "admin") redirect("/");

  const { data: order } = await supabase
    .from("orders")
    .select("*, profile:profiles(full_name, email, phone), items:order_items(*, product:products(name, images, slug))")
    .eq("id", id)
    .single();

  if (!order) notFound();

  const o = order as any;
  const address = o.shipping_address as Address;

  const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
    pending:    { label: "Aguardando",   color: "text-yellow-400 bg-yellow-400/10" },
    confirmed:  { label: "Confirmado",   color: "text-blue-400 bg-blue-400/10" },
    processing: { label: "Em Separação", color: "text-blue-400 bg-blue-400/10" },
    shipped:    { label: "Enviado",      color: "text-purple-400 bg-purple-400/10" },
    delivered:  { label: "Entregue",     color: "text-green-400 bg-green-400/10" },
    cancelled:  { label: "Cancelado",    color: "text-red-400 bg-red-400/10" },
  };

  const status = STATUS_CONFIG[o.status] || { label: o.status, color: "text-neutral-400 bg-neutral-800" };

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">

        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <Link href="/admin/pedidos" className="text-xs text-neutral-500 hover:text-white tracking-widest uppercase block mb-3">
              ← Pedidos
            </Link>
            <h1 className="text-2xl font-black text-white">
              Pedido #{id.slice(-8).toUpperCase()}
            </h1>
            <p className="text-neutral-500 text-sm mt-1">
              {new Date(o.created_at).toLocaleDateString("pt-BR", {
                day: "2-digit", month: "long", year: "numeric",
                hour: "2-digit", minute: "2-digit"
              })}
            </p>
          </div>
          <span className={`text-xs font-bold uppercase px-3 py-1.5 ${status.color}`}>
            {status.label}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Items + Cliente */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Itens */}
            <div className="border border-white/10 p-5">
              <h2 className="text-xs font-bold tracking-widest uppercase text-neutral-400 mb-4">
                Itens do Pedido
              </h2>
              <div className="flex flex-col gap-4">
                {o.items?.map((item: any) => (
                  <div key={item.id} className="flex gap-4 py-3 border-b border-white/5 last:border-0">
                    <div className="w-14 h-18 bg-neutral-900 relative overflow-hidden flex-shrink-0" style={{height: "4.5rem"}}>
                      {item.product?.images?.[0] && (
                        <Image src={item.product.images[0]} alt={item.product?.name} fill className="object-cover" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white">{item.product?.name}</p>
                      <p className="text-xs text-neutral-500 mt-0.5">{item.size} · {item.color} · Qtd: {item.quantity}</p>
                      <p className="text-sm font-bold mt-1">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cliente */}
            <div className="border border-white/10 p-5">
              <h2 className="text-xs font-bold tracking-widest uppercase text-neutral-400 mb-4">
                Cliente
              </h2>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Nome</span>
                  <span className="text-white">{o.profile?.full_name || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Email</span>
                  <span className="text-white">{o.profile?.email}</span>
                </div>
                {o.profile?.phone && (
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Telefone</span>
                    <span className="text-white">{o.profile.phone}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Endereço */}
            {address && (
              <div className="border border-white/10 p-5">
                <h2 className="text-xs font-bold tracking-widest uppercase text-neutral-400 mb-4">
                  Endereço de Entrega
                </h2>
                <p className="text-sm text-neutral-300 leading-relaxed">
                  {address.name}<br />
                  {address.street}, {address.number}{address.complement ? ` - ${address.complement}` : ""}<br />
                  {address.district}, {address.city} - {address.state}<br />
                  CEP {address.zip}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-4">

            {/* Resumo */}
            <div className="border border-white/10 p-5">
              <h2 className="text-xs font-bold tracking-widest uppercase text-neutral-400 mb-4">
                Resumo
              </h2>
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Subtotal</span>
                  <span>{formatPrice(o.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Frete</span>
                  <span>{o.shipping === 0 ? <span className="text-green-400">Grátis</span> : formatPrice(o.shipping)}</span>
                </div>
                <hr className="border-white/10 my-1" />
                <div className="flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span>{formatPrice(o.total)}</span>
                </div>
              </div>
            </div>

            {/* Atualizar Status */}
            <div className="border border-white/10 p-5">
              <h2 className="text-xs font-bold tracking-widest uppercase text-neutral-400 mb-4">
                Atualizar Status
              </h2>
              <StatusUpdater orderId={id} currentStatus={o.status} />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
