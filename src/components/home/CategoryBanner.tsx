"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Check, X } from "lucide-react";
import EditableText from "@/components/admin/EditableText";
import { useSiteContent } from "@/contexts/SiteContentContext";

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

function CategoryEditOverlay({ cat, index, onSave }: { cat: Category; index: number; onSave: (i: number, updated: Partial<Category>) => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(cat.name);
  const [image, setImage] = useState(cat.image);

  const save = () => {
    onSave(index, { name, image });
    setOpen(false);
  };

  return (
    <div className="absolute top-2 right-2 z-20">
      {open ? (
        <div className="flex flex-col gap-1.5 bg-black/90 border border-white/20 p-2 w-56" onClick={(e) => e.stopPropagation()}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome da categoria"
            className="bg-black border border-white/30 text-white text-xs px-2 py-1.5 outline-none focus:border-blue-400"
          />
          <input
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="URL da imagem"
            className="bg-black border border-white/30 text-white text-xs px-2 py-1.5 outline-none focus:border-blue-400"
          />
          <div className="flex gap-1.5 mt-0.5">
            <button onClick={save} className="flex-1 flex items-center justify-center gap-1 bg-blue-600 text-white text-xs py-1 font-bold">
              <Check size={10} /> Salvar
            </button>
            <button onClick={() => setOpen(false)} className="p-1 border border-white/20 text-white/60 hover:text-white">
              <X size={12} />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={(e) => { e.preventDefault(); setName(cat.name); setImage(cat.image); setOpen(true); }}
          className="flex items-center gap-1 bg-black/70 hover:bg-black text-white text-[10px] font-bold px-2 py-1 border border-white/20"
        >
          <Pencil size={10} /> Editar
        </button>
      )}
    </div>
  );
}

export default function CategoryBanner() {
  const { content, isAdmin, isEditMode, updateContent } = useSiteContent();

  const categories: Category[] = (() => {
    try { return JSON.parse(content["categories.items"] ?? "[]"); }
    catch { return DEFAULT_CATEGORIES; }
  })();

  const handleSaveCategory = (index: number, updated: Partial<Category>) => {
    const next = categories.map((c, i) => (i === index ? { ...c, ...updated } : c));
    updateContent("categories.items", JSON.stringify(next));
  };

  return (
    <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="mb-12">
        <EditableText
          contentKey="categories.label"
          tag="p"
          className="text-xs font-bold tracking-[0.4em] uppercase text-neutral-500 mb-2"
        />
        <EditableText
          contentKey="categories.title"
          tag="h2"
          className="text-3xl sm:text-4xl font-black tracking-tight text-white"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-4 h-[600px]">
        {categories.map((cat, i) => (
          <Link
            key={cat.slug}
            href={`/shop?category=${cat.slug}`}
            className={`relative overflow-hidden group bg-neutral-900 ${cat.span}`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url('${cat.image}')`, opacity: 0.5 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h3 className="text-lg font-black tracking-widest uppercase text-white">
                {cat.name}
              </h3>
              <span className="text-xs text-neutral-400 group-hover:text-white transition-colors tracking-widest uppercase">
                Ver Coleção →
              </span>
            </div>

            {isAdmin && isEditMode && (
              <CategoryEditOverlay cat={cat} index={i} onSave={handleSaveCategory} />
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}
