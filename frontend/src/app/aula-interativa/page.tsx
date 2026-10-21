"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { Mic, Square, Loader2, Volume2, ArrowRight, ArrowLeft, BookOpen, Star, Trophy, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LessonPage {
  id: number;
  module: string;
  title: string;
  image: string;
  text: string;
  targetWord: string;
  syllables: string;
  teacherAudioMock: string;
  type: "read" | "sentence";
}

const LESSON_PAGES: LessonPage[] = [
  {
    id: 1,
    module: "Módulo 1: Vogais e Sons",
    title: "A Letra A da Abelha",
    image: "https://images.unsplash.com/photo-1587049352847-4a222e784d38?auto=format&fit=crop&q=80&w=800",
    text: "A ABELHA",
    targetWord: "ABELHA",
    syllables: "A - BE - LHA",
    teacherAudioMock: "Veja a abelha na flor! Ela começa com a vogal A. Fale em voz alta: ABELHA.",
    type: "read"
  },
  {
    id: 2,
    module: "Módulo 1: Vogais e Sons",
    title: "A Bola Colorida",
    image: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?auto=format&fit=crop&q=80&w=800",
    text: "A BOLA",
    targetWord: "BOLA",
    syllables: "BO - LA",
    teacherAudioMock: "Olhe a bola no campo! Vamos juntar BO com LA. Diga em voz alta: BOLA.",
    type: "read"
  },
  {
    id: 3,
    module: "Módulo 2: Animais",
    title: "Aventuras com a Letra G",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=800",
    text: "O GATO",
    targetWord: "GATO",
    syllables: "GA - TO",
    teacherAudioMock: "Veja a foto. Que animal é esse? Tente ler a palavra em voz alta: GATO.",
    type: "read"
  },
  {
    id: 4,
    module: "Módulo 2: Animais",
    title: "Aventuras com a Letra G",
    image: "https://images.unsplash.com/photo-1548247416-ec66f4900b2e?auto=format&fit=crop&q=80&w=800",
    text: "O GATO BEBE LEITE",
    targetWord: "LEITE",
    syllables: "LEI - TE",
    teacherAudioMock: "Muito bem! O gato gosta muito de uma bebida branca. Leia a palavra destacada: LEITE.",
    type: "sentence"
  },
  {
    id: 5,
    module: "Módulo 2: Animais",
    title: "O Pato na Lagoa",
    image: "https://images.unsplash.com/photo-1555852095-64e7428df0fa?auto=format&fit=crop&q=80&w=800",
    text: "O PATO NADA",
    targetWord: "PATO",
    syllables: "PA - TO",
    teacherAudioMock: "Quem está nadando na água? É o pato! Junte PA com TO e fale: PATO.",
    type: "read"
  },
  {
    id: 6,
    module: "Módulo 2: Animais",
    title: "O Cachorro Amigo",
    image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=800",
    text: "O CACHORRO",
    targetWord: "CACHORRO",
    syllables: "CA - CHOR - RO",
    teacherAudioMock: "Que amigo fiel! Vamos falar o nome dele em voz alta: CACHORRO.",
    type: "read"
  },
  {
    id: 7,
    module: "Módulo 3: Cotidiano e Casa",
    title: "Nossa Moradia",
    image: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80&w=800",
    text: "A CASA BONITA",
    targetWord: "CASA",
    syllables: "CA - SA",
    teacherAudioMock: "Onde nós moramos com nossa família? Na casa! Diga em voz alta: CASA.",
    type: "read"
  },
  {
    id: 8,
    module: "Módulo 3: Cotidiano e Casa",
    title: "Hora de Aprender",
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800",
    text: "EU VOU PARA A ESCOLA",
    targetWord: "ESCOLA",
    syllables: "ES - CO - LA",
    teacherAudioMock: "Lugar de aprender e fazer amigos! Leia a palavra destacada: ESCOLA.",
    type: "sentence"
  },
  {
    id: 9,
    module: "Módulo 4: Pequenas Frases",
    title: "Dia Ensolarado",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800",
    text: "O SOL BRILHA NO CÉU",
    targetWord: "SOL",
    syllables: "SOL",
    teacherAudioMock: "Olhe que dia lindo! Quem está brilhando lá no alto? Diga em voz alta: SOL.",
    type: "sentence"
  },
  {
    id: 10,
    module: "Módulo 4: Pequenas Frases",
    title: "Amor pela Leitura",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=800",
    text: "EU GOSTO DE LER LIVROS",
    targetWord: "LIVROS",
    syllables: "LI - VROS",
    teacherAudioMock: "Você está lendo cada vez melhor! Para fechar com chave de ouro, diga: LIVROS.",
    type: "sentence"
  }
];

function normalizePt(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9\s]/g, "")
    .trim();
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

function phoneticMatch(spokenRaw: string, targetRaw: string): boolean {
  const spoken = normalizePt(spokenRaw);
  const target = normalizePt(targetRaw);
  if (!spoken || !target) return false;

  const phoneticNormalize = (w: string) =>
    w
      .replace(/S$/, "")
      .replace(/U$/, "O")
      .replace(/I$/, "E")
      .replace(/LH/g, "LI")
      .replace(/RR/g, "R")
      .replace(/SS/g, "S")
      .replace(/C([EI])/g, "S$1");

  const normTarget = phoneticNormalize(target);
  const words = spoken.split(/\s+/).filter(Boolean);

  // Verifica também a junção de sílabas caso o aluno tenha falado pausado (ex: "GA TO" -> "GATO")
  const joinedSpoken = phoneticNormalize(words.join(""));
  if (joinedSpoken === normTarget) return true;

  for (const w of words) {
    const nw = phoneticNormalize(w);
    if (nw === normTarget) return true;
    if (normTarget.length >= 4 && nw.length >= 3 && levenshtein(nw, normTarget) <= 1) {
      return true;
    }
  }
  return false;
}

export default function AulaInterativa() {
  const { getToken } = useAuth();
  const [currentPage, setCurrentPage] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [feedback, setFeedback] = useState<"none" | "success" | "retry">("none");
  const [score, setScore] = useState(0);
  const [studentSaid, setStudentSaid] = useState<string>("");
  const [teacherMessage, setTeacherMessage] = useState<string>("");

  const pageData = LESSON_PAGES[currentPage];
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const rafRef = useRef<number | null>(null);
  const handledRef = useRef<boolean>(false);

  const speakText = (text: string, onEnd?: () => void) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "pt-BR";
      utterance.rate = 0.92;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        if (onEnd) onEnd();
      };
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setIsSpeaking(true);
      setTimeout(() => {
        setIsSpeaking(false);
        if (onEnd) onEnd();
      }, 2500);
    }
  };

  useEffect(() => {
    setFeedback("none");
    setStudentSaid("");
    setTeacherMessage(pageData.teacherAudioMock);
    speakText(pageData.teacherAudioMock);

    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close().catch(() => {});
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [currentPage]);

  const saveProgress = async (word: string) => {
    try {
      const letra = word[0].toUpperCase();
      const silaba = word.slice(0, 2).toUpperCase();
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          letra,
          silaba,
          palavraLida: true,
          minutos: 1
        })
      });
    } catch (e) {
      console.warn("Progresso salvo localmente:", e);
    }
  };

  const handleSpeechResult = (transcript: string) => {
    if (handledRef.current) return;
    handledRef.current = true;
    setIsRecording(false);
    setIsProcessing(false);

    const clean = transcript.trim().toUpperCase();
    setStudentSaid(clean || "...");

    const target = pageData.targetWord.toUpperCase();
    const isMatch = phoneticMatch(clean, target);

    if (isMatch) {
      setFeedback("success");
      setScore(prev => prev + 100);
      setTeacherMessage(`Incrível! Você leu perfeitamente: ${target} (${pageData.syllables})! Clique em Avançar.`);
      speakText(`Incrível! Você leu perfeitamente: ${target}! Muito bem!`);
      saveProgress(target);
    } else {
      setFeedback("retry");
      const heardMsg = clean ? `Eu ouvi "${clean}". ` : "O som ficou baixinho. ";
      setTeacherMessage(`${heardMsg}Vamos tentar de novo? Fale apenas a palavra destacada: ${target} (${pageData.syllables}).`);
      speakText(`Quase lá! Fale comigo: ${pageData.syllables}. ${target}!`);
    }
  };

  const stopAllCapture = () => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try { mediaRecorderRef.current.stop(); } catch {}
    }
  };

  const toggleRecording = async () => {
    if (isRecording) {
      setIsRecording(false);
      setIsProcessing(true);
      stopAllCapture();
      return;
    }

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    setFeedback("none");
    setStudentSaid("");
    handledRef.current = false;

    // Pequena pausa para garantir que o áudio do professor parou de sair na caixa de som
    await new Promise((r) => setTimeout(r, 150));

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
      streamRef.current = stream;

      let chosenMime = "audio/webm";
      if (typeof MediaRecorder !== "undefined") {
        if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) chosenMime = "audio/webm;codecs=opus";
        else if (MediaRecorder.isTypeSupported("audio/mp4")) chosenMime = "audio/mp4";
        else if (MediaRecorder.isTypeSupported("audio/ogg")) chosenMime = "audio/ogg";
      }

      const mr = new MediaRecorder(stream, { mimeType: chosenMime });
      mediaRecorderRef.current = mr;
      audioChunksRef.current = [];

      mr.ondataavailable = (ev) => {
        if (ev.data && ev.data.size > 0) audioChunksRef.current.push(ev.data);
      };

      mr.onstop = async () => {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((t) => t.stop());
          streamRef.current = null;
        }
        if (handledRef.current) return;

        const actualMime = chosenMime.split(";")[0].trim() || "audio/webm";
        const blob = new Blob(audioChunksRef.current, { type: actualMime });
        if (blob.size < 350) {
          handleSpeechResult("");
          return;
        }

        try {
          setIsProcessing(true);
          const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://alfabetiza-ai-production.up.railway.app";
          const token = await getToken();
          const formData = new FormData();
          const ext = actualMime.includes("mp4") ? "mp4" : actualMime.includes("ogg") ? "ogg" : "webm";
          formData.append("audio_file", blob, `lesson.${ext}`);
          formData.append("target_hint", pageData.targetWord);

          const res = await fetch(`${API_URL}/api/voice/transcribe`, {
            method: "POST",
            body: formData,
            headers: { Authorization: `Bearer ${token}` },
          });

          if (res.ok) {
            const data = await res.json();
            handleSpeechResult(data.text || "");
            return;
          }
        } catch (err) {
          console.warn("Erro na transcrição:", err);
        }

        handleSpeechResult("");
      };

      mr.start();
      setIsRecording(true);

      // VAD: Detecta início da fala e encerra automaticamente após 1.4s de silêncio pós-fala
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      let hasSpoken = false;
      let silenceStart: number | null = null;
      const recordStart = Date.now();

      const checkLevel = () => {
        if (!mediaRecorderRef.current || mediaRecorderRef.current.state === "inactive") return;
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
        const avg = sum / dataArray.length;

        if (avg > 16) {
          hasSpoken = true;
          silenceStart = null;
        } else if (hasSpoken) {
          if (!silenceStart) silenceStart = Date.now();
          if (Date.now() - silenceStart > 1400) {
            setIsRecording(false);
            setIsProcessing(true);
            stopAllCapture();
            return;
          }
        } else if (Date.now() - recordStart > 8000) {
          setIsRecording(false);
          setIsProcessing(true);
          stopAllCapture();
          return;
        }
        rafRef.current = requestAnimationFrame(checkLevel);
      };
      checkLevel();
    } catch (err) {
      console.error("Erro ao acessar microfone:", err);
      alert("Permissão de microfone necessária para praticar a leitura!");
    }
  };

  const nextPage = () => {
    if (currentPage < LESSON_PAGES.length - 1) {
      setCurrentPage(prev => prev + 1);
    } else {
      setCurrentPage(0);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };


  return (
    <div className="min-h-screen bg-sky-50 flex flex-col font-sans overflow-hidden">
      {/* Top Navbar / Progress */}
      <header className="bg-white px-6 py-4 shadow-sm flex items-center justify-between shrink-0 relative z-10">
        <div className="flex items-center gap-4">
          <Link 
            href="/sala" 
            className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
            title="Voltar para a Sala"
          >
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="font-bold text-slate-800 text-lg">{pageData.title}</h1>
            <span className="text-xs font-bold text-sky-500 uppercase tracking-widest">{pageData.module}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 md:gap-6">
          <div className="flex items-center gap-2 bg-amber-100 px-4 py-2 rounded-full border border-amber-200">
            <Star className="text-amber-500 fill-amber-500" size={18} />
            <span className="font-black text-amber-700">{score} XP</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prevPage}
              disabled={currentPage === 0}
              className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-600 transition-colors cursor-pointer"
              title="Lição anterior"
            >
              <ArrowLeft size={16} />
            </button>
            <div className="w-24 md:w-32 h-3 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-sky-500 rounded-full transition-all duration-500"
                style={{ width: `${((currentPage + 1) / LESSON_PAGES.length) * 100}%` }}
              />
            </div>
            <span className="text-sm font-bold text-slate-500">{currentPage + 1}/{LESSON_PAGES.length}</span>
            <button
              type="button"
              onClick={nextPage}
              className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              title="Próxima lição"
            >
              <ArrowRight size={16} />
            </button>
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
              <div className="w-full h-[38vh] md:h-[46vh] rounded-[2rem] overflow-hidden relative bg-slate-100">
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

              {/* Text to Read & Syllables */}
              <div className="flex-1 flex flex-col items-center justify-center p-6 gap-4">
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

                <button
                  type="button"
                  onClick={() => speakText(`${pageData.syllables.replace(/-/g, "... ")}. ${pageData.targetWord}!`)}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 font-black text-lg transition-all cursor-pointer active:scale-95"
                >
                  <Volume2 size={20} className="text-sky-500" />
                  <span>Sílabas: {pageData.syllables}</span>
                </button>
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
              className="w-40 h-40 md:w-48 md:h-48 rounded-full border-8 border-sky-400 bg-sky-200 flex items-center justify-center relative shadow-inner mb-6"
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
                key={teacherMessage || pageData.teacherAudioMock}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-slate-800 text-white p-5 rounded-3xl rounded-tl-none relative shadow-xl text-center"
              >
                <p className="font-medium text-lg leading-relaxed">"{teacherMessage || pageData.teacherAudioMock}"</p>
                {isSpeaking && (
                  <div className="absolute -top-3 -right-3 bg-sky-500 w-8 h-8 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                    <Volume2 size={16} className="text-white" />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {studentSaid && (
              <div className="mt-3 bg-slate-100 border border-slate-200 px-4 py-2 rounded-2xl text-center">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Você falou:</span>
                <span className="text-base font-black text-slate-800">{studentSaid}</span>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="bg-white rounded-[2.5rem] p-6 shadow-lg border-4 border-slate-100 flex flex-col items-center justify-center gap-3 shrink-0">
            {feedback === "success" ? (
              <motion.button
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                onClick={nextPage}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-black text-xl py-6 rounded-3xl shadow-[0_8px_0_rgb(21,128,61)] active:translate-y-2 active:shadow-none transition-all flex items-center justify-center gap-3 cursor-pointer"
              >
                {currentPage < LESSON_PAGES.length - 1 ? "Próxima Palavra" : "Recomeçar Livro"} <ArrowRight size={28} />
              </motion.button>
            ) : (
              <button
                onClick={toggleRecording}
                disabled={isProcessing}
                className={`w-full font-black text-xl py-6 rounded-3xl transition-all flex flex-col items-center justify-center gap-2 relative overflow-hidden cursor-pointer ${
                  isProcessing
                    ? 'bg-amber-500 text-white'
                    : isRecording 
                    ? 'bg-rose-500 text-white shadow-none translate-y-2' 
                    : 'bg-sky-500 hover:bg-sky-400 text-white shadow-[0_8px_0_rgb(2,132,199)] active:translate-y-2 active:shadow-none'
                }`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={32} className="animate-spin" />
                    <span>Avaliando sua voz...</span>
                  </>
                ) : isRecording ? (
                  <>
                    <motion.div 
                      animate={{ scale: [1, 1.5, 1] }} 
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="absolute inset-0 bg-rose-600 rounded-3xl -z-10"
                    />
                    <Square size={32} className="fill-white" />
                    <span>Ouvindo... Clique para Enviar</span>
                  </>
                ) : (
                  <>
                    <Mic size={36} className="" />
                    <span>Aperte para Falar</span>
                  </>
                )}
              </button>
            )}
            
            {feedback === "retry" && !isRecording && !isProcessing && (
              <button
                type="button"
                onClick={nextPage}
                className="text-sky-600 hover:text-sky-800 text-sm font-bold underline cursor-pointer mt-1"
              >
                Pular para a próxima palavra →
              </button>
            )}

            {!isRecording && !isProcessing && feedback === "none" && (
              <p className="text-slate-400 text-sm font-bold text-center mt-1">
                Fale a palavra sublinhada e clique para enviar!
              </p>
            )}
          </div>
        </div>

      </main>
    </div>
  );
}
