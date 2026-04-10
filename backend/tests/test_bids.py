import pytest
from fastapi.testclient import TestClient
from datetime import datetime, timedelta
from app.main import app
from app.database import Base, engine

client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


def _create_user_and_get_token(email, username):
    res = client.post("/api/auth/register", json={
        "email": email,
        "username": username,
        "password": "pass123",
        "first_name": "Test",
        "last_name": "User",
    })
    return res.json()["access_token"]


def test_bid_below_minimum_rejected():
    seller_token = _create_user_and_get_token("seller@test.com", "seller")
    bidder_token = _create_user_and_get_token("bidder@test.com", "bidder")

    # Create item
    item_res = client.post("/api/items/", json={
        "title": "Test Item",
        "category": "electronics",
        "starting_price": 100.0,
    }, headers={"Authorization": f"Bearer {seller_token}"})
    item_id = item_res.json()["id"]

    # Create auction
    end_time = (datetime.utcnow() + timedelta(hours=24)).isoformat()
    auction_res = client.post("/api/auctions/", json={
        "item_id": item_id,
        "end_time": end_time,
        "min_increment": 5.0,
    }, headers={"Authorization": f"Bearer {seller_token}"})
    auction_id = auction_res.json()["id"]

    # Bid below minimum
    bid_res = client.post("/api/bids/", json={
        "auction_id": auction_id,
        "amount": 102.0,  # Below 100 + 5 = 105
    }, headers={"Authorization": f"Bearer {bidder_token}"})
    assert bid_res.status_code == 400


def test_seller_cannot_bid_on_own_item():
    seller_token = _create_user_and_get_token("seller@test.com", "seller")

    item_res = client.post("/api/items/", json={
        "title": "My Item",
        "category": "art",
        "starting_price": 50.0,
    }, headers={"Authorization": f"Bearer {seller_token}"})
    item_id = item_res.json()["id"]

    end_time = (datetime.utcnow() + timedelta(hours=24)).isoformat()
    auction_res = client.post("/api/auctions/", json={
        "item_id": item_id,
        "end_time": end_time,
    }, headers={"Authorization": f"Bearer {seller_token}"})
    auction_id = auction_res.json()["id"]

    bid_res = client.post("/api/bids/", json={
        "auction_id": auction_id,
        "amount": 100.0,
    }, headers={"Authorization": f"Bearer {seller_token}"})
    assert bid_res.status_code == 400
