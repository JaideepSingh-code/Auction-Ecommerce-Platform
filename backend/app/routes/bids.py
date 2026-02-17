from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from app.database import get_db
from app.models.auction import Auction
from app.models.bid import Bid
from app.models.user import User
from app.schemas.schemas import BidCreate, BidResponse
from app.utils.auth import get_current_user

router = APIRouter()


@router.post("/", response_model=BidResponse, status_code=201)
def place_bid(
    bid_data: BidCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    auction = db.query(Auction).filter(Auction.id == bid_data.auction_id).first()
    if not auction:
        raise HTTPException(status_code=404, detail="Auction not found")

    # Validation checks
    if auction.status != "active":
        raise HTTPException(status_code=400, detail="Auction is no longer active")

    if auction.end_time < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Auction has ended")

    if auction.item.seller_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot bid on your own item")

    min_bid = auction.current_price + auction.min_increment
    if bid_data.amount < min_bid:
        raise HTTPException(
            status_code=400,
            detail=f"Bid must be at least ${min_bid:.2f} (current: ${auction.current_price:.2f} + increment: ${auction.min_increment:.2f})",
        )

    # Place the bid
    bid = Bid(
        auction_id=auction.id,
        bidder_id=current_user.id,
        amount=bid_data.amount,
    )
    db.add(bid)

    # Update auction current price
    auction.current_price = bid_data.amount
    db.commit()
    db.refresh(bid)

    return bid


@router.get("/auction/{auction_id}", response_model=list[BidResponse])
def get_auction_bids(auction_id: int, db: Session = Depends(get_db)):
    bids = (
        db.query(Bid)
        .filter(Bid.auction_id == auction_id)
        .order_by(Bid.amount.desc())
        .all()
    )
    return bids


@router.get("/my-bids", response_model=list[BidResponse])
def get_my_bids(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(Bid)
        .filter(Bid.bidder_id == current_user.id)
        .order_by(Bid.created_at.desc())
        .all()
    )
