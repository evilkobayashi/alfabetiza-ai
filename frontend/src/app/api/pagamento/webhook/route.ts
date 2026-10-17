import { clerkClient } from '@clerk/nextjs/server'
import { setUserProStatus } from '@/lib/db'
import { NextResponse } from 'next/server'
import crypto from 'crypto'

const WEBHOOK_TOKEN = process.env.ASAAS_WEBHOOK_TOKEN || ''

export async function POST(req: Request) {
  try {
    const asaasToken = req.headers.get('asaas-access-token') || ''
    
    // Verificação em tempo constante do token Asaas
    if (
      !WEBHOOK_TOKEN ||
      !asaasToken ||
      !crypto.timingSafeEqual(Buffer.from(asaasToken), Buffer.from(WEBHOOK_TOKEN))
    ) {
      return NextResponse.json({ error: 'Token de webhook inválido.' }, { status: 401 })
    }

    const payload = await req.json().catch(() => ({}))
    const event = payload.event

    if (event === 'PAYMENT_RECEIVED' || event === 'PAYMENT_CONFIRMED') {
      const payment = payload.payment || {}
      const rawRef = payment.externalReference || ''
      const paymentId = payment.id

      if (rawRef) {
        const [userId, cycle] = rawRef.split(':')
        const planType = cycle === 'YEARLY' ? 'family_yearly' : 'family_monthly'

        // 1. Atualiza no PostgreSQL
        await setUserProStatus(userId, true, planType, paymentId)

        // 2. Atualiza no Clerk User Metadata para persistência em sessão
        try {
          const client = await clerkClient()
          await client.users.updateUserMetadata(userId, {
            publicMetadata: {
              isPro: true,
              plan: planType,
            },
          })
        } catch (clerkErr) {
          console.error('Erro ao atualizar metadata no Clerk:', clerkErr)
        }
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Erro em webhook Asaas:', error)
    return NextResponse.json({ error: 'Erro interno no webhook.' }, { status: 500 })
  }
}
