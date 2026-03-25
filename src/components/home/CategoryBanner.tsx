"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { useSite } from "@/context/SiteContext";
import { useAuth } from "@/hooks/useAuth";
import CategoryEditor from "@/components/editor/CategoryEditor";

function MosaicLayout({ items }: { items: Array<{ name: string; slug: string; image: string }> }) {
  const all = items.slice(0, 4);
  const spans = ["col-span-2 row-span-2", "col-span-1", "col-span-1", "col-span-2"];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-2 gap-4 h-[600px]">
      {all.map((cat, i) => (
        <CategoryCard key={cat.slug || i} cat={cat} spanClass={spans[i] ?? ""} />
      ))}
    </div>
  );
}

function EqualLayout({ items }: { items: Array<{ name: string; slug: string; image: string }> }) {
  const all = items.slice(0, 4);
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 gap-4 h-[600px]">
      {all.map((cat, i) => (
        <CategoryCard key={cat.slug || i} cat={cat} spanClass="" />
      ))}
    </div>
  );
}

function PortraitLayout({ items }: { items: Array<{ name: string; slug: string; image: string }> }) {
  const all = items.slice(0, 4);
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-[500px]">
      {all.map((cat, i) => (
        <CategoryCard key={cat.slug || i} cat={cat} spanClass="" />
      ))}
    </div>
  );
}

function CategoryCard({ cat, spanClass }: { cat: { name: string; slug: string; image: string }; spanClass: string }) {
  return (
    <Link
      href={`/shop?category=${cat.slug}`}
      className={`relative overflow-hidden group bg-neutral-950 ${spanClass}`}
    >
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
        style={{ backgroundImage: `url('${cat.image}')`, opacity: 0.65 }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="font-display text-2xl tracking-wider uppercase text-white leading-none mb-1">{cat.name}</h3>
        <span className="text-[10px] font-bold text-neutral-400 group-hover:text-white transition-colors tracking-[0.2em] uppercase flex items-center gap-1.5">
          Ver Coleção <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
        </span>
      </div>
    </Link>
  );
}

export default function CategoryBanner() {
  const { settings, editMode } = useSite();
  const { profile } = useAuth();
  const [editorOpen, setEditorOpen] = useState(false);

  const isAdmin = profile?.role === "admin";
  const cats = settings.categories;

  return (
    <section className="py-24 px-4 sm:px-6 max-w-7xl mx-auto relative group/cats">
      {/* Edit overlay */}
      {isAdmin && editMode && (
        <button
          onClick={() => setEditorOpen(true)}
          className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-orange-500 text-black text-[10px] font-black uppercase tracking-wider px-3 py-2 hover:bg-orange-400 transition-colors"
        >
          <Pencil size={12} /> Editar Categorias
        </button>
      )}

      {isAdmin && editMode && (
        <div className="absolute inset-0 border-2 border-orange-500/40 pointer-events-none rounded" />
      )}

      <div className="mb-12">
        <p className="text-[10px] font-bold tracking-[0.5em] uppercase text-neutral-500 mb-3">
          {cats.subtitle}
        </p>
        <h2 className="font-display text-5xl sm:text-6xl tracking-wide text-white leading-none">
          {cats.title}
        </h2>
      </div>

      {cats.layout === "equal" ? (
        <EqualLayout items={cats.items} />
      ) : cats.layout === "portrait" ? (
        <PortraitLayout items={cats.items} />
      ) : (
        <MosaicLayout items={cats.items} />
      )}

      {editorOpen && <CategoryEditor onClose={() => setEditorOpen(false)} />}
    </section>
  );
}
