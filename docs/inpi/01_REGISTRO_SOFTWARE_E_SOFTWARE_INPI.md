# Dossiê de Registro de Programa de Computador (e-Software / INPI)

**Titular / Empresa:** Aí Tecnologia e Educação Inova Simples (I.S.) / Aí Tecnologia e Educação Ltda. ("AÍ")  
**Enquadramento Jurídico e Fomento:**
- **Inova Simples (LC nº 167/2019 e Art. 65-A da LC nº 123/2006):** Natureza Jurídica `234-8` (*Empresa Simples de Inovação — Inova Simples*), elegível a **Exame Prioritário de Marcas e Patentes no INPI** (Portaria INPI/PR nº 365/2020) e redução de até 60% em emolumentos federais (GRUs).
- **Marco Legal das Startups (LC nº 182/2021):** Habilitado para contratação pública via **CPSI** (Contrato Público para Solução Inovadora).
- **PBIA (Plano Brasileiro de Inteligência Artificial 2024–2028 — MCTI / FINEP / BNDES):** Enquadrado no **Eixo 3 (IA para Melhoria dos Serviços Públicos — Educação)** e **Eixo 4 (Inovação Empresarial em IA Soberana)**, operando com orquestração prioritária em **Modelos de Linguagem Brasileiros (Sabiá-4 / Sabiazinho-4 — Maritaca AI `-br-sp`, SoberanIA e Tucano)** e residência de dados 100% em território nacional.
- **Base Legal de Propriedade Intelectual:** Lei nº 9.609/1998 (Lei de Software), Lei nº 9.610/1998 (Direito Autoral) e Instrução Normativa INPI/PR nº 099/2019.

---

## 1. Dados de Preenchimento no Sistema e-Software (GRU Código 730)

| Campo no Formulário INPI | Valor Recomendado para Preenchimento |
| :--- | :--- |
| **Título do Programa** | ALFABETIZA AÍ — Plataforma de Alfabetização Assistida por Inteligência Artificial com Interface 100% Conversacional (Voice-First) e Adaptação EJA/KIDS/PCD |
| **Data de Criação / Publicação** | 2026 |
| **Natureza Jurídica do Titular** | `234-8` (Empresa Simples de Inovação — Inova Simples) ou `206-2` (Sociedade Empresária Limitada — ME/EPP) |
| **Algoritmo de Hash (Resumo Digital)** | `SHA-512` (Padrão oficial recomendado pelo INPI) |
| **Resumo Digital Hash (SHA-512)** | Consulte `dist/HASH_RESUMO_DIGITAL_INPI.txt` |
| **Linguagens de Programação** | `PYTHON, TYPESCRIPT, JAVASCRIPT, SQL, HTML, CSS` |
| **Campo de Aplicação (Tabela INPI)** | `ED-01 (Educação / Alfabetização Assistida por Computador), ED-03 (Educação Especial e Inclusiva / EJA), IA-02 (Processamento de Voz e Linguagem Natural)` |
| **Tipo de Programa (Tabela INPI)** | `IA-01 (Inteligência Artificial), AP-01 (Aplicativo de Uso Específico), SM-01 (Sistemas Multimídia / Áudio)` |
| **Derivação / Obra Original** | Obra Original (Titularidade: Aí Tecnologia e Educação Inova Simples / Ltda.) |

---

## 2. Memorial Descritivo Técnico, Soberania de Dados (PBIA) e Arquitetura

### 2.1. Escopo e Finalidade Técnica
O sistema **ALFABETIZA AÍ** resolve problemas técnicos no domínio de processamento de sinais de fala em baixa latência, síntese vocal neural e sistemas tutores inteligentes operados sem exigência de letramento prévio (interfaces Voice-First), operando sob arquitetura de **Soberania Tecnológica Nacional** em conformidade com o **Plano Brasileiro de Inteligência Artificial (PBIA 2024–2028)** e a **LGPD (Lei nº 13.709/2018, Art. 14 — proteção de dados de crianças e adolescentes)**.

### 2.2. Subsistemas e Módulos Computacionais
- **(110) Capturador Acústico Zero-Text UI no Cliente com Detecção de Atividade Vocal e Compressão de Fluxo de Áudio;**
- **(120) Pipeline de Transcrição Fonética de Ultrabaixa Latência em Borda (Rede Neural Whisper-Large-V3-Turbo);**
- **(130) Motor de Raciocínio Fonético-Pedagógico com Máquina de Estados Adaptativa por Perfil (KIDS, EJA Não-Infantilizado e PCD);**
- **(140) Sincronizador Multimodal de Estímulo Visual-Auditivo (Destaque Simultâneo de Sílabas/Grafemas e Síntese Neural Edge TTS);**
- **(150) Módulo de Telemetria de Progresso Fonológico e Persistência de Jornada de Letramento em Banco Multi-Tenant.**
- **(160) Camada de Orquestração Soberana PBIA e Anonimização LGPD:** Roteamento prioritário para modelos nacionais (**Sabiá-4 / Sabiazinho-4** em infraestrutura `-br-sp`, **SoberanIA** e **Tucano**) com anonimização em trânsito de dados pessoais e processamento documental local.

---

## 3. Instruções de Protocolo no INPI, Inova Simples (Fast-Track) e Guarda Legal
1. **Abertura / Vinculação Inova Simples (`Natureza Jurídica 234-8`):** No portal Redesim (`gov.br/redesim`), utilize o CNPJ Inova Simples para usufruir do **desconto de até 60% nas taxas federais (GRUs)** e comunicação automática de prioridade ao INPI.
2. **Registro de Software (GRU 730):** Emita e pague a **GRU código 730** no portal do INPI (`https://www.gov.br/inpi/pt-br/servicos/programas-de-computador`), copie o **Hash SHA-512** de `dist/HASH_RESUMO_DIGITAL_INPI.txt` e cole no campo **"Resumo Digital Hash"** do formulário eletrônico e-Software.
3. **Pedido de Patente com Exame Prioritário Startup / Inova Simples (GRU 200 + GRU 279):** Ao protocolar o relatório descritivo `dist/PEDIDO_PATENTE_INPI_ALFABETIZA_AI.docx`, solicite o **Trâmite Prioritário para Startups / Inova Simples (Portaria INPI/PR nº 365/2020)**.
4. **Guarda Legal Pericial:** Conserve de forma imutável o arquivo `dist/alfabetiza_ai_codigo_fonte_inpi.zip` — ele constitui a prova pericial de integridade vinculada ao certificado do INPI e aos editais da **FINEP / BNDES / CPSI**.
