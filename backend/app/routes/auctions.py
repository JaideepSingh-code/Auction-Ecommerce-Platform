from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from typing import Optional
from datetime import datetime
from app.database import get_db
from app.models.auction import Auction
from app.models.item import Item
from app.models.bid import Bid
from app.models.user import User
from app.schemas.schemas import AuctionCreate, AuctionResponse, AuctionDetail
from app.utils.auth import get_current_user

router = APIRouter()


@router.get("/")
def list_auctions(
    status: Optional[str] = "active",
    category: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(Auction).options(joinedload(Auction.item))

    if status:
        query = query.filter(Auction.status == status)
    if category:
        query = query.join(Item).filter(Item.category == category)
    if min_price is not None:
        query = query.filter(Auction.current_price >= min_price)
    if max_price is not None:
        query = query.filter(Auction.current_price <= max_price)

    auctions = query.order_by(Auction.end_time.asc()).offset(skip).limit(limit).all()

    result = []
    for auction in auctions:
        bid_count = db.query(Bid).filter(Bid.auction_id == auction.id).count()
        result.append({
            **AuctionResponse.from_orm(auction).dict(),
            "item": auction.item,
            "bid_count": bid_count,
        })

    return result


@router.get("/{auction_id}")
def get_auction(auction_id: int, db: Session = Depends(get_db)):
    auction = (
        db.query(Auction)
        .options(joinedload(Auction.item), joinedload(Auction.bids))
        .filter(Auction.id == auction_id)
        .first()
    )
    if not auction:
        raise HTTPException(status_code=404, detail="Auction not found")

    # Auto-close expired auctions
    if auction.status == "active" and auction.end_time < datetime.utcnow():
        _close_auction(auction, db)

    return {
        "auction": auction,
        "item": auction.item,
        "bids": auction.bids[:10],  # Latest 10 bids
        "bid_count": len(auction.bids),
    }


@router.post("/", response_model=AuctionResponse, status_code=201)
def create_auction(
    auction_data: AuctionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    item = db.query(Item).filter(Item.id == auction_data.item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    if item.seller_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only auction your own items")

    existing = db.query(Auction).filter(Auction.item_id == item.id, Auction.status == "active").first()
    if existing:
        raise HTTPException(status_code=409, detail="Item already has an active auction")

    if auction_data.end_time <= datetime.utcnow():
        raise HTTPException(status_code=400, detail="End time must be in the future")

    auction = Auction(
        item_id=item.id,
        end_time=auction_data.end_time,
        current_price=item.starting_price,
        min_increment=auction_data.min_increment or 1.0,
    )
    db.add(auction)
    db.commit()
    db.refresh(auction)
    return auction


def _close_auction(auction: Auction, db: Session):
    """Close an expired auction and determine the winner."""
    highest_bid = (
        db.query(Bid)
        .filter(Bid.auction_id == auction.id)
        .order_by(Bid.amount.desc())
        .first()
    )
    auction.status = "ended"
    if highest_bid:
        auction.winner_id = highest_bid.bidder_id
    db.commit()
