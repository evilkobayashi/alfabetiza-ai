"use client";

import { useState, useEffect } from "react";
import { Mic, Square, Loader2, Volume2, ArrowRight, ArrowLeft, BookOpen, Star, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Mock data for the Syllabus / Lesson
const LESSON_DATA = {
  title: "Aventuras com a Letra G",
  module: "Módulo 2: Animais",
  pages: [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800",
      text: "O GATO",
      targetWord: "GATO",
      teacherAudioMock: "Veja a foto. Que animal é esse? Tente ler a palavra em voz alta: GATO.",
      type: "read"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1548247416-ec66f4900b2e?auto=format&fit=crop&q=80&w=800",
      text: "O GATO BEBE LEITE",
      targetWord: "LEITE",
      teacherAudioMock: "Muito bem! O gato gosta muito de uma bebida branca. Leia a frase completa comigo.",
      type: "sentence"
    }
  ]
};

export default function AulaInterativa() {
  const [currentPage, setCurrentPage] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [feedback, setFeedback] = useState<"none" | "success" | "retry">("none");
  const [score, setScore] = useState(0);

  const pageData = LESSON_DATA.pages[currentPage];

  // Simula a IA "falando" ao entrar na página
  useEffect(() => {
    setIsSpeaking(true);
    setFeedback("none");
    
    // Simulate audio duration
    const timer = setTimeout(() => {
      setIsSpeaking(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, [currentPage]);

  const simulateRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      // Simulate IA processing voice
      setTimeout(() => {
        setFeedback("success");
        setScore(prev => prev + 100);
        
        // IA congratulates
        setIsSpeaking(true);
        setTimeout(() => setIsSpeaking(false), 2000);
      }, 1000);
    } else {
      setIsRecording(true);
      setFeedback("none");
    }
  };

  const nextPage = () => {
    if (currentPage < LESSON_DATA.pages.length - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-sky-50 flex flex-col font-sans overflow-hidden">
      {/* Top Navbar / Progress */}
      <header className="bg-white px-6 py-4 shadow-sm flex items-center justify-between shrink-0 relative z-10">
        <div className="flex items-center gap-4">
          <button className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-bold text-slate-800 text-lg">{LESSON_DATA.title}</h1>
            <span className="text-xs font-bold text-sky-500 uppercase tracking-widest">{LESSON_DATA.module}</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-amber-100 px-4 py-2 rounded-full border border-amber-200">
            <Star className="text-amber-500 fill-amber-500" size={18} />
            <span className="font-black text-amber-700">{score} XP</span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-32 h-3 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-sky-500 rounded-full transition-all duration-500"
                style={{ width: `${((currentPage) / LESSON_DATA.pages.length) * 100}%` }}
              />
            </div>
            <span className="text-sm font-bold text-slate-400">{currentPage + 1}/{LESSON_DATA.pages.length}</span>
          </div>
        </div>
      </header>

      {/* Main Learning Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 relative">
        
        {/* Digital Book (Center Stage) */}
        <div className="lg:col-span-8 flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentPage}
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50, scale: 0.95 }}
              transition={{ duration: 0.4, type: "spring" }}
              className="bg-white rounded-[2.5rem] p-4 shadow-xl border-4 border-slate-100 flex-1 flex flex-col overflow-hidden relative"
            >
              {/* Image / Illustration */}
              <div className="w-full h-[40vh] md:h-[50vh] rounded-[2rem] overflow-hidden relative bg-slate-100">
                <img 
                  src={pageData.image} 
                  alt="Ilustração do Livro" 
                  className="w-full h-full object-cover"
                />
                
                {/* Visual Feedback Overlays */}
                <AnimatePresence>
                  {feedback === "success" && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-green-500/20 backdrop-blur-sm flex items-center justify-center z-20"
                    >
                      <motion.div 
                        initial={{ y: 20 }}
                        animate={{ y: 0 }}
                        className="bg-white px-8 py-6 rounded-3xl shadow-2xl flex flex-col items-center"
                      >
                        <Trophy className="text-yellow-500 fill-yellow-400 w-24 h-24 mb-4" />
                        <span className="text-3xl font-black text-green-600">Perfeito!</span>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Text to Read */}
              <div className="flex-1 flex items-center justify-center p-8">
                <h2 className="text-4xl md:text-6xl font-black text-slate-800 text-center tracking-tight leading-tight">
                  {pageData.text.split(' ').map((word, i) => (
                    <span 
                      key={i} 
                      className={`inline-block mx-2 ${
                        word === pageData.targetWord 
                          ? feedback === "success" 
                            ? "text-green-500" 
                            : "text-sky-500 underline decoration-sky-300 decoration-4 underline-offset-8"
                          : ""
                      }`}
                    >
                      {word}
                    </span>
                  ))}
                </h2>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* AI Tutor / Mascot Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Mascot / Avatar Area */}
          <div className="bg-white rounded-[2.5rem] p-6 shadow-lg border-4 border-slate-100 flex-1 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Pulsing background when speaking */}
            <AnimatePresence>
              {isSpeaking && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1.2 }}
                  exit={{ opacity: 0 }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className="absolute inset-0 bg-sky-100 rounded-full blur-3xl -z-10"
                />
              )}
            </AnimatePresence>

            {/* Simple CSS Mascot Avatar */}
            <motion.div 
              animate={{ 
                y: isSpeaking ? [0, -10, 0] : 0,
                rotate: isSpeaking ? [0, 5, -5, 0] : 0
              }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-48 h-48 rounded-full border-8 border-sky-400 bg-sky-200 flex items-center justify-center relative shadow-inner mb-6"
            >
              {/* Eyes */}
              <div className="absolute top-12 left-10 w-8 h-8 bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  animate={{ y: [0, 8, 0] }} 
                  transition={{ repeat: Infinity, duration: 4, times: [0, 0.1, 0.2] }}
                  className="w-full h-full bg-sky-200 absolute -top-8" 
                />
                <div className="w-3 h-3 bg-white rounded-full absolute top-1 right-1" />
              </div>
              <div className="absolute top-12 right-10 w-8 h-8 bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  animate={{ y: [0, 8, 0] }} 
                  transition={{ repeat: Infinity, duration: 4, times: [0, 0.1, 0.2] }}
                  className="w-full h-full bg-sky-200 absolute -top-8" 
                />
                <div className="w-3 h-3 bg-white rounded-full absolute top-1 left-1" />
              </div>

              {/* Mouth */}
              <motion.div 
                animate={
                  isSpeaking 
                    ? { height: [12, 32, 16, 40, 12], width: [32, 28, 36, 24, 32], borderRadius: ["16px", "24px", "16px"] }
                    : feedback === "success" 
                      ? { height: 24, width: 48, borderRadius: "0 0 24px 24px" }
                      : { height: 12, width: 32, borderRadius: "16px" }
                }
                transition={isSpeaking ? { repeat: Infinity, duration: 0.6 } : {}}
                className="absolute bottom-12 w-8 h-3 bg-rose-500 rounded-full shadow-inner overflow-hidden"
              >
                {isSpeaking && <div className="absolute bottom-0 w-full h-1/2 bg-rose-700 rounded-t-full" />}
              </motion.div>
            </motion.div>

            {/* Speech Bubble */}
            <AnimatePresence mode="wait">
              <motion.div 
                key={pageData.teacherAudioMock}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-slate-800 text-white p-5 rounded-3xl rounded-tl-none relative shadow-xl text-center"
              >
                <p className="font-medium text-lg leading-relaxed">"{pageData.teacherAudioMock}"</p>
                {isSpeaking && (
                  <div className="absolute -top-3 -right-3 bg-sky-500 w-8 h-8 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                    <Volume2 size={16} className="text-white" />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-[2.5rem] p-6 shadow-lg border-4 border-slate-100 flex flex-col items-center justify-center gap-4 shrink-0">
            {feedback === "success" ? (
              <motion.button
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                onClick={nextPage}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-black text-xl py-6 rounded-3xl shadow-[0_8px_0_rgb(21,128,61)] active:translate-y-2 active:shadow-none transition-all flex items-center justify-center gap-3"
              >
                Avançar <ArrowRight size={28} />
              </motion.button>
            ) : (
              <button
                onClick={simulateRecording}
                className={`w-full font-black text-xl py-6 rounded-3xl transition-all flex flex-col items-center justify-center gap-2 relative overflow-hidden ${
                  isRecording 
                    ? 'bg-rose-500 text-white shadow-none translate-y-2' 
                    : 'bg-sky-500 hover:bg-sky-400 text-white shadow-[0_8px_0_rgb(2,132,199)] active:translate-y-2 active:shadow-none'
                }`}
              >
                {isRecording ? (
                  <>
                    <motion.div 
                      animate={{ scale: [1, 1.5, 1] }} 
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="absolute inset-0 bg-rose-600 rounded-3xl -z-10"
                    />
                    <Square size={32} className="fill-white" />
                    <span>Parar e Enviar</span>
                  </>
                ) : (
                  <>
                    <Mic size={36} className="" />
                    <span>Aperte para Falar</span>
                  </>
                )}
              </button>
            )}
            
            {!isRecording && feedback !== "success" && (
              <p className="text-slate-400 text-sm font-bold text-center mt-2">
                O professor está aguardando você tentar!
              </p>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
