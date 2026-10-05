-- =========================================================================
-- POLITICA DE RETENÇÃO DE DADOS - LGPD E ECA (DADOS INFANTIS)
-- =========================================================================

CREATE EXTENSION IF NOT EXISTS pg_cron;

CREATE OR REPLACE FUNCTION delete_old_academic_data() RETURNS void AS $$
BEGIN
  -- ECA/LGPD: Limpeza de dados de progresso de crianças após o término do ano letivo
  DELETE FROM alfabetiza_ai.progress WHERE created_at < NOW() - INTERVAL '6 months';
END;
$$ LANGUAGE plpgsql;

SELECT cron.schedule(
    'delete_academic_data_job', 
    '0 0 * * 0', 
    'SELECT delete_old_academic_data()'
);

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
