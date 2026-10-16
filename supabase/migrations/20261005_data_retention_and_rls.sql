-- =========================================================================
-- REFORÇO DE ROW LEVEL SECURITY (RLS) - PRIVACIDADE DOS ALUNOS
-- =========================================================================

ALTER TABLE alfabetiza_ai.progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Usuários podem ler apenas seu próprio progresso" ON alfabetiza_ai.progress;
CREATE POLICY "Usuários podem ler apenas seu próprio progresso"
ON alfabetiza_ai.progress FOR SELECT
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Usuários podem deletar apenas seu próprio progresso" ON alfabetiza_ai.progress;
CREATE POLICY "Usuários podem deletar apenas seu próprio progresso"
ON alfabetiza_ai.progress FOR DELETE
USING (auth.uid() = user_id);
