'use client'

import Link from 'next/link'
import { Mic, Sparkles, Heart, ArrowRight, CheckCircle2, BookOpen, Users, Accessibility, Shield, Volume2, ChevronDown } from 'lucide-react'
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
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <button className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">Entrar</button>
            </Link>
            <Link href="/signup">
              <button className="px-5 py-2.5 text-sm font-bold bg-sky-600 hover:bg-sky-700 text-white rounded-full shadow-md shadow-sky-600/20 transition-all">
                Criar Conta Grátis
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
            Uma IA que conversa com você, entende a sua fala e ensina letras, sílabas e palavras de forma natural. Para crianças, adultos e pessoas com deficiência.
          </motion.p>

          <motion.div initial="hidden" animate="visible" custom={3} variants={fadeIn}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/signup">
              <button className="h-14 px-8 text-base rounded-full bg-gray-950 text-white hover:bg-gray-800 shadow-xl font-bold flex items-center gap-2 transition-all">
                Começar a Aprender <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <Link href="/login">
              <button className="h-14 px-8 text-base rounded-full border border-gray-300 text-gray-800 hover:bg-gray-50 font-semibold transition-all">
                Já tenho conta
              </button>
            </Link>
          </motion.div>

          <motion.div initial="hidden" animate="visible" custom={4} variants={fadeIn}
            className="flex items-center justify-center gap-5 text-xs text-gray-400 font-semibold pt-3">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> 100% por voz</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Sem digitar nada</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Grátis para testar</span>
          </motion.div>
        </div>
      </section>

      {/* PERSONAS */}
      <section className="py-24 bg-gray-50/50 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-950 tracking-tight">Um app. Três realidades.</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">A interface se transforma automaticamente de acordo com quem está usando.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Modo Criança', subtitle: '5 a 8 anos', desc: 'Método fônico com cores vibrantes, mascote animado e botões gigantes. A IA fala como uma professora carinhosa.', color: 'from-sky-500 to-sky-600', icon: <Sparkles className="w-6 h-6 text-sky-600" />, bg: 'bg-sky-50 border-sky-200' },
              { title: 'Modo Adulto (EJA)', subtitle: 'Jovens e adultos', desc: 'Interface séria e respeitosa, sem infantilização. Letras grandes, tom de portal bancário. Foco em letramento prático.', color: 'from-slate-700 to-slate-800', icon: <Users className="w-6 h-6 text-slate-700" />, bg: 'bg-slate-50 border-slate-200' },
              { title: 'Modo Inclusão (PCD)', subtitle: 'TEA, TDAH, Dislexia', desc: 'Zero animações bruscas, tons pastéis, espaçamento largo. Previsibilidade total para reduzir sobrecarga sensorial.', color: 'from-teal-500 to-teal-600', icon: <Accessibility className="w-6 h-6 text-teal-600" />, bg: 'bg-teal-50 border-teal-200' },
            ].map((p) => (
              <div key={p.title} className={`relative p-8 rounded-2xl border ${p.bg} hover:shadow-md transition-shadow`}>
                <div className="w-14 h-14 bg-white border border-gray-200 rounded-2xl flex items-center justify-center mb-6 shadow-sm">{p.icon}</div>
                <h3 className="text-xl font-bold text-gray-950 mb-1">{p.title}</h3>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{p.subtitle}</p>
                <p className="text-gray-500 leading-relaxed text-sm">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-16 text-center space-y-3">
            <h2 className="text-4xl lg:text-5xl font-black text-gray-950 tracking-tight">Tecnologia que ensina de verdade</h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">Cada detalhe foi pensado para quem nunca teve acesso à leitura.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Mic className="w-7 h-7" />, title: 'Voice-First (Sem Teclado)', desc: 'O aluno interage 100% por voz. Não precisa saber digitar, ler ou navegar menus.', color: 'from-sky-500 to-sky-600' },
              { icon: <Volume2 className="w-7 h-7" />, title: 'Vozes Neurais (Edge TTS)', desc: 'A IA responde com voz humana da Microsoft: expressiva para crianças, madura para adultos.', color: 'from-indigo-500 to-indigo-600' },
              { icon: <Sparkles className="w-7 h-7" />, title: 'Gemini Multimodal', desc: 'A IA entende o ÁUDIO bruto da fala, inclusive sotaques regionais e falas infantis.', color: 'from-amber-500 to-amber-600' },
              { icon: <Heart className="w-7 h-7" />, title: 'Método Fônico Integrado', desc: 'Para crianças: BA-BE-BI-BO-BU com reforço sonoro e visual. Para adultos: letramento contextual.', color: 'from-rose-500 to-rose-600' },
              { icon: <Shield className="w-7 h-7" />, title: 'Seguro para Crianças', desc: 'Sem coleta de dados pessoais de menores. Ambiente fechado, sem links externos ou anúncios.', color: 'from-emerald-500 to-emerald-600' },
              { icon: <Accessibility className="w-7 h-7" />, title: 'Acessibilidade WCAG', desc: 'Contraste alto, navegação por teclado, sem dependência de cores, compatível com leitores de tela.', color: 'from-purple-500 to-purple-600' },
            ].map((f, i) => (
              <div key={i} className="h-full p-8 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 bg-gradient-to-br ${f.color} shadow-md`}>{f.icon}</div>
                <h3 className="text-xl font-bold text-gray-950 mb-3">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-32 bg-gray-950 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-[600px] h-[600px] bg-sky-600/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-4xl lg:text-5xl font-black tracking-tight">Educação acessível para todos</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">Comece grátis. Sem cartão de crédito.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 flex flex-col">
              <h3 className="text-2xl font-bold text-white mb-2">Plano Família</h3>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-5xl font-black text-white">R$ 10</span>
                <span className="text-gray-400">/mês</span>
              </div>
              <p className="text-xs text-emerald-400 font-medium mb-8">7 dias grátis</p>
              <ul className="space-y-4 mb-10 flex-1">
                {['1 perfil de aluno', 'Sessões ilimitadas de voz', 'Modo Criança ou EJA', 'Progresso salvo na nuvem', 'Relatório semanal para os pais'].map(item => (
                  <li key={item} className="flex gap-3 text-gray-200 items-start text-sm">
                    <CheckCircle2 className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                    <span className="leading-tight">{item}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full h-14 rounded-full bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-lg shadow-[0_0_40px_rgba(14,165,233,0.3)] transition-all">
                Assinar Família
              </button>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-10 flex flex-col relative">
              <div className="absolute top-0 right-0 p-6">
                <div className="bg-gradient-to-r from-teal-400 to-emerald-500 text-white text-[10px] font-extrabold uppercase tracking-widest px-3.5 py-1 rounded-full">Para Escolas</div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Plano Escola</h3>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-5xl font-black text-white">R$ 5</span>
                <span className="text-gray-400">/aluno/mês</span>
              </div>
              <p className="text-xs text-emerald-400 font-medium mb-8">Mínimo 30 alunos</p>
              <ul className="space-y-4 mb-10 flex-1">
                {['Tudo do Plano Família', 'Perfis ilimitados de alunos', 'Painel do Professor com Analytics', 'Dashboard de Evolução da Turma', 'Modo PCD/Inclusão habilitado', 'Suporte prioritário', 'Relatórios pedagógicos em PDF'].map(item => (
                  <li key={item} className="flex gap-3 text-gray-200 items-start text-sm">
                    <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                    <span className="leading-tight">{item}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full h-14 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-white font-extrabold text-lg shadow-[0_0_40px_rgba(20,184,166,0.3)] transition-all">
                Falar com Comercial
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-extrabold text-gray-950 text-center mb-12">Perguntas Frequentes</h2>
          <FAQItem q="Precisa saber ler para usar?" a="Não! O app é 100% por voz. O aluno só precisa falar e ouvir. Nenhuma leitura ou digitação é necessária." />
          <FAQItem q="Funciona para adultos analfabetos?" a="Sim. O Modo EJA foi projetado sem infantilização, com tom respeitoso e foco em letramento prático (ler placas, documentos, receitas)." />
          <FAQItem q="É seguro para crianças?" a="Totalmente. Sem anúncios, sem links externos, sem coleta de dados pessoais de menores. Ambiente fechado." />
          <FAQItem q="Precisa de internet?" a="Sim, pois a IA processa o áudio na nuvem. Estamos trabalhando em um modo offline para áreas rurais." />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-sky-600 rounded-md flex items-center justify-center text-white">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            <span className="font-extrabold text-gray-950 text-lg tracking-tight">Alfabetiza <span className="text-sky-600">AÍ</span></span>
          </div>
          <p className="text-gray-400 text-sm font-medium">© {new Date().getFullYear()} AÍ Tecnologia e Educação Ltda.</p>
        </div>
      </footer>
    </div>
  )
}
