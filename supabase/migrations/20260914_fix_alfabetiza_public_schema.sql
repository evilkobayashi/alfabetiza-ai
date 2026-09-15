-- ==============================================================================
-- Migration: Suporte Oficial ao Alfabetiza AÍ no Schema Public
-- Evita erro PGRST106 de schemas customizados não expostos no PostgREST
-- ==============================================================================

-- 1. Garante que a tabela de perfis existe no schema public
CREATE TABLE IF NOT EXISTS public.alfabetiza_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    perfil VARCHAR(50) NOT NULL CHECK (perfil IN ('KIDS', 'EJA', 'PCD')),
    full_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Habilita RLS
ALTER TABLE public.alfabetiza_profiles ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para alfabetiza_profiles
DROP POLICY IF EXISTS "Usuários podem ver o próprio perfil alfabetiza" ON public.alfabetiza_profiles;
CREATE POLICY "Usuários podem ver o próprio perfil alfabetiza"
    ON public.alfabetiza_profiles FOR SELECT
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Usuários podem inserir o próprio perfil alfabetiza" ON public.alfabetiza_profiles;
CREATE POLICY "Usuários podem inserir o próprio perfil alfabetiza"
    ON public.alfabetiza_profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Usuários podem atualizar o próprio perfil alfabetiza" ON public.alfabetiza_profiles;
CREATE POLICY "Usuários podem atualizar o próprio perfil alfabetiza"
    ON public.alfabetiza_profiles FOR UPDATE
    USING (auth.uid() = id);

-- 2. Tabela de progresso no schema public
CREATE TABLE IF NOT EXISTS public.alfabetiza_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    letras_aprendidas TEXT[] DEFAULT '{}',
    silabas_aprendidas TEXT[] DEFAULT '{}',
    palavras_lidas INTEGER DEFAULT 0,
    minutos_estudo INTEGER DEFAULT 0,
    ultima_sessao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE public.alfabetiza_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuários podem ver próprio progresso alfabetiza" ON public.alfabetiza_progress;
CREATE POLICY "Usuários podem ver próprio progresso alfabetiza"
    ON public.alfabetiza_progress FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem inserir próprio progresso alfabetiza" ON public.alfabetiza_progress;
CREATE POLICY "Usuários podem inserir próprio progresso alfabetiza"
    ON public.alfabetiza_progress FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem atualizar próprio progresso alfabetiza" ON public.alfabetiza_progress;
CREATE POLICY "Usuários podem atualizar próprio progresso alfabetiza"
    ON public.alfabetiza_progress FOR UPDATE
    USING (auth.uid() = user_id);

-- 3. Adiciona coluna perfil em public.profiles se a tabela existir
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'perfil') THEN
            ALTER TABLE public.profiles ADD COLUMN perfil VARCHAR(50);
        END IF;
    END IF;
END $$;
