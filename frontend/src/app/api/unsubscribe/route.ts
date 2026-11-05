import { sql } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    const cleanEmail = (email || '').trim().toLowerCase()
    if (!cleanEmail || !cleanEmail.includes('@')) {
      return NextResponse.json({ error: 'E-mail inválido' }, { status: 400 })
    }

    await sql`
      CREATE TABLE IF NOT EXISTS lgpd_unsubscribes (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        product_name TEXT NOT NULL DEFAULT 'Alfabetiza AÍ',
        unsubscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `.catch(() => {})

    await sql`
      INSERT INTO lgpd_unsubscribes (email, product_name, unsubscribed_at)
      VALUES (${cleanEmail}, 'Alfabetiza AÍ', NOW())
      ON CONFLICT (email) DO UPDATE SET unsubscribed_at = NOW();
    `.catch(() => {})

    return NextResponse.json({ status: 'unsubscribed', email: cleanEmail })
  } catch (error) {
    console.error('Error in /api/unsubscribe:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
