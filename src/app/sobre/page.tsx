import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sobre a Marca — DOTHIS" };

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-black pt-24 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        <p className="text-xs font-bold tracking-[0.4em] uppercase text-neutral-500 mb-3">
          A Marca
        </p>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-10">
          Sobre a DOTHIS
        </h1>

        <div className="flex flex-col gap-6 text-neutral-400 text-base leading-relaxed">
          <p>
            DOTHIS nasceu da necessidade de ter um streetwear nacional com identidade própria —
            sem copiar tendências, sem seguir fórmulas. Cada peça é desenvolvida com atenção
            aos detalhes e pensada para quem usa moda como forma de expressão.
          </p>
          <p>
            Trabalhamos com fornecedores locais, priorizando qualidade de material e acabamento.
            Nossos drops são limitados por escolha: acreditamos que menos é mais, e que cada
            lançamento deve significar algo.
          </p>
          <p>
            Feito no Brasil. Para quem tem estilo, não segue regra.
          </p>
        </div>
      </div>
    </div>
  );
}
