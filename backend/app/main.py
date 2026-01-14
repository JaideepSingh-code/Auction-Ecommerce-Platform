from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routes import auth, items, auctions, bids, users

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Auction E-commerce API",
    description="A full-stack auction bidding platform",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(items.router, prefix="/api/items", tags=["Items"])
app.include_router(auctions.router, prefix="/api/auctions", tags=["Auctions"])
app.include_router(bids.router, prefix="/api/bids", tags=["Bids"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])


@app.get("/api/health")
def health_check():
    return {"status": "healthy", "service": "Auction E-commerce API"}
