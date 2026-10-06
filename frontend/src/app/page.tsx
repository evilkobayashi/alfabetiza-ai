'use client'

import Link from 'next/link'
import { BookOpen, ArrowRight, CheckCircle2, Heart, Mic, Users, Shield, PlayCircle } from 'lucide-react'
import { motion } from 'framer-motion'

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } })
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-800 font-sans selection:bg-amber-200">
      
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 bg-[#FAF9F6]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-serif text-2xl font-bold tracking-tight text-blue-950">
              Alfabetiza<span className="text-amber-600">AÍ</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <button className="px-6 py-2.5 text-sm font-semibold bg-white border border-slate-300 text-slate-700 rounded-full hover:bg-slate-50 transition-colors">
                Área do Professor
              </button>
            </Link>
            <Link href="/login">
              <button className="px-6 py-2.5 text-sm font-semibold bg-blue-900 hover:bg-blue-800 text-white rounded-full transition-colors">
                Entrar na Aula
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative pt-20 pb-24 lg:pt-32 lg:pb-32 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          
          <div className="space-y-8 max-w-2xl">
            <motion.div initial="hidden" animate="visible" custom={0} variants={fadeIn}>
              <div className="inline-flex items-center gap-2 bg-amber-100/50 text-amber-800 text-sm font-medium px-4 py-2 rounded-full">
                <Heart className="w-4 h-4 text-amber-600" />
                <span>Pedagogia aliada à Tecnologia</span>
              </div>
            </motion.div>

            <motion.h1 initial="hidden" animate="visible" custom={1} variants={fadeIn}
              className="text-5xl lg:text-6xl font-serif font-bold text-blue-950 leading-[1.1]">
              Aprender a ler no <span className="italic text-amber-600">seu próprio ritmo.</span>
            </motion.h1>

            <motion.p initial="hidden" animate="visible" custom={2} variants={fadeIn}
              className="text-lg text-slate-600 leading-relaxed font-medium">
              Desenvolvemos uma tutoria por voz que escuta, entende e acompanha cada criança, respeitando o tempo de aprendizado humano. Construído por educadores, potencializado pela Inteligência Artificial.
            </motion.p>

            <motion.div initial="hidden" animate="visible" custom={3} variants={fadeIn}
              className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/login">
                <button className="w-full sm:w-auto h-14 px-8 text-base rounded-full bg-blue-900 text-white hover:bg-blue-800 font-semibold flex items-center justify-center gap-2 transition-colors">
                  Acessar Plataforma <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <button className="w-full sm:w-auto h-14 px-8 text-base rounded-full bg-white border-2 border-slate-200 text-blue-950 hover:border-slate-300 font-semibold flex items-center justify-center gap-2 transition-colors">
                <PlayCircle className="w-5 h-5 text-amber-600" /> Ver como funciona
              </button>
            </motion.div>

            <motion.div initial="hidden" animate="visible" custom={4} variants={fadeIn}
              className="flex flex-wrap items-center gap-6 text-sm text-slate-500 font-medium pt-4">
              <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-600" /> 100% por voz</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-600" /> Ambiente Seguro</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-600" /> Relatórios para Educadores</span>
            </motion.div>
          </div>

          <motion.div initial="hidden" animate="visible" custom={2} variants={fadeIn} className="relative hidden lg:block">
            {/* Espaço para foto humana real ou ilustração editorial */}
            <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-slate-200 relative">
              <img 
                src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop" 
                alt="Criança aprendendo"
                className="object-cover w-full h-full opacity-90"
              />
              <div className="absolute inset-0 bg-blue-900/10 mix-blend-multiply"></div>
            </div>
            
            {/* Card flutuante para dar aquele ar de "produto real" */}
            <div className="absolute -left-12 bottom-12 bg-white p-6 rounded-2xl shadow-xl max-w-xs border border-slate-100">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Mic className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-950">"Muito bem! A letra M com A faz MA."</p>
                  <p className="text-xs text-slate-500 mt-1">Interação em tempo real</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* METODOLOGIA */}
      <section className="py-24 bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-6 text-center max-w-3xl">
          <h2 className="text-3xl lg:text-4xl font-serif font-bold text-blue-950 mb-6">Feito por pessoas, para pessoas.</h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            Acreditamos que a tecnologia nunca vai substituir o toque humano na educação. Nossa plataforma é uma ferramenta de apoio que utiliza o que há de mais moderno em IA para escalar o cuidado, a paciência e a atenção individualizada.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#FAF9F6] py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-900 rounded-md flex items-center justify-center text-white">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="font-serif font-bold text-blue-950 text-xl">Alfabetiza<span className="text-amber-600">AÍ</span></span>
          </div>
          <p className="text-slate-500 text-sm font-medium">© {new Date().getFullYear()} AÍ Tecnologia e Educação. Todos os direitos reservados.</p>
        </div>
      </footer>

{/* Disclaimer CDC */}
<div className="w-full bg-gray-900 text-gray-400 py-6 text-center text-xs px-4">
  <p className="max-w-4xl mx-auto">
    Aviso Legal: Esta plataforma é uma ferramenta de <strong>assistência pedagógica baseada em Inteligência Artificial</strong>. 
    Não garantimos resultados acadêmicos absolutos, notas ou aprovação automática. O uso das ferramentas requer supervisão 
    do educador ou responsável legal.
  </p>
</div>

    </div>
  )
}
