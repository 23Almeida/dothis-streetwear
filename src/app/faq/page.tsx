import type { Metadata } from "next";

export const metadata: Metadata = { title: "FAQ — DOTHIS" };

const faqs = [
  {
    q: "Quais são os prazos de entrega?",
    a: "Enviamos em até 2 dias úteis após a confirmação do pagamento. O prazo de entrega varia de 5 a 12 dias úteis dependendo da região.",
  },
  {
    q: "Como funciona a tabela de tamanhos?",
    a: "Cada produto tem uma tabela de medidas na página de detalhes. Em caso de dúvida, nossa recomendação é subir um tamanho para um fit mais oversized.",
  },
  {
    q: "Posso trocar ou devolver?",
    a: "Sim. Aceitamos trocas e devoluções em até 7 dias corridos após o recebimento. O produto deve estar sem uso, com etiqueta e na embalagem original.",
  },
  {
    q: "Quais formas de pagamento vocês aceitam?",
    a: "Aceitamos cartão de crédito, débito, Pix e boleto bancário via Mercado Pago.",
  },
  {
    q: "Vocês enviam para todo o Brasil?",
    a: "Sim, enviamos para todo o território nacional via Correios ou transportadora parceira.",
  },
  {
    q: "Como rastrear meu pedido?",
    a: "Após o envio, você recebe um e-mail com o código de rastreamento. Você também pode acompanhar na sua conta em 'Meus Pedidos'.",
  },
];

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-black pt-24 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        <p className="text-xs font-bold tracking-[0.4em] uppercase text-neutral-500 mb-3">
          Perguntas Frequentes
        </p>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-10">
          FAQ
        </h1>

        <div className="flex flex-col gap-0 border-t border-white/10">
          {faqs.map((item, i) => (
            <div key={i} className="border-b border-white/10 py-6">
              <h2 className="text-sm font-bold text-white mb-2">{item.q}</h2>
              <p className="text-neutral-400 text-sm leading-relaxed">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
