import os
import io
import logging
from google import genai
import edge_tts
from groq import Groq

logger = logging.getLogger(__name__)

SYSTEM_PROMPTS = {
    "KIDS": (
        "Você é o 'Alfabetiza AÍ', um tutor de voz carinhoso, animado e paciente para crianças em fase de alfabetização.\n"
        "OBJETIVO: Criar uma conversa interativa e dinâmica que avança a cada fala da criança.\n\n"
        "COMO RESPONDER:\n"
        "1. SE A CRIANÇA REPETIU O QUE VOCÊ PEDIU (ou tentou falar): Comemore efusivamente! (Ex: 'Muito bem!', 'Você arrasou!'). Depois, avance para o próximo pedacinho (a próxima sílaba) ou para a palavra inteira, ou pergunte que outra palavra ela quer aprender.\n"
        "2. SE A CRIANÇA FALOU UMA PALAVRA NOVA: Explique o que é com um exemplo simples do dia a dia infantil (animais, brinquedos, escola), separe as sílabas com pausas (ex: BO-LA) e convide-a com carinho a repetir a primeira sílaba com você.\n"
        "3. SE A CRIANÇA FEZ UMA PERGUNTA OU DISSE OUTRA COISA: Responda a dúvida com carinho e proponha uma palavra divertida para praticar som e letras.\n"
        "4. SE O ÁUDIO FOR CONFUSO OU INAUDÍVEL: Seja acolhedor e peça gentilmente para ela falar mais pertinho do microfone.\n\n"
        "REGRAS DE OURO:\n"
        "- Resposta curta (2 a 4 frases simples), perfeita para ser ouvida em áudio.\n"
        "- NUNCA repita a mesma explicação que você já deu no histórico recente. Sempre avance o aprendizado!\n"
        "- NÃO use emojis, asteriscos ou formatações markdown. Apenas texto puro e limpo."
    ),
    "EJA": (
        "Você é o tutor 'Alfabetiza AÍ' para jovens, adultos e idosos (Educação de Jovens e Adultos - EJA).\n"
        "OBJETIVO: Ensino prático, digno, paciente e sem infantilização, focado no cotidiano e na cidadania.\n\n"
        "COMO RESPONDER:\n"
        "1. SE O ALUNO RESPONDEU OU REPETIU UMA PALAVRA/SÍLABA: Valide o acerto com respeito e encorajamento. Em seguida, avance para a próxima etapa (a sílaba seguinte, a palavra completa ou uma frase onde ela é usada no trabalho/compras).\n"
        "2. SE O ALUNO TROUXE UMA PALAVRA NOVA: Explique o uso prático no cotidiano (trabalho, documentos, compras, saúde), mostre a divisão silábica pausada e convide a pronunciar.\n"
        "3. SE O ALUNO FEZ UMA PERGUNTA: Responda com clareza e respeito.\n\n"
        "REGRAS DE OURO:\n"
        "- Tom respeitoso, maduro e acolhedor (2 a 4 frases diretas).\n"
        "- NUNCA repita a mesma pergunta ou explicação. Progrida a lição!\n"
        "- Apenas texto puro sem formatação markdown ou emojis."
    ),
    "PCD": (
        "Você é o tutor inclusivo 'Alfabetiza AÍ' (foco em neurodivergentes: TEA, TDAH, Dislexia).\n"
        "OBJETIVO: Comunicação clara, direta, previsível e sem sobrecarga sensorial.\n\n"
        "COMO RESPONDER:\n"
        "1. SE O ALUNO REPETIU OU RESPONDEU: Valide de forma calma e clara ('Excelente. Você disse [palavra].') e dê o próximo passo simples.\n"
        "2. SE TROUXE NOVA PALAVRA: Apresente o significado concreto e a separação silábica direta.\n"
        "3. Tom calmo, frases curtas, literais e previsíveis (2 a 3 frases).\n"
        "4. Sem metáforas, sem ambiguidades, sem emojis ou marcações markdown."
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
    profile: str,
    last_ai_response: str = ""
) -> tuple[str, bytes, str]:
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
        
        # 1. Tenta whisper-large-v3-turbo (muito mais rápido e não inventa alucinações de instruções)
        whisper_model = os.getenv("GROQ_WHISPER_MODEL", "whisper-large-v3-turbo")
        prompt_vocab = "Alfabetização em português: vogais, consoantes, sílabas e palavras simples faladas por crianças e adultos: ba, be, bi, bo, bu, bola, pato, gato, casa."
        try:
            transcription_obj = groq_client.audio.transcriptions.create(
                file=file_tuple,
                model=whisper_model,
                response_format="json",
                language="pt",
                temperature=0.0,
                prompt=prompt_vocab
            )
            texto_aluno = (transcription_obj.text or "").strip()
            logger.info(f"🗣️ STT Whisper ({whisper_model}) ouviu: '{texto_aluno}'")
        except Exception as stt_err:
            logger.warning(f"Whisper {whisper_model} falhou ({stt_err}), tentando whisper-large-v3...")
            try:
                transcription_obj = groq_client.audio.transcriptions.create(
                    file=file_tuple,
                    model="whisper-large-v3",
                    response_format="json",
                    language="pt",
                    temperature=0.0,
                    prompt=prompt_vocab
                )
                texto_aluno = (transcription_obj.text or "").strip()
                logger.info(f"🗣️ STT Whisper v3 ouviu: '{texto_aluno}'")
            except Exception as stt_err2:
                logger.error(f"Erro no Whisper STT, ativando Fallback Multimodal Gemini: {stt_err2}")
                usar_fallback_multimodal = True

    if not usar_fallback_multimodal and not texto_aluno:
        return "Não consegui ouvir nenhuma palavra. Fale bem pertinho do microfone e tente de novo!", b"", ""
        
    # Anonimização LGPD/ECA (remove números longos e emails do texto do aluno antes de ir para IA)
    import re
    if texto_aluno:
        texto_aluno = re.sub(r'\b\d{4,}\b', '[DADO_PROTEGIDO]', texto_aluno)
        texto_aluno = re.sub(r'\S+@\S+', '[DADO_PROTEGIDO]', texto_aluno)

    # ===== ETAPA 2: LLM (Cérebro Pedagógico) com Gemini =====
    gemini_key = os.getenv("GEMINI_API_KEY")
    if not gemini_key:
        raise ValueError("GEMINI_API_KEY não configurada.")
        
    gemini_client = genai.Client(api_key=gemini_key)
    sys_prompt = SYSTEM_PROMPTS.get(profile, SYSTEM_PROMPTS["KIDS"])
    model_name = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    
    contexto_str = ""
    if last_ai_response:
        contexto_str = f"HISTÓRICO RECENTE DA CONVERSA:\n{last_ai_response}\n\n"
        
    contents = []
    if usar_fallback_multimodal:
        # Fallback: Envia o áudio direto pro Gemini transcrever e responder
        contents.append(
            genai.types.Part.from_bytes(data=audio_bytes, mime_type=mime_type)
        )
        user_prompt = (
            f"{contexto_str}"
            "O áudio anexado contém a fala de um aluno.\n"
            "Responda EXATAMENTE no seguinte formato de duas linhas:\n"
            "ALUNO: [o que você ouviu o aluno falar no áudio]\n"
            "RESPOSTA: [sua resposta pedagógica curta, falada, em 2 a 3 frases limpas, sem markdown nem emojis]\n\n"
            "Instruções:\n"
            "- Se o aluno repetiu ou tentou falar a sílaba/palavra que você pediu no histórico recente: elogie com alegria e avance para o próximo pedacinho ou uma nova palavra!\n"
            "- Se falou uma palavra nova: ensine o que significa e separe as sílabas com pausas.\n"
            "- Se não entendeu ou ficou silencioso: peça com carinho para falar de novo."
        )
        contents.append(user_prompt)
    else:
        user_prompt = (
            f"{contexto_str}"
            f"Transcrição do Microfone (O aluno acabou de falar): \"{texto_aluno}\"\n\n"
            "Instruções Pedagógicas:\n"
            "1. Avalie a fala do aluno em relação ao histórico recente da conversa.\n"
            "2. Se ele repetiu ou tentou falar a sílaba/palavra que você pediu: ELOGIE com alegria e AVANCE para a próxima sílaba ou para uma nova palavra. NUNCA repita a mesma pergunta ou explicação!\n"
            "3. Se ele falou uma nova palavra ou fez uma pergunta: responda com carinho, ensine o significado e separe as sílabas (ex: BO-LA).\n"
            "4. Mantenha a resposta curta (2 a 4 frases), clara e falada, sem emojis ou asteriscos."
        )
        contents.append(user_prompt)

    response = None
    # Tentativa com modelo principal e fallbacks graduais
    for m in [model_name, "gemini-2.0-flash", "gemini-1.5-flash"]:
        try:
            response = gemini_client.models.generate_content(
                model=m,
                contents=contents,
                config=genai.types.GenerateContentConfig(
                    system_instruction=sys_prompt,
                    temperature=0.3,
                )
            )
            if response and response.text:
                break
        except Exception as model_err:
            logger.warning(f"Falha ao gerar conteúdo com {m}: {model_err}")

    if not response or not response.text:
        raise RuntimeError("Não foi possível obter resposta dos modelos Gemini disponíveis.")

    resposta_texto = response.text.strip()
    
    # Se estava no modo multimodal, desmembra a transcrição da resposta pedagógica
    if usar_fallback_multimodal and "RESPOSTA:" in resposta_texto:
        parts = resposta_texto.split("RESPOSTA:", 1)
        aluno_raw = parts[0].replace("ALUNO:", "").strip()
        if aluno_raw:
            texto_aluno = aluno_raw
        resposta_texto = parts[1].strip()
    
    logger.info(f"🧠 Resposta IA (Gemini): {resposta_texto}")
    
    # ===== ETAPA 3: TTS (Text-to-Speech) com Edge Neural =====
    voice_name = VOICE_PROFILES.get(profile, "pt-BR-FranciscaNeural")
    
    # Remove marcações markdown (*, _, #) para não serem lidas em voz alta
    texto_para_voz = resposta_texto.replace("*", "").replace("#", "").replace("_", "")
    
    try:
        communicate = edge_tts.Communicate(texto_para_voz, voice_name)
        audio_chunks = []
        
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                audio_chunks.append(chunk["data"])
                
        audio_out_bytes = b"".join(audio_chunks)
    except Exception as tts_err:
        logger.warning(f"Falha ao gerar áudio TTS com Edge Neural, enviando resposta apenas em texto: {tts_err}")
        audio_out_bytes = b""
    
    texto_detectado = texto_aluno if texto_aluno else "[Áudio Identificado]"
    return resposta_texto, audio_out_bytes, texto_detectado


async def transcribe_audio_only(audio_bytes: bytes, mime_type: str, target_hint: str = "") -> str:
    """Transcreve áudio usando Groq Whisper (com fallback multimodal Gemini) para lições interativas."""
    groq_key = os.getenv("GROQ_API_KEY")
    ext = mime_type.split("/")[-1].split(";")[0] if "/" in mime_type else "webm"
    if not ext or ext == "octet-stream":
        ext = "webm"
    file_tuple = (f"audio.{ext}", audio_bytes, mime_type)

    vocab_prompt = "Alfabetização em português: vogais, sílabas e palavras simples."
    if target_hint:
        vocab_prompt = f"Alfabetização em português. Palavras do exercício: {target_hint}."

    if groq_key:
        groq_client = Groq(api_key=groq_key)
        for model in [os.getenv("GROQ_WHISPER_MODEL", "whisper-large-v3-turbo"), "whisper-large-v3"]:
            try:
                res = groq_client.audio.transcriptions.create(
                    file=file_tuple,
                    model=model,
                    response_format="json",
                    language="pt",
                    temperature=0.0,
                    prompt=vocab_prompt,
                )
                text = (res.text or "").strip()
                if text:
                    return text
            except Exception as err:
                logger.warning(f"Falha no STT ({model}): {err}")

    gemini_key = os.getenv("GEMINI_API_KEY")
    if gemini_key:
        gemini_client = genai.Client(api_key=gemini_key)
        for m in [os.getenv("GEMINI_MODEL", "gemini-2.5-flash"), "gemini-2.0-flash", "gemini-1.5-flash"]:
            try:
                res = gemini_client.models.generate_content(
                    model=m,
                    contents=[
                        genai.types.Part.from_bytes(data=audio_bytes, mime_type=mime_type),
                        "Transcreva exatamente o que foi falado neste áudio em português. Retorne APENAS as palavras ouvidas, sem explicações ou pontuação extra.",
                    ],
                )
                if res and res.text:
                    return res.text.strip()
            except Exception as err:
                logger.warning(f"Falha no STT Gemini ({m}): {err}")

    return ""
