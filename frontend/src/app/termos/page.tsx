import React from 'react';

export default function TermosPrivacidadePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-100 prose prose-blue">
        <h1>Termos de Uso e Política de Privacidade</h1>
        <p><em>Última atualização: Outubro de 2026</em></p>
        <p>Estes Termos de Uso e Política de Privacidade regem o acesso e uso das plataformas educacionais. Ao marcar a caixa de concordância no momento do cadastro, você expressa seu consentimento livre, expresso e informado com estas regras.</p>
        
        <h2>PARTE I: TERMOS DE USO</h2>
        
        <h3>1. Natureza do Serviço</h3>
        <p>A Plataforma é uma ferramenta de <strong>assistência pedagógica baseada em Inteligência Artificial</strong>. Ela <strong>não substitui</strong> o julgamento humano, a avaliação profissional do educador ou a responsabilidade legal da instituição de ensino. Toda sugestão (notas, planos de aula, diagnósticos) fornecida pela IA é considerada um <strong>rascunho</strong> e requer validação expressa do educador responsável.</p>
        
        <h3>2. Responsabilidade sobre Direitos Autorais (Lei 9.610/98)</h3>
        <p>Ao realizar upload de materiais (PDFs, livros, textos, imagens), o Usuário declara ter os direitos autorais necessários ou a devida licença de uso para fins educacionais. A Plataforma não se responsabiliza por infrações de direitos autorais cometidas pelos usuários e não utiliza obras protegidas de terceiros para o treinamento de modelos fundacionais próprios.</p>
        
        <h3>3. Idade Mínima e Capacidade Legal</h3>
        <p>Em conformidade com o Estatuto da Criança e do Adolescente (Lei 8.069/90 e Lei 15.211/2025 - ECA Digital), o uso direto da Plataforma por menores de 18 anos exige a supervisão e o consentimento expresso de pais ou responsáveis legais, declarado obrigatoriamente no ato do cadastro.</p>
        
        <h2>PARTE II: POLÍTICA DE PRIVACIDADE (LGPD)</h2>
        <p>Em conformidade com a Lei Geral de Proteção de Dados (Lei 13.709/2018).</p>
        
        <h3>1. Papéis e Responsabilidades</h3>
        <ul>
          <li><strong>Controlador de Dados:</strong> A Instituição de Ensino ou o Educador (cliente contratante), que decide quais dados serão inseridos na Plataforma.</li>
          <li><strong>Operador de Dados:</strong> A Plataforma, que processa os dados estritamente sob as diretrizes do Controlador e destes Termos.</li>
        </ul>
        
        <h3>2. Coleta e Minimização de Dados</h3>
        <p>Coletamos apenas os dados estritamente necessários para o funcionamento pedagógico:</p>
        <ul>
          <li><strong>Educadores:</strong> Nome, e-mail, instituição.</li>
          <li><strong>Alunos:</strong> Recomendamos o uso exclusivo de identificadores anônimos (ex: "Aluno A", "ID 123"). Caso nomes sejam fornecidos, a Plataforma aplica anonimização sistêmica automática (substituição de PIIs) antes do processamento por Inteligência Artificial.</li>
        </ul>
        
        <h3>3. Dados Sensíveis e de Menores (ECA/LGPD)</h3>
        <p>A Plataforma não coleta biometria persistente. Arquivos de voz são processados de forma volátil (<em>on-the-fly</em>) para transcrição e imediatamente deletados dos nossos servidores, não havendo armazenamento permanente.</p>
        
        <h3>4. Compartilhamento com Terceiros e Transferência Internacional</h3>
        <p>Para fornecer as funcionalidades de IA, utilizamos APIs de terceiros (ex: OpenAI, Groq). O compartilhamento ocorre sob protocolos de anonimização prévia. Possuímos acordos de <em>Zero Data Retention</em> com estes parceiros, garantindo que os dados acadêmicos dos usuários <strong>não sejam utilizados para o treinamento de novos modelos de IA</strong>.</p>
        
        <h3>5. Retenção e Exclusão de Dados</h3>
        <p>Por segurança e para evitar a manutenção indefinida de histórico de menores, a Plataforma possui uma política de retenção limitada. Dados de desempenho acadêmico (notas, missões, planos de aula) são automaticamente apagados após 6 (seis) meses de inatividade ou ao término do ano letivo, podendo ser excluídos a qualquer momento pelo usuário através de sua conta.</p>
        
        <h3>6. Segurança da Informação</h3>
        <p>Utilizamos criptografia padrão de mercado (AES-256) para armazenamento em banco de dados e isolamento de informações (<em>Row Level Security</em>), assegurando que usuários só tenham acesso aos dados de suas respectivas contas ou instituições.</p>
        
        <h3>7. Direitos do Titular (Art. 18, LGPD)</h3>
        <p>Você tem direito à confirmação, acesso, correção, anonimização ou exclusão dos seus dados. Qualquer solicitação referente aos dados dos alunos deve ser intermediada pelo Educador/Instituição de Ensino (Controlador).</p>
      </div>
    </div>
  );
}
