"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/hooks/useSupabase";
import { slugify } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ImageUploader from "./ImageUploader";

interface Category {
  id: string;
  name: string;
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

  const handleChange = (field: string, value: any) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "name" && !product) {
        updated.slug = slugify(value);
      }
      return updated;
    });
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

    if (product) {
      const { error } = await db.from("products").update(payload).eq("id", product.id);
      if (error) { setError(error.message); setLoading(false); return; }
    } else {
      const { error } = await db.from("products").insert(payload);
      if (error) { setError(error.message); setLoading(false); return; }
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
        <label className="text-xs font-medium text-neutral-400 uppercase tracking-widest">
          Descrição
        </label>
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
          placeholder="249.90 (para mostrar desconto)"
          value={form.compare_at_price}
          onChange={(e) => handleChange("compare_at_price", e.target.value)}
        />
      </div>

      {/* Categoria + Estoque */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-neutral-400 uppercase tracking-widest">
            Categoria
          </label>
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
          label="Estoque"
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
        placeholder="new, bestseller, sale, limited, premium"
        value={form.tags}
        onChange={(e) => handleChange("tags", e.target.value)}
      />

      {/* Imagens */}
      <ImageUploader images={images} onChange={setImages} />

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
