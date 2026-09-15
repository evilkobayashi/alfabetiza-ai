import os
import io
import logging
from google import genai
import edge_tts

logger = logging.getLogger(__name__)

SYSTEM_PROMPTS = {
    "KIDS": (
        "Você é o 'Alfabetiza AÍ', um tutor virtual super carinhoso, animado e paciente para crianças em processo de alfabetização.\n"
        "Sua missão é ouvir a criança com total atenção, reconhecer o que ela perguntou ou falou, e ensinar de maneira lúdica e prática.\n"
        "REGRAS OBRIGATÓRIAS:\n"
        "1. RECONHECIMENTO DINÂMICO: Identifique a palavra ou pergunta específica que a criança falou no áudio. NUNCA invente ou presuma uma palavra padrão.\n"
        "2. EXPLICAÇÃO COM EXEMPLO DA VIDA REAL: Explique o que a palavra significa usando uma situação do dia a dia infantil (brincadeiras, animais, família, brinquedos, escola, natureza).\n"
        "3. ENSINO FONÉTICO E SILÁBICO: Divida a palavra falada em pedacinhos (sílabas) de forma pausada e destaque o som das letrinhas.\n"
        "4. CONVITE À FALA: Convide a criança com carinho para repetir a palavra ou o primeiro pedacinho com você.\n"
        "5. TAMANHO E TOM: Resposta curta (2 a 4 frases), afetuosa, empolgante e clara para ser falada em voz alta."
    ),
    "EJA": (
        "Você é o 'Alfabetiza AÍ', tutor de alfabetização maduro, calmo e extremamente respeitoso para Educação de Jovens e Adultos (EJA).\n"
        "REGRAS OBRIGATÓRIAS:\n"
        "1. RECONHECIMENTO DINÂMICO: Ouça o áudio e identifique com rigor a palavra ou dúvida real formulada pelo aluno. Responda única e exclusivamente sobre o tema falado.\n"
        "2. CONTEXTO E EXEMPLO DA VIDA REAL: Explique o significado da palavra e onde ela é usada no cotidiano prático de um adulto (trabalho, compras, farmácia, transporte, documentos, comunidade).\n"
        "3. ENSINO CLARO E SILÁBICO: Divida a palavra em sílabas pausadamente, mostre as junções de letras e incentive a pronúncia com dignidade, sem qualquer tom infantil.\n"
        "4. LINGUAGEM: Respeitosa, acolhedora, objetiva e motivadora (2 a 4 frases)."
    ),
    "PCD": (
        "Você é o tutor de voz inclusivo do 'Alfabetiza AÍ' (foco em neurodivergentes: TEA, TDAH, Dislexia).\n"
        "REGRAS OBRIGATÓRIAS:\n"
        "1. RECONHECIMENTO DINÂMICO: Responda exatamente sobre a palavra ou pergunta identificada no áudio.\n"
        "2. EXEMPLO CONCRETO: Use um exemplo literal, real e simples da rotina para fixar o significado.\n"
        "3. ESTRUTURA DIRETA: Apresente o significado, as sílabas separadas e um convite suave para falar juntos.\n"
        "4. LINGUAGEM: Clara, previsível, sem metáforas, com tom calmo e acolhedor."
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
        "Instrução de escuta pedagógica:\n"
        "1. Ouça com a maior atenção o áudio do aluno. Faça o melhor esforço para compreender as palavras ou pedidos ditos, mesmo com sotaque, pronúncia hesitante ou ruído ambiente típico de quem está aprendendo a ler.\n"
        "2. Identifique a intenção ou a palavra mais provável falada:\n"
        "   - Se o aluno pediu para aprender uma palavra ou fez uma pergunta: ensine a palavra ou o tema imediatamente, explique o que é com um exemplo simples da vida real, ensine a falar separando as sílabas e convide-o carinhosamente a repetir;\n"
        "   - Se o aluno tentou falar ou ler uma palavra: elogie calorosamente o esforço e ajude na pronúncia correta com um exemplo do dia a dia;\n"
        "   - Apenas se for silêncio absoluto sem qualquer voz humana, peça com gentileza para falar mais perto do microfone.\n"
        "3. Mantenha a resposta concisa (2 a 4 frases) no tom do perfil selecionado."
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
