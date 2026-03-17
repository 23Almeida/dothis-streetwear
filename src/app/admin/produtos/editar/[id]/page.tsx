import { redirect, notFound } from "next/navigation";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import ProductForm from "../../ProductForm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin — Editar Produto" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditarProdutoPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profileData } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  const profile = profileData as any;
  if (profile?.role !== "admin") redirect("/");

  const [{ data: productData }, { data: categories }] = await Promise.all([
    supabase.from("products").select("*").eq("id", id).single(),
    supabase.from("categories").select("id, name").order("name"),
  ]);

  if (!productData) notFound();

  return (
    <div className="min-h-screen bg-black pt-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-10">
          <p className="text-xs text-neutral-500 tracking-widest uppercase mb-1">
            Admin / <a href="/admin/produtos" className="hover:text-white">Produtos</a>
          </p>
          <h1 className="text-3xl font-black text-white">Editar Produto</h1>
        </div>
        <ProductForm
          categories={(categories as any[]) || []}
          product={productData}
        />
      </div>
    </div>
  );
}
