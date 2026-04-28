"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { Pencil, Check, Trash2, LayoutGrid, Upload, Link2, Loader2 } from "lucide-react";
import EditableText from "@/components/admin/EditableText";
import { useSiteContent } from "@/contexts/SiteContentContext";
import { normalizeImageUrl } from "@/lib/utils";

const SPAN_OPTIONS = [
  { label: "Pequeno (1×1)", value: "col-span-1" },
  { label: "Largo (2×1)",   value: "col-span-2" },
  { label: "Grande (2×2)",  value: "col-span-2 row-span-2" },
  { label: "Alto (1×2)",    value: "col-span-1 row-span-2" },
];

const LAYOUT_PRESETS = [
  { label: "Destaque Esquerda", description: "1 grande + 3 pequenos", spans: ["col-span-2 row-span-2", "col-span-1", "col-span-1", "col-span-2"] },
  { label: "Destaque Direita",  description: "3 pequenos + 1 grande",  spans: ["col-span-1", "col-span-1", "col-span-1 row-span-2", "col-span-1 row-span-2"] },
  { label: "Grade Igual",       description: "Todos do mesmo tamanho", spans: ["col-span-1", "col-span-1", "col-span-1", "col-span-1"] },
  { label: "Dois Largos",       description: "2 colunas largas",       spans: ["col-span-2", "col-span-2", "col-span-2", "col-span-2"] },
];

const DEFAULT_IMAGES = [
  "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800",
  "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800",
  "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800",
  "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800",
];

async function uploadFile(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: form });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Erro no upload");
  return data.url as string;
}

export default function CategoryBanner() {
  const { content, categories, isAdmin, isEditMode, updateContent } = useSiteContent();
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [showLayoutPicker, setShowLayoutPicker] = useState(false);

  // edit form state
  const [editImage, setEditImage] = useState("");
  const [editSpan, setEditSpan]   = useState("");
  const [editTab, setEditTab]     = useState<"url" | "file">("url");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const getImage = (slug: string, idx: number) =>
    content[`banner.${slug}.image`] || DEFAULT_IMAGES[idx % DEFAULT_IMAGES.length] || "";

  const getSpan = (slug: string, idx: number) =>
    content[`banner.${slug}.span`] || LAYOUT_PRESETS[0].spans[idx] || "col-span-1";

  const openEdit = (slug: string, idx: number) => {
    setEditingSlug(slug);
    setEditImage(getImage(slug, idx));
    setEditSpan(getSpan(slug, idx));
    setEditTab("url");
    setShowLayoutPicker(false);
  };

  const saveEdit = () => {
    if (!editingSlug) return;
    updateContent(`banner.${editingSlug}.image`, normalizeImageUrl(editImage));
    updateContent(`banner.${editingSlug}.span`, editSpan);
    setEditingSlug(null);
  };

  const applyLayout = (spans: string[]) => {
    categories.forEach((cat, i) => {
      updateContent(`banner.${cat.slug}.span`, spans[i] ?? "col-span-1");
    });
    setShowLayoutPicker(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file);
      setEditImage(url);
    } catch (err: any) {
      alert(err.message ?? "Erro no upload");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const tabCls = (active: boolean) =>
    `flex items-center gap-1 px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase transition-colors ${
      active ? "bg-white text-black" : "text-neutral-500 hover:text-white"
    }`;

  return (
    <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="mb-12 flex items-end justify-between">
        <div>
          <EditableText contentKey="categories.label" tag="p"
            className="text-xs font-bold tracking-[0.4em] uppercase text-neutral-500 mb-2" />
          <EditableText contentKey="categories.title" tag="h2"
            className="text-3xl sm:text-4xl font-black tracking-tight text-white" />
        </div>

        {isAdmin && isEditMode && (
          <button
            onClick={() => { setShowLayoutPicker((p) => !p); setEditingSlug(null); }}
            className="flex items-center gap-1.5 bg-neutral-900 border border-white/20 hover:border-white/50 text-white text-[10px] font-bold tracking-widest uppercase px-3 py-2 transition-colors"
          >
            <LayoutGrid size={12} /> Layout
          </button>
        )}
      </div>

      {/* Layout Picker */}
      {isAdmin && isEditMode && showLayoutPicker && (
        <div className="mb-6 p-4 bg-neutral-950 border border-white/10 flex flex-col gap-3">
          <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-500">Escolher Layout</p>
          <div className="flex flex-wrap gap-2">
            {LAYOUT_PRESETS.map((preset) => (
              <button key={preset.label} onClick={() => applyLayout(preset.spans)}
                className="flex flex-col items-start px-4 py-2.5 border border-white/10 hover:border-white/50 hover:bg-white/5 transition-colors text-left">
                <span className="text-xs font-bold text-white">{preset.label}</span>
                <span className="text-[10px] text-neutral-500">{preset.description}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Edit Form */}
      {isAdmin && isEditMode && editingSlug !== null && (() => {
        const idx = categories.findIndex(c => c.slug === editingSlug);
        const cat = categories[idx];
        return cat ? (
          <div className="mb-6 p-4 bg-neutral-950 border border-white/10 flex flex-col gap-3">
            <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-500">
              Editando banner: <span className="text-white">{cat.name}</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
              <div className="sm:col-span-2 flex flex-col gap-1">
                <div className="flex border border-white/10">
                  <button type="button" onClick={() => setEditTab("url")} className={tabCls(editTab === "url")}>
                    <Link2 size={10} /> URL
                  </button>
                  <button type="button" onClick={() => setEditTab("file")} className={tabCls(editTab === "file")}>
                    <Upload size={10} /> Upload
                  </button>
                </div>
                {editTab === "url" ? (
                  <input value={editImage} onChange={(e) => setEditImage(e.target.value)}
                    placeholder="URL da imagem ou link do Google Drive"
                    className="bg-black border border-white/20 text-white text-sm px-3 py-2 outline-none focus:border-white w-full" />
                ) : (
                  <div className="flex items-center gap-2">
                    <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange}
                      className="hidden" id="banner-file-edit" />
                    <label htmlFor="banner-file-edit"
                      className="flex items-center gap-1.5 cursor-pointer border border-white/20 hover:border-white/50 text-white text-[10px] font-bold tracking-widest uppercase px-3 py-2 transition-colors">
                      {uploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                      {uploading ? "Enviando..." : "Escolher arquivo"}
                    </label>
                    {editImage && !uploading && editTab === "file" && (
                      <span className="text-[10px] text-green-400">✓ Imagem enviada</span>
                    )}
                  </div>
                )}
              </div>

              <select value={editSpan} onChange={(e) => setEditSpan(e.target.value)}
                className="bg-black border border-white/20 text-white text-sm px-3 py-2 outline-none focus:border-white">
                {SPAN_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>

            <div className="flex gap-2">
              <button onClick={saveEdit} disabled={uploading}
                className="flex items-center gap-1.5 bg-white text-black text-[10px] font-bold tracking-widest uppercase px-4 py-2 hover:bg-neutral-200 disabled:opacity-40 transition-colors">
                <Check size={12} /> Salvar
              </button>
              <button onClick={() => setEditingSlug(null)}
                className="px-3 py-2 border border-white/10 text-neutral-500 hover:text-white text-[10px]">
                Cancelar
              </button>
            </div>
            <p className="text-[9px] text-neutral-600">
              Para adicionar ou remover categorias, acesse o <strong className="text-neutral-400">Painel → Categorias</strong>.
            </p>
          </div>
        ) : null;
      })()}

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-4 h-[600px]">
        {categories.map((cat, i) => (
          <Link key={cat.id} href={`/shop?category=${cat.slug}`}
            className={`relative overflow-hidden group bg-neutral-900 ${getSpan(cat.slug, i)}`}>
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url('${getImage(cat.slug, i)}')`, opacity: 0.5 }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h3 className="text-lg font-black tracking-widest uppercase text-white">{cat.name}</h3>
              <span className="text-xs text-neutral-400 group-hover:text-white transition-colors tracking-widest uppercase">Ver Coleção →</span>
            </div>
            {isAdmin && isEditMode && (
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); openEdit(cat.slug, i); }}
                onMouseDown={(e) => e.stopPropagation()}
                className={`absolute top-2 right-2 z-20 flex items-center gap-1 text-[10px] font-bold px-2 py-1 border transition-colors ${editingSlug === cat.slug ? "bg-white text-black border-white" : "bg-black/70 hover:bg-black text-white border-white/20"}`}
              >
                <Pencil size={10} /> {editingSlug === cat.slug ? "Editando" : "Editar"}
              </button>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
