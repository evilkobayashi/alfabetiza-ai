import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Política de Reembolso e Cancelamento | Alfabetiza AÍ - Aí Tecnologia',
  description: 'Política de Reembolso Integral de 7 Dias (CDC Art. 49), Cancelamento sem Multas e Transparência de Preços do Alfabetiza AÍ.',
};

export default function ReembolsoPage() {
  return (
    <main id="main-content" className="min-h-screen bg-slate-50 text-slate-800 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-12">
        <div className="mb-6">
          <Link href="/" className="text-sm font-semibold text-blue-700 hover:text-blue-900 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded">
            &larr; Voltar para a Página Inicial (Alfabetiza AÍ)
          </Link>
        </div>

        
        <nav aria-label="Navegação de documentos legais" className="flex flex-wrap gap-3 mb-8 pb-4 border-b border-slate-200 text-xs sm:text-sm font-semibold">
          <Link href="/termos" className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">Termos de Serviço</Link>
          <Link href="/privacidade" className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">Política de Privacidade (LGPD)</Link>
          <Link href="/reembolso" className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">Política de Reembolso</Link>
          <Link href="/cookies" className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">Política de Cookies e SDKs</Link>
          <Link href="/unsubscribe" className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors">Cancelar E-mails (Unsubscribe)</Link>
        </nav>
    

        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
          Política de Reembolso, Cancelamento e Transparência Financeira — Alfabetiza AÍ
        </h1>
        <p className="text-sm text-slate-600 mb-8 pb-6 border-b border-slate-200">
          Última atualização: 05 de Novembro de 2026 | Em conformidade com o Código de Defesa do Consumidor (Lei nº 8.078/1990 — Art. 49)
        </p>

        <div className="space-y-6 text-sm leading-relaxed text-slate-700">
          <section className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950">
            <h2 className="text-lg font-extrabold mb-1">Garantia Incondicional de 7 Dias (Direito de Arrependimento — Art. 49 do CDC)</h2>
            <p>
              Você tem o direito legal e incondicional de desistir da assinatura ou compra de qualquer plano do <strong>Alfabetiza AÍ</strong> no prazo de até <strong>7 (sete) dias corridos</strong> a contar da data da confirmação do pagamento, recebendo a <strong>devolução integral (100%) do valor pago</strong>, sem necessidade de justificativa complexa e sem qualquer retenção ou taxa administrativa.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">1. Zero Taxas Escondidas (Preços Finais Transparentes)</h2>
            <p>
              A Aí Tecnologia adota uma política de transparência radical em todos os seus produtos:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Preço Único e Final:</strong> O valor exibido na página de planos e no checkout é o valor exato que você pagará em Reais (R$), já com todos os impostos inclusos.</li>
              <li><strong>Sem Taxas de Processamento:</strong> Não cobramos taxa de emissão de PIX, taxa de boleto, taxa de matrícula ou tarifa de cancelamento.</li>
              <li><strong>Sem Fidelidade Forçada:</strong> Você pode cancelar a renovação da sua assinatura a qualquer momento com apenas 1 clique, sem multa contratual.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">2. Como Solicitar seu Reembolso em 1 Passo Simples</h2>
            <p>
              Não utilizamos padrões obscuros (<em>dark patterns</em>) ou burocracia para dificultar reembolsos. Para solicitar o estorno dentro do prazo de garantia de 7 dias (ou em caso de cobrança indevida):
            </p>
            <ol className="list-decimal pl-5 mt-2 space-y-1.5">
              <li>Envie um e-mail para <a href="mailto:contato@aitecnologia.xyz?subject=Solicitacao%20de%20Reembolso%20CDC" className="text-blue-700 underline font-bold">contato@aitecnologia.xyz</a> informando o e-mail cadastrado na plataforma.</li>
              <li>Nossa equipe processará a devolução integral em até <strong>24 horas úteis</strong>.</li>
              <li>Para pagamentos realizados via <strong>PIX</strong>, o estorno de 100% do valor cai diretamente na mesma conta bancária de origem via PIX de devolução. Para pagamentos via cartão de crédito, o estorno é enviado imediatamente à operadora do cartão.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">3. Cancelamento de Assinaturas Após 7 Dias</h2>
            <p>
              Caso deseje cancelar sua assinatura após o período inicial de 7 dias, nenhuma nova cobrança será realizada nos ciclos seguintes, e seu acesso permanecerá ativo normalmente até o último dia do período já pago.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
