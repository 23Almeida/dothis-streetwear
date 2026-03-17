import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import { Package, ShoppingBag, Users, TrendingUp } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin — Dashboard" };

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profileData } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  const profile = profileData as any;

  if (profile?.role !== "admin") redirect("/");

  const [
    { count: productCount },
    { count: orderCount },
    { count: userCount },
    { data: recentOrders },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase
      .from("orders")
      .select("id, status, total, created_at")
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  const STATUS_COLORS: Record<string, string> = {
    pending: "text-yellow-400 bg-yellow-400/10",
    confirmed: "text-blue-400 bg-blue-400/10",
    processing: "text-blue-400 bg-blue-400/10",
    shipped: "text-purple-400 bg-purple-400/10",
    delivered: "text-green-400 bg-green-400/10",
    cancelled: "text-red-400 bg-red-400/10",
  };

  const STATUS_LABELS: Record<string, string> = {
    pending: "Aguardando",
    confirmed: "Confirmado",
    processing: "Em Separação",
    shipped: "Enviado",
    delivered: "Entregue",
    cancelled: "Cancelado",
  };

  const stats = [
    { label: "Produtos", value: productCount || 0, icon: Package, href: "/admin/produtos" },
    { label: "Pedidos", value: orderCount || 0, icon: ShoppingBag, href: "/admin/pedidos" },
    { label: "Clientes", value: userCount || 0, icon: Users, href: "/admin/pedidos" },
  ];

  const navLinks = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/produtos", label: "Produtos" },
    { href: "/admin/pedidos", label: "Pedidos" },
  ];

  return (
    <div className="min-h-screen bg-black pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-xs font-bold tracking-[0.4em] uppercase text-neutral-500 mb-1">Painel</p>
            <h1 className="text-3xl font-black text-white">Admin</h1>
          </div>
          <Link href="/" className="text-xs text-neutral-500 hover:text-white transition-colors tracking-widest uppercase">
            Ver Site →
          </Link>
        </div>

        {/* Nav */}
        <div className="flex gap-1 mb-10 border-b border-white/10 pb-0">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-xs font-bold tracking-widest uppercase text-neutral-400 hover:text-white border-b-2 border-transparent hover:border-white transition-all"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
          {stats.map((stat) => (
            <Link key={stat.label} href={stat.href} className="bg-neutral-950 border border-white/10 p-6 hover:border-white/30 transition-colors group">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-4xl font-black text-white">{stat.value}</p>
                  <p className="text-xs text-neutral-500 uppercase tracking-widest mt-1">{stat.label}</p>
                </div>
                <stat.icon size={20} className="text-neutral-700 group-hover:text-neutral-400 transition-colors" />
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-bold tracking-widest uppercase text-white">Pedidos Recentes</h2>
          <Link href="/admin/pedidos" className="text-xs text-neutral-500 hover:text-white transition-colors tracking-widest uppercase">
            Ver todos →
          </Link>
        </div>

        <div className="flex flex-col gap-2">
          {(recentOrders as any[])?.map((order: any) => (
            <Link
              key={order.id}
              href={`/admin/pedidos/${order.id}`}
              className="flex items-center justify-between p-4 border border-white/10 hover:border-white/30 transition-colors group"
            >
              <div>
                <p className="text-xs font-mono text-white">#{order.id.slice(-8).toUpperCase()}</p>
                <p className="text-xs text-neutral-600 mt-0.5">
                  {new Date(order.created_at).toLocaleDateString("pt-BR")}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-xs font-bold uppercase tracking-wide px-2 py-1 ${STATUS_COLORS[order.status] || "text-neutral-400 bg-neutral-800"}`}>
                  {STATUS_LABELS[order.status] || order.status}
                </span>
                <span className="text-sm font-bold text-white">{formatPrice(order.total)}</span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
