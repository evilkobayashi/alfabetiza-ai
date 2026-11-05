import { auth, currentUser } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const ASAAS_API_KEY = process.env.ASAAS_API_KEY || ''
const ASAAS_URL = process.env.ASAAS_URL || 'https://api.asaas.com/v3'

export async function POST(req: Request) {
  try {
    const asaasKey = (process.env.ASAAS_API_KEY || '').trim().replace(/^["']|["']$/g, '')
    const asaasUrl = (process.env.ASAAS_URL || 'https://api.asaas.com/v3').trim()

    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Faça login para assinar.' }, { status: 401 })
    }

    if (!asaasKey) {
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
      access_token: asaasKey,
      'Content-Type': 'application/json',
    }

    // 1. Buscar cliente existente pelo CPF/CNPJ ou criar novo no Asaas
    let customerId: string | null = null
    const searchRes = await fetch(`${asaasUrl}/customers?cpfCnpj=${cpfCnpjRaw}`, { headers })
    if (searchRes.ok) {
      const searchData = await searchRes.json().catch(() => ({}))
      if (searchData?.data?.length > 0) {
        customerId = searchData.data[0].id
      }
    }

    if (!customerId) {
      const custRes = await fetch(`${asaasUrl}/customers`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ name, email, cpfCnpj: cpfCnpjRaw }),
      })

      if (!custRes.ok) {
        const err = await custRes.json().catch(() => ({}))
        const firstErr = err?.errors?.[0]?.description || 'Erro ao cadastrar CPF/CNPJ no Asaas.'
        return NextResponse.json({ error: firstErr }, { status: 400 })
      }

      const custData = await custRes.json()
      customerId = custData.id
    }

    // 2. Criar cobrança UNDEFINED (permite PIX, Cartão de Crédito e Boleto na fatura Asaas)
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const dueDate = tomorrow.toISOString().split('T')[0]

    const payRes = await fetch(`${asaasUrl}/payments`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        customer: customerId,
        billingType: 'UNDEFINED',
        value,
        dueDate,
        description,
        externalReference: `${userId}:${cycle}`,
      }),
    })

    if (!payRes.ok) {
      const err = await payRes.json().catch(() => ({}))
      const firstErr = err?.errors?.[0]?.description || 'Erro ao gerar cobrança no Asaas.'
      return NextResponse.json({ error: firstErr }, { status: 400 })
    }

    const payData = await payRes.json()
    const paymentId = payData.id
    const invoiceUrl = payData.invoiceUrl

    // 3. Obter QR Code PIX imediato
    let qrCode: string | null = null
    let payload: string | null = null
    const qrRes = await fetch(`${asaasUrl}/payments/${paymentId}/pixQrCode`, { headers })
    if (qrRes.ok) {
      const qrData = await qrRes.json().catch(() => ({}))
      qrCode = qrData.encodedImage || null
      payload = qrData.payload || null
    }

    return NextResponse.json({
      paymentId,
      invoiceUrl,
      value,
      cycle,
      qrCode,
      payload,
    })
  } catch (error: any) {
    console.error('Erro em /api/pagamento/checkout:', error)
    return NextResponse.json({ error: 'Erro interno ao processar checkout.' }, { status: 500 })
  }
}
