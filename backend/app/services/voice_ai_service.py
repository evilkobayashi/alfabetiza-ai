import os
import io
import logging
from google import genai
import edge_tts
from groq import Groq

logger = logging.getLogger(__name__)

SYSTEM_PROMPTS = {
    "KIDS": (
        "Você é o 'Alfabetiza AÍ', um tutor virtual super carinhoso, animado e paciente para crianças em processo de alfabetização.\n"
        "Sua missão é ensinar de maneira lúdica e prática a palavra ou dúvida que o aluno acabou de falar.\n"
        "REGRAS OBRIGATÓRIAS:\n"
        "1. CONTEXTO EXATO: Responda exatamente sobre o que o aluno falou no texto transcrito.\n"
        "2. EXPLICAÇÃO COM EXEMPLO DA VIDA REAL: Explique o que a palavra significa usando uma situação do dia a dia infantil (brincadeiras, animais, família, brinquedos, escola, natureza).\n"
        "3. ENSINO FONÉTICO E SILÁBICO: Divida a palavra-chave em pedacinhos (sílabas) de forma pausada e destaque o som das letrinhas.\n"
        "4. CONVITE À FALA: Convide a criança com carinho para repetir a palavra ou o primeiro pedacinho com você.\n"
        "5. TAMANHO E TOM: Resposta curta (2 a 4 frases), afetuosa, empolgante e clara para ser falada em voz alta."
    ),
    "EJA": (
        "Você é o 'Alfabetiza AÍ', tutor de alfabetização maduro, calmo e extremamente respeitoso para Educação de Jovens e Adultos (EJA).\n"
        "REGRAS OBRIGATÓRIAS:\n"
        "1. CONTEXTO EXATO: Leia a transcrição do aluno e responda única e exclusivamente sobre o tema falado.\n"
        "2. CONTEXTO E EXEMPLO DA VIDA REAL: Explique o significado da palavra e onde ela é usada no cotidiano prático de um adulto (trabalho, compras, farmácia, transporte, documentos, comunidade).\n"
        "3. ENSINO CLARO E SILÁBICO: Divida a palavra em sílabas pausadamente, mostre as junções de letras e incentive a pronúncia com dignidade, sem qualquer tom infantil.\n"
        "4. LINGUAGEM: Respeitosa, acolhedora, objetiva e motivadora (2 a 4 frases)."
    ),
    "PCD": (
        "Você é o tutor de voz inclusivo do 'Alfabetiza AÍ' (foco em neurodivergentes: TEA, TDAH, Dislexia).\n"
        "REGRAS OBRIGATÓRIAS:\n"
        "1. CONTEXTO EXATO: Responda exatamente sobre a palavra ou pergunta identificada na transcrição.\n"
        "2. EXEMPLO CONCRETO: Use um exemplo literal, real e simples da rotina para fixar o significado.\n"
        "3. ESTRUTURA DIRETA: Apresente o significado, as sílabas separadas e um convite suave para falar juntos.\n"
        "4. LINGUAGEM: Clara, previsível, sem metáforas, com tom calmo e acolhedor (2 a 4 frases)."
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
    1. STT com Whisper (via Groq API para latência AAA).
    2. LLM com Gemini para raciocínio pedagógico em cima da transcrição.
    3. TTS com Edge Neural.
    """
    logger.info(f"Processando áudio para o perfil: {profile}")

    # ===== ETAPA 1: STT com Whisper (ou Fallback para Gemini) =====
    groq_key = os.getenv("GROQ_API_KEY")
    texto_aluno = ""
    usar_fallback_multimodal = False
    
    if not groq_key:
        usar_fallback_multimodal = True
    else:
        groq_client = Groq(api_key=groq_key)
        ext = mime_type.split("/")[-1].split(";")[0] if "/" in mime_type else "webm"
        if not ext or ext == "octet-stream": ext = "webm"
        filename = f"audio.{ext}"
        file_tuple = (filename, audio_bytes, mime_type)
        
        try:
            transcription_obj = groq_client.audio.transcriptions.create(
                file=file_tuple,
                model="whisper-large-v3",
                response_format="json",
                language="pt",
                temperature=0.0,
                prompt="O áudio a seguir é um aluno brasileiro fazendo uma pergunta educacional ou dizendo uma palavra isolada de forma clara."
            )
            texto_aluno = transcription_obj.text.strip()
            logger.info(f"🗣️ STT Whisper ouviu: '{texto_aluno}'")
        except Exception as stt_err:
            logger.error(f"Erro no Whisper STT (Bloqueio Groq), ativando Fallback Multimodal Gemini: {stt_err}")
            usar_fallback_multimodal = True

    if not usar_fallback_multimodal and (not texto_aluno or len(texto_aluno) < 2):
        return "Não ouvi nenhuma palavra, ficou muito baixinho. Clique no microfone de novo e fale com vontade!", b""
        
    # ===== ETAPA 2: LLM (Cérebro Pedagógico) com Gemini =====
    gemini_key = os.getenv("GEMINI_API_KEY")
    if not gemini_key:
        raise ValueError("GEMINI_API_KEY não configurada.")
        
    gemini_client = genai.Client(api_key=gemini_key)
    sys_prompt = SYSTEM_PROMPTS.get(profile, SYSTEM_PROMPTS["KIDS"])
    model_name = os.getenv("GEMINI_MODEL", "gemini-1.5-flash") # 1.5 flash é melhor para multimodal
    
    contents = []
    if usar_fallback_multimodal:
        # Fallback: Envia o áudio direto pro Gemini transcrever e responder
        contents.append(
            genai.types.Part.from_bytes(data=audio_bytes, mime_type=mime_type)
        )
        user_prompt = (
            "Instrução Pedagógica OBRIGATÓRIA:\n"
            "1. Ouça o áudio em anexo. Ele contém a voz de um aluno brasileiro.\n"
            "2. Responda EXATAMENTE sobre o assunto, pergunta ou palavra que o aluno falou no áudio.\n"
            "3. Se o aluno falou uma palavra solta, ensine a palavra (separe as sílabas).\n"
            "4. Se fez uma pergunta, responda de forma educativa.\n"
            "5. Se o áudio estiver vazio, com ruído ou fizer pouco sentido, diga gentilmente que não entendeu e peça para ele repetir.\n"
            "6. Seja super caloroso e fale no máximo 2 a 4 frases curtas."
        )
        contents.append(user_prompt)
    else:
        user_prompt = (
            f"Transição do Microfone (O que o aluno falou): \"{texto_aluno}\"\n\n"
            "Instrução Pedagógica OBRIGATÓRIA:\n"
            "1. Você DEVE ler o texto acima e responder EXATAMENTE sobre o assunto, pergunta ou palavra que o aluno falou.\n"
            "2. Se o texto for uma palavra solta, ensine a palavra (separe as sílabas).\n"
            "3. Se o texto for uma pergunta, responda a pergunta de forma educativa.\n"
            "4. Se o texto estiver vazio ou fizer pouco sentido, diga gentilmente que não entendeu e peça para ele repetir.\n"
            "5. Seja super caloroso e fale no máximo 2 a 4 frases curtas."
        )
        contents.append(user_prompt)

    try:
        response = gemini_client.models.generate_content(
            model=model_name,
            contents=contents,
            config=genai.types.GenerateContentConfig(
                system_instruction=sys_prompt,
                temperature=0.3,
            )
        )
    except Exception as model_err:
        logger.warning(f"Falha com modelo {model_name}, tentando gemini-1.5-flash fallback: {model_err}")
        response = gemini_client.models.generate_content(
            model='gemini-1.5-flash',
            contents=contents,
            config=genai.types.GenerateContentConfig(
                system_instruction=sys_prompt,
                temperature=0.3,
            )
        )
    
    resposta_texto = response.text
    logger.info(f"🧠 Resposta IA (Gemini): {resposta_texto}")
    
    # ===== ETAPA 3: TTS (Text-to-Speech) com Edge Neural =====
    voice_name = VOICE_PROFILES.get(profile, "pt-BR-FranciscaNeural")
    
    communicate = edge_tts.Communicate(resposta_texto, voice_name)
    audio_chunks = []
    
    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            audio_chunks.append(chunk["data"])
            
    audio_out_bytes = b"".join(audio_chunks)
    
    return resposta_texto, audio_out_bytes
