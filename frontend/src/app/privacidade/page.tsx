import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Política de Privacidade e LGPD | Alfabetiza AÍ - Aí Tecnologia',
  description: 'Política de Privacidade, Minimização de Dados, Proteção Infantil e Direitos do Titular (LGPD) do Alfabetiza AÍ.',
};

export default function PrivacidadePage() {
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
          Política de Privacidade e Proteção de Dados (LGPD) — Alfabetiza AÍ
        </h1>
        <p className="text-sm text-slate-600 mb-8 pb-6 border-b border-slate-200">
          Última atualização: 05 de Novembro de 2026 | Em conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018) e ECA Digital (Lei nº 15.211/2025)
        </p>

        <div className="space-y-6 text-sm leading-relaxed text-slate-700">
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">1. Controlador de Dados e Encarregado (DPO)</h2>
            <p>
              A <strong>Aí Tecnologia e Educação Inova Simples (I.S.) / Aí Tecnologia e Educação Ltda.</strong> (Sede: Queimados - RJ, Brasil) atua como Controladora dos dados pessoais tratados no <strong>Alfabetiza AÍ</strong>. Nosso Encarregado pelo Tratamento de Dados Pessoais (DPO) atende diretamente pelo canal <a href="mailto:contato@aitecnologia.xyz" className="text-blue-700 underline font-semibold">contato@aitecnologia.xyz</a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">2. Princípio da Minimização de Dados (Coleta Apenas do Estritamente Necessário)</h2>
            <p>
              Em cumprimento ao Art. 6º, inciso III da LGPD (Princípio da Necessidade), coletamos <strong>exclusivamente os dados mínimos indispensables</strong> para a prestação do serviço educacional:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Dados de Identificação Básica:</strong> Nome ou apelido pedagógico e endereço de e-mail (para autenticação segura e recuperação de acesso).</li>
              <li><strong>Dados Pedagógicos de Uso:</strong> Planos de aula, exercícios, redações ou progresso fonético estritamente necessários para salvar seu histórico de estudo.</li>
              <li><strong>O que NÃO coletamos:</strong> Não exigimos endereço residencial, telefone pessoal obrigatório, geolocalização em segundo plano, contatos da agenda ou dados biométricos. Dados de pagamento (PIX/Cartão) são processados diretamente pelo gateway homologado pelo Banco Central (Asaas), sem armazenamento de dados sensíveis de cartão em nossos servidores.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">3. Soberania de Dados no Brasil e Proteção contra Treinamento de IA Externa</h2>
            <p>
              Nosso banco de dados relacional (PostgreSQL/Supabase) está hospedado fisicamente em datacenter localizado em <strong>São Paulo, Brasil (Região AWS sa-east-1)</strong>, garantindo soberania nacional dos dados e baixa latência. Os textos, redações, vozes e atividades enviados pelos usuários são <strong>anonimizados antes do processamento pela IA</strong> e <strong>jamais são vendidos ou cedidos para treinar modelos públicos de terceiros</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">4. Proteção Prioritária de Crianças e Adolescentes (Art. 14 LGPD e ECA Digital)</h2>
            <p>
              O tratamento de dados no ecossistema Aí Tecnologia observa o melhor interesse da criança e do adolescente:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Exigimos verificação ativa de maioridade (18+) ou consentimento parental expresso (Opt-In desmarcado por padrão) antes da criação de qualquer conta.</li>
              <li><strong>Zero Publicidade Comportamental:</strong> Não exibimos anúncios de terceiros, não realizamos perfilamento comportamental infantil (<em>profiling</em>) e não utilizamos técnicas de retenção viciante ou <em>dark patterns</em>.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">5. Direito de Apagar os Dados do Usuário (Direito ao Esquecimento — Art. 18, VI LGPD)</h2>
            <p>
              Você possui controle total sobre seus dados pessoais e pode exercer a qualquer momento seus direitos previstos no Art. 18 da LGPD (acesso, correção, portabilidade, revogação de consentimento e eliminação).
            </p>
            <div className="mt-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-950">
              <p className="font-bold mb-1">Como apagar sua conta e todos os seus dados imediatamente:</p>
              <ol className="list-decimal pl-5 space-y-1 text-xs sm:text-sm">
                <li><strong>Pelo Painel do Sistema (1 Clique):</strong> Acesse seu Perfil ou Menu Superior na plataforma e clique no botão <strong>&ldquo;Excluir Conta / Apagar Meus Dados (LGPD)&rdquo;</strong>. Todos os seus registros, históricos e dados pessoais serão permanentemente removidos do banco de dados imediatamente.</li>
                <li><strong>Por Solicitação Direta ao DPO:</strong> Caso não queira fazer login, envie um e-mail para <a href="mailto:contato@aitecnologia.xyz?subject=Exclusao%20Total%20de%20Dados%20LGPD" className="underline font-bold">contato@aitecnologia.xyz</a> com o assunto <em>&ldquo;Exclusão Total de Dados LGPD&rdquo;</em> e concluiremos a exclusão definitiva em até 48 horas úteis.</li>
              </ol>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">6. Auditoria de SDKs de Terceiros e Cookies</h2>
            <p>
              Mantemos uma lista pública e auditada de todos os SDKs e subprocessadores utilizados na plataforma em nossa <Link href="/cookies" className="text-blue-700 underline font-semibold">Política de Cookies e Auditoria de SDKs</Link>, bem como opção de descadastramento imediato de e-mails em <Link href="/unsubscribe" className="text-blue-700 underline font-semibold">/unsubscribe</Link>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
