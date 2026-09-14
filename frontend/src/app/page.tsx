"use client";

import { useState } from "react";
import VoiceRecorder from "@/components/VoiceRecorder";

type Profile = "KIDS" | "EJA" | "PCD";

export default function Home() {
  const [profile, setProfile] = useState<Profile>("KIDS");

  // Adaptação dinâmica de Tema baseada na escolha de Perfil (AAA Quality)
  const themeStyles = {
    KIDS: "bg-gradient-to-b from-sky-200 to-yellow-100 text-sky-900",
    EJA: "bg-gradient-to-b from-slate-100 to-slate-200 text-slate-800 font-serif",
    PCD: "bg-zinc-100 text-zinc-900", // Alto contraste, baixo estímulo visual
  };

  return (
    <main className={`min-h-screen flex flex-col items-center justify-between p-8 transition-colors duration-500 ${themeStyles[profile]}`}>
      
      <header className="w-full max-w-md flex flex-col items-center space-y-4">
        <h1 className="text-3xl font-black tracking-tight">Alfabetiza AÍ</h1>
        
        {/* Profile Selector (Simulando o Banco de Dados) */}
        <div className="flex space-x-2 bg-white/30 p-1 rounded-full backdrop-blur-sm">
          {(["KIDS", "EJA", "PCD"] as Profile[]).map((p) => (
            <button
              key={p}
              onClick={() => setProfile(p)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                profile === p 
                  ? "bg-white shadow-sm scale-105" 
                  : "opacity-60 hover:opacity-100"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center w-full max-w-md">
        <VoiceRecorder profile={profile} />
      </div>

      <footer className="text-center text-sm opacity-50 pb-4">
        Powered by Gemini 1.5 Flash & Google Cloud TTS
      </footer>
    </main>
  );
}
