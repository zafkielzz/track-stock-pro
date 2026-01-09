"""
Track Stock Pro - Main Backend Application
FastAPI application for inventory management and AI face recognition
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

# Import routers (will be created)
# from api.routes import products, users, warehouses, inventory, stock_ops, auth
# from ai_service.routes import face_recognition

# from database.session import engine, Base


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events"""
    # Startup: Create database tables
    print("🚀 Starting Track Stock Pro Backend...")
    # Base.metadata.create_all(bind=engine)
    yield
    # Shutdown
    print("🛑 Shutting down...")


app = FastAPI(
    title="Track Stock Pro API",
    description="Backend API for Inventory Management System with AI Face Recognition",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware - Allow frontend to communicate
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "online",
        "message": "Track Stock Pro Backend API is running",
        "version": "1.0.0"
    }


@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "database": "connected",  # Will implement DB check
        "ai_service": "ready"
    }


# Register API routers
# app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
# app.include_router(products.router, prefix="/products", tags=["Products"])
# app.include_router(users.router, prefix="/users", tags=["Users"])
# app.include_router(warehouses.router, prefix="/warehouses", tags=["Warehouses"])
# app.include_router(inventory.router, prefix="/inventory", tags=["Inventory"])
# app.include_router(stock_ops.router, prefix="/stock-operations", tags=["Stock Operations"])

# Register AI router
# app.include_router(face_recognition.router, prefix="/ai", tags=["AI Services"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=3000,
        reload=True,
        log_level="info"
    )
