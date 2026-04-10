import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import Base, engine, SessionLocal

client = TestClient(app)


@pytest.fixture(autouse=True)
def setup_db():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


def test_register_success():
    response = client.post("/api/auth/register", json={
        "email": "test@example.com",
        "username": "testuser",
        "password": "securepass123",
        "first_name": "Test",
        "last_name": "User",
    })
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "test@example.com"


def test_register_duplicate_email():
    client.post("/api/auth/register", json={
        "email": "test@example.com",
        "username": "user1",
        "password": "pass123",
        "first_name": "A",
        "last_name": "B",
    })
    response = client.post("/api/auth/register", json={
        "email": "test@example.com",
        "username": "user2",
        "password": "pass456",
        "first_name": "C",
        "last_name": "D",
    })
    assert response.status_code == 409


def test_login_success():
    client.post("/api/auth/register", json={
        "email": "test@example.com",
        "username": "testuser",
        "password": "securepass123",
        "first_name": "Test",
        "last_name": "User",
    })
    response = client.post("/api/auth/login", json={
        "email": "test@example.com",
        "password": "securepass123",
    })
    assert response.status_code == 200
    assert "access_token" in response.json()


def test_login_invalid_credentials():
    response = client.post("/api/auth/login", json={
        "email": "nobody@example.com",
        "password": "wrong",
    })
    assert response.status_code == 401
