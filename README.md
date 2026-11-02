# Gowtham G B — AI Portfolio

A personal developer portfolio built with React + Vite + Tailwind CSS v4, and a Python FastAPI backend with an LLM-powered recruiter assistant.

## Requirements
- Windows 10/11
- Node.js 20+ (Node 22 recommended)
- Python 3.11+
- An API key from an LLM provider that supports the OpenAI API format (the sample uses OpenAI)

## 1. Start the backend (Windows PowerShell)
Open PowerShell in this project folder:

```powershell
cd backend
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install --upgrade pip
pip install -r requirements.txt
Copy-Item .env.example .env
notepad .env
```

Add your API key to `.env`:

```env
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-4o-mini
FRONTEND_ORIGINS=http://localhost:5173
```

Save `.env`, then run:

```powershell
uvicorn main:app --reload --port 8000
```

API health check: http://127.0.0.1:8000/health

## 2. Start the frontend
Open a second PowerShell window in the project root:

```powershell
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite, usually http://localhost:5173.

## 3. Important customizations
- Update `backend/profile.json` with verified facts, project details, links, and your current resume.
- Replace the sample GitHub/LinkedIn URLs in `frontend/src/App.jsx` with your real links.
- Add your resume PDF at `frontend/public/Gowtham-G-B-Resume.pdf` if you want the Download Resume button to work.
- Keep `.env` private. Never put your API key in React code or commit `.env` to Git.

## 4. How the chatbot works
The frontend sends a question to FastAPI. FastAPI loads `profile.json`, passes it to the model as the only source of personal facts, and returns the answer. If the information is not available, the assistant is instructed to say so rather than invent details. The LLM API may incur charges; check your provider's current pricing and limits.

## 5. Free-tier deployment outline
- Frontend: deploy `frontend` to Vercel or Netlify. Build command: `npm run build`; output directory: `dist`.
- Backend: deploy `backend` to a Python host such as Render or another provider with a free tier if available. Free-tier availability, sleep behavior, and limits can change.
- On the backend host, set `OPENAI_API_KEY`, `OPENAI_MODEL`, and `FRONTEND_ORIGINS` to your deployed frontend URL.
- In `frontend/.env.production`, set `VITE_API_BASE_URL` to your deployed backend URL, then rebuild/redeploy the frontend.
- Do not put secrets in variables prefixed with `VITE_`; frontend variables are public.

## Troubleshooting
- PowerShell blocks activation: run `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`, then activate again.
- `py` not found: install Python from python.org and enable the launcher / PATH option.
- CORS error: ensure `FRONTEND_ORIGINS` exactly matches the frontend origin, including `https://` and no trailing path.
- Chatbot returns a configuration error: confirm `.env` exists in `backend`, contains a valid key, and restart Uvicorn.
- API usage errors: check your provider's model access, billing, and rate limits.
