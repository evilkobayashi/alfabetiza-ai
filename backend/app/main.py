from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import voice

app = FastAPI(
    title="Alfabetiza AÍ - Voice Engine",
    description="Motor AAA de alfabetização Voice-First (Gemini + Google Cloud TTS)",
    version="1.0.0"
)

# CORS para o PWA (Next.js)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://alfabetiza-ai.vercel.app",
        "http://localhost:3000",
        "http://localhost:8000",
        "*",
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(voice.router)

@app.get("/")
def health_check():
    return {"status": "Alfabetiza AÍ Voice Engine is running (AAA Quality)"}
