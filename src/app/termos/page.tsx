import type { Metadata } from "next";

export const metadata: Metadata = { title: "Termos de Uso — DOTHIS" };

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-black pt-24 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        <p className="text-xs font-bold tracking-[0.4em] uppercase text-neutral-500 mb-3">
          Legal
        </p>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-4">
          Termos de Uso
        </h1>
        <p className="text-neutral-600 text-xs mb-10">Última atualização: Janeiro de 2026</p>

        <div className="flex flex-col gap-8 text-neutral-400 text-sm leading-relaxed">
          <section>
            <h2 className="text-xs font-bold tracking-widest uppercase text-white mb-3">Uso do Site</h2>
            <p>
              Ao acessar e utilizar este site, você concorda com estes Termos de Uso. O conteúdo
              desta loja (textos, imagens, logotipos) é propriedade da DOTHIS e protegido por
              direitos autorais. É proibida a reprodução sem autorização.
            </p>
          </section>

          <section>
            <h2 className="text-xs font-bold tracking-widest uppercase text-white mb-3">Conta de Usuário</h2>
            <p>
              Você é responsável por manter a confidencialidade da sua senha e por todas as
              atividades realizadas em sua conta. Notifique-nos imediatamente em caso de uso
              não autorizado.
            </p>
          </section>

          <section>
            <h2 className="text-xs font-bold tracking-widest uppercase text-white mb-3">Pedidos e Pagamentos</h2>
            <p>
              Ao realizar um pedido, você declara que as informações fornecidas são verdadeiras.
              Reservamo-nos o direito de cancelar pedidos em caso de fraude, erro de preço ou
              indisponibilidade de estoque.
            </p>
          </section>

          <section>
            <h2 className="text-xs font-bold tracking-widest uppercase text-white mb-3">Limitação de Responsabilidade</h2>
            <p>
              A DOTHIS não se responsabiliza por danos decorrentes de atrasos causados por
              transportadoras, eventos de força maior ou informações incorretas fornecidas pelo
              comprador.
            </p>
          </section>

          <section>
            <h2 className="text-xs font-bold tracking-widest uppercase text-white mb-3">Contato</h2>
            <p>
              Dúvidas sobre estes termos? Entre em contato:{" "}
              <a href="mailto:contato@dothis.com.br" className="text-white hover:underline">
                contato@dothis.com.br
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
