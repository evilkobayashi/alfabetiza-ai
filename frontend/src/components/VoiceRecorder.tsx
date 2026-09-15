"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Square, Loader2, Volume2 } from "lucide-react";

interface VoiceRecorderProps {
  profile: "KIDS" | "EJA" | "PCD";
  animationsEnabled?: boolean;
}

export default function VoiceRecorder({ profile, animationsEnabled = true }: VoiceRecorderProps) {
  const [isStarting, setIsStarting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [transcription, setTranscription] = useState("");
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const mimeTypeRef = useRef<string>("audio/webm");

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
        const actualMime = mimeTypeRef.current.split(";")[0].trim() || "audio/webm";
        const audioBlob = new Blob(audioChunksRef.current, { type: actualMime });
        
        if (audioBlob.size < 800) {
          setTranscription("O áudio ficou muito curtinho ou sem som. Clique no microfone, fale com calma e clique para enviar!");
          setIsProcessing(false);
          return;
        }

        await sendAudioToBackend(audioBlob, actualMime);
      };

      mediaRecorder.start(250);
      setIsStarting(false);
      setIsRecording(true);

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);

    } catch (error) {
      console.error("Erro ao acessar microfone:", error);
      setIsStarting(false);
      alert("Permissão de microfone necessária para aprender a ler!");
    }
  };

  const stopRecording = () => {
    if (!mediaRecorderRef.current || !isRecording) return;

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    setIsRecording(false);

    // Garante que o gravador recolha os últimos milissegundos de fala
    setTimeout(() => {
      try {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
          mediaRecorderRef.current.stop();
        }
      } catch {}

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    }, 350);
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

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://alfabetiza-ai-production.up.railway.app";
      const response = await fetch(`${API_URL}/api/voice/chat`, { method: "POST", body: formData });

      if (!response.ok) {
        const errText = await response.text();
        console.error("Erro na API de Voz:", response.status, errText);
        throw new Error("Falha na API de Voz");
      }
      const data = await response.json();
      setTranscription(data.transcription_or_reasoning);

      if (data.audio_base64) {
        const audioSrc = `data:${data.mime_type};base64,${data.audio_base64}`;
        const audioPlayer = new Audio(audioSrc);
        audioPlayer.play().catch((err) => console.warn("Autoplay impedido pelo navegador:", err));
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
            ? "Pode falar agora! Clique no botão quando terminar."
            : isProcessing 
            ? "A IA está ouvindo sua voz..."
            : "Clique no microfone para falar"}
        </p>

        {isRecording && (
          <p className="text-xs font-bold text-red-500 uppercase tracking-widest animate-pulse">
            ● Gravando ({formatTimer(recordingSeconds)})
          </p>
        )}
      </div>

      {/* Caixa de Transcrição / Resposta da IA */}
      {transcription && (
        <div className={`w-full p-6 rounded-3xl transition-opacity duration-500 ${
          profile === "KIDS" 
            ? "bg-white shadow-xl border-4 border-yellow-300 text-2xl font-bold text-sky-900" 
            : profile === "EJA"
            ? "bg-white border border-slate-300 text-xl text-slate-800 shadow-sm rounded-xl font-serif"
            : "bg-[#FDFBF7] border-2 border-teal-200 text-xl leading-loose tracking-wider text-slate-800 shadow-sm"
        }`}>
          <div className="flex items-start gap-4">
            <Volume2 className={profile === "KIDS" ? "text-yellow-500 w-8 h-8 shrink-0 animate-pulse" : profile === "EJA" ? "text-slate-500 w-6 h-6 shrink-0" : "text-teal-600 w-6 h-6 shrink-0"} />
            <p className="whitespace-pre-line leading-relaxed">{transcription}</p>
          </div>
        </div>
      )}
    </div>
  );
}
