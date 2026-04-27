"use client";

import { useRef, useState } from "react";
import { Upload, X, Loader2, GripVertical, Link as LinkIcon, Plus } from "lucide-react";

interface ImageUploaderProps {
  images: string[];
  onChange: (urls: string[]) => void;
  bucket?: string;
}

export default function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<"upload" | "url">("upload");
  const [urlInput, setUrlInput] = useState("");

  const uploadFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError("");
    const uploaded: string[] = [];

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      if (file.size > 10 * 1024 * 1024) { setError(`${file.name} é muito grande (máx 10MB)`); continue; }

      const form = new FormData();
      form.append("file", file);

      try {
        const res = await fetch("/api/upload", { method: "POST", body: form });
        const data = await res.json();
        if (!res.ok) { setError(data.error || "Erro no upload"); continue; }
        uploaded.push(data.url);
      } catch {
        setError("Erro de conexão no upload");
      }
    }

    onChange([...images, ...uploaded]);
    setUploading(false);
  };

  const normalizeUrl = (raw: string): string => {
    // Google Drive: /file/d/ID/view → direct image URL
    const driveMatch = raw.match(/drive\.google\.com\/file\/d\/([^/?]+)/);
    if (driveMatch) return `https://drive.google.com/uc?export=view&id=${driveMatch[1]}`;
    // Google Drive: open?id=ID
    const driveOpen = raw.match(/drive\.google\.com\/open\?id=([^&]+)/);
    if (driveOpen) return `https://drive.google.com/uc?export=view&id=${driveOpen[1]}`;
    return raw;
  };

  const addUrl = () => {
    const raw = urlInput.trim();
    if (!raw) return;
    if (!raw.startsWith("http")) { setError("URL inválida"); return; }
    onChange([...images, normalizeUrl(raw)]);
    setUrlInput("");
    setError("");
  };

  const remove = (url: string) => onChange(images.filter((i) => i !== url));
  const moveUp = (i: number) => {
    if (i === 0) return;
    const next = [...images];
    [next[i - 1], next[i]] = [next[i], next[i - 1]];
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Tabs */}
      <div className="flex border border-white/10 text-[10px] font-bold tracking-widest uppercase">
        <button
          type="button"
          onClick={() => setTab("upload")}
          className={`flex-1 py-2 flex items-center justify-center gap-1.5 transition-colors ${tab === "upload" ? "bg-white text-black" : "text-neutral-400 hover:text-white"}`}
        >
          <Upload size={10} /> Upload
        </button>
        <button
          type="button"
          onClick={() => setTab("url")}
          className={`flex-1 py-2 flex items-center justify-center gap-1.5 transition-colors ${tab === "url" ? "bg-white text-black" : "text-neutral-400 hover:text-white"}`}
        >
          <LinkIcon size={10} /> URL
        </button>
      </div>

      {tab === "upload" ? (
        <div
          className="border-2 border-dashed border-neutral-700 hover:border-neutral-500 transition-colors cursor-pointer p-6 text-center"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); uploadFiles(e.dataTransfer.files); }}
        >
          <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => uploadFiles(e.target.files)} />
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 size={20} className="text-neutral-400 animate-spin" />
              <p className="text-xs text-neutral-500">Enviando...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5">
              <Upload size={20} className="text-neutral-600" />
              <p className="text-sm text-neutral-400">Clique ou arraste imagens</p>
              <p className="text-xs text-neutral-600">PNG, JPG, WEBP — máx 5MB</p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => { setUrlInput(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && addUrl()}
              placeholder="https://..."
              className="flex-1 bg-neutral-900 border border-neutral-700 text-white text-xs px-3 py-2.5 outline-none focus:border-white placeholder:text-neutral-600"
            />
            <button
              type="button"
              onClick={addUrl}
              disabled={!urlInput.trim()}
              className="flex items-center gap-1 bg-white text-black text-[10px] font-bold tracking-widest uppercase px-3 py-2 hover:bg-neutral-200 disabled:opacity-40 transition-colors"
            >
              <Plus size={10} /> Adicionar
            </button>
          </div>
          <p className="text-neutral-600 text-[10px]">Cole qualquer URL de imagem. Links do Google Drive são convertidos automaticamente.</p>
        </div>
      )}

      {error && <p className="text-red-400 text-xs">{error}</p>}

      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {images.map((url, i) => (
            <div key={url} className={`relative group aspect-square bg-neutral-900 overflow-hidden border ${i === 0 ? "border-white/50" : "border-white/10"}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="absolute inset-0 w-full h-full object-cover" />
              {i === 0 && <span className="absolute top-1 left-1 bg-white text-black text-[9px] font-black px-1">Principal</span>}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                {i > 0 && (
                  <button type="button" onClick={() => moveUp(i)} className="bg-white/20 hover:bg-white/40 text-white p-1.5">
                    <GripVertical size={12} />
                  </button>
                )}
                <button type="button" onClick={() => remove(url)} className="bg-red-500/80 hover:bg-red-500 text-white p-1.5">
                  <X size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Single image upload (for hero/banner) ───────────────────── */
interface SingleImageUploadProps {
  onUpload: (url: string) => void;
  bucket?: string;
  label?: string;
}

export function SingleImageUpload({ onUpload, label = "Upload" }: SingleImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (files: FileList | null) => {
    const file = files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setError("Arquivo inválido"); return; }
    if (file.size > 10 * 1024 * 1024) { setError("Máximo 10MB"); return; }

    setUploading(true);
    setError("");

    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Erro no upload"); return; }
      onUpload(data.url);
    } catch {
      setError("Erro de conexão");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files)} />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex items-center gap-1.5 bg-white text-black text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 hover:bg-neutral-200 transition-colors disabled:opacity-50"
      >
        {uploading ? <Loader2 size={10} className="animate-spin" /> : <Upload size={10} />}
        {uploading ? "Enviando..." : label}
      </button>
      {error && <p className="text-red-400 text-[10px] mt-1">{error}</p>}
    </>
  );
}
