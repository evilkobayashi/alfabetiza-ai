import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Termos de Serviço | Alfabetiza AÍ - Aí Tecnologia',
  description: 'Termos e Condições Gerais de Uso, Licenciamento, Transparência de Preços e Diretrizes Éticas de IA do Alfabetiza AÍ.',
};

export default function TermosPage() {
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
          Termos e Condições Gerais de Uso — Alfabetiza AÍ
        </h1>
        <p className="text-sm text-slate-600 mb-8 pb-6 border-b border-slate-200">
          Última atualização: 05 de Novembro de 2026 | Versão 2.1 (Conformidade LGPD, Marco Legal da IA, CDC e ECA Digital)
        </p>

        <div className="space-y-6 text-sm leading-relaxed text-slate-700">
          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">1. Identificação da Empresa (Detalhes do Negócio)</h2>
            <p>
              Estes Termos e Condições Gerais de Uso regulam o acesso e a utilização da plataforma tecnológica educacional <strong>Alfabetiza AÍ</strong>, desenvolvida, operada e mantida por <strong>Aí Tecnologia e Educação Inova Simples (I.S.) / Aí Tecnologia e Educação Ltda.</strong>, sediada em Queimados, Estado do Rio de Janeiro, Brasil, com programas de computador registrados perante o Instituto Nacional da Propriedade Industrial (INPI), e canal oficial de atendimento e Encarregado de Dados (DPO) através do e-mail <a href="mailto:contato@aitecnologia.xyz" className="text-blue-700 underline font-semibold">contato@aitecnologia.xyz</a>.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">2. Natureza Assistiva da IA e Ausência de Reivindicações Irreais</h2>
            <p>
              O <strong>Alfabetiza AÍ</strong> utiliza modelos avançados de Inteligência Artificial Generativa e síntese neural alinhados às diretrizes da <strong>Base Nacional Comum Curricular (BNCC — MEC)</strong>. Em estrita observância à transparência e à ética educacional:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Ferramenta de Apoio Pedagógico:</strong> A plataforma atua exclusivamente como instrumento de suporte ao estudo e ao trabalho docente, <strong>não substituindo</strong> o professor, o pedagogo, o avaliador humano ou o acompanhamento escolar presencial.</li>
              <li><strong>Sem Garantias Irreais:</strong> A Aí Tecnologia <strong>não promete nem garante aprovação automática</strong> em vestibulares, ENEM ou concursos, nem garante nota máxima oficial em bancas examinadoras externas, visto que o desempenho depende do esforço individual do estudante e dos critérios soberanos de cada banca oficial (como o INEP/MEC).</li>
              <li><strong>Supervisão Humana Obrigatória:</strong> Todo conteúdo, plano de aula, atividade ou feedback gerado por IA pode conter imprecisões (alucinações estatísticas) e deve ser revisado por um educador ou responsável antes da aplicação em sala de aula.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">3. Consentimento de Idade, Proteção de Crianças e Adolescentes (ECA Digital e Art. 14 LGPD)</h2>
            <p>
              O cadastro direto e a contratação de planos são restritos a <strong>maiores de 18 (dezoito) anos</strong> (professores, estudantes maiores de idade, pais ou responsáveis legais). O uso da plataforma por crianças ou adolescentes menores de 18 anos somente é permitido mediante <strong>consentimento específico e em destaque dado por pelo menos um dos pais ou pelo responsável legal</strong>, em conformidade com o Art. 14 da Lei nº 13.709/2018 (LGPD) e a Lei nº 15.211/2025 (ECA Digital).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">4. Transparência de Preços, Zero Taxas Escondidas e Direito de Reembolso</h2>
            <p>
              Todos os valores exibidos na plataforma são expressos em Reais (R$) e representam o <strong>preço final completo, com todos os tributos inclusos</strong>. Não cobramos taxas ocultas de adesão, taxas de processamento de PIX, multas de fidelidade ou cobranças surpresa.
            </p>
            <p className="mt-2">
              Conforme detalhado em nossa <Link href="/reembolso" className="text-blue-700 underline font-semibold">Política de Reembolso</Link>, o usuário possui <strong>Direito de Arrependimento incondicional de 7 (sete) dias corridos</strong> a contar da contratação (Art. 49 do Código de Defesa do Consumidor — Lei nº 8.078/1990), com reembolso integral de 100% do valor pago, além de cancelamento livre a qualquer momento sem padrões obscuros (<em>Zero Dark Patterns</em>).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">5. Propriedade Intelectual e Licenciamento de Ativos Visuais (Stock & Open Source)</h2>
            <p>
              O código-fonte, a arquitetura de software, os algoritmos e as marcas do ecossistema Aí Tecnologia são protegidos pela Lei de Programa de Computador (Lei nº 9.609/1998) e pela Lei de Direitos Autorais (Lei nº 9.610/1998). Os materiais didáticos gerados pelo usuário para uso em sala de aula ou estudo próprio podem ser livremente impressos, compartilhados com alunos e utilizados para fins pedagógicos.
            </p>
            <p className="mt-2">
              <strong>Declaração de Licenciamento de Imagens e Ícones:</strong> Os ícones vetoriais utilizados na interface são licenciados sob a <em>MIT License</em> (Lucide Icons). As ilustrações pedagógicas vetoriais (SVGs) são de autoria própria da Aí Tecnologia, e eventuais fotografias ilustrativas de apoio possuem licença aberta verificada (<em>Unsplash License / Creative Commons Zero</em>), devidamente auditadas para uso comercial e educacional seguro.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-900 mb-2">6. Exclusão de Conta, Descadastramento e Foro</h2>
            <p>
              O usuário pode apagar permanentemente sua conta e todos os seus dados pessoais a qualquer momento diretamente no painel do usuário (botão <em>&ldquo;Excluir Conta / Apagar Meus Dados&rdquo;</em>) ou solicitar o descadastramento de comunicações em <Link href="/unsubscribe" className="text-blue-700 underline font-semibold">/unsubscribe</Link>. Fica eleito o foro da Comarca do domicílio do consumidor ou da Comarca de Queimados - RJ para dirimir quaisquer dúvidas oriundas destes Termos.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
