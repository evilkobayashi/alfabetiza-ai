import os, requests
key = os.getenv("GROQ_API_KEY")
res = requests.get("https://api.groq.com/openai/v1/models", headers={"Authorization": f"Bearer {key}"})
print(res.json())
