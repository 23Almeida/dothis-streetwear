"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <section className="py-24 px-4 sm:px-6 bg-neutral-950 border-t border-white/5">
      <div className="max-w-2xl mx-auto text-center">
        <p className="text-xs font-bold tracking-[0.4em] uppercase text-neutral-500 mb-4">
          Newsletter
        </p>
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-4">
          Seja o Primeiro a Saber
        </h2>
        <p className="text-neutral-400 text-sm mb-10 leading-relaxed">
          Cadastre-se para receber drops exclusivos, promoções e novidades
          antes de todo mundo.
        </p>

        {submitted ? (
          <div className="py-6 px-8 border border-white/10 inline-block">
            <p className="text-white font-medium">Você está na lista! 🔥</p>
            <p className="text-neutral-500 text-sm mt-1">
              Em breve você receberá nossas novidades.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1"
            />
            <Button type="submit" variant="primary">
              Cadastrar
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
