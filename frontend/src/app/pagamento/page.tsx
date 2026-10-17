'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Sparkles, Check, ArrowLeft, ShieldCheck, Heart } from 'lucide-react'
import { useUser } from '@clerk/nextjs'

export default function PagamentoPage() {
  const { isSignedIn, user } = useUser()
  const [cycle, setCycle] = useState<'MONTHLY' | 'YEARLY'>('YEARLY')
  const [cpf, setCpf] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [payload, setPayload] = useState<string | null>(null)

  const handleCheckout = async () => {
    setError(null)
    const cleanCpf = cpf.replace(/\D/g, '')
    if (cleanCpf.length !== 11 && cleanCpf.length !== 14) {
      setError('Informe um CPF ou CNPJ válido para emissão do PIX.')
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
        throw new Error(data.error || 'Erro ao gerar pagamento PIX.')
      }

      setQrCode(data.qrCode)
      setPayload(data.payload)
    } catch (e: any) {
      setError(e.message || 'Erro de conexão com o servidor.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <Link href="/sala" className="flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900">
            <ArrowLeft className="size-4" /> Voltar para a Sala de Aula
          </Link>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
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

          {!qrCode ? (
            <>
              {/* Seletor Mensal / Anual */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div
                  onClick={() => setCycle('MONTHLY')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    cycle === 'MONTHLY' ? 'border-amber-600 bg-amber-50/50' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="text-xs font-bold uppercase text-slate-500 mb-1">Assinatura Mensal</p>
                  <p className="text-2xl font-extrabold text-slate-900">R$ 24,90</p>
                  <p className="text-xs text-slate-500 mt-1">por mês · cancele quando quiser</p>
                </div>

                <div
                  onClick={() => setCycle('YEARLY')}
                  className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    cycle === 'YEARLY' ? 'border-amber-600 bg-amber-50/60' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="absolute -top-2.5 right-3 bg-amber-600 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full shadow-sm">
                    Mais Econômico
                  </span>
                  <p className="text-xs font-bold uppercase text-amber-700 mb-1">Plano Anual</p>
                  <p className="text-2xl font-extrabold text-slate-900">R$ 147,00</p>
                  <p className="text-xs text-emerald-600 font-bold mt-1">R$ 12,25/mês · economize 50%</p>
                </div>
              </div>

              {/* Benefícios */}
              <div className="bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-100 space-y-2.5">
                {[
                  'Conversas de voz 100% ilimitadas todos os dias',
                  'Acesso a todos os modos (KIDS, EJA e PCD)',
                  'Mascote interativo e atividades fonéticas',
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

              <input
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                placeholder="CPF ou CNPJ para emissão do PIX"
                aria-label="CPF ou CNPJ"
                inputMode="numeric"
                className="block w-full p-3 border border-slate-300 rounded-xl text-sm mb-4 bg-white"
              />

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3.5 rounded-xl font-bold text-sm shadow-md transition-colors"
              >
                {loading ? 'Gerando PIX...' : `Assinar por R$ ${cycle === 'YEARLY' ? '147,00 (Anual)' : '24,90 (Mensal)'}`}
              </button>
            </>
          ) : (
            <div className="text-center">
              <h2 className="text-lg font-bold text-slate-900 mb-1">Escaneie o QR Code PIX</h2>
              <p className="text-xs text-slate-500 mb-4">
                Abra o app do seu banco e pague via Pix Copia e Cola ou QR Code.
              </p>
              <img
                src={`data:image/png;base64,${qrCode}`}
                alt="QR Code Pix"
                className="mx-auto w-48 h-48 border p-2 rounded-2xl mb-4 bg-white shadow-sm"
              />
              <textarea
                readOnly
                value={payload || ''}
                rows={3}
                className="w-full p-2.5 bg-slate-50 border rounded-xl text-xs font-mono text-slate-700 mb-4"
              />
              <Link
                href="/sala"
                className="block w-full text-center bg-slate-900 text-white py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors"
              >
                Voltar para a Aula
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
