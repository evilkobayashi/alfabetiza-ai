-- Schema Alfabetiza AÍ
CREATE SCHEMA IF NOT EXISTS alfabetiza_ai;

-- Tabela de Perfis
CREATE TABLE IF NOT EXISTS alfabetiza_ai.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    perfil VARCHAR(50) NOT NULL CHECK (perfil IN ('KIDS', 'EJA', 'PCD')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE alfabetiza_ai.profiles ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para perfis
CREATE POLICY "Usuários podem ver o próprio perfil"
    ON alfabetiza_ai.profiles
    FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar o próprio perfil"
    ON alfabetiza_ai.profiles
    FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Usuários podem inserir o próprio perfil"
    ON alfabetiza_ai.profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Tabela de Progresso/Métricas
CREATE TABLE IF NOT EXISTS alfabetiza_ai.progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES alfabetiza_ai.profiles(id) NOT NULL,
    letras_aprendidas TEXT[] DEFAULT '{}',
    silabas_aprendidas TEXT[] DEFAULT '{}',
    palavras_lidas INTEGER DEFAULT 0,
    minutos_estudo INTEGER DEFAULT 0,
    ultima_sessao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- RLS Progresso
ALTER TABLE alfabetiza_ai.progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver próprio progresso"
    ON alfabetiza_ai.progress
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar próprio progresso"
    ON alfabetiza_ai.progress
    FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem inserir próprio progresso"
    ON alfabetiza_ai.progress
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);
