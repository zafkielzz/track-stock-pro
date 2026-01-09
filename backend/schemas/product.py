"""
Product schemas
"""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from models.product import ProductStatus


class ProductBase(BaseModel):
    sku: str
    name: str
    description: Optional[str] = None
    category: Optional[str] = None
    quantity: int = 0
    unit: str = "pcs"
    price: float = 0.0
    min_stock_level: int = 10


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    sku: Optional[str] = None
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    quantity: Optional[int] = None
    unit: Optional[str] = None
    price: Optional[float] = None
    min_stock_level: Optional[int] = None
    status: Optional[ProductStatus] = None


class ProductResponse(ProductBase):
    id: int
    status: ProductStatus
    image_url: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
