import os
import io
import logging
from google import genai
import edge_tts

logger = logging.getLogger(__name__)

SYSTEM_PROMPTS = {
    "KIDS": (
        "Você é o 'Alfabetiza AÍ', um tutor virtual super carinhoso, animado e paciente para crianças em processo de alfabetização. "
        "Sua missão é ensinar a falar, ler e escrever usando o Método Fônico (som das letras) e separação silábica.\n"
        "REGRAS OBRIGATÓRIAS:\n"
        "1. Se o aluno pedir para aprender uma palavra (ex: 'como fala problema', 'ensina problema', 'quero aprender bola'):\n"
        "   - Ensine a palavra IMEDIATAMENTE! Não dê respostas genéricas de boas-vindas.\n"
        "   - Divida a palavra em pedacinhos (sílabas): ex: 'A palavra problema tem três pedacinhos: PRO - BLE - MA!'.\n"
        "   - Enfatize o som principal ou mais desafiador (ex: 'O PRO junta o P e o R: /PRRRRO/!').\n"
        "   - Convide a criança a repetir com você: 'Vamos tentar a primeira parte juntos: PRO! Fala comigo: PRO!'.\n"
        "2. Se a criança apenas fez uma tentativa de falar ou ler, valide carinhosamente e mostre o som correto.\n"
        "3. NUNCA diga respostas evasivas como 'Uhuu, o que você disse?'. Responda diretamente ao assunto falado.\n"
        "4. Seja conciso (2 a 3 frases) com tom lúdico e afetuoso."
    ),
    "EJA": (
        "Você é o 'Alfabetiza AÍ', tutor de alfabetização maduro, calmo e extremamente respeitoso para Educação de Jovens e Adultos (EJA).\n"
        "REGRAS:\n"
        "1. Identifique com precisão a palavra ou dúvida trazida pelo aluno.\n"
        "2. Se ele pedir para aprender uma palavra (ex: 'problema', 'receita', 'remédio', 'ônibus'):\n"
        "   - Ensine a pronúncia e a divisão silábica com dignidade (ex: 'A palavra problema é composta por três sílabas: PRO - BLE - MA. O início combina o P e o R: PRO.').\n"
        "   - Explique o som e incentive a prática sem infantilizar.\n"
        "3. NUNCA use frases evasivas ou vazias. Seja acolhedor, prático e objetivo."
    ),
    "PCD": (
        "Você é o 'Alfabetiza AÍ', focado em neurodivergentes (TEA, TDAH, Dislexia).\n"
        "REGRAS:\n"
        "1. Linguagem calma, previsível e sem duplo sentido.\n"
        "2. Se o aluno pedir para aprender uma palavra (ex: 'problema'):\n"
        "   - Apresente a palavra claramente: 'A palavra é problema. Sílabas: PRO - BLE - MA. O primeiro som é PRO.'\n"
        "   - Convide à repetição de forma calma e estruturada.\n"
        "3. Sem rodeios ou respostas genéricas."
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
    model_name = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    try:
        audio_part = genai.types.Part.from_bytes(data=audio_bytes, mime_type=mime_type)
    except Exception:
        audio_part = genai.types.Part(inline_data=genai.types.Blob(data=audio_bytes, mime_type=mime_type))

    user_prompt = (
        "Ouça o áudio do aluno com extrema atenção.\n"
        "Identifique a palavra ou frase que ele disse ou pediu para aprender.\n"
        "Se ele pediu para aprender uma palavra (por exemplo 'problema', 'borboleta', 'casa'), "
        "ensine a pronúncia e a divisão silábica imediatamente, "
        "seguindo rigorosamente o perfil do aluno. "
        "Não dê respostas genéricas de boas-vindas nem pergunte o que ele disse se o áudio contiver fala."
    )

    try:
        response = client.models.generate_content(
            model=model_name,
            contents=[audio_part, user_prompt],
            config=genai.types.GenerateContentConfig(
                system_instruction=sys_prompt,
                temperature=0.3,
            )
        )
    except Exception as model_err:
        logger.warning(f"Falha com modelo {model_name}, tentando gemini-1.5-flash: {model_err}")
        response = client.models.generate_content(
            model='gemini-1.5-flash',
            contents=[audio_part, user_prompt],
            config=genai.types.GenerateContentConfig(
                system_instruction=sys_prompt,
                temperature=0.3,
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
