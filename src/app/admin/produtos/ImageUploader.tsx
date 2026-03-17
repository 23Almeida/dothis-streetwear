"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useSupabase } from "@/hooks/useSupabase";
import { Upload, X, Loader2, GripVertical } from "lucide-react";

interface ImageUploaderProps {
  images: string[];
  onChange: (urls: string[]) => void;
}

export default function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const supabase = useSupabase();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError("");

    const uploaded: string[] = [];

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      if (file.size > 5 * 1024 * 1024) {
        setError(`${file.name} é muito grande (máx 5MB)`);
        continue;
      }

      const ext = file.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error: uploadError } = await (supabase as any).storage
        .from("products")
        .upload(path, file, { cacheControl: "3600", upsert: false });

      if (uploadError) {
        setError(`Erro ao enviar ${file.name}: ${uploadError.message}`);
        continue;
      }

      const { data } = (supabase as any).storage
        .from("products")
        .getPublicUrl(path);

      uploaded.push(data.publicUrl);
    }

    onChange([...images, ...uploaded]);
    setUploading(false);
  };

  const remove = (url: string) => {
    onChange(images.filter((i) => i !== url));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const next = [...images];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onChange(next);
  };

  const moveDown = (index: number) => {
    if (index === images.length - 1) return;
    const next = [...images];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-3">
      <label className="text-xs font-medium text-neutral-400 uppercase tracking-widest">
        Imagens do Produto
      </label>

      {/* Upload Area */}
      <div
        className="border-2 border-dashed border-neutral-700 hover:border-neutral-500 transition-colors cursor-pointer p-8 text-center"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFiles(e.dataTransfer.files);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 size={24} className="text-neutral-400 animate-spin" />
            <p className="text-xs text-neutral-500">Enviando...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload size={24} className="text-neutral-600" />
            <p className="text-sm text-neutral-400">
              Clique ou arraste imagens aqui
            </p>
            <p className="text-xs text-neutral-600">PNG, JPG, WEBP — máx 5MB por foto</p>
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-xs">{error}</p>}

      {/* Preview Grid */}
      {images.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-neutral-600">
            {images.length} imagem{images.length > 1 ? "s" : ""} — a primeira é a principal
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {images.map((url, i) => (
              <div
                key={url}
                className={`relative group aspect-square bg-neutral-900 overflow-hidden border ${
                  i === 0 ? "border-white/40" : "border-white/10"
                }`}
              >
                <Image
                  src={url}
                  alt={`Imagem ${i + 1}`}
                  fill
                  className="object-cover"
                />

                {/* Badge principal */}
                {i === 0 && (
                  <span className="absolute top-1.5 left-1.5 bg-white text-black text-[9px] font-black uppercase px-1.5 py-0.5">
                    Principal
                  </span>
                )}

                {/* Actions overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {i > 0 && (
                    <button
                      type="button"
                      onClick={() => moveUp(i)}
                      title="Mover para cima"
                      className="bg-white/20 hover:bg-white/40 text-white p-1.5 transition-colors"
                    >
                      <GripVertical size={14} />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => remove(url)}
                    title="Remover"
                    className="bg-red-500/80 hover:bg-red-500 text-white p-1.5 transition-colors"
                  >
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
