"use client";

import { useState } from "react";
import { X, Save, Check, LayoutGrid, Grid2x2, Rows } from "lucide-react";
import { useSite } from "@/context/SiteContext";

const LAYOUTS = [
  {
    id: "mosaic",
    label: "Mosaico",
    icon: LayoutGrid,
    desc: "Primeiro item grande, outros menores",
    preview: (
      <div className="grid grid-cols-4 grid-rows-2 gap-0.5 h-10 w-16">
        <div className="col-span-2 row-span-2 bg-white/40" />
        <div className="col-span-1 bg-white/20" />
        <div className="col-span-1 bg-white/20" />
        <div className="col-span-2 bg-white/20" />
      </div>
    ),
  },
  {
    id: "equal",
    label: "Grade",
    icon: Grid2x2,
    desc: "Todos os blocos iguais (2×2)",
    preview: (
      <div className="grid grid-cols-2 grid-rows-2 gap-0.5 h-10 w-16">
        {[0,1,2,3].map(i => <div key={i} className="bg-white/30" />)}
      </div>
    ),
  },
  {
    id: "portrait",
    label: "Retrato",
    icon: Rows,
    desc: "Cards altos em linha",
    preview: (
      <div className="grid grid-cols-4 gap-0.5 h-10 w-16">
        {[0,1,2,3].map(i => <div key={i} className="bg-white/30" />)}
      </div>
    ),
  },
];

export default function CategoryEditor({ onClose }: { onClose: () => void }) {
  const { settings, updateSection, saving } = useSite();
  const cats = settings.categories;

  const [title, setTitle] = useState(cats.title);
  const [subtitle, setSubtitle] = useState(cats.subtitle);
  const [layout, setLayout] = useState<"mosaic" | "equal" | "portrait">(cats.layout);
  const [items, setItems] = useState(cats.items.map(i => ({ ...i })));
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const updateItem = (idx: number, field: "name" | "image", value: string) => {
    setItems(prev => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaveError(null);
    const result = await updateSection("categories", { title, subtitle, layout, items });
    if (result.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } else {
      setSaveError(result.error ?? "Erro ao salvar");
    }
  };

  const inputClass = "w-full bg-neutral-900 border border-neutral-700 text-white placeholder:text-neutral-600 px-3 py-2 text-sm focus:outline-none focus:border-white";

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full sm:w-[460px] h-full sm:h-auto sm:max-h-[95vh] bg-neutral-950 border-l border-white/10 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 flex-shrink-0">
          <div>
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Editando</p>
            <h3 className="text-sm font-black text-white uppercase tracking-wider">Seção Categorias</h3>
          </div>
          <button onClick={onClose} className="text-neutral-500 hover:text-white p-1">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6">
          {/* Title */}
          <div className="flex flex-col gap-3">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Título da Seção</label>
            <input value={title} onChange={e => { setTitle(e.target.value); setSaved(false); }} placeholder="Explore por Estilo" className={inputClass} />
            <input value={subtitle} onChange={e => { setSubtitle(e.target.value); setSaved(false); }} placeholder="Categorias" className={inputClass} />
          </div>

          {/* Layout picker */}
          <div className="flex flex-col gap-3">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Layout das Molduras</label>
            <div className="flex flex-col gap-2">
              {LAYOUTS.map(l => (
                <button
                  key={l.id}
                  onClick={() => { setLayout(l.id as any); setSaved(false); }}
                  className={`flex items-center gap-4 p-3 border transition-colors text-left ${layout === l.id ? "border-white bg-white/5" : "border-white/10 hover:border-white/30"}`}
                >
                  {l.preview}
                  <div>
                    <p className="text-xs font-bold text-white uppercase tracking-wider">{l.label}</p>
                    <p className="text-[10px] text-neutral-500">{l.desc}</p>
                  </div>
                  {layout === l.id && <div className="ml-auto w-2 h-2 bg-white rounded-full" />}
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-col gap-4">
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Categorias</label>
            {items.map((item, idx) => (
              <div key={idx} className="flex flex-col gap-2 p-3 border border-white/10">
                <div className="flex items-center gap-2 mb-1">
                  {item.image && (
                    <div
                      className="w-10 h-10 bg-cover bg-center flex-shrink-0 border border-white/10"
                      style={{ backgroundImage: `url('${item.image}')` }}
                    />
                  )}
                  <span className="text-xs font-bold text-white uppercase tracking-widest">{item.name}</span>
                </div>
                <input
                  value={item.name}
                  onChange={e => updateItem(idx, "name", e.target.value)}
                  placeholder="Nome da categoria"
                  className={inputClass}
                />
                <input
                  value={item.image}
                  onChange={e => updateItem(idx, "image", e.target.value)}
                  placeholder="URL da foto (https://...)"
                  className={inputClass}
                />
              </div>
            ))}
          </div>
        </div>

        {saveError && (
          <div className="px-6 py-3 bg-red-950 border-t border-red-800 text-red-400 text-xs">
            {saveError}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-white/10 flex-shrink-0">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 bg-white text-black text-xs font-black uppercase tracking-widest py-3 hover:bg-neutral-200 transition-colors disabled:opacity-50"
          >
            {saving ? <span className="animate-pulse">Salvando...</span>
              : saved ? <><Check size={14} /> Salvo!</>
              : <><Save size={14} /> Salvar</>}
          </button>
          <button onClick={onClose} className="px-4 py-3 text-xs text-neutral-400 hover:text-white border border-white/10 hover:border-white/40">
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
