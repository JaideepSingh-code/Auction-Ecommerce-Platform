# Auction E-commerce Platform

A full-stack online auction bidding system supporting forward auctions where users list items for sale and buyers compete by placing incrementally higher bids.

## Demo

[Watch the demo on YouTube](https://www.youtube.com/watch?v=RQTsol0FD7s&feature=youtu.be)

## Tech Stack

- **Backend:** Python / FastAPI
- **Frontend:** React / Next.js / TypeScript / Tailwind CSS
- **Database:** PostgreSQL
- **Auth:** JWT (JSON Web Tokens)
- **Deployment:** Docker / Docker Compose

## Features

- **User Authentication** — Secure registration and login with JWT tokens and bcrypt password hashing
- **Item Listings** — Create, browse, and search auction listings with images, descriptions, and categories
- **Forward Auctions** — Place incrementally higher bids within a time-bound auction window
- **Real-time Updates** — Live bid tracking and auction countdown timers
- **Card Validation** — Luhn algorithm-based credit card validation for payment processing
- **User Profiles** — View bid history, active listings, and won auctions
- **Search & Filter** — Filter auctions by category, price range, and status
- **Responsive UI** — Clean, modern interface built with Tailwind CSS

## Getting Started

### Prerequisites

- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- Docker (optional)

### Quick Start with Docker

```bash
docker-compose up --build
```

Frontend: `http://localhost:3000` | API: `http://localhost:8000` | Docs: `http://localhost:8000/docs`

### Manual Setup

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## API Documentation

FastAPI auto-generates interactive docs at `/docs` (Swagger UI) and `/redoc`.

See [docs/api-reference.md](docs/api-reference.md) for the full API reference.

## Architecture

See [docs/architecture.md](docs/architecture.md) for system design details.

## Team (Baby Blue)

- Kanwarjot Singh Bharaj
- Prabhjyot Grewal
- Jaideep Singh
- Muhammad Fahad Sohail
- Svastik Sharma

## License

GPL-3.0 — see [LICENSE](LICENSE)
