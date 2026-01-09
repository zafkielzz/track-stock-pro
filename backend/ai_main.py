"""
AI Service - Face Recognition API
Separate FastAPI application for face recognition (Port 8000)
"""
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import io
from PIL import Image

# Import AI utilities (will be created)
# from ai_service.face_detector import detect_and_recognize_face
# from ai_service.face_embeddings import FaceEmbeddingManager

app = FastAPI(
    title="Track Stock Pro - AI Service",
    description="Face Recognition Service for Attendance System",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Health check"""
    return {
        "status": "online",
        "service": "AI Face Recognition",
        "version": "1.0.0"
    }


@app.post("/recognize")
async def recognize_face(file: UploadFile = File(...)):
    """
    Face recognition endpoint
    Expected by frontend: AttendanceCheck.tsx
    
    Input: JPEG image from webcam
    Output: {status: "success", match: bool, name: str}
    """
    try:
        # Read image file
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # TODO: Implement face recognition logic
        # 1. Detect face in image
        # 2. Extract face embedding
        # 3. Compare with stored embeddings in database
        # 4. Return match result
        
        # Placeholder response
        return {
            "status": "success",
            "match": False,
            "name": "Unknown",
            "confidence": 0.0,
            "message": "Face recognition not yet implemented"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recognition failed: {str(e)}")


@app.post("/register-face")
async def register_face(file: UploadFile = File(...), user_id: int = None, name: str = None):
    """
    Register new face for a user
    
    Input: Image + user_id + name
    Output: Success/failure status
    """
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # TODO: Implement face registration
        # 1. Detect face
        # 2. Extract embedding
        # 3. Store in database with user_id
        
        return {
            "status": "success",
            "message": "Face registered successfully",
            "user_id": user_id,
            "name": name
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "ai_main:app",
        host="127.0.0.1",
        port=8000,
        reload=True,
        log_level="info"
    )
