import { auth, clerkClient } from '@clerk/nextjs/server'
import { setUserProStatus } from '@/lib/db'
import { NextResponse } from 'next/server'

const ASAAS_API_KEY = process.env.ASAAS_API_KEY || ''
const ASAAS_URL = process.env.ASAAS_URL || 'https://api.asaas.com/v3'

export async function GET(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const paymentId = searchParams.get('id')
    if (!paymentId || !ASAAS_API_KEY) {
      return NextResponse.json({ confirmed: false, status: 'PENDING' })
    }

    const res = await fetch(`${ASAAS_URL}/payments/${encodeURIComponent(paymentId)}`, {
      headers: {
        access_token: ASAAS_API_KEY,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!res.ok) {
      return NextResponse.json({ confirmed: false, status: 'PENDING' })
    }

    const payment = await res.json()
    const status = payment.status || 'PENDING'
    const confirmed = status === 'RECEIVED' || status === 'CONFIRMED'

    if (confirmed) {
      const rawRef = payment.externalReference || `${userId}:YEARLY`
      const [, cycle] = rawRef.split(':')
      const planType = cycle === 'MONTHLY' ? 'family_monthly' : 'family_yearly'

      await setUserProStatus(userId, true, planType, paymentId)

      try {
        const client = await clerkClient()
        await client.users.updateUserMetadata(userId, {
          publicMetadata: {
            isPro: true,
            plan: planType,
          },
        })
      } catch {
        // Ignora erro de metadata secundário
      }
    }

    return NextResponse.json({ confirmed, status })
  } catch {
    return NextResponse.json({ confirmed: false, status: 'ERROR' }, { status: 500 })
  }
}
