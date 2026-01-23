from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime


class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False, index=True)
    description = Column(Text)
    category = Column(String(50), index=True)
    image_url = Column(String(500))
    starting_price = Column(Float, nullable=False)
    seller_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    seller = relationship("User", back_populates="items")
    auction = relationship("Auction", back_populates="item", uselist=False)
