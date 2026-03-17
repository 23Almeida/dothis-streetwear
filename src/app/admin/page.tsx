import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin" };

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
    { data: recentOrders },
    { data: products },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase
      .from("orders")
      .select("id, status, total, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("products")
      .select("id, name, price, stock, is_active")
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  const stats = [
    { label: "Produtos", value: productCount || 0 },
    { label: "Pedidos", value: orderCount || 0 },
  ];

  const STATUS_COLORS: Record<string, string> = {
    pending: "text-yellow-400",
    confirmed: "text-blue-400",
    processing: "text-blue-400",
    shipped: "text-purple-400",
    delivered: "text-green-400",
    cancelled: "text-red-400",
  };

  return (
    <div className="min-h-screen bg-black pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <p className="text-xs font-bold tracking-[0.4em] uppercase text-neutral-500 mb-2">
            Painel
          </p>
          <h1 className="text-3xl font-black text-white">Admin</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-neutral-950 border border-white/10 p-6">
              <p className="text-3xl font-black text-white">{stat.value}</p>
              <p className="text-xs text-neutral-500 uppercase tracking-widest mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div>
            <h2 className="text-xs font-bold tracking-widest uppercase text-neutral-400 mb-4">
              Pedidos Recentes
            </h2>
            <div className="flex flex-col gap-2">
              {(recentOrders as any[])?.map((order: any) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 border border-white/10"
                >
                  <div>
                    <p className="text-xs font-mono text-neutral-300">
                      #{order.id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-neutral-600 mt-0.5">
                      {new Date(order.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs font-bold uppercase ${STATUS_COLORS[order.status] || "text-neutral-400"}`}>
                      {order.status}
                    </p>
                    <p className="text-sm font-bold text-white">{formatPrice(order.total)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold tracking-widest uppercase text-neutral-400">
                Produtos
              </h2>
              <Link
                href="/admin/products/new"
                className="text-xs font-bold tracking-widest uppercase text-white border border-white/30 px-3 py-1.5 hover:bg-white hover:text-black transition-all"
              >
                + Novo
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              {(products as any[])?.map((product: any) => (
                <div
                  key={product.id}
                  className="flex items-center justify-between p-4 border border-white/10"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">{product.name}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Estoque: {product.stock}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-sm font-bold">{formatPrice(product.price)}</p>
                    <p className={`text-xs mt-0.5 ${product.is_active ? "text-green-400" : "text-neutral-600"}`}>
                      {product.is_active ? "Ativo" : "Inativo"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
