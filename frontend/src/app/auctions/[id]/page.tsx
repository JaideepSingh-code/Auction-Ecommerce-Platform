"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import BidHistory from "@/components/BidHistory";
import { getAuction, placeBid, getAuctionBids } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";

export default function AuctionDetailPage() {
  const { id } = useParams();
  const [auction, setAuction] = useState<any>(null);
  const [bids, setBids] = useState<any[]>([]);
  const [bidAmount, setBidAmount] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [auctionRes, bidsRes] = await Promise.all([
        getAuction(Number(id)),
        getAuctionBids(Number(id)),
      ]);
      setAuction(auctionRes.data);
      setBids(bidsRes.data);
      const minBid = auctionRes.data.auction.current_price + auctionRes.data.auction.min_increment;
      setBidAmount(minBid.toFixed(2));
    } catch { console.error("Failed to load auction"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleBid = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated()) { toast.error("Please login to bid"); return; }
    try {
      await placeBid({ auction_id: Number(id), amount: parseFloat(bidAmount) });
      toast.success("Bid placed!");
      fetchData(); // Refresh
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to place bid");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>;
  if (!auction) return <div className="min-h-screen flex items-center justify-center"><p>Auction not found</p></div>;

  const { auction: auc, item } = auction;
  const isActive = auc.status === "active" && new Date(auc.end_time) > new Date();
  const timeLeft = isActive ? formatDistanceToNow(new Date(auc.end_time), { addSuffix: false }) : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Item info */}
          <div>
            <div className="h-64 bg-gradient-to-br from-brand-100 to-brand-200 rounded-xl flex items-center justify-center mb-6">
              <span className="text-7xl">🔨</span>
            </div>
            <span className="badge bg-brand-50 text-brand-700 capitalize mb-3 inline-block">{item?.category}</span>
            <h1 className="text-3xl font-bold text-gray-800 mb-3">{item?.title}</h1>
            <p className="text-gray-600">{item?.description || "No description provided."}</p>
            <p className="text-sm text-gray-400 mt-4">Starting price: ${item?.starting_price.toFixed(2)}</p>
          </div>

          {/* Right: Bidding */}
          <div>
            <div className="card mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className={`badge ${isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                  {isActive ? "Active" : auc.status}
                </span>
                {timeLeft && <span className="text-sm text-gray-500">{timeLeft} remaining</span>}
              </div>

              <p className="text-sm text-gray-400">Current highest bid</p>
              <p className="text-4xl font-bold text-brand-600 mb-2">${auc.current_price.toFixed(2)}</p>
              <p className="text-sm text-gray-500 mb-6">{auction.bid_count} bids · Min increment: ${auc.min_increment.toFixed(2)}</p>

              {isActive ? (
                <form onSubmit={handleBid} className="space-y-3">
                  <div className="flex space-x-3">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                      <input type="number" step="0.01" className="input-field pl-7" value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)} required />
                    </div>
                    <button type="submit" className="btn-primary">Place Bid</button>
                  </div>
                </form>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-gray-600 font-medium">Auction has ended</p>
                  {auc.winner_id && <p className="text-sm text-gray-500 mt-1">Winner determined</p>}
                </div>
              )}
            </div>

            <BidHistory bids={bids} />
          </div>
        </div>
      </main>
    </div>
  );
}
