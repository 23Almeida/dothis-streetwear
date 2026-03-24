"use client";

import { useState } from "react";
import { Save, Check } from "lucide-react";
import type { SiteSettings } from "@/lib/settings";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

const TABS = [
  { id: "brand", label: "Identidade" },
  { id: "announcement", label: "Anúncio" },
  { id: "hero", label: "Homepage" },
  { id: "social", label: "Redes Sociais" },
  { id: "contact", label: "Contato" },
  { id: "pages", label: "Páginas" },
  { id: "seo", label: "SEO" },
];

interface Props {
  initialSettings: SiteSettings;
}

export default function SettingsEditor({ initialSettings }: Props) {
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [activeTab, setActiveTab] = useState("brand");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const update = (section: keyof SiteSettings, field: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [section]: { ...(prev[section] as any), [field]: value },
    }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert("Erro ao salvar. Tente novamente.");
    }
    setSaving(false);
  };

  const Field = ({ label, section, field, type = "text", placeholder = "", rows = 0 }: {
    label: string; section: keyof SiteSettings; field: string;
    type?: string; placeholder?: string; rows?: number;
  }) => {
    const value = (settings[section] as any)[field] ?? "";
    if (rows > 0) {
      return (
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-neutral-400 uppercase tracking-widest">{label}</label>
          <textarea
            value={value}
            onChange={(e) => update(section, field, e.target.value)}
            rows={rows}
            placeholder={placeholder}
            className="w-full bg-neutral-900 border border-neutral-700 text-white placeholder:text-neutral-600 px-4 py-3 text-sm focus:outline-none focus:border-white resize-y"
          />
        </div>
      );
    }
    return (
      <Input
        label={label}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => update(section, field, e.target.value)}
      />
    );
  };

  return (
    <div className="flex flex-col gap-0">
      {/* Tabs */}
      <div className="flex gap-0 border-b border-white/10 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-xs font-bold tracking-widest uppercase whitespace-nowrap transition-colors border-b-2 -mb-px ${
              activeTab === tab.id
                ? "text-white border-white"
                : "text-neutral-500 border-transparent hover:text-neutral-300"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-neutral-950 border border-white/10 border-t-0 p-8">

        {/* IDENTIDADE */}
        {activeTab === "brand" && (
          <div className="flex flex-col gap-6">
            <h2 className="text-sm font-bold text-white uppercase tracking-widest">Identidade da Marca</h2>
            <Field label="Nome da Marca" section="brand" field="name" placeholder="DOTHIS" />
            <Field label="Slogan / Tagline" section="brand" field="tagline" placeholder="DROP 2026" />
            <Field label="Descrição (aparece no rodapé)" section="brand" field="description" rows={3} placeholder="Streetwear nacional com identidade própria." />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-neutral-400 uppercase tracking-widest">Logo atual</label>
              <p className="text-xs text-neutral-500">Para trocar o logo, substitua o arquivo <code className="bg-neutral-800 px-1">/public/Logo.png</code> por um novo com o mesmo nome.</p>
            </div>
          </div>
        )}

        {/* ANÚNCIO */}
        {activeTab === "announcement" && (
          <div className="flex flex-col gap-6">
            <h2 className="text-sm font-bold text-white uppercase tracking-widest">Barra de Anúncio</h2>
            <p className="text-xs text-neutral-500">Aparece no topo do site. Use para promoções, lançamentos ou avisos.</p>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="ann_enabled"
                checked={(settings.announcement as any).enabled}
                onChange={(e) => update("announcement", "enabled", e.target.checked)}
                className="w-4 h-4 accent-white"
              />
              <label htmlFor="ann_enabled" className="text-sm text-neutral-300">Mostrar barra de anúncio</label>
            </div>
            <Field label="Texto do anúncio" section="announcement" field="text" placeholder="FRETE GRÁTIS acima de R$299" />
            <Field label="Link do anúncio (opcional)" section="announcement" field="link" placeholder="/shop" />
          </div>
        )}

        {/* HERO */}
        {activeTab === "hero" && (
          <div className="flex flex-col gap-6">
            <h2 className="text-sm font-bold text-white uppercase tracking-widest">Seção Hero (Página Inicial)</h2>
            <Field label="Título principal" section="hero" field="title" placeholder="DOTHIS" />
            <Field label="Subtítulo / Drop" section="hero" field="subtitle" placeholder="DROP 2026" />
            <Field label="Descrição" section="hero" field="description" rows={3} placeholder="Peças limitadas. Estética brutal." />
            <Field label="Texto do botão CTA" section="hero" field="ctaText" placeholder="Shop Now" />
            <Field label="Link do botão CTA" section="hero" field="ctaLink" placeholder="/shop" />
          </div>
        )}

        {/* REDES SOCIAIS */}
        {activeTab === "social" && (
          <div className="flex flex-col gap-6">
            <h2 className="text-sm font-bold text-white uppercase tracking-widest">Redes Sociais</h2>
            <p className="text-xs text-neutral-500">Cole o link completo do perfil. Deixe em branco para ocultar.</p>
            <Field label="Instagram" section="social" field="instagram" placeholder="https://instagram.com/dothis" />
            <Field label="TikTok" section="social" field="tiktok" placeholder="https://tiktok.com/@dothis" />
            <Field label="Twitter / X" section="social" field="twitter" placeholder="https://twitter.com/dothis" />
            <Field label="YouTube" section="social" field="youtube" placeholder="https://youtube.com/@dothis" />
            <Field label="WhatsApp (número com DDI)" section="social" field="whatsapp" placeholder="5511999999999" />
          </div>
        )}

        {/* CONTATO */}
        {activeTab === "contact" && (
          <div className="flex flex-col gap-6">
            <h2 className="text-sm font-bold text-white uppercase tracking-widest">Informações de Contato</h2>
            <Field label="Email de contato" section="contact" field="email" type="email" placeholder="contato@dothis.com.br" />
            <Field label="WhatsApp (número com DDI)" section="contact" field="whatsapp" placeholder="5511999999999" />
            <Field label="Endereço (opcional)" section="contact" field="address" placeholder="Rua Exemplo, 123" />
            <Field label="Cidade / Estado" section="contact" field="city" placeholder="São Paulo, SP" />
            <Field label="Horário de atendimento" section="contact" field="hours" placeholder="Seg–Sex, 9h–18h" />
          </div>
        )}

        {/* PÁGINAS */}
        {activeTab === "pages" && (
          <div className="flex flex-col gap-8">
            <h2 className="text-sm font-bold text-white uppercase tracking-widest">Conteúdo das Páginas</h2>
            <p className="text-xs text-neutral-500">Use **texto** para negrito e quebras de linha para parágrafos.</p>
            <Field label="Sobre a Marca" section="pages" field="sobre" rows={8} placeholder="Conte a história da marca..." />
            <Field label="FAQ (Perguntas Frequentes)" section="pages" field="faq" rows={8} placeholder="Pergunta\nResposta..." />
            <Field label="Trocas e Devoluções" section="pages" field="trocas" rows={6} placeholder="Política de trocas..." />
            <Field label="Política de Envio" section="pages" field="envio" rows={6} placeholder="Prazo e condições de envio..." />
            <Field label="Privacidade" section="pages" field="privacidade" rows={5} placeholder="Como tratamos seus dados..." />
            <Field label="Termos de Uso" section="pages" field="termos" rows={5} placeholder="Termos e condições..." />
          </div>
        )}

        {/* SEO */}
        {activeTab === "seo" && (
          <div className="flex flex-col gap-6">
            <h2 className="text-sm font-bold text-white uppercase tracking-widest">SEO</h2>
            <p className="text-xs text-neutral-500">Aparece nos resultados do Google e no compartilhamento em redes sociais.</p>
            <Field label="Título do site (aparece na aba do browser)" section="seo" field="title" placeholder="DOTHIS Streetwear" />
            <Field label="Descrição (aparece no Google)" section="seo" field="description" rows={3} placeholder="Moda streetwear masculina..." />
            <Field label="Palavras-chave" section="seo" field="keywords" placeholder="streetwear, moda masculina, camisetas..." />
          </div>
        )}
      </div>

      {/* Save button */}
      <div className="flex items-center justify-between pt-6 border-t border-white/10 mt-2">
        <p className="text-xs text-neutral-600">Alterações aplicadas em todos os visitantes após salvar.</p>
        <Button onClick={handleSave} loading={saving} size="lg">
          {saved ? (
            <span className="flex items-center gap-2 text-green-400"><Check size={16} /> Salvo!</span>
          ) : (
            <span className="flex items-center gap-2"><Save size={16} /> Salvar Alterações</span>
          )}
        </Button>
      </div>
    </div>
  );
}
