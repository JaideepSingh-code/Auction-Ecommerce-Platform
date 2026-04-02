"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { createItem, createAuction } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import toast from "react-hot-toast";

const CATEGORIES = ["electronics", "art", "collectibles", "fashion", "home", "sports"];

export default function CreateListingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [itemId, setItemId] = useState<number | null>(null);
  const [itemForm, setItemForm] = useState({ title: "", description: "", category: "electronics", starting_price: "" });
  const [auctionForm, setAuctionForm] = useState({ duration_hours: "24", min_increment: "1.00" });
  const [loading, setLoading] = useState(false);

  if (!isAuthenticated()) { router.push("/login"); return null; }

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createItem({ ...itemForm, starting_price: parseFloat(itemForm.starting_price) });
      setItemId(res.data.id);
      toast.success("Item created! Now set auction details.");
      setStep(2);
    } catch (err: any) { toast.error(err.response?.data?.detail || "Failed"); }
    finally { setLoading(false); }
  };

  const handleCreateAuction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemId) return;
    setLoading(true);
    try {
      const endTime = new Date(Date.now() + parseInt(auctionForm.duration_hours) * 3600000).toISOString();
      await createAuction({ item_id: itemId, end_time: endTime, min_increment: parseFloat(auctionForm.min_increment) });
      toast.success("Auction is live!");
      router.push("/auctions");
    } catch (err: any) { toast.error(err.response?.data?.detail || "Failed"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Listing</h2>
        <p className="text-gray-500 mb-8">Step {step} of 2: {step === 1 ? "Item Details" : "Auction Settings"}</p>

        {step === 1 ? (
          <form onSubmit={handleCreateItem} className="card space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input className="input-field" value={itemForm.title} onChange={(e) => setItemForm({ ...itemForm, title: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea className="input-field h-24" value={itemForm.description} onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select className="input-field" value={itemForm.category} onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}>
                  {CATEGORIES.map((c) => <option key={c} value={c} className="capitalize">{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Starting Price ($)</label>
                <input type="number" step="0.01" min="0.01" className="input-field" value={itemForm.starting_price}
                  onChange={(e) => setItemForm({ ...itemForm, starting_price: e.target.value })} required />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
              {loading ? "Creating..." : "Next: Set Auction Duration"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleCreateAuction} className="card space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Auction Duration</label>
              <select className="input-field" value={auctionForm.duration_hours} onChange={(e) => setAuctionForm({ ...auctionForm, duration_hours: e.target.value })}>
                <option value="1">1 hour</option>
                <option value="6">6 hours</option>
                <option value="12">12 hours</option>
                <option value="24">24 hours</option>
                <option value="72">3 days</option>
                <option value="168">7 days</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Bid Increment ($)</label>
              <input type="number" step="0.01" min="0.01" className="input-field" value={auctionForm.min_increment}
                onChange={(e) => setAuctionForm({ ...auctionForm, min_increment: e.target.value })} required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
              {loading ? "Going live..." : "Start Auction"}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
