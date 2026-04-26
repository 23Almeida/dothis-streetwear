"use client";

import { useState } from "react";
import Image from "next/image";
import { SingleImageUpload } from "@/components/admin/ImageUploader";
import { Check, ImageIcon, X } from "lucide-react";

interface HeroEditorProps {
  currentImage: string;
}

export default function HeroEditor({ currentImage }: HeroEditorProps) {
  const [preview, setPreview] = useState(currentImage);
  const [urlInput, setUrlInput] = useState("");
  const [tab, setTab] = useState<"upload" | "url">("upload");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const save = async (url: string) => {
    setSaving(true);
    setSaved(false);
    await fetch("/api/site-content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "hero.bg_image", value: url }),
    });
    setPreview(url);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleUrl = () => {
    if (urlInput.trim()) { save(urlInput.trim()); setUrlInput(""); }
  };

  return (
    <div className="bg-neutral-950 border border-white/10 p-6 flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <ImageIcon size={14} className="text-neutral-500" />
        <h2 className="text-xs font-bold tracking-widest uppercase text-white">Foto do Hero</h2>
        {saved && <span className="text-xs text-green-400 ml-auto">Salvo!</span>}
      </div>

      {/* Preview */}
      <div className="relative w-full aspect-video bg-neutral-900 overflow-hidden">
        {preview && (
          <Image src={preview} alt="Hero" fill className="object-cover opacity-60" />
        )}
        <span className="absolute bottom-2 left-2 text-[10px] text-neutral-500 uppercase tracking-widest">Preview</span>
      </div>

      {/* Tabs */}
      <div className="flex border border-white/10 text-[10px] font-bold tracking-widest uppercase">
        <button
          onClick={() => setTab("upload")}
          className={`flex-1 py-2 transition-colors ${tab === "upload" ? "bg-white text-black" : "text-neutral-400 hover:text-white"}`}
        >
          Upload
        </button>
        <button
          onClick={() => setTab("url")}
          className={`flex-1 py-2 transition-colors ${tab === "url" ? "bg-white text-black" : "text-neutral-400 hover:text-white"}`}
        >
          URL
        </button>
      </div>

      {tab === "upload" ? (
        <div className="flex flex-col gap-2">
          <SingleImageUpload
            label={saving ? "Salvando..." : "Selecionar Foto"}
            onUpload={save}
          />
          <p className="text-neutral-600 text-[10px]">PNG, JPG, WEBP — máx 10MB. A foto será usada como fundo da página inicial.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleUrl()}
              placeholder="https://..."
              className="flex-1 bg-black border border-white/20 text-white text-xs px-3 py-2 outline-none focus:border-white"
            />
            <button
              onClick={handleUrl}
              disabled={!urlInput.trim() || saving}
              className="flex items-center gap-1 bg-white text-black text-[10px] font-bold tracking-widest uppercase px-3 py-2 hover:bg-neutral-200 disabled:opacity-40 transition-colors"
            >
              <Check size={10} /> Salvar
            </button>
          </div>
          <p className="text-neutral-600 text-[10px]">Cole a URL de uma imagem (Unsplash, etc.)</p>
        </div>
      )}
    </div>
  );
}
