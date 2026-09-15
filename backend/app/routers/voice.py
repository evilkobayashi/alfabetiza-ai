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
        raw_mime = (audio_file.content_type or "audio/webm").split(";")[0].strip()
        
        # Detecção de mime type real por magic bytes
        mime_type = raw_mime
        if len(audio_bytes) >= 4:
            if audio_bytes[:4] == b"RIFF":
                mime_type = "audio/wav"
            elif audio_bytes[:4] == b"OggS":
                mime_type = "audio/ogg"
            elif audio_bytes[:4] == b"\x1aE\xdf\xa3":
                mime_type = "audio/webm"
            elif audio_bytes[:3] == b"ID3" or audio_bytes[:2] in (b"\xff\xfb", b"\xff\xf3", b"\xff\xf2"):
                mime_type = "audio/mp3"
            elif len(audio_bytes) >= 12 and audio_bytes[4:8] == b"ftyp":
                mime_type = "audio/mp4"

        import logging
        logging.getLogger(__name__).info(
            f"Recebido áudio: {len(audio_bytes)} bytes | filename={audio_file.filename} | raw_mime={raw_mime} | mime_detectado={mime_type} | perfil={profile}"
        )

        if len(audio_bytes) < 600:
            return {
                "profile": profile,
                "transcription_or_reasoning": "O áudio ficou muito curtinho ou sem som. Clique no microfone, fale com calma e clique para enviar!",
                "audio_base64": "",
                "mime_type": "audio/mp3"
            }
        
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
