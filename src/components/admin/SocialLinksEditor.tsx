"use client";

import { useState, useEffect } from "react";
import { useSiteContent } from "@/contexts/SiteContentContext";

export default function SocialLinksEditor() {
  const { content, updateContent } = useSiteContent();

  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [youtube, setYoutube] = useState("");

  // Carrega as URLs que já estão no banco de dados
  useEffect(() => {
    setInstagram(content["social.instagram"] || "");
    setTwitter(content["social.twitter"] || "");
    setYoutube(content["social.youtube"] || "");
  }, [content]);

  // Função que salva automaticamente ao tirar o clique da caixa de texto
  const handleSave = (key: string, value: string) => {
    if (content[key] !== value) {
      updateContent(key, value);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <label className="text-xs font-medium text-neutral-400 w-24">Instagram</label>
        <input
          type="text"
          value={instagram}
          onChange={(e) => setInstagram(e.target.value)}
          onBlur={(e) => handleSave("social.instagram", e.target.value)}
          className="flex-1 text-sm text-white bg-black border border-neutral-800 p-2 focus:border-white focus:outline-none transition-colors"
          placeholder="https://instagram.com/suamarca"
        />
      </div>

      <div className="flex items-center gap-4">
        <label className="text-xs font-medium text-neutral-400 w-24">Twitter / X</label>
        <input
          type="text"
          value={twitter}
          onChange={(e) => setTwitter(e.target.value)}
          onBlur={(e) => handleSave("social.twitter", e.target.value)}
          className="flex-1 text-sm text-white bg-black border border-neutral-800 p-2 focus:border-white focus:outline-none transition-colors"
          placeholder="https://twitter.com/suamarca"
        />
      </div>

      <div className="flex items-center gap-4">
        <label className="text-xs font-medium text-neutral-400 w-24">YouTube</label>
        <input
          type="text"
          value={youtube}
          onChange={(e) => setYoutube(e.target.value)}
          onBlur={(e) => handleSave("social.youtube", e.target.value)}
          className="flex-1 text-sm text-white bg-black border border-neutral-800 p-2 focus:border-white focus:outline-none transition-colors"
          placeholder="https://youtube.com/@suamarca"
        />
      </div>
      
      <p className="text-xs text-neutral-600 mt-2">
        * As alterações são salvas automaticamente ao clicar fora do campo.
      </p>
    </div>
  );
}