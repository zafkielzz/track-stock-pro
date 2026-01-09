# Track Stock Pro

Hệ thống quản lý kho thông minh với AI nhận diện khuôn mặt.

## 📁 Cấu trúc Project

```
PRJ/
├── frontend/          # React + TypeScript Frontend
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
│
└── backend/           # Python FastAPI Backend
    ├── main.py        # Main API (Port 3000)
    ├── ai_main.py     # AI Service (Port 8000)
    ├── api/           # REST API routes
    ├── ai_service/    # Face recognition
    ├── models/        # Database models
    ├── schemas/       # Pydantic schemas
    └── README.md      # Backend setup guide
```

## 🚀 Quick Start

### Frontend

```bash
cd frontend
npm install
npm run dev
# Chạy tại http://localhost:5173
```

### Backend

```bash
cd backend

# Tạo virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac

# Cài đặt dependencies
pip install -r requirements.txt

# Cấu hình
cp .env.example .env
# Chỉnh sửa .env (SECRET_KEY, DATABASE_URL, etc.)

# Chạy API Server
uvicorn main:app --reload --port 3000

# Chạy AI Service (terminal khác)
uvicorn ai_main:app --reload --port 8000
```

## 📖 Documentation

- **Frontend:** Xem `frontend/README.md`
- **Backend:** Xem `backend/README.md`
- **API Docs:** http://localhost:3000/docs
- **AI Docs:** http://localhost:8000/docs

## 🛠️ Tech Stack

**Frontend:**
- React 18 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- TanStack Query
- MediaPipe (Face Mesh)

**Backend:**
- FastAPI
- SQLAlchemy + PostgreSQL/SQLite
- face_recognition (AI)
- JWT Authentication

## 👥 Team

DAT301m - PRJ - FPT University

---

Xem chi tiết setup trong README của từng folder.
