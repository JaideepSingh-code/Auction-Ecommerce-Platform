# Auction E-commerce Platform

A full-stack auction system where sellers list items and buyers compete through real-time bidding. Built with FastAPI, React, TypeScript, and PostgreSQL, fully containerized with Docker Compose.

## Demo

[Watch the demo on YouTube](https://www.youtube.com/watch?v=RQTsol0FD7s&feature=youtu.be)

## Tech Stack

- **Backend:** Python / FastAPI
- **Frontend:** React, TypeScript, TailwindCSS
- **Database:** PostgreSQL
- **Migrations:** Alembic
- **API Docs:** OpenAPI / Swagger (auto-generated)
- **Auth:** JWT tokens, bcrypt password hashing
- **Deployment:** Docker / Docker Compose

## Setup Instructions

**Step 1: Clone the repository**

```bash
git clone https://github.com/JaideepSingh-code/Auction-Ecommerce-Platform.git
cd Auction-Ecommerce-Platform
```

**Prerequisites:**
- Install Docker: `brew install docker`
- Download [Docker Desktop](https://www.docker.com/products/docker-desktop)

**Step 2: Start all containers** (takes ~30–60 seconds to build)

The Dockerfiles install all dependencies, run migrations to populate the database (including seeding categories), and start both backend and frontend services.

```bash
docker-compose up --build
```

This will start:
- **Backend** at: http://127.0.0.1:8000
- **Frontend** at: http://localhost:3000
- **PostgreSQL** at: http://localhost:5434

```
POSTGRES_DB: auction_db
POSTGRES_USER: auction_user
POSTGRES_PASSWORD: auction_password
PORT: 5434

DATABASE_URL = "postgresql://auction_user:auction_password@localhost:5434/auction_db"
```

**Step 3: Verify containers are running**

```bash
docker ps
```

Expected output:
```
CONTAINER ID   IMAGE                                    STATUS   PORTS
f381795e7b9f   auction-ecommerce-platform-backend       Up       0.0.0.0:8000->8000/tcp
abc123def456   auction-ecommerce-platform-frontend      Up       0.0.0.0:3000->3000/tcp
abe4291b927d   postgres:15                              Up       0.0.0.0:5434->5432/tcp
```

## API Endpoints

Interactive API documentation is auto-generated at: http://localhost:8000/docs#

## Postman Testing

A detailed Postman collection simulates real buyer–seller interactions across the full bidding lifecycle.

The collection is organized into folders (`/auth`, `/users`, `/catalogue`, `/auction`, `/orders`, `/delete_endpoints`), following the logical user flow. Each request uses collection variables — like `accessToken`, `addressId`, `categoryId`, and `itemId` — that are automatically set by post-request scripts. For instance, when a user logs in through `/auth/login`, the script extracts the `access_token` and saves it as a variable, letting all protected requests run seamlessly without manual setup.

**Testing flow (run top to bottom):**

1. Create the buyer and seller accounts, stay logged in as the seller
2. Log in as the buyer to create an address or browse auction items
3. Log in as the seller to create categories or list new items for auction
4. Switch back to the buyer to place bids, check bidding status, and complete an order (pay for an order)

This approach simulates both sides of the marketplace in a consistent, automated way — verifying that authentication, endpoint flows, and state transitions all work correctly end to end.

## Database Schema

### Core Tables

1. **Users and Authentication**
   - `users` — User accounts with authentication
   - `addresses` — User shipping addresses
   - `auth_sessions` — Active user sessions
   - `password_reset_tokens` — Password reset functionality

2. **Catalogue Management**
   - `categories` — Product categories (hierarchical)
   - `catalogue_items` — Products/items for sale
   - `item_images` — Product images

3. **Auction System**
   - `auctions` — Auction listings
   - `bids` — User bids on auctions

4. **Order Management**
   - `orders` — Purchase orders
   - `payments` — Payment processing
   - `receipts` — Order receipts
   - `shipments` — Shipping information

### Database Commands

Use the `db_commands.py` script for database operations:

```bash
# Initialize database (create all tables)
python db_commands.py init-db

# Create a new migration
python db_commands.py create "Add new feature"

# Run migrations
python db_commands.py migrate

# Show migration history
python db_commands.py history

# Show current revision
python db_commands.py current

# Downgrade by one revision
python db_commands.py downgrade
```

### Manual Alembic Commands

```bash
# Create migration
alembic revision --autogenerate -m "Description"

# Run migrations
alembic upgrade head

# Show history
alembic history

# Show current revision
alembic current
```

## Model Structure

All SQLAlchemy models are organized in the `app/models/` directory:

- `user.py` — User-related models
- `catalogue.py` — Product catalogue models
- `auction.py` — Auction system models
- `order.py` — Order management models
- `event_log.py` — Event logging model

## Security Features

- Password hashing with bcrypt
- JWT-based authentication with session management
- Password reset tokens with expiration
- Input validation and constraints

## Development Notes

- The system uses psycopg3 (psycopg) as the PostgreSQL adapter
- All migrations are auto-generated from model changes
- The database URL is automatically converted to use the psycopg driver
- Models are imported in `app/models/__init__.py` to ensure they're registered with SQLAlchemy

## Team

- Kanwarjot Singh Bharaj
- Prabhjyot Grewal
- Jaideep Singh
- Muhammad Fahad Sohail
- Svastik Sharma

## License

GPL-3.0 — see [LICENSE](LICENSE)
