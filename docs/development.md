# TaskFlow Pro - Local Development Guide

Instructions for local development, test running, and database seeding.

---

## 💻 Local Prerequisites
- Python 3.11+
- Node.js 18+
- Docker & Docker Compose

---

## 🛠️ Step-by-Step Backend Setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Run migrations
alembic upgrade head

# Launch FastAPI app with hot reload
uvicorn src.main:app --reload --port 8000
```

---

## 🎨 Step-by-Step Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 Running Automated Test Suites

### Backend Tests (pytest)
```bash
cd backend
pytest -v --cov=src
```

### Frontend Tests (vitest)
```bash
cd frontend
npm run test
```
