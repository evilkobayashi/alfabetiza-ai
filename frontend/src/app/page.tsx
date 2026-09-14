"use client";

import { useState } from "react";
import VoiceRecorder from "@/components/VoiceRecorder";
import { Smile, Brain, BookOpen } from "lucide-react";

type Profile = "KIDS" | "PCD";

export default function Home() {
  const [profile, setProfile] = useState<Profile>("KIDS");

  // THEME 1: Crianças (5-8 anos) - Lúdico, cores vibrantes, fontes gordinhas
  const KidsTheme = () => (
    <div className="flex-1 flex flex-col items-center w-full max-w-2xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-4 bg-yellow-300 rounded-full shadow-lg mb-2 animate-bounce">
          <Smile className="w-12 h-12 text-yellow-700" />
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-sky-600 drop-shadow-sm">
          Oi! Vamos aprender?
        </h2>
        <p className="text-xl text-sky-800 font-medium">Aperte o botão mágico abaixo!</p>
      </div>
      <VoiceRecorder profile="KIDS" animationsEnabled={true} />
    </div>
  );

  // THEME 2: Inclusão (PCD / TEA / TDAH / Dislexia) - Baixo Estímulo, Alto Contraste, Previsível
  const PCDTheme = () => (
    <div className="flex-1 flex flex-col items-center w-full max-w-2xl mx-auto space-y-10">
      <div className="text-center space-y-6 w-full bg-white p-8 rounded-2xl shadow-sm border border-teal-100">
        <div className="flex items-center justify-center gap-4">
          <Brain className="w-10 h-10 text-teal-600" />
          <h2 className="text-3xl font-bold text-teal-900 tracking-wide">
            Sala de Leitura
          </h2>
        </div>
        <div className="h-1 w-full bg-teal-50 rounded-full overflow-hidden">
          <div className="h-full w-1/3 bg-teal-400 rounded-full"></div>
        </div>
        <p className="text-xl text-slate-600 tracking-wide leading-relaxed font-medium">
          Olá. Eu sou o seu assistente de voz.
        </p>
      </div>
      <VoiceRecorder profile="PCD" animationsEnabled={false} />
    </div>
  );

  return (
    <main className={`min-h-screen flex flex-col p-4 md:p-8 transition-all duration-700 ${
      profile === "KIDS" 
        ? "bg-[#E0F2FE] font-sans" // Sky-100
        : "bg-[#F8FAFC] font-sans tracking-wide" // Slate-50, tipografia mais legível
    }`}>
      
      {/* HEADER DE TESTE (Para você trocar os perfis rapidamente) */}
      <header className="w-full flex justify-end mb-8">
        <div className="flex bg-white/50 backdrop-blur-md p-1 rounded-full shadow-sm border border-black/5">
          <button
            onClick={() => setProfile("KIDS")}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
              profile === "KIDS" ? "bg-sky-500 text-white shadow-md scale-105" : "text-slate-500 hover:bg-white"
            }`}
          >
            Modo Criança
          </button>
          <button
            onClick={() => setProfile("PCD")}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
              profile === "PCD" ? "bg-teal-600 text-white shadow-md scale-105" : "text-slate-500 hover:bg-white"
            }`}
          >
            Modo Inclusão (PCD)
          </button>
        </div>
      </header>

      {/* RENDERIZAÇÃO DO TEMA */}
      {profile === "KIDS" ? <KidsTheme /> : <PCDTheme />}

    </main>
  );
}
