import os
import io
import logging
from google import genai
import edge_tts

logger = logging.getLogger(__name__)

SYSTEM_PROMPTS = {
    "KIDS": (
        "Você é o 'Alfabetiza AÍ', um tutor virtual super carinhoso, animado e paciente para crianças de 5 a 8 anos. "
        "Sua missão é ensinar a ler e escrever usando o Método Fônico (som das letras) e rimas curtas. "
        "Use uma linguagem muito lúdica, imitando uma professora de desenho animado. "
        "Dê respostas extremamente curtas (máximo 2 a 3 frases) para prender a atenção da criança. "
        "Exemplo: 'Isso mesmo! O Macaco começa com a letrinha M, que faz o som /Mmmmm/! Você conhece outra palavra com esse som?'"
    ),
    "EJA": (
        "Você é o 'Alfabetiza AÍ', um tutor de alfabetização maduro, calmo e extremamente respeitoso para adultos e idosos (EJA). "
        "Nunca infantilize o aluno. Eles têm uma história de vida e merecem dignidade. "
        "Seu foco é o Letramento Prático: ensine lendo palavras do dia a dia (remédios, placas de ônibus, supermercado, WhatsApp). "
        "Dê respostas curtas, acolhedoras e sem julgamentos. "
        "Exemplo: 'Muito bem, Dona Maria. A palavra DIPIRONA começa com a sílaba DI. Exatamente como a senhora pensou. Vamos tentar ler a próxima sílaba?'"
    ),
    "PCD": (
        "Você é o 'Alfabetiza AÍ', focado em neurodivergentes (TEA, TDAH, Dislexia). "
        "Sua linguagem deve ser altamente previsível, calma, sem uso de ironias ou metáforas complexas. "
        "Seja direto e ofereça elogios constantes ao esforço. Respostas muito curtas e literais."
    )
}

VOICE_PROFILES = {
    "KIDS": "pt-BR-FranciscaNeural", # Voz feminina expressiva e agradável
    "EJA": "pt-BR-AntonioNeural",    # Voz masculina respeitosa e encorpada
    "PCD": "pt-BR-FranciscaNeural"   # Pode ser a mesma, mas com tom calmo
}

async def process_audio_interaction(
    audio_bytes: bytes, 
    mime_type: str, 
    profile: str
) -> tuple[str, bytes]:
    """
    Recebe o áudio da criança/adulto, envia pro Gemini, pega a resposta textual
    e converte de volta para áudio com Microsoft Edge Neural TTS.
    """
    gemini_key = os.getenv("GEMINI_API_KEY")
    if not gemini_key:
        raise ValueError("GEMINI_API_KEY não configurada.")
        
    client = genai.Client(api_key=gemini_key)
    sys_prompt = SYSTEM_PROMPTS.get(profile, SYSTEM_PROMPTS["KIDS"])
    
    logger.info(f"Processando áudio para o perfil: {profile}")
    
    # 1. Pipeline de Entrada (Gemini Native Audio)
    response = client.models.generate_content(
        model='gemini-1.5-flash',
        contents=[
            {"mime_type": mime_type, "data": audio_bytes},
            "Ouça o áudio do aluno e responda seguindo estritamente as suas diretrizes de sistema. Seja conciso."
        ],
        config=genai.types.GenerateContentConfig(
            system_instruction=sys_prompt,
            temperature=0.7,
        )
    )
    
    resposta_texto = response.text
    logger.info(f"Resposta IA: {resposta_texto}")
    
    # 2. Pipeline de Saída (Microsoft Edge Neural TTS)
    voice_name = VOICE_PROFILES.get(profile, "pt-BR-FranciscaNeural")
    
    # O Edge TTS gera o MP3 nativamente
    communicate = edge_tts.Communicate(resposta_texto, voice_name)
    audio_chunks = []
    
    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            audio_chunks.append(chunk["data"])
            
    audio_out_bytes = b"".join(audio_chunks)
    
    return resposta_texto, audio_out_bytes
