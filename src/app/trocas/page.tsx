import type { Metadata } from "next";

export const metadata: Metadata = { title: "Trocas e Devoluções — DOTHIS" };

export default function TrocasPage() {
  return (
    <div className="min-h-screen bg-black pt-24 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        <p className="text-xs font-bold tracking-[0.4em] uppercase text-neutral-500 mb-3">
          Políticas
        </p>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-10">
          Trocas e Devoluções
        </h1>

        <div className="flex flex-col gap-8 text-neutral-400 text-sm leading-relaxed">
          <section>
            <h2 className="text-xs font-bold tracking-widest uppercase text-white mb-3">Prazo</h2>
            <p>
              Você tem até <strong className="text-white">7 dias corridos</strong> após o recebimento
              do produto para solicitar troca ou devolução, conforme o Código de Defesa do Consumidor.
            </p>
          </section>

          <section>
            <h2 className="text-xs font-bold tracking-widest uppercase text-white mb-3">Condições</h2>
            <ul className="flex flex-col gap-2 list-disc list-inside">
              <li>Produto sem uso, lavagem ou alterações</li>
              <li>Etiquetas originais intactas</li>
              <li>Embalagem original preservada</li>
              <li>Nota fiscal ou comprovante de compra</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xs font-bold tracking-widest uppercase text-white mb-3">Como solicitar</h2>
            <p>
              Entre em contato pelo e-mail{" "}
              <a href="mailto:contato@dothis.com.br" className="text-white hover:underline">
                contato@dothis.com.br
              </a>{" "}
              informando o número do pedido, o motivo e, se possível, fotos do produto.
              Nossa equipe responde em até 2 dias úteis.
            </p>
          </section>

          <section>
            <h2 className="text-xs font-bold tracking-widest uppercase text-white mb-3">Reembolso</h2>
            <p>
              Após aprovação, o reembolso é processado em até 5 dias úteis para o mesmo método
              de pagamento utilizado na compra. Para cartão de crédito, pode levar até 2 faturas.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
