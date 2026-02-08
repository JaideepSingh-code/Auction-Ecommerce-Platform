from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.database import get_db
from app.models.item import Item
from app.models.user import User
from app.schemas.schemas import ItemCreate, ItemResponse
from app.utils.auth import get_current_user

router = APIRouter()


@router.get("/", response_model=list[ItemResponse])
def list_items(
    category: Optional[str] = None,
    search: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(Item)

    if category:
        query = query.filter(Item.category == category)
    if search:
        query = query.filter(Item.title.ilike(f"%{search}%"))

    return query.order_by(Item.created_at.desc()).offset(skip).limit(limit).all()


@router.get("/{item_id}", response_model=ItemResponse)
def get_item(item_id: int, db: Session = Depends(get_db)):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item


@router.post("/", response_model=ItemResponse, status_code=201)
def create_item(
    item_data: ItemCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    item = Item(
        title=item_data.title,
        description=item_data.description,
        category=item_data.category,
        image_url=item_data.image_url,
        starting_price=item_data.starting_price,
        seller_id=current_user.id,
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item
