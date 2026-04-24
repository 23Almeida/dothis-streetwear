import type { Metadata } from "next";

export const metadata: Metadata = { title: "Política de Envio — DOTHIS" };

export default function EnvioPage() {
  return (
    <div className="min-h-screen bg-black pt-24 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        <p className="text-xs font-bold tracking-[0.4em] uppercase text-neutral-500 mb-3">
          Entrega
        </p>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-10">
          Política de Envio
        </h1>

        <div className="flex flex-col gap-8 text-neutral-400 text-sm leading-relaxed">
          <section>
            <h2 className="text-xs font-bold tracking-widest uppercase text-white mb-3">Processamento</h2>
            <p>
              Os pedidos são processados em até <strong className="text-white">2 dias úteis</strong>{" "}
              após a confirmação do pagamento. Pedidos feitos em fins de semana ou feriados são
              processados no próximo dia útil.
            </p>
          </section>

          <section>
            <h2 className="text-xs font-bold tracking-widest uppercase text-white mb-3">Prazos de Entrega</h2>
            <div className="border border-white/10">
              {[
                { region: "Sudeste", prazo: "5–8 dias úteis" },
                { region: "Sul", prazo: "6–9 dias úteis" },
                { region: "Centro-Oeste", prazo: "7–10 dias úteis" },
                { region: "Nordeste", prazo: "8–12 dias úteis" },
                { region: "Norte", prazo: "10–15 dias úteis" },
              ].map((r) => (
                <div key={r.region} className="flex justify-between items-center px-4 py-3 border-b border-white/5 last:border-0">
                  <span className="text-white text-sm">{r.region}</span>
                  <span className="text-neutral-400 text-sm">{r.prazo}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xs font-bold tracking-widest uppercase text-white mb-3">Frete Grátis</h2>
            <p>
              Frete grátis para compras acima de <strong className="text-white">R$ 299,00</strong>{" "}
              para todo o Brasil.
            </p>
          </section>

          <section>
            <h2 className="text-xs font-bold tracking-widest uppercase text-white mb-3">Rastreamento</h2>
            <p>
              Após o envio, você receberá um e-mail com o código de rastreamento. Você também pode
              acompanhar diretamente na sua conta em{" "}
              <a href="/account/orders" className="text-white hover:underline">Meus Pedidos</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
