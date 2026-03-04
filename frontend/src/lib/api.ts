import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const api = axios.create({ baseURL: API_BASE, headers: { "Content-Type": "application/json" } });

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const register = (data: { email: string; username: string; password: string; first_name: string; last_name: string }) =>
  api.post("/auth/register", data);
export const login = (email: string, password: string) =>
  api.post("/auth/login", { email, password });
export const getProfile = () => api.get("/users/me");
export const getUserStats = () => api.get("/users/me/stats");

// Items
export const createItem = (data: { title: string; description?: string; category: string; starting_price: number; image_url?: string }) =>
  api.post("/items/", data);
export const getItems = (params?: { category?: string; search?: string }) =>
  api.get("/items/", { params });

// Auctions
export const getAuctions = (params?: { status?: string; category?: string; min_price?: number; max_price?: number }) =>
  api.get("/auctions/", { params });
export const getAuction = (id: number) => api.get(`/auctions/${id}`);
export const createAuction = (data: { item_id: number; end_time: string; min_increment?: number }) =>
  api.post("/auctions/", data);

// Bids
export const placeBid = (data: { auction_id: number; amount: number }) =>
  api.post("/bids/", data);
export const getAuctionBids = (auctionId: number) =>
  api.get(`/bids/auction/${auctionId}`);
export const getMyBids = () => api.get("/bids/my-bids");

// Payment
export const validateCard = (data: { card_number: string; expiry_month: number; expiry_year: number; cvv: string }) =>
  api.post("/users/validate-card", data);

export default api;
