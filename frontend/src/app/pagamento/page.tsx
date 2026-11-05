'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Sparkles, Check, ArrowLeft, ShieldCheck, Copy, ExternalLink, CreditCard, CheckCircle2, Loader2 } from 'lucide-react'
import { useUser } from '@clerk/nextjs'

export default function PagamentoPage() {
  const router = useRouter()
  const { isSignedIn } = useUser()
  const [cycle, setCycle] = useState<'MONTHLY' | 'YEARLY'>('YEARLY')
  const [cpf, setCpf] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentId, setPaymentId] = useState<string | null>(null)
  const [invoiceUrl, setInvoiceUrl] = useState<string | null>(null)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [payload, setPayload] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    if (!paymentId || confirmed) return

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/pagamento/status?id=${encodeURIComponent(paymentId)}`)
        if (!res.ok) return
        const data = await res.json()
        if (data?.confirmed) {
          setConfirmed(true)
          clearInterval(interval)
          setTimeout(() => {
            router.push('/sala?upgraded=true')
          }, 2000)
        }
      } catch {
        // Ignora falhas de rede durante polling
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [paymentId, confirmed, router])

  const formatCpfCnpj = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 14)
    if (digits.length <= 11) {
      return digits
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    }
    return digits
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d)/, '$1-$2')
  }

  const handleCopyPix = async () => {
    if (!payload) return
    try {
      await navigator.clipboard.writeText(payload)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // Fallback
    }
  }

  const handleCheckout = async () => {
    setError(null)
    const cleanCpf = cpf.replace(/\D/g, '')
    if (cleanCpf.length !== 11 && cleanCpf.length !== 14) {
      setError('Informe um CPF (11 dígitos) ou CNPJ (14 dígitos) válido para emissão da cobrança.')
      return
    }

    if (!isSignedIn) {
      window.location.href = '/login'
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/pagamento/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cycle, cpfCnpj: cleanCpf }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Erro ao gerar pagamento.')
      }

      setPaymentId(data.paymentId || null)
      setInvoiceUrl(data.invoiceUrl || null)
      setQrCode(data.qrCode || null)
      setPayload(data.payload || null)
    } catch (e: any) {
      setError(e.message || 'Erro de conexão com o servidor.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div id="main-content" className="min-h-screen bg-[#FAF9F6] text-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <Link href="/sala" className="flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-slate-900">
            <ArrowLeft className="size-4" /> Voltar para a Sala de Aula
          </Link>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
            <Sparkles className="size-3.5" /> Acesso Família & Inclusão
          </div>
        </header>

        <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-sm">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Plano Família Alfabetiza AÍ</h1>
            <p className="text-slate-600 text-sm mt-2">
              Voz neural ilimitada, suporte com afeto para crianças, EJA e pessoas neurodivergentes.
            </p>
          </div>

          {!paymentId && !qrCode ? (
            <>
              {/* Seletor Mensal / Anual */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setCycle('MONTHLY')}
                  className={`p-4 rounded-2xl border-2 text-left cursor-pointer transition-all ${
                    cycle === 'MONTHLY' ? 'border-amber-600 bg-amber-50/50' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="text-xs font-bold uppercase text-slate-600 mb-1">Assinatura Mensal</p>
                  <p className="text-2xl font-extrabold text-slate-900">R$ 24,90</p>
                  <p className="text-xs text-slate-600 mt-1">por mês · cancele quando quiser</p>
                </button>

                <button
                  type="button"
                  onClick={() => setCycle('YEARLY')}
                  className={`relative p-4 rounded-2xl border-2 text-left cursor-pointer transition-all ${
                    cycle === 'YEARLY' ? 'border-amber-600 bg-amber-50/60' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="absolute -top-2.5 right-3 bg-amber-700 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow-sm">
                    Mais Econômico
                  </span>
                  <p className="text-xs font-bold uppercase text-amber-800 mb-1">Plano Anual</p>
                  <p className="text-2xl font-extrabold text-slate-900">R$ 147,00</p>
                  <p className="text-xs text-emerald-700 font-bold mt-1">R$ 12,25/mês · economize 50%</p>
                </button>
              </div>

              {/* Benefícios */}
              <div className="bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-100 space-y-2.5">
                {[
                  'Conversas de voz 100% ilimitadas todos os dias',
                  'Acesso a todos os modos (KIDS, EJA e PCD)',
                  'Mascote interativo e atividades fonéticas com IA Sabiá-4',
                  'Relatórios de progresso das sílabas e palavras dominadas',
                ].map((b) => (
                  <div key={b} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                    <Check className="size-4 text-emerald-600 shrink-0" />
                    <span>{b}</span>
                  </div>
                ))}
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
                  {error}
                </div>
              )}

              <label htmlFor="alfabetiza-cpf" className="block text-xs font-bold text-slate-700 mb-1.5">
                CPF ou CNPJ do Responsável (para nota fiscal e PIX):
              </label>
              <input
                id="alfabetiza-cpf"
                value={cpf}
                onChange={(e) => setCpf(formatCpfCnpj(e.target.value))}
                placeholder="000.000.000-00"
                aria-label="CPF ou CNPJ"
                inputMode="numeric"
                maxLength={18}
                className="block w-full p-3 border border-slate-300 rounded-xl text-sm mb-4 bg-white tracking-wider"
              />

              <button
                type="button"
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3.5 rounded-xl font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" /> Gerando Cobrança Segura...
                  </>
                ) : (
                  `Assinar por R$ ${cycle === 'YEARLY' ? '147,00 (Anual)' : '24,90 (Mensal)'}`
                )}
              </button>
              <p className="mt-4 text-xs text-slate-600 text-center flex items-center justify-center gap-1 flex-wrap">
                <ShieldCheck className="size-4 text-emerald-600 shrink-0" /> Preço final em Reais (R$) · PIX, Cartão ou Boleto · Garantia de 7 dias (<Link href="/reembolso" className="text-amber-800 underline font-semibold">Política de Reembolso CDC</Link>).
              </p>
            </>
          ) : confirmed ? (
            <div className="text-center py-8 space-y-4">
              <CheckCircle2 className="size-16 text-emerald-600 mx-auto" />
              <h2 className="text-2xl font-extrabold text-slate-900">Pagamento Confirmado!</h2>
              <p className="text-sm text-slate-600">Seu Plano Família foi ativado com sucesso. Redirecionando para a Sala de Aula...</p>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                ⚡ Aguardando confirmação automática do pagamento...
              </div>
              <h2 className="text-lg font-bold text-slate-900">Escaneie o QR Code PIX ou pague com Cartão</h2>
              <p className="text-xs text-slate-600">
                Abra o app do seu banco e pague via Pix Copia e Cola, QR Code ou abra a fatura para Cartão.
              </p>

              {qrCode && (
                <img
                  src={`data:image/png;base64,${qrCode}`}
                  alt="QR Code PIX para pagamento do Plano Família Alfabetiza AÍ"
                  className="mx-auto w-48 h-48 border p-2 rounded-2xl bg-white shadow-sm"
                />
              )}

              {payload && (
                <div className="space-y-2">
                  <textarea
                    readOnly
                    aria-label="Código PIX Copia e Cola"
                    value={payload}
                    rows={3}
                    className="w-full p-2.5 bg-slate-50 border rounded-xl text-xs font-mono text-slate-700"
                  />
                  <button
                    type="button"
                    onClick={handleCopyPix}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                  >
                    {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                    {copied ? 'Código PIX Copiado!' : 'Copiar Código PIX (Copia e Cola)'}
                  </button>
                </div>
              )}

              {invoiceUrl && (
                <a
                  href={invoiceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <CreditCard className="size-4" /> Abrir Fatura Asaas (Cartão de Crédito / Boleto) <ExternalLink className="size-3.5" />
                </a>
              )}

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setPaymentId(null)
                    setQrCode(null)
                    setPayload(null)
                    setInvoiceUrl(null)
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800 underline"
                >
                  Alterar plano ou CPF
                </button>
                <Link
                  href="/sala"
                  className="block w-full text-center bg-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors"
                >
                  Voltar para a Aula
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
