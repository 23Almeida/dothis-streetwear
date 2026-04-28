"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Check, X, LayoutGrid, Settings2 } from "lucide-react";
import Button from "@/components/ui/Button";
import Logo3D from "./Logo3D";
import EditableText from "@/components/admin/EditableText";
import { EditBgButton } from "@/components/admin/EditableImage";
import { useSiteContent } from "@/contexts/SiteContentContext";

interface HeroButton {
  label: string;
  href: string;
  variant: "primary" | "outline" | "ghost" | "secondary";
  newTab: boolean;
}

const DEFAULT_BUTTONS: HeroButton[] = [
  { label: "SHOP",    href: "/shop", variant: "primary",  newTab: false },
  { label: "COLEÇÃO", href: "/shop", variant: "outline",  newTab: false },
];

const VARIANT_OPTIONS = [
  { value: "primary",   label: "Preenchido",   hint: "Fundo branco, texto preto" },
  { value: "outline",   label: "Contorno",     hint: "Borda branca, fundo transparente" },
  { value: "secondary", label: "Secundário",   hint: "Fundo cinza escuro" },
  { value: "ghost",     label: "Fantasma",     hint: "Sem borda, hover discreto" },
];

const LAYOUT_OPTIONS = [
  { value: "row-center", label: "Horizontal · Centro",   cls: "flex-col sm:flex-row items-center justify-center" },
  { value: "row-left",   label: "Horizontal · Esquerda", cls: "flex-col sm:flex-row items-start justify-start" },
  { value: "col-center", label: "Vertical · Centro",     cls: "flex-col items-center" },
  { value: "col-left",   label: "Vertical · Esquerda",   cls: "flex-col items-start" },
];

const LINK_HINTS = [
  "/shop — loja completa",
  "/shop?category=camisetas — só camisetas",
  "/shop?category=moletons — só moletons",
  "https://... — site externo",
];

export default function Hero() {
  const { content, isAdmin, isEditMode, updateContent } = useSiteContent();
  const bgImage = content["hero.bg_image"] ?? "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920";

  const [showPanel, setShowPanel] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [showAdd, setShowAdd]         = useState(false);

  // edit form
  const [editLabel,   setEditLabel]   = useState("");
  const [editHref,    setEditHref]    = useState("");
  const [editVariant, setEditVariant] = useState<HeroButton["variant"]>("primary");
  const [editNewTab,  setEditNewTab]  = useState(false);

  // add form
  const [newLabel,   setNewLabel]   = useState("");
  const [newHref,    setNewHref]    = useState("/shop");
  const [newVariant, setNewVariant] = useState<HeroButton["variant"]>("outline");
  const [newNewTab,  setNewNewTab]  = useState(false);

  const buttons: HeroButton[] = (() => {
    try { return JSON.parse(content["hero.buttons"] ?? "[]"); }
    catch { return DEFAULT_BUTTONS; }
  })();

  const layout = content["hero.buttons_layout"] ?? "row-center";
  const layoutCls = LAYOUT_OPTIONS.find((l) => l.value === layout)?.cls
    ?? "flex-col sm:flex-row items-center justify-center";

  const persist = (next: HeroButton[]) =>
    updateContent("hero.buttons", JSON.stringify(next));

  const openEdit = (i: number) => {
    setEditingIndex(i);
    setEditLabel(buttons[i].label);
    setEditHref(buttons[i].href);
    setEditVariant(buttons[i].variant);
    setEditNewTab(buttons[i].newTab ?? false);
    setShowAdd(false);
  };

  const saveEdit = () => {
    if (editingIndex === null) return;
    persist(buttons.map((b, i) =>
      i === editingIndex
        ? { label: editLabel, href: editHref, variant: editVariant, newTab: editNewTab }
        : b
    ));
    setEditingIndex(null);
  };

  const deleteBtn = (i: number) => {
    persist(buttons.filter((_, idx) => idx !== i));
    setEditingIndex(null);
  };

  const addBtn = () => {
    if (!newLabel.trim() || !newHref.trim()) return;
    persist([...buttons, { label: newLabel.trim(), href: newHref.trim(), variant: newVariant, newTab: newNewTab }]);
    setNewLabel(""); setNewHref("/shop"); setNewVariant("outline"); setNewNewTab(false);
    setShowAdd(false);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{ backgroundImage: `url('${bgImage}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black" />

      <EditBgButton contentKey="hero.bg_image" label="Trocar Fundo" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center w-full">
        <EditableText
          contentKey="hero.badge"
          tag="p"
          className="text-xs font-bold tracking-[0.5em] uppercase text-neutral-400 mb-10"
        />

        <div className="mb-10">
          <Logo3D />
        </div>

        <EditableText
          contentKey="hero.subtitle"
          tag="p"
          multiline
          className="text-base sm:text-lg text-neutral-300 max-w-md mx-auto mb-10 leading-relaxed"
        />

        {/* Buttons row */}
        <div className={`flex gap-4 ${layoutCls}`}>
          {buttons.map((btn, i) => (
            <div key={i} className="relative group/btn">
              <Link href={btn.href} target={btn.newTab ? "_blank" : undefined} rel={btn.newTab ? "noopener noreferrer" : undefined}>
                <Button size="lg" variant={btn.variant}>{btn.label}</Button>
              </Link>
              {isAdmin && isEditMode && (
                <button
                  onClick={() => { setShowPanel(true); openEdit(i); }}
                  className="absolute -top-2 -right-2 z-20 bg-black border border-white/30 text-white p-1 opacity-0 group-hover/btn:opacity-100 transition-opacity hover:bg-neutral-900"
                  title="Editar botão"
                >
                  <Pencil size={9} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Admin toggle */}
        {isAdmin && isEditMode && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              onClick={() => { setShowPanel((p) => !p); setShowAdd(false); setEditingIndex(null); }}
              className="flex items-center gap-1.5 bg-black/60 border border-white/20 hover:border-white/50 text-white text-[10px] font-bold tracking-widest uppercase px-3 py-2 transition-colors"
            >
              <Settings2 size={11} /> Editar Botões
            </button>
          </div>
        )}
      </div>

      {/* ── Edit Panel (fixed at bottom of viewport) ── */}
      {isAdmin && isEditMode && showPanel && (
        <div className="fixed bottom-0 left-0 right-0 z-[100] bg-black/98 border-t border-white/10 shadow-2xl max-h-[80vh] overflow-y-auto">
          <div className="max-w-3xl mx-auto px-6 py-5 flex flex-col gap-5">

            {/* Header */}
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-black tracking-[0.4em] uppercase text-neutral-500">Gerenciar Botões do Hero</p>
              <button onClick={() => { setShowPanel(false); setEditingIndex(null); setShowAdd(false); }}
                className="text-neutral-500 hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Button list */}
            <div className="flex flex-col gap-2">
              {buttons.length === 0 && (
                <p className="text-xs text-neutral-600 italic">Nenhum botão. Clique em "Adicionar Botão" abaixo.</p>
              )}
              {buttons.map((btn, i) => (
                <div key={i} className={`border px-4 py-3 transition-colors ${editingIndex === i ? "border-white/40 bg-white/5" : "border-white/10"}`}>
                  {editingIndex === i ? (
                    <div className="flex flex-col gap-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">
                            Texto do botão
                          </label>
                          <input value={editLabel} onChange={(e) => setEditLabel(e.target.value)}
                            placeholder="Ex: SHOP"
                            className="bg-black border border-white/20 text-white text-sm px-3 py-2 outline-none focus:border-white" />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">
                            Link — para onde o botão leva
                          </label>
                          <input value={editHref} onChange={(e) => setEditHref(e.target.value)}
                            placeholder="/shop"
                            className="bg-black border border-white/20 text-white text-sm px-3 py-2 outline-none focus:border-white" />
                          <p className="text-[9px] text-neutral-600">Ex: {LINK_HINTS[0]}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">
                            Estilo visual
                          </label>
                          <select value={editVariant} onChange={(e) => setEditVariant(e.target.value as HeroButton["variant"])}
                            className="bg-black border border-white/20 text-white text-sm px-3 py-2 outline-none focus:border-white">
                            {VARIANT_OPTIONS.map((o) => (
                              <option key={o.value} value={o.value}>{o.label} — {o.hint}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex flex-col gap-1 justify-end pb-1">
                          <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-400 select-none">
                            <input type="checkbox" checked={editNewTab} onChange={(e) => setEditNewTab(e.target.checked)} className="accent-white w-4 h-4" />
                            Abrir em nova aba (útil para links externos)
                          </label>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={saveEdit}
                          className="flex items-center gap-1.5 bg-white text-black text-[10px] font-bold tracking-widest uppercase px-4 py-2 hover:bg-neutral-200 transition-colors">
                          <Check size={11} /> Salvar
                        </button>
                        <button onClick={() => setEditingIndex(null)}
                          className="px-3 py-2 border border-white/10 text-neutral-500 hover:text-white text-[10px] transition-colors">
                          Cancelar
                        </button>
                        <button onClick={() => { if (confirm("Excluir este botão?")) deleteBtn(i); }}
                          className="ml-auto flex items-center gap-1.5 border border-red-800/60 text-red-500 hover:bg-red-900/20 text-[10px] font-bold px-3 py-2 transition-colors">
                          <Trash2 size={11} /> Excluir
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <p className="text-sm text-white font-bold">{btn.label}</p>
                        <p className="text-[10px] text-neutral-600 font-mono">
                          {btn.href}
                          {" · "}
                          {VARIANT_OPTIONS.find((v) => v.value === btn.variant)?.label}
                          {btn.newTab ? " · Nova aba" : ""}
                        </p>
                      </div>
                      <button onClick={() => openEdit(i)}
                        className="text-neutral-500 hover:text-white p-1.5 transition-colors" title="Editar">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => { if (confirm("Excluir este botão?")) deleteBtn(i); }}
                        className="text-neutral-700 hover:text-red-400 p-1.5 transition-colors" title="Excluir">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Add form */}
            {showAdd ? (
              <div className="border border-dashed border-white/20 p-4 flex flex-col gap-3">
                <p className="text-[9px] font-black tracking-[0.3em] uppercase text-neutral-500">Novo Botão</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">
                      Texto do botão
                    </label>
                    <input value={newLabel} onChange={(e) => setNewLabel(e.target.value)}
                      placeholder="Ex: VER COLEÇÃO"
                      className="bg-black border border-white/20 text-white text-sm px-3 py-2 outline-none focus:border-white" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">
                      Link — para onde o botão leva
                    </label>
                    <input value={newHref} onChange={(e) => setNewHref(e.target.value)}
                      placeholder="/shop"
                      className="bg-black border border-white/20 text-white text-sm px-3 py-2 outline-none focus:border-white" />
                    <div className="flex flex-col gap-0.5">
                      {LINK_HINTS.map((h) => (
                        <p key={h} className="text-[9px] text-neutral-600">• {h}</p>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">
                      Estilo visual
                    </label>
                    <select value={newVariant} onChange={(e) => setNewVariant(e.target.value as HeroButton["variant"])}
                      className="bg-black border border-white/20 text-white text-sm px-3 py-2 outline-none focus:border-white">
                      {VARIANT_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>{o.label} — {o.hint}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1 justify-end pb-1">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-400 select-none">
                      <input type="checkbox" checked={newNewTab} onChange={(e) => setNewNewTab(e.target.checked)} className="accent-white w-4 h-4" />
                      Abrir em nova aba (útil para links externos)
                    </label>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={addBtn} disabled={!newLabel.trim() || !newHref.trim()}
                    className="flex items-center gap-1.5 bg-white text-black text-[10px] font-bold tracking-widest uppercase px-4 py-2 hover:bg-neutral-200 disabled:opacity-40 transition-colors">
                    <Check size={11} /> Adicionar
                  </button>
                  <button onClick={() => setShowAdd(false)}
                    className="px-3 py-2 border border-white/10 text-neutral-500 hover:text-white text-[10px] transition-colors">
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <button onClick={() => { setShowAdd(true); setEditingIndex(null); }}
                className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-neutral-400 hover:text-white transition-colors self-start border border-white/10 hover:border-white/40 px-4 py-2">
                <Plus size={12} /> Adicionar Botão
              </button>
            )}

            {/* Layout picker */}
            <div className="border-t border-white/10 pt-4">
              <p className="text-[9px] font-black tracking-[0.3em] uppercase text-neutral-500 mb-3">
                Layout dos Botões — como ficam dispostos no hero
              </p>
              <div className="flex gap-2 flex-wrap">
                {LAYOUT_OPTIONS.map((opt) => (
                  <button key={opt.value}
                    onClick={() => updateContent("hero.buttons_layout", opt.value)}
                    className={`px-4 py-2 text-[10px] font-bold tracking-widest uppercase border transition-colors ${
                      layout === opt.value
                        ? "bg-white text-black border-white"
                        : "border-white/10 text-neutral-400 hover:text-white hover:border-white/40"
                    }`}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Scroll indicator */}
      {!(isAdmin && isEditMode && showPanel) && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="w-px h-12 bg-gradient-to-b from-white/0 to-white/30 animate-pulse" />
          <span className="text-[10px] tracking-widest uppercase text-neutral-600">Scroll</span>
        </div>
      )}
    </section>
  );
}
