"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/hooks/useSupabase";
import { slugify } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ImageUploader from "./ImageUploader";
import { Plus, X } from "lucide-react";

interface Category {
  id: string;
  name: string;
}

interface Variant {
  id?: string;
  size: string;
  color: string;
  stock: number;
  sku: string;
  _delete?: boolean;
}

interface ProductFormProps {
  categories: Category[];
  product?: any;
}

export default function ProductForm({ categories, product }: ProductFormProps) {
  const supabase = useSupabase();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    price: product?.price || "",
    compare_at_price: product?.compare_at_price || "",
    category_id: product?.category_id || (categories[0]?.id || ""),
    stock: product?.stock || 0,
    is_active: product?.is_active ?? true,
    tags: product?.tags?.join(", ") || "",
  });

  const [images, setImages] = useState<string[]>(product?.images || []);
  const [variants, setVariants] = useState<Variant[]>(
    product?.variants?.map((v: any) => ({
      id: v.id,
      size: v.size,
      color: v.color,
      stock: v.stock,
      sku: v.sku || "",
    })) || []
  );
  const [newVariant, setNewVariant] = useState({ size: "", color: "", stock: 0, sku: "" });

  const handleChange = (field: string, value: any) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "name" && !product) {
        updated.slug = slugify(value);
      }
      return updated;
    });
  };

  const addVariant = () => {
    if (!newVariant.size) return;
    setVariants((prev) => [...prev, { ...newVariant }]);
    setNewVariant({ size: "", color: "", stock: 0, sku: "" });
  };

  const removeVariant = (index: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      name: form.name,
      slug: form.slug,
      description: form.description,
      price: parseFloat(String(form.price)),
      compare_at_price: form.compare_at_price ? parseFloat(String(form.compare_at_price)) : null,
      category_id: form.category_id,
      stock: parseInt(String(form.stock)),
      is_active: form.is_active,
      tags: form.tags.split(",").map((t: string) => t.trim()).filter(Boolean),
      images,
    };

    const db = supabase as any;
    let productId = product?.id;

    if (product) {
      const { error } = await db.from("products").update(payload).eq("id", product.id);
      if (error) { setError(error.message); setLoading(false); return; }
    } else {
      const { data, error } = await db.from("products").insert(payload).select().single();
      if (error || !data) { setError(error?.message || "Erro ao criar produto"); setLoading(false); return; }
      productId = data.id;
    }

    // Save variants
    if (productId && variants.length > 0) {
      // Delete existing variants for this product and re-insert
      await db.from("product_variants").delete().eq("product_id", productId);
      const variantsToInsert = variants.map((v) => ({
        product_id: productId,
        size: v.size,
        color: v.color || "Único",
        stock: v.stock,
        sku: v.sku || `${form.slug}-${v.size}-${v.color || "unico"}`.toLowerCase(),
      }));
      await db.from("product_variants").insert(variantsToInsert);
    }

    router.push("/admin/produtos");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">

      {/* Nome + Slug */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Nome do Produto"
          placeholder="Ex: Camiseta Core Logo"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          required
        />
        <Input
          label="Slug (URL)"
          placeholder="camiseta-core-logo"
          value={form.slug}
          onChange={(e) => handleChange("slug", e.target.value)}
          required
        />
      </div>

      {/* Descrição */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-neutral-400 uppercase tracking-widest">Descrição</label>
        <textarea
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Descreva o produto..."
          rows={4}
          className="w-full bg-neutral-900 border border-neutral-700 text-white placeholder:text-neutral-600 px-4 py-3 text-sm focus:outline-none focus:border-white resize-none"
          required
        />
      </div>

      {/* Preços */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Preço (R$)"
          type="number"
          step="0.01"
          placeholder="199.90"
          value={form.price}
          onChange={(e) => handleChange("price", e.target.value)}
          required
        />
        <Input
          label="Preço Original (opcional)"
          type="number"
          step="0.01"
          placeholder="249.90"
          value={form.compare_at_price}
          onChange={(e) => handleChange("compare_at_price", e.target.value)}
        />
      </div>

      {/* Categoria + Estoque geral */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-neutral-400 uppercase tracking-widest">Categoria</label>
          <select
            value={form.category_id}
            onChange={(e) => handleChange("category_id", e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-700 text-white px-4 py-3 text-sm focus:outline-none focus:border-white"
            required
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <Input
          label="Estoque geral"
          type="number"
          placeholder="50"
          value={form.stock}
          onChange={(e) => handleChange("stock", e.target.value)}
          required
        />
      </div>

      {/* Tags */}
      <Input
        label="Tags (separadas por vírgula)"
        placeholder="new, bestseller, sale, limited"
        value={form.tags}
        onChange={(e) => handleChange("tags", e.target.value)}
      />

      {/* Imagens */}
      <ImageUploader images={images} onChange={setImages} />

      {/* Variantes */}
      <div className="flex flex-col gap-3">
        <label className="text-xs font-medium text-neutral-400 uppercase tracking-widest">
          Variantes (Tamanho / Cor)
        </label>

        {/* Existing variants */}
        {variants.length > 0 && (
          <div className="border border-white/10">
            <div className="grid grid-cols-12 gap-2 px-3 py-2 bg-neutral-950 border-b border-white/10">
              <span className="col-span-3 text-xs text-neutral-600 uppercase tracking-wider">Tamanho</span>
              <span className="col-span-3 text-xs text-neutral-600 uppercase tracking-wider">Cor</span>
              <span className="col-span-3 text-xs text-neutral-600 uppercase tracking-wider">Estoque</span>
              <span className="col-span-2 text-xs text-neutral-600 uppercase tracking-wider">SKU</span>
              <span className="col-span-1"></span>
            </div>
            {variants.map((v, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 px-3 py-2 border-b border-white/5 items-center">
                <span className="col-span-3 text-sm text-white">{v.size}</span>
                <span className="col-span-3 text-sm text-neutral-400">{v.color || "Único"}</span>
                <span className="col-span-3 text-sm text-white">{v.stock}</span>
                <span className="col-span-2 text-xs text-neutral-600 font-mono truncate">{v.sku}</span>
                <div className="col-span-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeVariant(i)}
                    className="text-neutral-600 hover:text-red-400 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add new variant */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Input
            label="Tamanho"
            placeholder="P, M, G, GG..."
            value={newVariant.size}
            onChange={(e) => setNewVariant((p) => ({ ...p, size: e.target.value }))}
          />
          <Input
            label="Cor (opcional)"
            placeholder="Preto, Branco..."
            value={newVariant.color}
            onChange={(e) => setNewVariant((p) => ({ ...p, color: e.target.value }))}
          />
          <Input
            label="Estoque"
            type="number"
            placeholder="10"
            value={newVariant.stock}
            onChange={(e) => setNewVariant((p) => ({ ...p, stock: Number(e.target.value) }))}
          />
          <Input
            label="SKU (opcional)"
            placeholder="DOT-001-P"
            value={newVariant.sku}
            onChange={(e) => setNewVariant((p) => ({ ...p, sku: e.target.value }))}
          />
        </div>
        <button
          type="button"
          onClick={addVariant}
          disabled={!newVariant.size}
          className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-neutral-400 hover:text-white transition-colors disabled:opacity-30 self-start border border-white/10 hover:border-white/40 px-4 py-2"
        >
          <Plus size={14} /> Adicionar Variante
        </button>
      </div>

      {/* Status */}
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          id="is_active"
          checked={form.is_active}
          onChange={(e) => handleChange("is_active", e.target.checked)}
          className="w-4 h-4 accent-white"
        />
        <label htmlFor="is_active" className="text-sm text-neutral-300">
          Produto ativo (visível na loja)
        </label>
      </div>

      {error && <p className="text-red-500 text-xs">{error}</p>}

      <div className="flex gap-3 pt-4 border-t border-white/10">
        <Button type="submit" loading={loading} size="lg">
          {product ? "Salvar Alterações" : "Criar Produto"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/admin/produtos")}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
