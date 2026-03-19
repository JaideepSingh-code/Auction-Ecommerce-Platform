"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { getProfile, getUserStats, getAuctions } from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import Link from "next/link";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [recentAuctions, setRecentAuctions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) { router.push("/login"); return; }
    const fetchData = async () => {
      try {
        const [u, s, a] = await Promise.all([getProfile(), getUserStats(), getAuctions({ status: "active" })]);
        setUser(u.data);
        setStats(s.data);
        setRecentAuctions(a.data.slice(0, 4));
      } catch { router.push("/login"); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p>Loading...</p></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Welcome, {user?.first_name}!</h2>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card text-center">
            <p className="text-3xl font-bold text-brand-600">{stats?.total_bids || 0}</p>
            <p className="text-sm text-gray-500 mt-1">Total Bids Placed</p>
          </div>
          <div className="card text-center">
            <p className="text-3xl font-bold text-green-600">{stats?.auctions_won || 0}</p>
            <p className="text-sm text-gray-500 mt-1">Auctions Won</p>
          </div>
          <div className="card text-center">
            <p className="text-3xl font-bold text-orange-600">{stats?.active_listings || 0}</p>
            <p className="text-sm text-gray-500 mt-1">Active Listings</p>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Active Auctions</h3>
          <Link href="/auctions" className="text-brand-600 hover:underline text-sm">View All</Link>
        </div>

        {recentAuctions.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-500">No active auctions right now.</p>
            <Link href="/create-listing" className="text-brand-600 hover:underline mt-2 inline-block">Create the first one</Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentAuctions.map((a: any) => (
              <Link key={a.id} href={`/auctions/${a.id}`} className="card hover:shadow-lg transition-shadow">
                <span className="badge bg-green-100 text-green-700 mb-2 inline-block">{a.status}</span>
                <h4 className="font-semibold text-gray-800 truncate">{a.item?.title}</h4>
                <p className="text-2xl font-bold text-brand-600 mt-2">${a.current_price?.toFixed(2)}</p>
                <p className="text-xs text-gray-400 mt-1">{a.bid_count} bids</p>
              </Link>
            ))}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <Link href="/create-listing" className="card hover:shadow-lg transition-shadow text-center">
            <div className="text-3xl mb-2">📦</div>
            <h4 className="font-semibold text-gray-800">List an Item</h4>
            <p className="text-sm text-gray-500">Start selling at auction</p>
          </Link>
          <Link href="/auctions" className="card hover:shadow-lg transition-shadow text-center">
            <div className="text-3xl mb-2">🔨</div>
            <h4 className="font-semibold text-gray-800">Browse & Bid</h4>
            <p className="text-sm text-gray-500">Find your next deal</p>
          </Link>
        </div>
      </main>
    </div>
  );
}
