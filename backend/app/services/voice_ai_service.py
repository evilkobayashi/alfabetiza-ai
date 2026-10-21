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

WHISPER_HALLUCINATIONS = {
    "obrigado",
    "obrigado.",
    "obrigado por assistir",
    "obrigado por assistir.",
    "legendas pela comunidade amara.org",
    "amara.org",
    "inscreva-se",
    "inscreva-se no canal",
    "até a próxima",
    "tchau",
    "...",
    ".",
}


def _clean_whisper_text(raw: str) -> str:
    text = (raw or "").strip()
    if not text:
        return ""
    if text.lower().rstrip(".!,?") in WHISPER_HALLUCINATIONS:
        return ""
    return text


async def process_audio_interaction(
    audio_bytes: bytes, 
    mime_type: str, 
    profile: str,
    last_ai_response: str = ""
) -> tuple[str, bytes, str]:
    """
    1. STT auxiliar com Whisper (sem prompt enviesado) + Áudio Nativo direto no Gemini.
    2. LLM com Gemini ouvindo o áudio real para máxima precisão fonética e pedagógica.
    3. TTS com Edge Neural.
    """
    logger.info(f"Processando áudio para o perfil: {profile}")

    # ===== ETAPA 1: STT auxiliar com Whisper (sem prompt para evitar alucinações) =====
    groq_key = os.getenv("GROQ_API_KEY")
    texto_whisper = ""
    
    if groq_key:
        groq_client = Groq(api_key=groq_key)
        ext = mime_type.split("/")[-1].split(";")[0] if "/" in mime_type else "webm"
        if not ext or ext == "octet-stream":
            ext = "webm"
        file_tuple = (f"audio.{ext}", audio_bytes, mime_type)
        whisper_model = os.getenv("GROQ_WHISPER_MODEL", "whisper-large-v3-turbo")
        try:
            transcription_obj = groq_client.audio.transcriptions.create(
                file=file_tuple,
                model=whisper_model,
                response_format="json",
                language="pt",
                temperature=0.0,
            )
            texto_whisper = _clean_whisper_text(transcription_obj.text)
            logger.info(f"🗣️ STT Whisper ({whisper_model}) ouviu: '{texto_whisper}'")
        except Exception as stt_err:
            logger.warning(f"Whisper {whisper_model} falhou ({stt_err})")

    # ===== ETAPA 2: Áudio Nativo + Cérebro Pedagógico com Gemini =====
    gemini_key = os.getenv("GEMINI_API_KEY")
    if not gemini_key:
        raise ValueError("GEMINI_API_KEY não configurada.")
        
    gemini_client = genai.Client(api_key=gemini_key)
    sys_prompt = SYSTEM_PROMPTS.get(profile, SYSTEM_PROMPTS["KIDS"])
    model_name = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    
    contexto_str = ""
    if last_ai_response:
        contexto_str = f"HISTÓRICO RECENTE DA CONVERSA:\n{last_ai_response}\n\n"

    dica_whisper = f"\n(Transcrição auxiliar preliminar: \"{texto_whisper}\")" if texto_whisper else ""

    contents = [
        genai.types.Part.from_bytes(data=audio_bytes, mime_type=mime_type),
        (
            f"{contexto_str}"
            f"Ouça com muita atenção o áudio anexado do aluno.{dica_whisper}\n\n"
            "Responda OBRIGATORIAMENTE no formato exato de duas linhas abaixo:\n"
            "ALUNO: [transcreva exatamente as palavras ou sílabas que o aluno falou no áudio, sem inventar frases. Se houver apenas silêncio ou ruído, escreva VAZIO]\n"
            "RESPOSTA: [sua resposta pedagógica curta, falada, de 2 a 3 frases, sem markdown, sem asteriscos e sem emojis]\n\n"
            "Instruções Pedagógicas:\n"
            "1. Confie no que você OUVIU no áudio (se a transcrição auxiliar estiver errada ou sem sentido, ignore-a e use o áudio real).\n"
            "2. Se o aluno repetiu ou tentou falar a sílaba/palavra pedida no histórico: ELOGIE com alegria e AVANCE para a próxima sílaba ou para uma nova palavra.\n"
            "3. Se ele falou uma palavra nova ou fez uma pergunta: ensine o significado de forma simples e separe as sílabas (ex: BO-LA).\n"
            "4. Se o áudio for VAZIO ou inaudível: peça com carinho para ele falar um pouquinho mais alto perto do microfone."
        ),
    ]

    response = None
    for m in [model_name, "gemini-2.0-flash", "gemini-1.5-flash"]:
        try:
            response = gemini_client.models.generate_content(
                model=m,
                contents=contents,
                config=genai.types.GenerateContentConfig(
                    system_instruction=sys_prompt,
                    temperature=0.2,
                )
            )
            if response and response.text:
                break
        except Exception as model_err:
            logger.warning(f"Falha ao gerar conteúdo com {m}: {model_err}")

    if not response or not response.text:
        raise RuntimeError("Não foi possível obter resposta dos modelos Gemini disponíveis.")

    resposta_bruta = response.text.strip()
    texto_aluno = texto_whisper
    resposta_texto = resposta_bruta

    if "RESPOSTA:" in resposta_bruta:
        parts = resposta_bruta.split("RESPOSTA:", 1)
        aluno_raw = parts[0].replace("ALUNO:", "").strip().strip('"').strip("'")
        resposta_texto = parts[1].strip()
        if aluno_raw and aluno_raw.upper() != "VAZIO":
            texto_aluno = aluno_raw
        elif aluno_raw.upper() == "VAZIO" and not texto_whisper:
            texto_aluno = ""

    # Anonimização LGPD/ECA
    import re
    if texto_aluno:
        texto_aluno = re.sub(r'\b\d{4,}\b', '[DADO_PROTEGIDO]', texto_aluno)
        texto_aluno = re.sub(r'\S+@\S+', '[DADO_PROTEGIDO]', texto_aluno)

    logger.info(f"🎯 Aluno falou: '{texto_aluno}' | 🧠 Resposta IA: {resposta_texto}")
    
    # ===== ETAPA 3: TTS (Text-to-Speech) com Edge Neural =====
    voice_name = VOICE_PROFILES.get(profile, "pt-BR-FranciscaNeural")
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
    
    return resposta_texto, audio_out_bytes, texto_aluno


async def transcribe_audio_only(audio_bytes: bytes, mime_type: str, target_hint: str = "") -> str:
    """Transcreve áudio curto com precisão usando Áudio Nativo Gemini + fallback Whisper sem prompt alucinatório."""
    gemini_key = os.getenv("GEMINI_API_KEY")
    if gemini_key:
        gemini_client = genai.Client(api_key=gemini_key)
        for m in ["gemini-2.0-flash", os.getenv("GEMINI_MODEL", "gemini-2.5-flash"), "gemini-1.5-flash"]:
            try:
                res = gemini_client.models.generate_content(
                    model=m,
                    contents=[
                        genai.types.Part.from_bytes(data=audio_bytes, mime_type=mime_type),
                        (
                            "Ouça o áudio e transcreva EXATAMENTE o que a pessoa falou em português brasileiro.\n"
                            "Regras:\n"
                            "- Retorne APENAS as palavras ou sílabas faladas, sem pontuação final e sem explicações.\n"
                            "- Não invente frases que não estão no áudio.\n"
                            "- Se houver apenas silêncio ou ruído sem fala inteligível, retorne exatamente: VAZIO"
                        ),
                    ],
                    config=genai.types.GenerateContentConfig(temperature=0.0),
                )
                if res and res.text:
                    cleaned = res.text.strip().strip('"').strip("'").rstrip(".!,?")
                    if cleaned.upper() == "VAZIO":
                        return ""
                    if cleaned:
                        logger.info(f"🎯 STT Gemini Audio ({m}) ouviu: '{cleaned}'")
                        return cleaned
            except Exception as err:
                logger.warning(f"Falha no STT Gemini ({m}): {err}")

    groq_key = os.getenv("GROQ_API_KEY")
    if groq_key:
        groq_client = Groq(api_key=groq_key)
        ext = mime_type.split("/")[-1].split(";")[0] if "/" in mime_type else "webm"
        if not ext or ext == "octet-stream":
            ext = "webm"
        file_tuple = (f"audio.{ext}", audio_bytes, mime_type)
        for model in [os.getenv("GROQ_WHISPER_MODEL", "whisper-large-v3-turbo"), "whisper-large-v3"]:
            try:
                res = groq_client.audio.transcriptions.create(
                    file=file_tuple,
                    model=model,
                    response_format="json",
                    language="pt",
                    temperature=0.0,
                )
                text = _clean_whisper_text(res.text)
                if text:
                    logger.info(f"🗣️ STT Whisper ({model}) ouviu: '{text}'")
                    return text
            except Exception as err:
                logger.warning(f"Falha no STT ({model}): {err}")

    return ""
