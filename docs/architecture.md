# Auction Platform Architecture

## System Overview

```
┌──────────────────────────────────────────┐
│          Client (Browser)                │
│    Next.js 14 + React + TypeScript       │
└───────────────┬──────────────────────────┘
                │ HTTP/REST (JSON)
┌───────────────▼──────────────────────────┐
│          API Server (FastAPI)            │
│  ┌─────────┐ ┌──────────┐ ┌──────────┐  │
│  │  Auth   │ │ Auctions │ │  Bids    │  │
│  │ (JWT)   │ │ Engine   │ │ Validator│  │
│  └─────────┘ └──────────┘ └──────────┘  │
│  ┌──────────────────────────────────┐    │
│  │   Card Validation (Luhn Algo)   │    │
│  └──────────────────────────────────┘    │
└───────────────┬──────────────────────────┘
                │ SQLAlchemy ORM
┌───────────────▼──────────────────────────┐
│          PostgreSQL Database             │
│   Users | Items | Auctions | Bids        │
└──────────────────────────────────────────┘
```

## Key Design Decisions

### MVC Pattern
Separation of concerns: FastAPI routes handle HTTP, SQLAlchemy models manage data, Pydantic schemas validate I/O.

### Forward Auction Model
Bids must exceed `current_price + min_increment`. Auctions auto-close when `end_time` passes. The highest valid bid determines the winner.

### JWT Authentication
Stateless auth via `python-jose`. Tokens expire after 60 minutes. Passwords hashed with bcrypt via `passlib`.

### Card Validation
Luhn algorithm validates card numbers client-side before submission. Card type auto-detected from prefix (Visa, Mastercard, Amex, Discover).

### Bid Validation Rules
1. Auction must be active and not expired
2. Bid amount must exceed current price + minimum increment
3. Sellers cannot bid on their own items
4. All bids are final (no retraction)
