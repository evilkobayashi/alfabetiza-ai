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
