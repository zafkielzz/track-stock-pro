"""
Product model
"""
from sqlalchemy import Column, Integer, String, Float, DateTime, Enum
from sqlalchemy.sql import func
from database.session import Base
import enum


class ProductStatus(str, enum.Enum):
    IN_STOCK = "in_stock"
    LOW_STOCK = "low_stock"
    OUT_OF_STOCK = "out_of_stock"


class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    sku = Column(String(100), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(String(1000))
    category = Column(String(100))
    quantity = Column(Integer, default=0)
    unit = Column(String(50), default="pcs")
    price = Column(Float, default=0.0)
    min_stock_level = Column(Integer, default=10)
    status = Column(Enum(ProductStatus), default=ProductStatus.IN_STOCK)
    image_url = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    def __repr__(self):
        return f"<Product(id={self.id}, sku={self.sku}, name={self.name})>"
