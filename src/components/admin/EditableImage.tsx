"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageIcon, X, Check, Upload } from "lucide-react";
import { useSiteContent } from "@/contexts/SiteContentContext";
import { SingleImageUpload } from "@/components/admin/ImageUploader";

/* ── next/image wrapper ─────────────────────────────────────────────── */

interface EditableImageProps {
  contentKey: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export default function EditableImage({
  contentKey,
  alt,
  className,
  ...rest
}: EditableImageProps) {
  const { content, isAdmin, isEditMode, updateContent } = useSiteContent();
  const src = content[contentKey] ?? "";

  const [showInput, setShowInput] = useState(false);
  const [draft, setDraft] = useState("");

  const save = () => {
    if (draft.trim()) updateContent(contentKey, draft.trim());
    setShowInput(false);
    setDraft("");
  };

  return (
    <div className="relative" style={rest.fill ? { position: "absolute", inset: 0 } : undefined}>
      {src && (
        <Image
          src={src}
          alt={alt}
          className={className}
          {...rest}
        />
      )}

      {isAdmin && isEditMode && (
        <div className="absolute inset-0 flex items-end justify-end p-2 z-10">
          {showInput ? (
            <div
              className="flex flex-col gap-1.5 bg-black/90 border border-white/20 p-2 w-64"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="url"
                placeholder="Cole a URL da imagem..."
                value={draft}
                autoFocus
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") save();
                  if (e.key === "Escape") { setShowInput(false); setDraft(""); }
                }}
                className="bg-black border border-white/30 text-white text-xs px-2 py-1.5 w-full outline-none focus:border-blue-400"
              />
              <div className="flex gap-1.5">
                <button onClick={save} className="flex-1 flex items-center justify-center gap-1 bg-blue-600 text-white text-xs py-1 font-bold">
                  <Check size={11} /> Salvar
                </button>
                <button onClick={() => { setShowInput(false); setDraft(""); }} className="p-1 border border-white/20 text-white/60 hover:text-white">
                  <X size={12} />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowInput(true)}
              className="flex items-center gap-1.5 bg-black/80 hover:bg-black text-white text-[10px] font-bold tracking-widest uppercase px-2.5 py-1.5 border border-white/20 transition-colors"
            >
              <ImageIcon size={11} /> Trocar
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ── CSS background-image helper ────────────────────────────────────── */

interface EditBgButtonProps {
  contentKey: string;
  label?: string;
}

export function EditBgButton({ contentKey, label = "Trocar Imagem" }: EditBgButtonProps) {
  const { isAdmin, isEditMode, content, updateContent } = useSiteContent();
  const [open, setOpen] = useState(false);
  const [urlDraft, setUrlDraft] = useState(content[contentKey] ?? "");
  const [tab, setTab] = useState<"upload" | "url">("upload");

  if (!isAdmin || !isEditMode) return null;

  const saveUrl = () => {
    if (urlDraft.trim()) { updateContent(contentKey, urlDraft.trim()); setOpen(false); }
  };

  return (
    <>
      {/* Trigger button */}
      <div className="absolute top-4 right-4 z-30">
        <button
          onClick={() => { setUrlDraft(content[contentKey] ?? ""); setOpen(true); }}
          className="flex items-center gap-1.5 bg-black/70 hover:bg-black text-white text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 border border-white/30 transition-colors"
        >
          <ImageIcon size={11} /> {label}
        </button>
      </div>

      {/* Panel — fixed so it's never clipped by overflow:hidden */}
      {open && (
        <>
          <div className="fixed inset-0 z-[9998]" onClick={() => setOpen(false)} />
          <div
            className="fixed top-16 right-4 z-[9999] flex flex-col gap-2 bg-black/95 border border-white/20 p-3 w-72"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-1">
              <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-400">{label}</p>
              <button onClick={() => setOpen(false)} className="text-neutral-500 hover:text-white">
                <X size={12} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border border-white/10 text-[10px] font-bold tracking-widest uppercase">
              <button onClick={() => setTab("upload")} className={`flex-1 py-1.5 transition-colors ${tab === "upload" ? "bg-white text-black" : "text-neutral-400 hover:text-white"}`}>
                Upload
              </button>
              <button onClick={() => setTab("url")} className={`flex-1 py-1.5 transition-colors ${tab === "url" ? "bg-white text-black" : "text-neutral-400 hover:text-white"}`}>
                URL
              </button>
            </div>

            {tab === "upload" ? (
              <div className="flex flex-col gap-2">
                <SingleImageUpload
                  label="Selecionar Arquivo"
                  onUpload={(url) => { updateContent(contentKey, url); setOpen(false); }}
                />
                <p className="text-neutral-600 text-[10px]">PNG, JPG, WEBP — máx 10MB</p>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                <input
                  type="url"
                  value={urlDraft}
                  autoFocus
                  onChange={(e) => setUrlDraft(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") saveUrl(); if (e.key === "Escape") setOpen(false); }}
                  placeholder="https://..."
                  className="bg-black border border-white/30 text-white text-xs px-2 py-1.5 w-full outline-none focus:border-blue-400"
                />
                <button onClick={saveUrl} className="flex items-center justify-center gap-1 bg-blue-600 text-white text-xs py-1.5 font-bold w-full">
                  <Check size={11} /> Salvar URL
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
