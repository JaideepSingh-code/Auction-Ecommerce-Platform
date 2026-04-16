# API Reference

Base URL: `http://localhost:8000/api`

Interactive docs: `http://localhost:8000/docs` (Swagger UI)

## Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /auth/register | Create account |
| POST | /auth/login | Get JWT token |

## Items

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /items/ | No | List items (supports ?category, ?search) |
| GET | /items/:id | No | Get item details |
| POST | /items/ | Yes | Create item listing |

## Auctions

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /auctions/ | No | List auctions (supports ?status, ?category, ?min_price, ?max_price) |
| GET | /auctions/:id | No | Get auction with bids |
| POST | /auctions/ | Yes | Create auction for your item |

## Bids

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /bids/ | Yes | Place a bid |
| GET | /bids/auction/:id | No | Get bid history |
| GET | /bids/my-bids | Yes | Get your bid history |

## Users

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | /users/me | Yes | Get profile |
| GET | /users/me/stats | Yes | Get user stats |
| POST | /users/validate-card | Yes | Validate payment card (Luhn) |
