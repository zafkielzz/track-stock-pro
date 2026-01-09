# Track Stock Pro - Backend

Backend Python cho hệ thống quản lý kho (Inventory Management System) với tích hợp AI nhận diện khuôn mặt.

## 🏗️ Kiến trúc

```
backend/
├── main.py                 # Main API Server (Port 3000)
├── ai_main.py             # AI Service (Port 8000)
├── requirements.txt       # Python dependencies
├── .env.example          # Environment template
│
├── api/                  # REST API Routes
│   ├── products.py       # Products CRUD
│   ├── users.py          # User management
│   ├── auth.py           # Authentication
│   ├── warehouses.py     # Warehouse management
│   ├── inventory.py      # Inventory counts
│   └── stock_ops.py      # Stock operations
│
├── ai_service/           # AI & Face Recognition
│   ├── face_recognition_utils.py  # Face detection/matching
│   └── routes.py         # AI endpoints
│
├── models/               # SQLAlchemy ORM Models
│   ├── user.py
│   ├── product.py
│   ├── warehouse.py
│   └── face_encoding.py
│
├── schemas/              # Pydantic Schemas
│   ├── user.py
│   └── product.py
│
├── database/             # Database config
│   ├── session.py        # DB connection
│   └── __init__.py
│
├── config/               # Configuration
│   └── settings.py       # Environment settings
│
├── utils/                # Utilities
│   └── auth.py           # JWT & password hashing
│
└── migrations/           # Alembic migrations
```

## 🚀 Cài đặt

### 1. Tạo Python Virtual Environment

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

### 2. Cài đặt Dependencies

```bash
pip install -r requirements.txt
```

**Lưu ý:** `dlib` và `face_recognition` yêu cầu:
- **Windows:** Cài đặt [Visual C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
- **Linux:** `sudo apt-get install cmake libboost-all-dev`
- **Mac:** `brew install cmake boost`

Nếu gặp lỗi cài đặt `face_recognition`, có thể dùng `deepface` thay thế:
```bash
pip install deepface
```

### 3. Cấu hình Environment

```bash
# Copy file template
cp .env.example .env

# Chỉnh sửa .env với thông tin của bạn
# - SECRET_KEY: Generate bằng: openssl rand -hex 32
# - DATABASE_URL: Thay đổi nếu dùng PostgreSQL
```

### 4. Tạo Database

```bash
# Khởi tạo tables (SQLAlchemy)
python -c "from database.session import engine, Base; from models import *; Base.metadata.create_all(bind=engine)"

# Hoặc dùng Alembic migrations (recommended)
alembic init migrations
alembic revision --autogenerate -m "Initial migration"
alembic upgrade head
```

## 🎯 Chạy Application

### Main API Server (Port 3000)

```bash
# Development mode (auto-reload)
uvicorn main:app --reload --port 3000

# Production
uvicorn main:app --host 0.0.0.0 --port 3000 --workers 4
```

### AI Service (Port 8000)

```bash
# Development
python ai_main.py

# Hoặc
uvicorn ai_main:app --reload --port 8000
```

### Chạy cả 2 service đồng thời

**Windows (PowerShell):**
```powershell
# Terminal 1
uvicorn main:app --reload --port 3000

# Terminal 2
uvicorn ai_main:app --reload --port 8000
```

**Linux/Mac:**
```bash
# Sử dụng screen hoặc tmux
screen -S api
uvicorn main:app --reload --port 3000
# Ctrl+A, D để detach

screen -S ai
uvicorn ai_main:app --reload --port 8000
```

## 📡 API Endpoints

### Main API (Port 3000)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| POST | `/auth/login` | Đăng nhập |
| POST | `/auth/register` | Đăng ký |
| GET | `/products` | Lấy danh sách sản phẩm |
| POST | `/products` | Tạo sản phẩm mới |
| GET | `/products/{id}` | Chi tiết sản phẩm |
| PUT | `/products/{id}` | Cập nhật sản phẩm |
| DELETE | `/products/{id}` | Xóa sản phẩm |
| GET | `/users` | Danh sách users |

**Swagger Docs:** http://localhost:3000/docs

### AI Service (Port 8000)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/recognize` | Nhận diện khuôn mặt |
| POST | `/register-face` | Đăng ký khuôn mặt mới |

**Swagger Docs:** http://localhost:8000/docs

## 🔧 Development Workflow

### 1. Tạo Model mới

```python
# models/warehouse.py
from sqlalchemy import Column, Integer, String
from database.session import Base

class Warehouse(Base):
    __tablename__ = "warehouses"
    id = Column(Integer, primary_key=True)
    name = Column(String(255), nullable=False)
```

### 2. Tạo Schema

```python
# schemas/warehouse.py
from pydantic import BaseModel

class WarehouseCreate(BaseModel):
    name: str

class WarehouseResponse(WarehouseCreate):
    id: int
    class Config:
        from_attributes = True
```

### 3. Tạo API Route

```python
# api/warehouses.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database.session import get_db
from models.warehouse import Warehouse
from schemas.warehouse import WarehouseCreate, WarehouseResponse

router = APIRouter()

@router.get("/", response_model=list[WarehouseResponse])
def get_warehouses(db: Session = Depends(get_db)):
    return db.query(Warehouse).all()

@router.post("/", response_model=WarehouseResponse)
def create_warehouse(data: WarehouseCreate, db: Session = Depends(get_db)):
    warehouse = Warehouse(**data.dict())
    db.add(warehouse)
    db.commit()
    db.refresh(warehouse)
    return warehouse
```

### 4. Register route trong main.py

```python
from api import warehouses
app.include_router(warehouses.router, prefix="/warehouses", tags=["Warehouses"])
```

## 🧪 Testing

```bash
# Chạy tests
pytest

# Với coverage
pytest --cov=. --cov-report=html
```

## 📦 Deployment

### Docker

```dockerfile
# Dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "3000"]
```

```bash
docker build -t track-stock-backend .
docker run -p 3000:3000 -p 8000:8000 track-stock-backend
```

## 🔐 Security Checklist

- [ ] Đổi `SECRET_KEY` trong `.env` (production)
- [ ] Sử dụng PostgreSQL thay vì SQLite (production)
- [ ] Enable HTTPS
- [ ] Cấu hình CORS đúng domain
- [ ] Rate limiting cho API
- [ ] Backup database định kỳ

## 📚 Tech Stack

- **Framework:** FastAPI 0.109
- **ORM:** SQLAlchemy 2.0
- **Database:** SQLite (dev) / PostgreSQL (prod)
- **AI:** face_recognition 1.3 + dlib
- **Auth:** python-jose + passlib
- **Server:** Uvicorn

## 🐛 Troubleshooting

### Lỗi cài đặt dlib/face_recognition
```bash
# Thử cài pre-built wheel
pip install dlib-binary
pip install face_recognition
```

### Database locked (SQLite)
- Tắt tất cả connections đang mở
- Hoặc chuyển sang PostgreSQL

### CORS errors
- Check `ALLOWED_ORIGINS` trong `.env`
- Đảm bảo frontend URL đúng

## 👨‍💻 Tiếp theo làm gì?

1. **Implement API Routes:**
   - Tạo file trong `api/` folder
   - Implement CRUD operations
   - Register routes trong `main.py`

2. **Hoàn thiện AI Service:**
   - Implement face recognition logic trong `ai_main.py`
   - Kết nối với database để lưu/load face encodings
   - Test với ảnh thật

3. **Database:**
   - Design full schema cho tất cả entities
   - Setup Alembic migrations
   - Seed initial data

4. **Authentication:**
   - Implement JWT middleware
   - Protected routes
   - Role-based access control

5. **Testing:**
   - Unit tests cho models
   - Integration tests cho API
   - E2E tests với frontend

---

**Happy Coding! 🚀**
