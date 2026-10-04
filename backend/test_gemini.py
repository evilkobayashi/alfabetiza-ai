import os, requests
gemini_key = os.getenv("GEMINI_API_KEY")
res = requests.get(f"https://generativelanguage.googleapis.com/v1beta/models?key={gemini_key}")
print([m["name"] for m in res.json().get("models", [])])
