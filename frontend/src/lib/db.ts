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
