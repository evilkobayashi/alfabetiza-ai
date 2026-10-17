import postgres from 'postgres'

const connectionString = process.env.DATABASE_URL!

export const sql = postgres(connectionString, {
  ssl: process.env.NODE_ENV === 'production' ? 'require' : false,
  max: 10,
})

export async function upsertUserProfile(
  userId: string,
  perfil: string,
  email?: string | null,
  fullName?: string | null
) {
  return await sql`
    INSERT INTO alfabetiza_profiles (id, perfil, email, full_name, updated_at)
    VALUES (${userId}, ${perfil}, ${email ?? null}, ${fullName ?? null}, NOW())
    ON CONFLICT (id) DO UPDATE SET 
      perfil = EXCLUDED.perfil,
      email = COALESCE(EXCLUDED.email, alfabetiza_profiles.email),
      full_name = COALESCE(EXCLUDED.full_name, alfabetiza_profiles.full_name),
      updated_at = NOW()
    RETURNING *;
  `
}

export async function getUserProfile(userId: string) {
  const rows = await sql`
    SELECT * FROM alfabetiza_profiles WHERE id = ${userId} LIMIT 1
  `
  return rows[0] || null
}

export async function setUserProStatus(
  userId: string,
  isPro: boolean,
  planType: string = 'family',
  subscriptionId?: string | null
) {
  // Garante que as colunas existem se a migration ainda não rodou
  await sql`
    ALTER TABLE alfabetiza_profiles 
    ADD COLUMN IF NOT EXISTS is_pro BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS plan_type TEXT DEFAULT 'free',
    ADD COLUMN IF NOT EXISTS subscription_id TEXT;
  `.catch(() => {})

  return await sql`
    UPDATE alfabetiza_profiles 
    SET is_pro = ${isPro}, plan_type = ${planType}, subscription_id = ${subscriptionId ?? null}, updated_at = NOW()
    WHERE id = ${userId}
    RETURNING *;
  `
}

export async function ensureProgressTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS alfabetiza_progress (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id TEXT NOT NULL,
      letras_aprendidas TEXT[] DEFAULT '{}',
      silabas_aprendidas TEXT[] DEFAULT '{}',
      palavras_lidas INTEGER DEFAULT 0,
      minutos_estudo INTEGER DEFAULT 0,
      ultima_sessao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `.catch(() => {})
}

export async function getUserProgress(userId: string) {
  await ensureProgressTable()
  const rows = await sql`
    SELECT * FROM alfabetiza_progress WHERE user_id = ${userId} LIMIT 1
  `
  if (rows.length > 0) return rows[0]

  const inserted = await sql`
    INSERT INTO alfabetiza_progress (user_id, letras_aprendidas, silabas_aprendidas, palavras_lidas, minutos_estudo)
    VALUES (${userId}, ARRAY['A', 'E', 'I', 'O', 'U'], ARRAY['BA', 'BE'], 0, 0)
    RETURNING *;
  `
  return inserted[0]
}

export async function saveUserProgress(
  userId: string,
  data: { letra?: string; silaba?: string; palavraLida?: boolean; minutos?: number }
) {
  await ensureProgressTable()
  const current = await getUserProgress(userId)

  let letras: string[] = current.letras_aprendidas || []
  if (data.letra && !letras.includes(data.letra.toUpperCase())) {
    letras = [...letras, data.letra.toUpperCase()]
  }

  let silabas: string[] = current.silabas_aprendidas || []
  if (data.silaba && !silabas.includes(data.silaba.toUpperCase())) {
    silabas = [...silabas, data.silaba.toUpperCase()]
  }

  const palavrasLidas = (current.palavras_lidas || 0) + (data.palavraLida ? 1 : 0)
  const minutos = (current.minutos_estudo || 0) + (data.minutos || 1)

  const updated = await sql`
    UPDATE alfabetiza_progress
    SET 
      letras_aprendidas = ${letras},
      silabas_aprendidas = ${silabas},
      palavras_lidas = ${palavrasLidas},
      minutos_estudo = ${minutos},
      ultima_sessao = NOW()
    WHERE user_id = ${userId}
    RETURNING *;
  `
  return updated[0]
}

