import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Auction Platform - Buy & Sell at Auction",
  description: "A full-stack online auction bidding platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
