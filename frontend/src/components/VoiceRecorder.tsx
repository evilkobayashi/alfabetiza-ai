"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { Mic, Square, Loader2, Volume2 } from "lucide-react";

interface VoiceRecorderProps {
  profile: "KIDS" | "EJA" | "PCD";
  animationsEnabled?: boolean;
}

const SUGGESTIONS: Record<"KIDS" | "EJA" | "PCD", string[]> = {
  KIDS: ["Bola", "Gato", "Casa", "Sapo", "Escola", "Pipoca"],
  PCD: ["Casa", "Água", "Livro", "Mesa", "Escola", "Amigo"],
  EJA: ["Trabalho", "Saúde", "Mercado", "Ônibus", "Família", "Documento"],
};

export default function VoiceRecorder({ profile, animationsEnabled = true }: VoiceRecorderProps) {
  const { getToken } = useAuth();
  const [isStarting, setIsStarting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [transcription, setTranscription] = useState("");
  const [studentSaid, setStudentSaid] = useState("");
  const [contextHistory, setContextHistory] = useState("");
  const [isConversationMode, setIsConversationMode] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mimeTypeRef = useRef<string>("audio/webm");
  const audioContextRef = useRef<AudioContext | null>(null);
  const silenceStartRef = useRef<number | null>(null);
  const hasSpokenRef = useRef<boolean>(false);
  const rafRef = useRef<number | null>(null);
  const isHandsFreeRef = useRef<boolean>(false);
  // Limpeza ao desmontar componente
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    if (isStarting || isRecording || isProcessing) return;
    setIsStarting(true);
    setRecordingSeconds(0);
    setTranscription("");
    setStudentSaid("");
    hasSpokenRef.current = false;
    silenceStartRef.current = null;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;

      let chosenMime = "audio/webm";
      if (typeof MediaRecorder !== "undefined") {
        if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
          chosenMime = "audio/webm;codecs=opus";
        } else if (MediaRecorder.isTypeSupported("audio/webm")) {
          chosenMime = "audio/webm";
        } else if (MediaRecorder.isTypeSupported("audio/mp4")) {
          chosenMime = "audio/mp4";
        } else if (MediaRecorder.isTypeSupported("audio/ogg")) {
          chosenMime = "audio/ogg";
        }
      }
      mimeTypeRef.current = chosenMime;

      const mediaRecorder = new MediaRecorder(stream, chosenMime ? { mimeType: chosenMime } : undefined);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setIsProcessing(true);
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }

        const actualMime = mimeTypeRef.current.split(";")[0].trim() || "audio/webm";
        const audioBlob = new Blob(audioChunksRef.current, { type: actualMime });
        
        if (audioBlob.size < 350) {
          setTranscription("O áudio ficou muito curtinho ou sem som. Clique no microfone, fale com calma e clique para enviar!");
          setIsProcessing(false);
          return;
        }

        await sendAudioToBackend(audioBlob, actualMime);
      };

      mediaRecorder.start();
      setIsStarting(false);
      setIsRecording(true);

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);

      // --- VAD: Voice Activity Detection (Auto-stop) ---
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      const checkAudioLevel = () => {
        if (!mediaRecorderRef.current || mediaRecorderRef.current.state === "inactive") return;
        
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for(let i=0; i<dataArray.length; i++) sum += dataArray[i];
        const average = sum / dataArray.length;

        if (average > 15) {
          // Voz detectada
          hasSpokenRef.current = true;
          silenceStartRef.current = null;
        } else {
          // Silêncio
          if (!silenceStartRef.current) silenceStartRef.current = Date.now();
          
          // Se já falou e agora silenciou por 1.6s -> encerra e envia sem gravar ruído residual
          if (hasSpokenRef.current && Date.now() - silenceStartRef.current > 1600) {
            stopRecording();
            return;
          }
          // No modo mãos livres, se ainda nem falou após 7s de silêncio -> para para não prender
          if (isHandsFreeRef.current && !hasSpokenRef.current && Date.now() - silenceStartRef.current > 7000) {
            stopRecording();
            return;
          }
        }
        rafRef.current = requestAnimationFrame(checkAudioLevel);
      };
      
      checkAudioLevel();
      // ------------------------------------------------

    } catch (error) {
      console.error("Erro ao acessar microfone:", error);
      setIsStarting(false);
      alert("Permissão de microfone necessária para aprender a ler!");
    }
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current || mediaRecorderRef.current.state === "inactive") return;

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(()=>{});
      audioContextRef.current = null;
    }

    setIsRecording(false);

    try {
      mediaRecorderRef.current.stop();
    } catch {}
  };

  const sendAudioToBackend = async (audioBlob: Blob, actualMime: string) => {
    const ext = actualMime.includes("mp4")
      ? "mp4"
      : actualMime.includes("ogg")
      ? "ogg"
      : actualMime.includes("wav")
      ? "wav"
      : "webm";

    const formData = new FormData();
    formData.append("audio_file", audioBlob, `voice_input.${ext}`);
    formData.append("profile", profile);
    formData.append("last_ai_response", contextHistory);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://alfabetiza-ai-production.up.railway.app";
      const token = await getToken();
      const response = await fetch(`${API_URL}/api/voice/chat`, { method: "POST", body: formData, headers: { Authorization: `Bearer ${token}` } });

      if (!response.ok) {
        const errText = await response.text();
        console.error("Erro na API de Voz:", response.status, errText);
        if (response.status === 429) {
          setTranscription("Você já conversou bastante hoje! Volte amanhã para continuar aprendendo.");
          return;
        }
        throw new Error("Falha na API de Voz");
      }
      const data = await response.json();
      setTranscription(data.transcription_or_reasoning);
      if (data.student_transcription && !data.student_transcription.startsWith("[")) {
        setStudentSaid(data.student_transcription);
        const cleanWord = data.student_transcription.trim().replace(/[^a-zA-ZÀ-ÿ]/g, "");
        if (cleanWord.length >= 1) {
          fetch("/api/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              letra: cleanWord[0].toUpperCase(),
              silaba: cleanWord.slice(0, 2).toUpperCase(),
              palavraLida: cleanWord.length >= 3,
              minutos: 1,
            }),
          }).catch(() => {});
        }
      }
      
      // Mantém histórico recente limpo (no máximo 3 rodadas) para não poluir o raciocínio da IA
      setContextHistory(prev => {
        const turn = `Aluno: ${data.student_transcription || "..."}\nProfessor: ${data.transcription_or_reasoning}`;
        const lines = (prev ? `${prev}\n${turn}` : turn).split("\n").filter(Boolean);
        return lines.slice(-6).join("\n");
      });

      if (data.audio_base64) {
        const audioSrc = `data:${data.mime_type};base64,${data.audio_base64}`;
        const audioPlayer = new Audio(audioSrc);
        audioPlayer.onended = () => {
           if (isHandsFreeRef.current) {
              startRecording();
           }
        };
        audioPlayer.play().catch((err) => console.warn("Autoplay impedido:", err));
      } else {
        // Se a IA não retornou áudio (ex: erro silencioso)
        if (isHandsFreeRef.current) {
           setTimeout(() => startRecording(), 1000);
        }
      }
    } catch (error) {
      setTranscription("Ops! Tivemos um problema de conexão. Tente novamente.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Adaptação Visual do Botão baseado no Perfil
  const getButtonStyles = () => {
    if (profile === "KIDS") {
      if (isRecording) return "bg-red-500 scale-110 shadow-[0_0_40px_rgba(239,68,68,0.7)] animate-pulse ring-4 ring-red-300";
      if (isStarting || isProcessing) return "bg-blue-400 animate-bounce";
      return "bg-gradient-to-tr from-green-400 to-emerald-500 hover:scale-105 shadow-xl hover:shadow-green-400/50";
    }
    if (profile === "PCD") {
      if (isRecording) return "bg-red-500 ring-4 ring-red-200";
      if (isStarting || isProcessing) return "bg-blue-300 opacity-90";
      return "bg-teal-600 hover:bg-teal-700 opacity-90 transition-colors shadow-md";
    }
    if (profile === "EJA") {
      if (isRecording) return "bg-red-600 ring-4 ring-red-200 animate-pulse";
      if (isStarting || isProcessing) return "bg-slate-500";
      return "bg-slate-800 hover:bg-slate-700 transition-all shadow-md";
    }
    return "bg-slate-800";
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto space-y-8">
      
      {/* Botão de Gravação Principal */}
      <button 
        type="button"
        disabled={isProcessing || isStarting}
        onClick={() => {
          if (isRecording) {
            if (isConversationMode) {
              setIsConversationMode(false);
              isHandsFreeRef.current = false;
            }
            stopRecording();
          } else if (!isProcessing && !isStarting) {
            startRecording();
          }
        }}
        className={`w-32 h-32 md:w-40 md:h-40 rounded-full flex flex-col items-center justify-center transition-all duration-300 cursor-pointer ${getButtonStyles()}`}
      >
        {isRecording ? (
          <>
            <Square className="w-12 h-12 md:w-16 md:h-16 text-white fill-white mb-1" />
            <span className="text-white font-mono text-xs font-bold tracking-wider">
              {formatTimer(recordingSeconds)}
            </span>
          </>
        ) : isStarting ? (
          <Loader2 className="w-12 h-12 md:w-16 md:h-16 text-white animate-spin" />
        ) : isProcessing ? (
          <Loader2 className={`w-12 h-12 md:w-16 md:h-16 text-white ${animationsEnabled ? "animate-spin" : ""}`} />
        ) : (
          <Mic className="w-14 h-14 md:w-20 md:h-20 text-white" />
        )}
      </button>

      {/* Label Instrucional Adaptativo */}
      <div className="text-center px-4 space-y-1">
        <p className={`font-semibold ${
          profile === "PCD" ? "text-xl text-teal-900 tracking-wide" : 
          profile === "EJA" ? "text-xl text-slate-700 font-serif" : 
          "text-2xl text-sky-800 font-bold"
        }`}>
          {isStarting 
            ? "Ligando microfone..."
            : isRecording 
            ? isConversationMode
              ? "Pode falar agora! O microfone enviará automaticamente quando houver silêncio."
              : "Pode falar agora! Clique no botão quadrado para enviar."
            : isProcessing 
            ? "A IA está ouvindo sua voz..."
            : "Clique no microfone para falar"}
        </p>

        {/* Toggle HandsFree */}
        <button 
          onClick={() => {
             const newVal = !isConversationMode;
             setIsConversationMode(newVal);
             isHandsFreeRef.current = newVal;
             if (newVal && !isRecording && !isStarting && !isProcessing) {
                startRecording();
             }
          }}
          className={`px-4 py-2 mt-4 rounded-full font-bold text-sm transition-all border-2 ${isConversationMode ? 'bg-sky-100 border-sky-400 text-sky-700 shadow-inner' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}
        >
           {isConversationMode ? '🎙️ Modo Mãos Livres: ATIVADO' : 'Ativar Modo Mãos Livres (Automático)'}
        </button>

        {isRecording && (
          <p className="text-xs font-bold text-red-500 uppercase tracking-widest animate-pulse">
            ● Gravando ({formatTimer(recordingSeconds)})
          </p>
        )}
      </div>

      {/* Sugestões rápidas de palavras */}
      <div className="w-full text-center space-y-2">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Sugestões para falar no microfone:
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {SUGGESTIONS[profile].map((word) => (
            <button
              key={word}
              type="button"
              onClick={() => {
                setStudentSaid("");
                setContextHistory(`Professor: Vamos aprender a palavra ${word}! Diga ${word} no microfone.`);
                setTranscription(`Vamos praticar a palavra "${word.toUpperCase()}"! Clique no microfone e fale: ${word.toUpperCase()}.`);
              }}
              className="px-3.5 py-1.5 rounded-full text-xs md:text-sm font-bold bg-white/80 hover:bg-white text-slate-700 border border-slate-200 shadow-sm transition-all cursor-pointer active:scale-95"
            >
              {word}
            </button>
          ))}
          {contextHistory && (
            <button
              type="button"
              onClick={() => {
                setContextHistory("");
                setStudentSaid("");
                setTranscription("Conversa reiniciada! Clique no microfone e diga qualquer palavra que queira aprender.");
              }}
              className="px-3.5 py-1.5 rounded-full text-xs md:text-sm font-bold bg-amber-100 hover:bg-amber-200 text-amber-800 border border-amber-300 shadow-sm transition-all cursor-pointer"
            >
              🔄 Novo Tema
            </button>
          )}
        </div>
      </div>

      {/* Caixa de Transcrição / Resposta da IA */}
      {(studentSaid || transcription) && (
        <div className={`w-full p-6 rounded-3xl transition-opacity duration-500 ${
          profile === "KIDS" 
            ? "bg-white shadow-xl border-4 border-yellow-300 text-2xl font-bold text-sky-900" 
            : profile === "EJA"
            ? "bg-white border border-slate-300 text-xl text-slate-800 shadow-sm rounded-xl font-serif"
            : "bg-[#FDFBF7] border-2 border-teal-200 text-xl leading-loose tracking-wider text-slate-800 shadow-sm"
        }`}>
          {studentSaid && (
            <div className="mb-3 pb-3 border-b border-black/10 flex items-center gap-2 text-sm md:text-base font-semibold opacity-80">
              <span>🗣️ Você falou:</span>
              <span className="italic font-normal">"{studentSaid}"</span>
            </div>
          )}
          {transcription && (
            <div className="flex items-start gap-4">
              <Volume2 className={profile === "KIDS" ? "text-yellow-500 w-8 h-8 shrink-0 animate-pulse" : profile === "EJA" ? "text-slate-500 w-6 h-6 shrink-0" : "text-teal-600 w-6 h-6 shrink-0"} />
              <p className="whitespace-pre-line leading-relaxed">{transcription}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
