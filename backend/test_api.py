import requests

API_URL = "https://alfabetiza-ai-production.up.railway.app/api/voice/chat"

print("--- Teste 1: Arquivo vazio (deve retornar mensagem de áudio muito curto) ---")
try:
    res = requests.post(API_URL, files={"audio_file": ("vazio.webm", b"123", "audio/webm")}, data={"profile": "KIDS"})
    print("Status:", res.status_code)
    print("Response:", res.json()["transcription_or_reasoning"] if res.status_code == 200 else res.text)
except Exception as e:
    print("Erro:", e)

print("\n--- Teste 2: Áudio real (Example.ogg) ---")
try:
    with open("test_audio.ogg", "rb") as f:
        res2 = requests.post(API_URL, files={"audio_file": ("test_audio.ogg", f, "audio/ogg")}, data={"profile": "KIDS"})
    print("Status:", res2.status_code)
    print("Response:", res2.json()["transcription_or_reasoning"] if res2.status_code == 200 else res2.text)
except Exception as e:
    print("Erro:", e)
