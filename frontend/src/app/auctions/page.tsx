"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import AuctionCard from "@/components/AuctionCard";
import { getAuctions } from "@/lib/api";

const CATEGORIES = ["all", "electronics", "art", "collectibles", "fashion", "home", "sports"];

export default function AuctionsPage() {
  const [auctions, setAuctions] = useState<any[]>([]);
  const [category, setCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const params: any = { status: "active" };
        if (category !== "all") params.category = category;
        if (priceRange.min) params.min_price = parseFloat(priceRange.min);
        if (priceRange.max) params.max_price = parseFloat(priceRange.max);
        const res = await getAuctions(params);
        setAuctions(res.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, [category, priceRange]);

  const filtered = search
    ? auctions.filter((a) => a.item?.title?.toLowerCase().includes(search.toLowerCase()))
    : auctions;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Browse Auctions</h2>

        {/* Search */}
        <input
          type="text" placeholder="Search auctions..." className="input-field mb-6"
          value={search} onChange={(e) => setSearch(e.target.value)}
        />

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
                category === cat ? "bg-brand-600 text-white" : "bg-white text-gray-600 hover:bg-gray-100 border"
              }`}>
              {cat}
            </button>
          ))}
          <div className="flex items-center space-x-2 ml-auto">
            <input type="number" placeholder="Min $" className="input-field w-24 text-sm"
              value={priceRange.min} onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })} />
            <span className="text-gray-400">–</span>
            <input type="number" placeholder="Max $" className="input-field w-24 text-sm"
              value={priceRange.max} onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })} />
          </div>
        </div>

        {loading ? <p className="text-gray-500">Loading...</p> : filtered.length === 0 ? (
          <div className="card text-center py-12"><p className="text-gray-500">No auctions found.</p></div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((a: any) => <AuctionCard key={a.id} auction={a} />)}
          </div>
        )}
      </main>
    </div>
  );
}
