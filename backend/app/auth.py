import os
import time
import jwt
from collections import defaultdict
from fastapi import Header, HTTPException

_jwks = None
_usage: dict[tuple[str, str], int] = defaultdict(int)


def _client() -> jwt.PyJWKClient:
    global _jwks
    url = os.getenv("CLERK_JWKS_URL")
    if not url:
        raise HTTPException(status_code=503, detail="Autenticação não configurada.")
    if _jwks is None:
        _jwks = jwt.PyJWKClient(url, cache_keys=True)
    return _jwks


async def get_user_id(authorization: str = Header(default="")) -> str:
    """Valida o JWT da sessão Clerk e aplica a cota diária de interações por usuário."""
    token = authorization.removeprefix("Bearer ").strip()
    if not token:
        raise HTTPException(status_code=401, detail="Login necessário.")
    try:
        key = _client().get_signing_key_from_jwt(token).key
        claims = jwt.decode(token, key, algorithms=["RS256"], options={"verify_aud": False})
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Sessão inválida ou expirada.")

    user_id = claims["sub"]
    day = time.strftime("%Y-%m-%d", time.gmtime())
    for k in [k for k in _usage if k[1] != day]:
        del _usage[k]
    limit = int(os.getenv("DAILY_VOICE_LIMIT", "40"))
    if _usage[(user_id, day)] >= limit:
        raise HTTPException(status_code=429, detail="Limite diário de conversas atingido. Volte amanhã!")
    _usage[(user_id, day)] += 1
    return user_id
