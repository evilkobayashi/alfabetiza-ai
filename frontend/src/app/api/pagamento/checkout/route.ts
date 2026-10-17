import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const ASAAS_API_KEY = process.env.ASAAS_API_KEY || ''
const ASAAS_URL = process.env.ASAAS_URL || 'https://api.asaas.com/v3'

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Faça login para assinar.' }, { status: 401 })
    }

    if (!ASAAS_API_KEY) {
      return NextResponse.json({ error: 'Gateway de pagamento não configurado no servidor.' }, { status: 500 })
    }

    const body = await req.json().catch(() => ({}))
    const cycle = body.cycle === 'YEARLY' ? 'YEARLY' : 'MONTHLY'
    const cpfCnpjRaw = (body.cpfCnpj || '').replace(/\D/g, '')

    if (cpfCnpjRaw.length !== 11 && cpfCnpjRaw.length !== 14) {
      return NextResponse.json({ error: 'CPF ou CNPJ inválido.' }, { status: 422 })
    }

    const user = await currentUser()
    const email = user?.emailAddresses?.[0]?.emailAddress || `${userId}@alfabetiza.ai`
    const name = user?.fullName || [user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'Assinante Alfabetiza AÍ'

    const isYearly = cycle === 'YEARLY'
    const value = isYearly ? 147.00 : 24.90
    const description = isYearly 
      ? 'Alfabetiza AÍ - Plano Família Anual (Voz Ilimitada)'
      : 'Alfabetiza AÍ - Plano Família Mensal (Voz Ilimitada)'

    const headers = {
      access_token: ASAAS_API_KEY,
      'Content-Type': 'application/json',
    }

    // 1. Criar ou obter cliente no Asaas
    const custRes = await fetch(`${ASAAS_URL}/customers`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ name, email, cpfCnpj: cpfCnpjRaw }),
    })

    if (!custRes.ok) {
      const err = await custRes.json().catch(() => ({}))
      console.error('Erro Asaas customers:', err)
      return NextResponse.json({ error: 'Erro ao cadastrar cliente no Asaas.' }, { status: 400 })
    }

    const custData = await custRes.json()
    const customerId = custData.id

    // 2. Criar cobrança PIX com vencimento amanhã
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const dueDate = tomorrow.toISOString().split('T')[0]

    const payRes = await fetch(`${ASAAS_URL}/payments`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        customer: customerId,
        billingType: 'PIX',
        value,
        dueDate,
        description,
        externalReference: `${userId}:${cycle}`,
      }),
    })

    if (!payRes.ok) {
      const err = await payRes.json().catch(() => ({}))
      console.error('Erro Asaas payments:', err)
      return NextResponse.json({ error: 'Erro ao gerar cobrança Asaas.' }, { status: 400 })
    }

    const payData = await payRes.json()
    const paymentId = payData.id

    // 3. Obter QR Code PIX
    const qrRes = await fetch(`${ASAAS_URL}/payments/${paymentId}/pixQrCode`, {
      headers,
    })

    if (!qrRes.ok) {
      return NextResponse.json({ error: 'Erro ao obter QR Code PIX.' }, { status: 400 })
    }

    const qrData = await qrRes.json()

    return NextResponse.json({
      paymentId,
      value,
      cycle,
      qrCode: qrData.encodedImage,
      payload: qrData.payload,
    })
  } catch (error: any) {
    console.error('Erro em /api/pagamento/checkout:', error)
    return NextResponse.json({ error: 'Erro interno ao processar checkout.' }, { status: 500 })
  }
}
