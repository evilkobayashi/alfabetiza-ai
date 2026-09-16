'use client'

import Link from 'next/link'
import { Mic, Sparkles, Heart, ArrowRight, CheckCircle2, BookOpen, Accessibility, Shield, Volume2, ChevronDown, Wrench } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } })
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-gray-200">
      <button onClick={() => setOpen(!open)} className="w-full py-5 flex items-center justify-between text-left">
        <span className="text-base font-semibold text-gray-900">{q}</span>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <p className="pb-5 text-gray-500 text-sm leading-relaxed">{a}</p>}
    </div>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 overflow-x-hidden selection:bg-sky-100">

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-tr from-sky-500 to-teal-400 rounded-xl flex items-center justify-center shadow-md">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-gray-950 text-xl tracking-tight">
              Alfabetiza <span className="text-sky-600">AÍ</span>
            </span>
            <div className="ml-2 inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              <Wrench className="w-3 h-3" /> Em Construção
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <button className="px-5 py-2.5 text-sm font-bold bg-sky-600 hover:bg-sky-700 text-white rounded-full shadow-md shadow-sky-600/20 transition-all">
                Acessar Plataforma
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative pt-24 pb-20 lg:pt-36 lg:pb-28 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[450px] bg-sky-500/10 blur-[140px] rounded-full -z-10 pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 text-center space-y-8">
          <motion.div initial="hidden" animate="visible" custom={0} variants={fadeIn}>
            <div className="inline-flex items-center gap-2 bg-sky-50 border border-sky-100 text-sky-700 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
              <Heart className="w-3.5 h-3.5" />
              Voice-First • Inclusivo • Adaptativo
            </div>
          </motion.div>

          <motion.h1 initial="hidden" animate="visible" custom={1} variants={fadeIn}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-950 leading-[1.15] max-w-4xl mx-auto">
            Aprender a ler usando{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 via-teal-500 to-sky-500">
              apenas a sua voz
            </span>
          </motion.h1>

          <motion.p initial="hidden" animate="visible" custom={2} variants={fadeIn}
            className="text-lg lg:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Uma IA que conversa com você, entende a sua fala e ensina letras, sílabas e palavras de forma natural. (Atualmente em fase de testes fechada).
          </motion.p>

          <motion.div initial="hidden" animate="visible" custom={3} variants={fadeIn}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/login">
              <button className="h-14 px-8 text-base rounded-full bg-gray-950 text-white hover:bg-gray-800 shadow-xl font-bold flex items-center gap-2 transition-all">
                Fazer Login <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
          </motion.div>

          <motion.div initial="hidden" animate="visible" custom={4} variants={fadeIn}
            className="flex items-center justify-center gap-5 text-xs text-gray-400 font-semibold pt-3">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 100% por voz</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Acesso restrito via Google</span>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200 py-12 mt-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-sky-600 rounded-md flex items-center justify-center text-white">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            <span className="font-extrabold text-gray-950 text-lg tracking-tight">Alfabetiza <span className="text-sky-600">AÍ</span></span>
          </div>
          <p className="text-gray-400 text-sm font-medium">© {new Date().getFullYear()} AÍ Tecnologia e Educação Ltda. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
