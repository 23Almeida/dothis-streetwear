"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Check, X, Trash2, Plus, LayoutGrid } from "lucide-react";
import EditableText from "@/components/admin/EditableText";
import { useSiteContent } from "@/contexts/SiteContentContext";
import { normalizeImageUrl, slugify } from "@/lib/utils";

interface Category {
  name: string;
  slug: string;
  image: string;
  span: string;
}

const DEFAULT_CATEGORIES: Category[] = [
  { name: "Camisetas", slug: "camisetas", image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800", span: "col-span-2 row-span-2" },
  { name: "Moletons",  slug: "moletons",  image: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800", span: "col-span-1" },
  { name: "Calças",    slug: "calcas",    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800", span: "col-span-1" },
  { name: "Jaquetas",  slug: "jaquetas",  image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800", span: "col-span-2" },
];

const SPAN_OPTIONS = [
  { label: "Pequeno (1×1)", value: "col-span-1" },
  { label: "Largo (2×1)",   value: "col-span-2" },
  { label: "Grande (2×2)",  value: "col-span-2 row-span-2" },
  { label: "Alto (1×2)",    value: "col-span-1 row-span-2" },
];

// Layout presets — define spans for each item in order
const LAYOUT_PRESETS = [
  {
    label: "Destaque Esquerda",
    description: "1 grande + 3 pequenos",
    spans: ["col-span-2 row-span-2", "col-span-1", "col-span-1", "col-span-2"],
  },
  {
    label: "Destaque Direita",
    description: "3 pequenos + 1 grande",
    spans: ["col-span-1", "col-span-1", "col-span-1 row-span-2", "col-span-1 row-span-2"],
  },
  {
    label: "Grade Igual",
    description: "Todos do mesmo tamanho",
    spans: ["col-span-1", "col-span-1", "col-span-1", "col-span-1"],
  },
  {
    label: "Dois Largos",
    description: "2 colunas largas",
    spans: ["col-span-2", "col-span-2", "col-span-2", "col-span-2"],
  },
  {
    label: "Uma Linha",
    description: "4 em linha",
    spans: ["col-span-1", "col-span-1", "col-span-1", "col-span-1"],
  },
];

export default function CategoryBanner() {
  const { content, isAdmin, isEditMode, updateContent } = useSiteContent();
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showLayoutPicker, setShowLayoutPicker] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  // edit form state
  const [editName, setEditName] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editSpan, setEditSpan] = useState("");

  // add form state
  const [newName, setNewName] = useState("");
  const [newImage, setNewImage] = useState("");
  const [newSpan, setNewSpan] = useState("col-span-1");

  const categories: Category[] = (() => {
    try { return JSON.parse(content["categories.items"] ?? "[]"); }
    catch { return DEFAULT_CATEGORIES; }
  })();

  const persist = (next: Category[]) =>
    updateContent("categories.items", JSON.stringify(next));

  const openEdit = (i: number) => {
    setEditingIndex(i);
    setEditName(categories[i].name);
    setEditImage(categories[i].image);
    setEditSpan(categories[i].span);
    setShowLayoutPicker(false);
    setShowAddForm(false);
  };

  const saveEdit = () => {
    if (editingIndex === null) return;
    const next = categories.map((c, i) =>
      i === editingIndex
        ? { ...c, name: editName, slug: slugify(editName), image: normalizeImageUrl(editImage), span: editSpan }
        : c
    );
    persist(next);
    setEditingIndex(null);
  };

  const deleteItem = (i: number) => {
    persist(categories.filter((_, idx) => idx !== i));
    setEditingIndex(null);
  };

  const applyLayout = (spans: string[]) => {
    const next = categories.map((c, i) => ({ ...c, span: spans[i] ?? "col-span-1" }));
    persist(next);
    setShowLayoutPicker(false);
  };

  const addNew = () => {
    if (!newName.trim()) return;
    persist([...categories, {
      name: newName.trim(),
      slug: slugify(newName.trim()),
      image: normalizeImageUrl(newImage),
      span: newSpan,
    }]);
    setNewName(""); setNewImage(""); setNewSpan("col-span-1");
    setShowAddForm(false);
  };

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
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setShowLayoutPicker((p) => !p); setEditingIndex(null); setShowAddForm(false); }}
              className="flex items-center gap-1.5 bg-neutral-900 border border-white/20 hover:border-white/50 text-white text-[10px] font-bold tracking-widest uppercase px-3 py-2 transition-colors"
            >
              <LayoutGrid size={12} /> Layout
            </button>
            <button
              onClick={() => { setShowAddForm((p) => !p); setEditingIndex(null); setShowLayoutPicker(false); }}
              className="flex items-center gap-1.5 bg-white text-black text-[10px] font-bold tracking-widest uppercase px-3 py-2 hover:bg-neutral-200 transition-colors"
            >
              <Plus size={12} /> Novo Banner
            </button>
          </div>
        )}
      </div>

      {/* Layout Picker */}
      {isAdmin && isEditMode && showLayoutPicker && (
        <div className="mb-6 p-4 bg-neutral-950 border border-white/10 flex flex-col gap-3">
          <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-500">Escolher Layout</p>
          <div className="flex flex-wrap gap-2">
            {LAYOUT_PRESETS.map((preset) => (
              <button
                key={preset.label}
                onClick={() => applyLayout(preset.spans)}
                className="flex flex-col items-start px-4 py-2.5 border border-white/10 hover:border-white/50 hover:bg-white/5 transition-colors text-left"
              >
                <span className="text-xs font-bold text-white">{preset.label}</span>
                <span className="text-[10px] text-neutral-500">{preset.description}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Add Form */}
      {isAdmin && isEditMode && showAddForm && (
        <div className="mb-6 p-4 bg-neutral-950 border border-white/10 flex flex-col gap-3">
          <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-500">Novo Banner</p>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input value={newName} onChange={(e) => setNewName(e.target.value)}
              placeholder="Nome (ex: Shorts)" onKeyDown={(e) => e.key === "Enter" && addNew()}
              className="bg-black border border-white/20 text-white text-sm px-3 py-2 outline-none focus:border-white" />
            <input value={newImage} onChange={(e) => setNewImage(e.target.value)}
              placeholder="URL da imagem ou Drive"
              className="bg-black border border-white/20 text-white text-sm px-3 py-2 outline-none focus:border-white sm:col-span-2" />
            <select value={newSpan} onChange={(e) => setNewSpan(e.target.value)}
              className="bg-black border border-white/20 text-white text-sm px-3 py-2 outline-none focus:border-white">
              {SPAN_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={addNew} disabled={!newName.trim()}
              className="flex items-center gap-1.5 bg-white text-black text-[10px] font-bold tracking-widest uppercase px-4 py-2 hover:bg-neutral-200 disabled:opacity-40 transition-colors">
              <Check size={12} /> Adicionar
            </button>
            <button onClick={() => setShowAddForm(false)}
              className="px-3 py-2 border border-white/10 text-neutral-500 hover:text-white text-[10px]">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Edit Form */}
      {isAdmin && isEditMode && editingIndex !== null && (
        <div className="mb-6 p-4 bg-neutral-950 border border-white/10 flex flex-col gap-3">
          <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-500">
            Editando: <span className="text-white">{categories[editingIndex]?.name}</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input value={editName} onChange={(e) => setEditName(e.target.value)}
              placeholder="Nome" onKeyDown={(e) => e.key === "Enter" && saveEdit()}
              className="bg-black border border-white/20 text-white text-sm px-3 py-2 outline-none focus:border-white" />
            <input value={editImage} onChange={(e) => setEditImage(e.target.value)}
              placeholder="URL da imagem ou Drive"
              className="bg-black border border-white/20 text-white text-sm px-3 py-2 outline-none focus:border-white sm:col-span-2" />
            <select value={editSpan} onChange={(e) => setEditSpan(e.target.value)}
              className="bg-black border border-white/20 text-white text-sm px-3 py-2 outline-none focus:border-white">
              {SPAN_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={saveEdit}
              className="flex items-center gap-1.5 bg-white text-black text-[10px] font-bold tracking-widest uppercase px-4 py-2 hover:bg-neutral-200 transition-colors">
              <Check size={12} /> Salvar
            </button>
            <button onClick={() => { if (confirm("Excluir este banner?")) deleteItem(editingIndex); }}
              className="flex items-center gap-1.5 border border-red-800 text-red-400 hover:bg-red-900/20 text-[10px] font-bold tracking-widest uppercase px-4 py-2 transition-colors">
              <Trash2 size={12} /> Excluir
            </button>
            <button onClick={() => setEditingIndex(null)}
              className="px-3 py-2 border border-white/10 text-neutral-500 hover:text-white text-[10px]">
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-4 h-[600px]">
        {categories.map((cat, i) => (
          <Link key={`${cat.slug}-${i}`} href={`/shop?category=${cat.slug}`}
            className={`relative overflow-hidden group bg-neutral-900 ${cat.span}`}>
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url('${cat.image}')`, opacity: 0.5 }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h3 className="text-lg font-black tracking-widest uppercase text-white">{cat.name}</h3>
              <span className="text-xs text-neutral-400 group-hover:text-white transition-colors tracking-widest uppercase">Ver Coleção →</span>
            </div>
            {isAdmin && isEditMode && (
              <button
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); openEdit(i); }}
                onMouseDown={(e) => e.stopPropagation()}
                className={`absolute top-2 right-2 z-20 flex items-center gap-1 text-[10px] font-bold px-2 py-1 border transition-colors ${editingIndex === i ? "bg-white text-black border-white" : "bg-black/70 hover:bg-black text-white border-white/20"}`}
              >
                <Pencil size={10} /> {editingIndex === i ? "Editando" : "Editar"}
              </button>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
