from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.bid import Bid
from app.models.item import Item
from app.models.auction import Auction
from app.schemas.schemas import UserResponse, CardValidation
from app.utils.auth import get_current_user
from app.utils.validators import validate_card_number, validate_expiry

router = APIRouter()


@router.get("/me", response_model=UserResponse)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user


@router.get("/me/stats")
def get_user_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    total_bids = db.query(Bid).filter(Bid.bidder_id == current_user.id).count()
    active_listings = (
        db.query(Item)
        .join(Auction)
        .filter(Item.seller_id == current_user.id, Auction.status == "active")
        .count()
    )
    auctions_won = (
        db.query(Auction)
        .filter(Auction.winner_id == current_user.id, Auction.status == "ended")
        .count()
    )

    return {
        "total_bids": total_bids,
        "active_listings": active_listings,
        "auctions_won": auctions_won,
    }


@router.post("/validate-card")
def validate_payment_card(card: CardValidation, _: User = Depends(get_current_user)):
    result = validate_card_number(card.card_number)

    if not result["valid"]:
        raise HTTPException(status_code=400, detail=result.get("error", "Invalid card"))

    if not validate_expiry(card.expiry_month, card.expiry_year):
        raise HTTPException(status_code=400, detail="Card has expired")

    if len(card.cvv) not in (3, 4):
        raise HTTPException(status_code=400, detail="Invalid CVV")

    return {
        "valid": True,
        "card_type": result["card_type"],
        "last_four": result["last_four"],
    }
