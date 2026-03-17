import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import { Plus, Pencil } from "lucide-react";
import DeleteProductButton from "./DeleteProductButton";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin — Produtos" };

export default async function AdminProdutosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profileData } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  const profile = profileData as any;
  if (profile?.role !== "admin") redirect("/");

  const { data: products } = await supabase
    .from("products")
    .select("*, category:categories(name)")
    .order("created_at", { ascending: false });

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
            <p className="text-xs font-bold tracking-[0.4em] uppercase text-neutral-500 mb-1">Admin</p>
            <h1 className="text-3xl font-black text-white">Produtos</h1>
          </div>
          <Link
            href="/admin/produtos/novo"
            className="flex items-center gap-2 bg-white text-black px-4 py-2 text-xs font-bold tracking-widest uppercase hover:bg-neutral-200 transition-colors"
          >
            <Plus size={14} />
            Novo Produto
          </Link>
        </div>

        {/* Nav */}
        <div className="flex gap-1 mb-10 border-b border-white/10">
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

        {/* Table */}
        <div className="border border-white/10">
          {/* Head */}
          <div className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-white/10 bg-neutral-950">
            <span className="col-span-4 text-xs font-bold tracking-widest uppercase text-neutral-500">Produto</span>
            <span className="col-span-2 text-xs font-bold tracking-widest uppercase text-neutral-500">Categoria</span>
            <span className="col-span-2 text-xs font-bold tracking-widest uppercase text-neutral-500">Preço</span>
            <span className="col-span-1 text-xs font-bold tracking-widest uppercase text-neutral-500">Estoque</span>
            <span className="col-span-1 text-xs font-bold tracking-widest uppercase text-neutral-500">Status</span>
            <span className="col-span-2 text-xs font-bold tracking-widest uppercase text-neutral-500 text-right">Ações</span>
          </div>

          {/* Rows */}
          {(products as any[])?.map((product: any) => (
            <div
              key={product.id}
              className="grid grid-cols-12 gap-4 px-4 py-4 border-b border-white/5 hover:bg-white/2 items-center"
            >
              <div className="col-span-4">
                <p className="text-sm text-white font-medium truncate">{product.name}</p>
                <p className="text-xs text-neutral-600 font-mono mt-0.5">{product.slug}</p>
              </div>
              <div className="col-span-2">
                <span className="text-xs text-neutral-400">{(product.category as any)?.name || "—"}</span>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-white font-bold">{formatPrice(product.price)}</p>
                {product.compare_at_price && (
                  <p className="text-xs text-neutral-600 line-through">{formatPrice(product.compare_at_price)}</p>
                )}
              </div>
              <div className="col-span-1">
                <span className={`text-sm font-bold ${product.stock === 0 ? "text-red-400" : product.stock < 5 ? "text-yellow-400" : "text-white"}`}>
                  {product.stock}
                </span>
              </div>
              <div className="col-span-1">
                <span className={`text-xs font-bold uppercase ${product.is_active ? "text-green-400" : "text-neutral-600"}`}>
                  {product.is_active ? "Ativo" : "Inativo"}
                </span>
              </div>
              <div className="col-span-2 flex items-center justify-end gap-2">
                <Link
                  href={`/admin/produtos/editar/${product.id}`}
                  className="p-2 text-neutral-500 hover:text-white transition-colors border border-white/10 hover:border-white/40"
                >
                  <Pencil size={14} />
                </Link>
                <DeleteProductButton id={product.id} name={product.name} />
              </div>
            </div>
          ))}

          {(!products || products.length === 0) && (
            <div className="text-center py-16">
              <p className="text-neutral-600 text-sm">Nenhum produto cadastrado</p>
              <Link href="/admin/produtos/novo" className="text-white text-xs mt-3 inline-block hover:underline">
                Criar primeiro produto →
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
