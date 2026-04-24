"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Save, Loader2, ExternalLink } from "lucide-react";
import { useSupabase } from "@/hooks/useSupabase";
import type { Product } from "@/types";
import ImageUploader from "@/components/admin/ImageUploader";

interface ProductEditPanelProps {
  product: Product;
  onClose: () => void;
}

export default function ProductEditPanel({ product, onClose }: ProductEditPanelProps) {
  const supabase = useSupabase();
  const router = useRouter();

  const [images, setImages] = useState<string[]>(product.images ?? []);
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(String(product.price));
  const [compareAt, setCompareAt] = useState(String(product.compare_at_price ?? ""));
  const [description, setDescription] = useState(product.description);
  const [tags, setTags] = useState((product.tags ?? []).join(", "));
  const [isActive, setIsActive] = useState(product.is_active);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleSave = async () => {
    setLoading(true);
    setError("");
    setSaved(false);

    const { error: dbError } = await supabase.from("products").update({
      name: name.trim(),
      price: parseFloat(price) || product.price,
      compare_at_price: compareAt ? parseFloat(compareAt) : null,
      description: description.trim(),
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      images,
      is_active: isActive,
      updated_at: new Date().toISOString(),
    }).eq("id", product.id);

    if (dbError) {
      setError(dbError.message);
      setLoading(false);
      return;
    }

    setSaved(true);
    setLoading(false);
    router.refresh();
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-[9998] backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-lg bg-neutral-950 border-l border-white/10 z-[9999] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 flex-shrink-0">
          <div>
            <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-500">Editar Produto</p>
            <h2 className="text-sm font-black text-white mt-0.5 truncate max-w-xs">{name}</h2>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`/shop/${product.slug}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-[10px] text-neutral-500 hover:text-white tracking-widest uppercase"
            >
              <ExternalLink size={11} /> Ver
            </a>
            <button onClick={onClose} className="p-1.5 text-neutral-500 hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-6">

          {/* Images */}
          <section>
            <label className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 block mb-2">
              Fotos do Produto
            </label>
            <ImageUploader images={images} onChange={setImages} />
          </section>

          {/* Name */}
          <section>
            <label className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 block mb-1.5">
              Nome
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-neutral-900 border border-neutral-700 text-white px-3 py-2.5 text-sm outline-none focus:border-white"
            />
          </section>

          {/* Prices */}
          <section className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 block mb-1.5">
                Preço (R$)
              </label>
              <input
                type="number"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 text-white px-3 py-2.5 text-sm outline-none focus:border-white"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 block mb-1.5">
                Preço Original
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="Deixe vazio"
                value={compareAt}
                onChange={(e) => setCompareAt(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-700 text-white px-3 py-2.5 text-sm outline-none focus:border-white placeholder:text-neutral-600"
              />
            </div>
          </section>

          {/* Description */}
          <section>
            <label className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 block mb-1.5">
              Descrição
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full bg-neutral-900 border border-neutral-700 text-white px-3 py-2.5 text-sm outline-none focus:border-white resize-none"
            />
          </section>

          {/* Tags */}
          <section>
            <label className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 block mb-1.5">
              Tags <span className="text-neutral-600 normal-case font-normal">(separadas por vírgula)</span>
            </label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="new, bestseller, limited, sale"
              className="w-full bg-neutral-900 border border-neutral-700 text-white px-3 py-2.5 text-sm outline-none focus:border-white placeholder:text-neutral-600"
            />
          </section>

          {/* Active toggle */}
          <section className="flex items-center gap-3">
            <button
              onClick={() => setIsActive((p) => !p)}
              className={`w-10 h-5 rounded-full transition-colors relative flex-shrink-0 ${isActive ? "bg-white" : "bg-neutral-700"}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-black transition-transform ${isActive ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
            <span className="text-sm text-neutral-300">
              Produto {isActive ? "ativo (visível na loja)" : "inativo (oculto)"}
            </span>
          </section>

        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-5 py-4 border-t border-white/10 flex flex-col gap-2">
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-white text-black py-3 text-xs font-bold tracking-widest uppercase hover:bg-neutral-200 transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              {saved ? "Salvo!" : loading ? "Salvando..." : "Salvar Alterações"}
            </button>
            <button
              onClick={onClose}
              className="px-4 py-3 border border-white/20 text-neutral-400 hover:text-white text-xs font-bold tracking-widest uppercase transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
