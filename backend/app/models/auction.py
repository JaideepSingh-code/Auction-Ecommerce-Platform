from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime


class Auction(Base):
    __tablename__ = "auctions"

    id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer, ForeignKey("items.id"), nullable=False, unique=True)
    start_time = Column(DateTime, default=datetime.utcnow)
    end_time = Column(DateTime, nullable=False)
    current_price = Column(Float, nullable=False)
    min_increment = Column(Float, default=1.0)
    status = Column(String(20), default="active")  # active, ended, cancelled
    winner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    item = relationship("Item", back_populates="auction")
    bids = relationship("Bid", back_populates="auction", order_by="Bid.amount.desc()")
    winner = relationship("User", foreign_keys=[winner_id])
