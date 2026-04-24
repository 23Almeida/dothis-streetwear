import type { Metadata } from "next";

export const metadata: Metadata = { title: "Contato — DOTHIS" };

export default function ContatoPage() {
  return (
    <div className="min-h-screen bg-black pt-24 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        <p className="text-xs font-bold tracking-[0.4em] uppercase text-neutral-500 mb-3">
          Fale Conosco
        </p>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-10">
          Contato
        </h1>

        <div className="flex flex-col gap-8">
          <div className="border border-white/10 p-6">
            <h2 className="text-xs font-bold tracking-widest uppercase text-neutral-400 mb-3">
              E-mail
            </h2>
            <a
              href="mailto:contato@dothis.com.br"
              className="text-white hover:text-neutral-300 transition-colors text-base"
            >
              contato@dothis.com.br
            </a>
            <p className="text-neutral-600 text-sm mt-2">
              Respondemos em até 2 dias úteis.
            </p>
          </div>

          <div className="border border-white/10 p-6">
            <h2 className="text-xs font-bold tracking-widest uppercase text-neutral-400 mb-3">
              Redes Sociais
            </h2>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Para dúvidas rápidas, nos chame no Instagram.
              Respondemos mais rápido por lá.
            </p>
            <a
              href="#"
              className="inline-block mt-3 text-white text-sm font-bold tracking-widest uppercase hover:text-neutral-300 transition-colors"
            >
              @dothis.oficial →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
