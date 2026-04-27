"use client";

import { useRef, useState } from "react";
import { Upload, X, Loader2, GripVertical, Link as LinkIcon, Plus } from "lucide-react";
import { normalizeImageUrl } from "@/lib/utils";

interface ImageUploaderProps {
  images: string[];
  onChange: (urls: string[]) => void;
}

export default function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"upload" | "url">("upload");
  const [urlInput, setUrlInput] = useState("");

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError("");
    const uploaded: string[] = [];

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      if (file.size > 10 * 1024 * 1024) { setError(`${file.name} muito grande (máx 10MB)`); continue; }

      try {
        const form = new FormData();
        form.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: form });
        const data = await res.json();
        if (!res.ok) { setError(data.error || "Erro no upload"); continue; }
        uploaded.push(data.url);
      } catch {
        setError("Erro de conexão");
      }
    }

    onChange([...images, ...uploaded]);
    setUploading(false);
  };

  const addUrl = () => {
    const raw = urlInput.trim();
    if (!raw || !raw.startsWith("http")) { setError("URL inválida"); return; }
    onChange([...images, normalizeImageUrl(raw)]);
    setUrlInput("");
    setError("");
  };

  const remove = (url: string) => onChange(images.filter((i) => i !== url));

  const moveUp = (index: number) => {
    if (index === 0) return;
    const next = [...images];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="text-xs font-medium text-neutral-400 uppercase tracking-widest">
        Imagens do Produto
      </label>

      {/* Tabs */}
      <div className="flex border border-white/10 text-[10px] font-bold tracking-widest uppercase">
        <button type="button" onClick={() => setTab("upload")}
          className={`flex-1 py-2 flex items-center justify-center gap-1.5 transition-colors ${tab === "upload" ? "bg-white text-black" : "text-neutral-400 hover:text-white"}`}>
          <Upload size={10} /> Upload
        </button>
        <button type="button" onClick={() => setTab("url")}
          className={`flex-1 py-2 flex items-center justify-center gap-1.5 transition-colors ${tab === "url" ? "bg-white text-black" : "text-neutral-400 hover:text-white"}`}>
          <LinkIcon size={10} /> URL
        </button>
      </div>

      {tab === "upload" ? (
        <div className="border-2 border-dashed border-neutral-700 hover:border-neutral-500 transition-colors cursor-pointer p-8 text-center"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}>
          <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 size={24} className="text-neutral-400 animate-spin" />
              <p className="text-xs text-neutral-500">Enviando...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload size={24} className="text-neutral-600" />
              <p className="text-sm text-neutral-400">Clique ou arraste imagens aqui</p>
              <p className="text-xs text-neutral-600">PNG, JPG, WEBP — máx 10MB</p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <input type="url" value={urlInput}
              onChange={(e) => { setUrlInput(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && addUrl()}
              placeholder="https:// ou link do Google Drive"
              className="flex-1 bg-neutral-900 border border-neutral-700 text-white text-sm px-3 py-2.5 outline-none focus:border-white placeholder:text-neutral-600" />
            <button type="button" onClick={addUrl} disabled={!urlInput.trim()}
              className="flex items-center gap-1 bg-white text-black text-[10px] font-bold tracking-widest uppercase px-3 py-2 hover:bg-neutral-200 disabled:opacity-40 transition-colors">
              <Plus size={10} /> Adicionar
            </button>
          </div>
          <p className="text-neutral-600 text-[10px]">Links do Google Drive são convertidos automaticamente.</p>
        </div>
      )}

      {error && <p className="text-red-500 text-xs">{error}</p>}

      {images.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-neutral-600">{images.length} imagem{images.length > 1 ? "s" : ""} — a primeira é a principal</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {images.map((url, i) => (
              <div key={url} className={`relative group aspect-square bg-neutral-900 overflow-hidden border ${i === 0 ? "border-white/40" : "border-white/10"}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={`Imagem ${i + 1}`} className="absolute inset-0 w-full h-full object-cover" />
                {i === 0 && <span className="absolute top-1.5 left-1.5 bg-white text-black text-[9px] font-black uppercase px-1.5 py-0.5">Principal</span>}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {i > 0 && (
                    <button type="button" onClick={() => moveUp(i)} className="bg-white/20 hover:bg-white/40 text-white p-1.5">
                      <GripVertical size={14} />
                    </button>
                  )}
                  <button type="button" onClick={() => remove(url)} className="bg-red-500/80 hover:bg-red-500 text-white p-1.5">
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
