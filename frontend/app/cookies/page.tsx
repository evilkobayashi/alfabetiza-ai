import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Política de Cookies e Auditoria de SDKs | Alfabetiza AÍ - Aí Tecnologia',
  description: 'Política de Cookies, Armazenamento Local e Relatório de Auditoria de SDKs de Terceiros do Alfabetiza AÍ.',
};

export default function CookiesPage() {
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
          Política de Cookies e Auditoria de SDKs de Terceiros — Alfabetiza AÍ
        </h1>
        <p className="text-sm text-slate-600 mb-8 pb-6 border-b border-slate-200">
          Última atualização: 05 de Novembro de 2026 | Transparência Técnica, LGPD e Proteção de Dados
        </p>

        <div className="space-y-6 text-sm leading-relaxed text-slate-700">
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">1. Como Utilizamos Cookies e Armazenamento Local</h2>
            <p>
              O <strong>Alfabetiza AÍ</strong> prioriza a privacidade desde a concepção (<em>Privacy by Design</em>). Dividimos os cookies em apenas duas categorias claras, sem rastreadores publicitários ocultos:
            </p>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-1">A) Cookies Estritamente Essenciais (Sempre Ativos)</h3>
                <p className="text-xs text-slate-700">
                  Indispensáveis para manter sua sessão autenticada com segurança (JWT/Session Token), proteger contra ataques CSRF e salvar sua escolha no Banner de Consentimento (<code>ai_tec_cookie_consent_v2</code>). Sem eles, o login seguro não funciona.
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-1">B) Cookies Analíticos de Desempenho (Opt-In Opcional)</h3>
                <p className="text-xs text-slate-700">
                  Desativados por padrão se você clicar em <em>&ldquo;Apenas Essenciais&rdquo;</em>. Quando aceitos, medem apenas métricas agregadas de estabilidade técnica e velocidade de carregamento de página, sem identificar crianças ou vender perfis a anunciantes.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">2. Relatório de Auditoria de SDKs de Terceiros (Third-Party SDK Audit)</h2>
            <p>
              Todos os pacotes e SDKs integrados ao ecossistema Aí Tecnologia passam por auditoria de segurança e conformidade LGPD. Abaixo listamos de forma transparente os únicos serviços externos utilizados:
            </p>
            <div className="mt-3 overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-100 text-slate-900 border-b border-slate-200">
                    <th className="p-3 font-bold">SDK / Provedor</th>
                    <th className="p-3 font-bold">Finalidade Estrita</th>
                    <th className="p-3 font-bold">Região / Conformidade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">Maritaca AI (Sabiá-3 / Sabiazinho-3)</td>
                    <td className="p-3">LLM soberana brasileira especializada na BNCC, ENEM e Língua Portuguesa (com dados anonimizados).</td>
                    <td className="p-3 text-emerald-800 font-semibold">Servidores Brasileiros • Soberania Nacional • LGPD</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">Supabase / PostgreSQL</td>
                    <td className="p-3">Banco de dados criptografado e autenticação segura.</td>
                    <td className="p-3 text-emerald-800 font-semibold">São Paulo, Brasil (sa-east-1) • LGPD</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">Clerk Auth (quando aplicável)</td>
                    <td className="p-3">Gerenciamento seguro de sessão e proteção de identidade.</td>
                    <td className="p-3 text-emerald-800 font-semibold">SOC 2 Type II • ISO 27001 • LGPD</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">Asaas Gestão Financeira</td>
                    <td className="p-3">Processamento de pagamentos PIX e emissão de cobranças.</td>
                    <td className="p-3 text-emerald-800 font-semibold">Instituição de Pagamento (Banco Central do Brasil)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-slate-900">Lucide Icons (Open Source)</td>
                    <td className="p-3">Ícones vetoriais renderizados localmente sem requisições externas.</td>
                    <td className="p-3 text-emerald-800 font-semibold">Licença MIT (Zero Coleta de Dados)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-slate-600">
              <strong>Declaração Negativa de Rastreadores:</strong> Confirmamos via auditoria de código que este sistema <strong>não incorpora</strong> SDKs de corretoras de dados (<em>data brokers</em>), pixels de remarketing infantil ou scripts de mineração de dados.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
