"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import VoiceRecorder from "@/components/VoiceRecorder";
import { Smile, Brain, BookOpen } from "lucide-react";

type Profile = "KIDS" | "PCD" | "EJA";

function SalaContent() {
  const searchParams = useSearchParams();
  const queryProfile = searchParams.get('perfil') as Profile;
  const [profile, setProfile] = useState<Profile>(queryProfile || "KIDS");

  useEffect(() => {
    if (queryProfile && ['KIDS', 'PCD', 'EJA'].includes(queryProfile)) {
      setProfile(queryProfile);
      try {
        localStorage.setItem('alfabetiza_perfil', queryProfile);
        document.cookie = `alfabetiza_perfil=${queryProfile}; path=/; max-age=31536000`;
      } catch {}
    } else {
      try {
        const saved = localStorage.getItem('alfabetiza_perfil') as Profile;
        if (saved && ['KIDS', 'PCD', 'EJA'].includes(saved)) {
          setProfile(saved);
        }
      } catch {}
    }
  }, [queryProfile]);

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

  // THEME 3: EJA (Jovens, Adultos e Idosos) - Maduro, Respeitoso, Letras Grandes, Estilo Bancário
  const EJATheme = () => (
    <div className="flex-1 flex flex-col items-center w-full max-w-2xl mx-auto space-y-10">
      <div className="text-center space-y-4 w-full p-6 border-b border-slate-200">
        <div className="inline-flex items-center justify-center p-3 bg-slate-800 rounded-xl mb-2">
          <BookOpen className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl md:text-4xl font-semibold text-slate-800 tracking-tight">
          Portal do Aluno
        </h2>
        <p className="text-xl text-slate-500 font-normal">
          Pressione o microfone para ditar sua dúvida.
        </p>
      </div>
      <VoiceRecorder profile="EJA" animationsEnabled={true} />
    </div>
  );

  return (
    <main className={`min-h-screen flex flex-col p-4 md:p-8 transition-all duration-700 ${
      profile === "KIDS" ? "bg-[#E0F2FE] font-sans" :
      profile === "PCD"  ? "bg-[#F8FAFC] font-sans tracking-wide" :
                           "bg-slate-50 font-serif" // EJA Theme (Elegante e clássico)
    }`}>
      
      {/* HEADER DE TESTE */}
      <header className="w-full flex justify-between items-center mb-8 overflow-x-auto pb-4 gap-4">
        <div className="flex bg-white/50 backdrop-blur-md p-1 rounded-full shadow-sm border border-black/5 min-w-max">
          <button
            onClick={() => {
              setProfile("KIDS");
              try {
                localStorage.setItem('alfabetiza_perfil', 'KIDS');
                document.cookie = 'alfabetiza_perfil=KIDS; path=/; max-age=31536000';
              } catch {}
            }}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
              profile === "KIDS" ? "bg-sky-500 text-white shadow-md scale-105" : "text-slate-500 hover:bg-white"
            }`}
          >
            Modo Criança
          </button>
          <button
            onClick={() => {
              setProfile("PCD");
              try {
                localStorage.setItem('alfabetiza_perfil', 'PCD');
                document.cookie = 'alfabetiza_perfil=PCD; path=/; max-age=31536000';
              } catch {}
            }}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
              profile === "PCD" ? "bg-teal-600 text-white shadow-md scale-105" : "text-slate-500 hover:bg-white"
            }`}
          >
            Modo Inclusão
          </button>
          <button
            onClick={() => {
              setProfile("EJA");
              try {
                localStorage.setItem('alfabetiza_perfil', 'EJA');
                document.cookie = 'alfabetiza_perfil=EJA; path=/; max-age=31536000';
              } catch {}
            }}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
              profile === "EJA" ? "bg-slate-800 text-white shadow-md scale-105" : "text-slate-500 hover:bg-white"
            }`}
          >
            Modo Adulto (EJA)
          </button>
        </div>
        
        {/* User Button (Logout) */}
        <div className="bg-white/50 backdrop-blur-md p-1.5 rounded-full shadow-sm border border-black/5 flex items-center justify-center">
          <UserButton afterSignOutUrl="/login" />
        </div>
      </header>

      {/* RENDERIZAÇÃO DO TEMA */}
      {profile === "KIDS" && <KidsTheme />}
      {profile === "PCD" && <PCDTheme />}
      {profile === "EJA" && <EJATheme />}

    </main>
  );
}


export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50 text-sky-600">Carregando Sala...</div>}>
      <SalaContent />
    </Suspense>
  )
}
