"""
Face recognition utilities using face_recognition library
"""
import face_recognition
import numpy as np
from typing import List, Tuple, Optional
import pickle
from pathlib import Path


class FaceRecognitionService:
    """Service for face detection and recognition"""
    
    def __init__(self, tolerance: float = 0.6, model: str = "large"):
        self.tolerance = tolerance
        self.model = model  # "small" or "large"
    
    def detect_face(self, image_array: np.ndarray) -> Optional[Tuple]:
        """
        Detect face in image
        Returns: (face_locations, face_encodings) or None
        """
        face_locations = face_recognition.face_locations(image_array, model=self.model)
        
        if not face_locations:
            return None
        
        face_encodings = face_recognition.face_encodings(image_array, face_locations)
        return face_locations, face_encodings
    
    def extract_encoding(self, image_array: np.ndarray) -> Optional[np.ndarray]:
        """
        Extract face encoding from image
        Returns: 128-dimensional face encoding or None
        """
        result = self.detect_face(image_array)
        if result is None:
            return None
        
        _, face_encodings = result
        if len(face_encodings) == 0:
            return None
        
        # Return first face encoding
        return face_encodings[0]
    
    def compare_faces(
        self, 
        known_encodings: List[np.ndarray], 
        face_encoding: np.ndarray
    ) -> Tuple[List[bool], List[float]]:
        """
        Compare face encoding with known encodings
        Returns: (matches, distances)
        """
        matches = face_recognition.compare_faces(
            known_encodings, 
            face_encoding, 
            tolerance=self.tolerance
        )
        distances = face_recognition.face_distance(known_encodings, face_encoding)
        return matches, distances
    
    def find_best_match(
        self, 
        known_encodings: List[np.ndarray],
        known_names: List[str],
        face_encoding: np.ndarray
    ) -> Tuple[Optional[str], float]:
        """
        Find best matching face
        Returns: (name, confidence) or (None, 0.0)
        """
        if not known_encodings:
            return None, 0.0
        
        matches, distances = self.compare_faces(known_encodings, face_encoding)
        
        if True not in matches:
            return None, 0.0
        
        # Find best match (lowest distance)
        best_match_index = np.argmin(distances)
        if matches[best_match_index]:
            confidence = 1 - distances[best_match_index]  # Convert distance to confidence
            return known_names[best_match_index], confidence
        
        return None, 0.0
    
    @staticmethod
    def save_encoding(encoding: np.ndarray, filepath: str):
        """Save face encoding to file"""
        with open(filepath, 'wb') as f:
            pickle.dump(encoding, f)
    
    @staticmethod
    def load_encoding(filepath: str) -> np.ndarray:
        """Load face encoding from file"""
        with open(filepath, 'rb') as f:
            return pickle.load(f)
    
    @staticmethod
    def encoding_to_bytes(encoding: np.ndarray) -> bytes:
        """Convert encoding to bytes for database storage"""
        return encoding.tobytes()
    
    @staticmethod
    def bytes_to_encoding(data: bytes) -> np.ndarray:
        """Convert bytes back to encoding"""
        return np.frombuffer(data, dtype=np.float64)


# Singleton instance
face_recognition_service = FaceRecognitionService()
