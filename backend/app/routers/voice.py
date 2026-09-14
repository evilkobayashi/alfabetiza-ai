import base64
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from app.services.voice_ai_service import process_audio_interaction

router = APIRouter(prefix="/api/voice", tags=["Alfabetiza AÍ - Voice"])

@router.post("/chat")
async def chat_voice(
    audio_file: UploadFile = File(...),
    profile: str = Form("KIDS") # KIDS, EJA, ou PCD
):
    """
    Recebe um áudio do frontend (ex: .webm do MediaRecorder), 
    processa com o Gemini 1.5 Flash e retorna o áudio TTS de resposta.
    """
    if profile not in ["KIDS", "EJA", "PCD"]:
        raise HTTPException(status_code=400, detail="Perfil inválido.")
        
    try:
        # Lê os bytes do áudio original
        audio_bytes = await audio_file.read()
        mime_type = audio_file.content_type or "audio/webm"
        
        # Chama a inteligência artificial
        resposta_texto, audio_out_bytes = await process_audio_interaction(
            audio_bytes, mime_type, profile
        )
        
        # Se falhou a geração do TTS por falta de credencial, o audio_out_bytes virá vazio
        audio_b64 = ""
        if audio_out_bytes:
            audio_b64 = base64.b64encode(audio_out_bytes).decode("utf-8")
            
        return {
            "profile": profile,
            "transcription_or_reasoning": resposta_texto,
            "audio_base64": audio_b64,
            "mime_type": "audio/mp3"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
