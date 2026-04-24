"use client";

import { useState } from "react";
import { Plus, Trash2, Check } from "lucide-react";
import { useSiteContent } from "@/contexts/SiteContentContext";

export default function MarqueeBar() {
  const { content, isAdmin, isEditMode, updateContent } = useSiteContent();

  const items: string[] = (() => {
    try { return JSON.parse(content["marquee.items"] ?? "[]"); }
    catch { return ["Streetwear Nacional", "Drop Exclusivo", "Entrega Rápida", "Qualidade Premium", "Edição Limitada", "Estilo Urbano"]; }
  })();

  const [drafts, setDrafts] = useState<string[]>(items);
  const [editing, setEditing] = useState(false);

  const saveItems = () => {
    updateContent("marquee.items", JSON.stringify(drafts.filter(Boolean)));
    setEditing(false);
  };

  const startEdit = () => {
    setDrafts([...items]);
    setEditing(true);
  };

  // Edit mode panel
  if (isAdmin && isEditMode && editing) {
    return (
      <div className="bg-white text-black py-4 px-6">
        <p className="text-xs font-bold tracking-widest uppercase mb-3 text-neutral-600">Editar itens do marquee</p>
        <div className="flex flex-col gap-2 mb-3">
          {drafts.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                value={item}
                onChange={(e) => setDrafts((prev) => prev.map((v, j) => (j === i ? e.target.value : v)))}
                className="flex-1 border border-neutral-300 px-2 py-1 text-sm outline-none focus:border-black"
              />
              <button
                onClick={() => setDrafts((prev) => prev.filter((_, j) => j !== i))}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setDrafts((prev) => [...prev, "Novo Item"])}
            className="flex items-center gap-1 text-xs font-bold tracking-widest uppercase border border-neutral-300 px-3 py-1.5 hover:border-black"
          >
            <Plus size={12} /> Adicionar
          </button>
          <button
            onClick={saveItems}
            className="flex items-center gap-1 text-xs font-bold tracking-widest uppercase bg-black text-white px-3 py-1.5"
          >
            <Check size={12} /> Salvar
          </button>
          <button
            onClick={() => setEditing(false)}
            className="text-xs text-neutral-500 hover:text-black px-2"
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white text-black py-3 overflow-hidden relative">
      {isAdmin && isEditMode && (
        <button
          onClick={startEdit}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex items-center gap-1 bg-blue-600 text-white text-[10px] font-bold tracking-widest uppercase px-2 py-1"
        >
          Editar Marquee
        </button>
      )}
      <div className="flex animate-marquee whitespace-nowrap">
        {[...items, ...items, ...items].map((item, i) => (
          <span key={i} className="text-xs font-black tracking-[0.3em] uppercase mx-8">
            {item} <span className="mx-4 opacity-40">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
