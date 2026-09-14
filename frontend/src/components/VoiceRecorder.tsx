"use client";

import { useState, useRef } from "react";

interface VoiceRecorderProps {
  profile: "KIDS" | "EJA" | "PCD";
}

export default function VoiceRecorder({ profile }: VoiceRecorderProps) {
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
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setIsProcessing(true);
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        await sendAudioToBackend(audioBlob);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Erro ao acessar microfone:", error);
      alert("Permissão de microfone necessária.");
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
      // Usar a URL do Backend local (Railway local ou uvicorn)
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      
      const response = await fetch(`${API_URL}/api/voice/chat`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Falha na API de Voz");

      const data = await response.json();
      setTranscription(data.transcription_or_reasoning);

      if (data.audio_base64) {
        // Toca o áudio retornado pelo Google Cloud TTS
        const audioSrc = `data:${data.mime_type};base64,${data.audio_base64}`;
        const audioPlayer = new Audio(audioSrc);
        audioPlayer.play();
      }
    } catch (error) {
      console.error("Erro no envio:", error);
      setTranscription("Ops! Tivemos um problema na conexão.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-8">
      {/* Visual Feedback area */}
      <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${
        isRecording ? "bg-red-500 animate-pulse scale-110 shadow-lg shadow-red-500/50" : 
        isProcessing ? "bg-blue-500 animate-bounce shadow-lg shadow-blue-500/50" : 
        "bg-green-500 hover:bg-green-400 hover:scale-105 cursor-pointer shadow-lg shadow-green-500/30"
      }`}
      onMouseDown={isRecording ? stopRecording : startRecording}
      onMouseUp={stopRecording}
      onTouchStart={isRecording ? stopRecording : startRecording}
      onTouchEnd={stopRecording}
      >
        <span className="text-white text-5xl">
          {isRecording ? "🎙️" : isProcessing ? "🧠" : "🎤"}
        </span>
      </div>

      <p className="text-gray-500 font-medium text-center">
        {isRecording ? "Segure para falar, solte para enviar..." : 
         isProcessing ? "A IA está pensando..." : 
         "Pressione e segure o microfone para falar com o tutor"}
      </p>

      {transcription && (
        <div className="max-w-md w-full bg-white/50 backdrop-blur-md p-4 rounded-xl border border-gray-100 shadow-sm mt-8 text-center">
          <p className="text-gray-800 text-lg">{transcription}</p>
        </div>
      )}
    </div>
  );
}
