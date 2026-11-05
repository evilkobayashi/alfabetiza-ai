# Relatório Descritivo de Pedido de Patente de Invenção (INPI)

> **Titular:** Aí Tecnologia e Educação Inova Simples (I.S.) / Aí Tecnologia e Educação Ltda. ("AÍ")
> **Enquadramento:** Empresa Simples de Inovação — Inova Simples (`Natureza Jurídica 234-8`, LC nº 167/2019 e LC nº 182/2021) com direito a **Trâmite Prioritário de Patente (Portaria INPI/PR nº 365/2020 — GRU 279)** e alinhamento estratégico ao **Plano Brasileiro de Inteligência Artificial (PBIA 2024–2028 / MCTI / FINEP)** com inferência prioritária em **Modelos de IA Nacionais (Sabiá-4 / Sabiazinho-4 / SoberanIA / Tucano)**.
> **Normativa:** Lei nº 9.279/96 (LPI), IN INPI/PR nº 30/2013 e Diretrizes de Exame de Invenções Implementadas por Computador (IIC).

---

## TÍTULO DA INVENÇÃO
**MÉTODO E SISTEMA IMPLEMENTADOS POR COMPUTADOR PARA ALFABETIZAÇÃO ASSISTIDA POR INTERFACE EXCLUSIVAMENTE VOCAL DE BAIXA LATÊNCIA COM ADAPTAÇÃO FONÉTICO-COGNITIVA DINÂMICA POR PERFIL ETÁRIO E NEURODIVERGENTE**

---

## CAMPO DA INVENÇÃO
**[001]** A presente invenção pertence ao campo da engenharia de sistemas computacionais aplicados a processamento de sinais de fala em baixa latência, síntese vocal neural e sistemas tutores inteligentes operados sem exigência de letramento prévio (interfaces Voice-First).

---

## FUNDAMENTOS DA TÉCNICA E PROBLEMAS DO ESTADO DA TÉCNICA
**[002]** No estado da técnica, sistemas convencionais apresentam limitações estruturais severas que impedem a automação confiável, determinística, soberana e auditável do fluxo proposto:

**[003]** Paradoxo de acessibilidade em softwares de alfabetização convencionais, que exigem leitura de menus textuais por usuários ainda não alfabetizados;
**[004]** Inadequação semântica e infantilização de alunos adultos da Educação de Jovens e Adultos (EJA) ou sobrecarga sensorial em alunos com deficiência (PCD);
**[005]** Elevada latência ponta a ponta entre captura de voz, transcrição fonética, inferência pedagógica e síntese de áudio, comprometendo a associação grafema-fonema em tempo real.

---

## SUMÁRIO DA INVENÇÃO
**[006]** A presente invenção soluciona os problemas técnicos do estado da técnica por meio de um sistema computacional integrado (100) e respectivo método de execução estruturado nos seguintes estágios cooperantes:
- (110) Capturador Acústico Zero-Text UI no Cliente com Detecção de Atividade Vocal e Compressão de Fluxo de Áudio;
- (120) Pipeline de Transcrição Fonética de Ultrabaixa Latência em Borda (Rede Neural Whisper-Large-V3-Turbo);
- (130) Motor de Raciocínio Fonético-Pedagógico com Máquina de Estados Adaptativa por Perfil (KIDS, EJA Não-Infantilizado e PCD);
- (140) Sincronizador Multimodal de Estímulo Visual-Auditivo (Destaque Simultâneo de Sílabas/Grafemas e Síntese Neural Edge TTS);
- (150) Módulo de Telemetria de Progresso Fonológico e Persistência de Jornada de Letramento em Banco Multi-Tenant.
- (160) Barramento de Anonimização em Trânsito (LGPD Art. 14) e Roteamento Prioritário para Modelos de Inteligência Artificial Soberanos Nacionais (família Sabiá-4 / Sabiazinho-4 / SoberanIA / Tucano) hospedados em jurisdição brasileira (`-br-sp`).

---

## BREVE DESCRIÇÃO DAS FIGURAS
**[007]** **A Figura 1** ilustra o diagrama de blocos da arquitetura do sistema **(100)** e seus módulos operacionais **(110 a 160)**.

---

## DESCRIÇÃO DETALHADA DA INVENÇÃO
**[008]** Com referência à **Figura 1**, o sistema **(100)** compreende um terminal cliente reativo **(105)** em comunicação segura com um servidor de aplicação **(108)**, barramento de inferência soberana nacional **(160)** e banco de dados distribuído em território nacional **(165)**.
**[009]** Durante a operação do método, os subsistemas **(110 a 160)** operam de maneira encadeada sobre estruturas de dados tipadas em memória e persistidas em banco relacional/vetorial, aplicando mascaramento determinístico de dados pessoais antes de qualquer chamada de inferência e priorizando modelos de linguagem treinados nativamente na língua portuguesa e nas matrizes normativas brasileiras (BNCC, ENEM e legislação educacional), garantindo rastreabilidade ponta a ponta, determinismo estrutural nas saídas geradas e eliminação dos gargalos de latência e inconsistência técnica verificados no estado da técnica.
