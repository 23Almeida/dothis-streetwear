import type { Metadata } from "next";

export const metadata: Metadata = { title: "Política de Privacidade — DOTHIS" };

export default function PrivacidadePage() {
  return (
    <div className="min-h-screen bg-black pt-24 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        <p className="text-xs font-bold tracking-[0.4em] uppercase text-neutral-500 mb-3">
          Legal
        </p>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-4">
          Política de Privacidade
        </h1>
        <p className="text-neutral-600 text-xs mb-10">Última atualização: Janeiro de 2026</p>

        <div className="flex flex-col gap-8 text-neutral-400 text-sm leading-relaxed">
          <section>
            <h2 className="text-xs font-bold tracking-widest uppercase text-white mb-3">Dados Coletados</h2>
            <p>
              Coletamos apenas os dados necessários para processar seus pedidos: nome, e-mail,
              endereço de entrega e informações de pagamento (processadas com segurança pelo Mercado Pago).
              Não armazenamos dados de cartão de crédito.
            </p>
          </section>

          <section>
            <h2 className="text-xs font-bold tracking-widest uppercase text-white mb-3">Uso dos Dados</h2>
            <p>
              Seus dados são utilizados exclusivamente para: processar e entregar pedidos, enviar
              atualizações de status, e melhorar sua experiência na loja. Não vendemos nem
              compartilhamos seus dados com terceiros para fins comerciais.
            </p>
          </section>

          <section>
            <h2 className="text-xs font-bold tracking-widest uppercase text-white mb-3">Segurança</h2>
            <p>
              Utilizamos o Supabase como infraestrutura de banco de dados, com criptografia em
              trânsito (HTTPS/TLS) e em repouso. O acesso aos dados é restrito e monitorado.
            </p>
          </section>

          <section>
            <h2 className="text-xs font-bold tracking-widest uppercase text-white mb-3">Seus Direitos (LGPD)</h2>
            <p>
              Você tem direito a acessar, corrigir ou excluir seus dados a qualquer momento.
              Para exercer esses direitos, entre em contato pelo e-mail{" "}
              <a href="mailto:privacidade@dothis.com.br" className="text-white hover:underline">
                privacidade@dothis.com.br
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
