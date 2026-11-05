'use client'

import { useState } from 'react'
import { SignUp } from '@clerk/nextjs'
import Link from 'next/link'
import { BookOpen, ArrowLeft, ShieldCheck } from 'lucide-react'

export default function SignupPage() {
  const [acceptAge, setAcceptAge] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const canProceed = acceptAge && acceptTerms

  return (
    <div id="main-content" className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-[#FAF9F6] font-sans text-slate-800">
      {/* LEFT */}
      <div className="hidden lg:flex lg:col-span-5 relative bg-blue-950 p-12 flex-col justify-between overflow-hidden">
        {/* Imagem de Fundo (com licença aberta verificada) */}
        <div className="absolute inset-0 opacity-20 mix-blend-overlay">
          <img 
            src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop" 
            alt="Mesa escolar com letras do alfabeto ilustrando o ambiente de alfabetização (Licença Aberta Unsplash)"
            className="w-full h-full object-cover grayscale"
          />
        </div>

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
            <BookOpen className="w-5 h-5 text-amber-400" aria-hidden="true" />
          </div>
          <span className="font-serif text-white text-2xl font-bold tracking-tight">
            Alfabetiza<span className="text-amber-400">AÍ</span>
          </span>
        </div>

        <div className="relative z-10 space-y-6 my-auto max-w-sm">
          <h2 className="text-4xl font-serif font-bold text-white leading-tight">
            A leitura começa com um "Oi".
          </h2>
          <p className="text-blue-100 text-base leading-relaxed font-medium">
            Crie sua conta e permita que nossa IA acompanhe a jornada de aprendizado do zero à primeira palavra.
          </p>
        </div>

        <div className="relative z-10 text-xs text-blue-200 pt-6">
          © {new Date().getFullYear()} Aí Tecnologia e Educação Inova Simples (I.S.).
        </div>
      </div>

      {/* RIGHT */}
      <div className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-12">
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-blue-900 transition-colors">
            <ArrowLeft className="w-4 h-4" aria-hidden="true" /> Voltar para o início
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto my-auto flex flex-col items-center py-4 space-y-4">
          <div className="w-full bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3 text-xs text-slate-700">
            <p className="font-bold text-slate-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" aria-hidden="true" />
              Consentimento Obrigatório (LGPD e ECA Digital)
            </p>
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptAge}
                onChange={(e) => setAcceptAge(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-slate-300 accent-blue-900"
              />
              <span>
                Declaro ter <strong>18 anos ou mais</strong> ou ser o <strong>pai, mãe ou responsável legal</strong> autorizando expressamente o uso pela criança/adolescente (Art. 14 da LGPD e Lei 15.211/2025).
              </span>
            </label>
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-slate-300 accent-blue-900"
              />
              <span>
                Li e aceito os <Link href="/termos" className="text-blue-800 underline font-semibold">Termos de Serviço</Link>, a <Link href="/privacidade" className="text-blue-800 underline font-semibold">Política de Privacidade (LGPD)</Link> e a <Link href="/cookies" className="text-blue-800 underline font-semibold">Política de Cookies</Link>.
              </span>
            </label>
            <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-200">
              🔒 <strong>Minimização de Dados:</strong> Coletamos apenas nome e e-mail estritamente necessários. Zero anúncios infantis. Exclusão total disponível em 1 clique na Sala.
            </p>
          </div>

          {canProceed ? (
            <SignUp
              routing="hash"
              signInUrl="/login"
              forceRedirectUrl="/onboarding"
              fallbackRedirectUrl="/onboarding"
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "shadow-2xl shadow-blue-900/5 border border-slate-200 rounded-3xl w-full",
                  headerTitle: "font-serif text-2xl font-bold text-blue-950",
                  headerSubtitle: "text-slate-600",
                  socialButtonsBlockButton: "rounded-xl border-slate-200",
                  formButtonPrimary: "bg-blue-900 hover:bg-blue-800 rounded-xl",
                }
              }}
            />
          ) : (
            <div className="w-full p-6 rounded-2xl bg-amber-50 border border-amber-200 text-center text-xs font-semibold text-amber-950">
              Marque as duas caixas de consentimento acima (Idade/Responsável Legal e Termos LGPD) para liberar o formulário de cadastro seguro.
            </div>
          )}
        </div>
        <div />
      </div>
    </div>
  )
}
