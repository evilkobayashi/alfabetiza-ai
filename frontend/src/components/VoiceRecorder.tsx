"use client";

import { useState, useRef } from "react";
import { Mic, Square, Loader2, Volume2 } from "lucide-react";

interface VoiceRecorderProps {
  profile: "KIDS" | "EJA" | "PCD";
  animationsEnabled?: boolean;
}

export default function VoiceRecorder({ profile, animationsEnabled = true }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState("");
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        setIsProcessing(true);
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        await sendAudioToBackend(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Erro ao acessar microfone:", error);
      alert("Permissão de microfone necessária para aprender a ler!");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendAudioToBackend = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append("audio_file", audioBlob, "voice_input.webm");
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
        audioPlayer.play();
      }
    } catch (error) {
      setTranscription("Ops! Tivemos um problema de conexão.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Adaptação Visual do Botão baseado no Perfil
  const getButtonStyles = () => {
    if (profile === "KIDS") {
      if (isRecording) return "bg-red-500 scale-110 shadow-[0_0_40px_rgba(239,68,68,0.6)] animate-pulse";
      if (isProcessing) return "bg-blue-400 animate-bounce";
      return "bg-gradient-to-tr from-green-400 to-emerald-500 hover:scale-105 shadow-xl hover:shadow-green-400/50";
    }
    if (profile === "PCD") {
      // Sem animações bruscas, cores sólidas de baixo contraste
      if (isRecording) return "bg-red-400 opacity-90";
      if (isProcessing) return "bg-blue-300 opacity-90";
      return "bg-teal-600 hover:bg-teal-700 opacity-90 transition-colors";
    }
    if (profile === "EJA") {
      // Estilo sério, cores sóbrias (Slate/Blue escuro), sem gradientes
      if (isRecording) return "bg-red-600 ring-4 ring-red-200";
      if (isProcessing) return "bg-slate-500";
      return "bg-slate-800 hover:bg-slate-700 transition-all shadow-md";
    }
    return "bg-slate-800"; // Fallback
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto space-y-8">
      
      {/* Botão de Gravação Principal */}
      <button 
        className={`w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center transition-all duration-300 ${getButtonStyles()}`}
        onMouseDown={isRecording ? stopRecording : startRecording}
        onMouseUp={stopRecording}
        onTouchStart={isRecording ? stopRecording : startRecording}
        onTouchEnd={stopRecording}
      >
        {isRecording ? (
          <Square className="w-12 h-12 md:w-16 md:h-16 text-white fill-white" />
        ) : isProcessing ? (
          <Loader2 className={`w-12 h-12 md:w-16 md:h-16 text-white ${animationsEnabled ? "animate-spin" : ""}`} />
        ) : (
          <Mic className="w-14 h-14 md:w-20 md:h-20 text-white" />
        )}
      </button>

      {/* Label Instrucional Adaptativo */}
      <p className={`font-semibold text-center px-4 ${
        profile === "PCD" ? "text-xl text-teal-900 tracking-wide" : 
        profile === "EJA" ? "text-xl text-slate-600" : 
        "text-2xl text-sky-800"
      }`}>
        {isRecording 
          ? (profile === "PCD" ? "Gravando... Pode falar." : profile === "EJA" ? "Gravando. Fale pausadamente." : "Tô te ouvindo! 👂") 
          : isProcessing 
          ? (profile === "PCD" ? "Processando resposta..." : profile === "EJA" ? "Processando o áudio..." : "A IA tá pensando! 🧠") 
          : (profile === "PCD" ? "Aperte o botão para falar" : profile === "EJA" ? "Pressione para ditar" : "Aperte o microfone para brincar!")}
      </p>

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
            <p>{transcription}</p>
          </div>
        </div>
      )}
    </div>
  );
}
