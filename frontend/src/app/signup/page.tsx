'use client'

import { SignUp } from '@clerk/nextjs'
import Link from 'next/link'
import { BookOpen, ArrowLeft } from 'lucide-react'

export default function SignupPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white font-sans text-gray-900">
      {/* LEFT */}
      <div className="hidden lg:flex lg:col-span-6 relative bg-gradient-to-br from-sky-900 via-teal-950 to-zinc-950 p-12 flex-col justify-between overflow-hidden border-r border-sky-900/50">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-sky-500/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-teal-500/15 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-sky-500 to-teal-400 rounded-xl flex items-center justify-center shadow-lg">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-white text-2xl tracking-tight">
            Alfabetiza <span className="text-sky-400">AÍ</span>
          </span>
        </div>

        <div className="relative z-10 space-y-6 my-auto max-w-lg">
          <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight">
            A leitura começa com um "Oi".
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            Crie sua conta e comece a aprender a ler usando apenas a sua voz. Sem digitar, sem complicação.
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-300">
            <span>✓ Grátis para testar</span>
            <span>✓ Sem cartão</span>
          </div>
        </div>

        <div className="relative z-10 text-xs text-gray-400 pt-6 border-t border-white/10">
          © {new Date().getFullYear()} AÍ Tecnologia e Educação Ltda.
        </div>
      </div>

      {/* RIGHT */}
      <div className="lg:col-span-6 flex flex-col justify-between p-6 sm:p-12">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto my-auto flex justify-center py-6">
          <SignUp
            routing="hash"
            signInUrl="/login"
            forceRedirectUrl="/onboarding"
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-xl border border-gray-200 rounded-3xl w-full",
              }
            }}
          />
        </div>
        <div />
      </div>
    </div>
  )
}
