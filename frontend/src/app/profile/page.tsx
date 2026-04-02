"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getProfile, getUserStats, getMyBids, validateCard } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [bids, setBids] = useState<any[]>([]);
  const [showCardForm, setShowCardForm] = useState(false);
  const [cardForm, setCardForm] = useState({ card_number: "", expiry_month: "", expiry_year: "", cvv: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) { router.push("/login"); return; }
    const fetch = async () => {
      try {
        const [u, s, b] = await Promise.all([getProfile(), getUserStats(), getMyBids()]);
        setUser(u.data); setStats(s.data); setBids(b.data);
      } catch { router.push("/login"); }
      finally { setLoading(false); }
    };
    fetch();
  }, [router]);

  const handleValidateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await validateCard({
        card_number: cardForm.card_number,
        expiry_month: parseInt(cardForm.expiry_month),
        expiry_year: parseInt(cardForm.expiry_year),
        cvv: cardForm.cvv,
      });
      toast.success(`${res.data.card_type} ending in ${res.data.last_four} is valid!`);
      setShowCardForm(false);
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Invalid card");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-gray-800">{user?.first_name} {user?.last_name}</h2>
          <p className="text-gray-500">@{user?.username}</p>
          <p className="text-sm text-gray-400 mt-1">{user?.email}</p>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xl font-bold text-brand-600">{stats?.total_bids}</p><p className="text-xs text-gray-500">Bids</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xl font-bold text-green-600">{stats?.auctions_won}</p><p className="text-xs text-gray-500">Won</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-xl font-bold text-orange-600">{stats?.active_listings}</p><p className="text-xs text-gray-500">Listings</p>
            </div>
          </div>
        </div>

        {/* Card Validation */}
        <div className="card mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800">Payment Method</h3>
            <button onClick={() => setShowCardForm(!showCardForm)} className="text-brand-600 text-sm hover:underline">
              {showCardForm ? "Cancel" : "Add Card"}
            </button>
          </div>
          {showCardForm && (
            <form onSubmit={handleValidateCard} className="space-y-3">
              <input placeholder="Card Number" className="input-field" value={cardForm.card_number}
                onChange={(e) => setCardForm({ ...cardForm, card_number: e.target.value })} required />
              <div className="grid grid-cols-3 gap-3">
                <input type="number" placeholder="MM" min="1" max="12" className="input-field" value={cardForm.expiry_month}
                  onChange={(e) => setCardForm({ ...cardForm, expiry_month: e.target.value })} required />
                <input type="number" placeholder="YYYY" min="2024" className="input-field" value={cardForm.expiry_year}
                  onChange={(e) => setCardForm({ ...cardForm, expiry_year: e.target.value })} required />
                <input placeholder="CVV" maxLength={4} className="input-field" value={cardForm.cvv}
                  onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value })} required />
              </div>
              <button type="submit" className="btn-primary w-full">Validate Card</button>
            </form>
          )}
        </div>

        {/* Bid History */}
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Your Bid History</h3>
          {bids.length === 0 ? <p className="text-gray-500">No bids placed yet.</p> : (
            <div className="space-y-2">
              {bids.slice(0, 10).map((bid: any) => (
                <div key={bid.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-800">${bid.amount.toFixed(2)}</span>
                  <span className="text-xs text-gray-400">{new Date(bid.created_at).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
