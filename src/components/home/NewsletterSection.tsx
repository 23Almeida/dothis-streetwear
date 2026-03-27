"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import EditableSection from "@/components/editor/EditableSection";
import { useSite } from "@/context/SiteContext";

export default function NewsletterSection() {
  const { settings } = useSite();
  const nl = settings.newsletter;
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      setError("Erro ao cadastrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <EditableSection
      section="newsletter"
      label="Newsletter"
      fields={[
        { key: "subtitle", label: "Rótulo acima do título", placeholder: "Newsletter" },
        { key: "title", label: "Título", placeholder: "Seja o Primeiro a Saber" },
        { key: "description", label: "Descrição", placeholder: "Cadastre-se para receber drops exclusivos...", rows: 3 },
        { key: "buttonText", label: "Texto do botão", placeholder: "Cadastrar" },
      ]}
    >
      <section className="py-24 px-4 sm:px-6 bg-neutral-950 border-t border-white/5">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs font-bold tracking-[0.4em] uppercase text-neutral-500 mb-4">
            {nl.subtitle}
          </p>
          <h2 className="font-display text-5xl sm:text-6xl tracking-wide text-white mb-4 leading-none">
            {nl.title}
          </h2>
          <p className="text-neutral-400 text-sm mb-10 leading-relaxed">
            {nl.description}
          </p>

          {submitted ? (
            <div className="py-6 px-8 border border-white/10 inline-block">
              <p className="text-white font-medium">Você está na lista! 🔥</p>
              <p className="text-neutral-500 text-sm mt-1">
                Em breve você receberá nossas novidades.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md mx-auto">
              <div className="flex gap-3">
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1"
                />
                <Button type="submit" variant="primary" loading={loading}>
                  {nl.buttonText}
                </Button>
              </div>
              {error && <p className="text-red-500 text-xs text-center">{error}</p>}
            </form>
          )}
        </div>
      </section>
    </EditableSection>
  );
}
