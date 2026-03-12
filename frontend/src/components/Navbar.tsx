"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { removeToken } from "@/lib/auth";

export default function Navbar() {
  const router = useRouter();
  const handleLogout = () => { removeToken(); router.push("/login"); };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        <Link href="/dashboard" className="text-xl font-bold text-brand-700">AuctionHub</Link>
        <div className="flex items-center space-x-6">
          <Link href="/dashboard" className="text-gray-600 hover:text-brand-600">Dashboard</Link>
          <Link href="/auctions" className="text-gray-600 hover:text-brand-600">Auctions</Link>
          <Link href="/create-listing" className="text-gray-600 hover:text-brand-600">Sell</Link>
          <Link href="/profile" className="text-gray-600 hover:text-brand-600">Profile</Link>
          <button onClick={handleLogout} className="text-gray-500 hover:text-red-500">Logout</button>
        </div>
      </div>
    </nav>
  );
}
