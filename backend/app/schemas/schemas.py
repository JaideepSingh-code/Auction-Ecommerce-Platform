from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


# --- User Schemas ---
class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str
    first_name: str
    last_name: str
    phone: Optional[str] = None
    address: Optional[str] = None


class UserResponse(BaseModel):
    id: int
    email: str
    username: str
    first_name: str
    last_name: str
    phone: Optional[str]
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    email: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse


# --- Item Schemas ---
class ItemCreate(BaseModel):
    title: str
    description: Optional[str] = None
    category: str
    image_url: Optional[str] = None
    starting_price: float


class ItemResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    category: str
    image_url: Optional[str]
    starting_price: float
    seller_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# --- Auction Schemas ---
class AuctionCreate(BaseModel):
    item_id: int
    end_time: datetime
    min_increment: Optional[float] = 1.0


class AuctionResponse(BaseModel):
    id: int
    item_id: int
    start_time: datetime
    end_time: datetime
    current_price: float
    min_increment: float
    status: str
    winner_id: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True


class AuctionDetail(AuctionResponse):
    item: ItemResponse
    bid_count: int = 0


# --- Bid Schemas ---
class BidCreate(BaseModel):
    auction_id: int
    amount: float


class BidResponse(BaseModel):
    id: int
    auction_id: int
    bidder_id: int
    amount: float
    created_at: datetime

    class Config:
        from_attributes = True


# --- Card Validation ---
class CardValidation(BaseModel):
    card_number: str
    expiry_month: int
    expiry_year: int
    cvv: str
