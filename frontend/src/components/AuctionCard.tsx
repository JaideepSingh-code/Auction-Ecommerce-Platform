import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface Props {
  auction: {
    id: number; current_price: number; end_time: string; status: string; bid_count: number;
    item: { title: string; category: string; image_url?: string };
  };
}

export default function AuctionCard({ auction }: Props) {
  const timeLeft = formatDistanceToNow(new Date(auction.end_time), { addSuffix: false });
  const isEnding = new Date(auction.end_time).getTime() - Date.now() < 3600000; // < 1hr

  return (
    <Link href={`/auctions/${auction.id}`} className="card hover:shadow-lg transition-shadow group">
      <div className="h-40 bg-gradient-to-br from-brand-100 to-brand-200 rounded-lg mb-4 flex items-center justify-center">
        <span className="text-5xl">🔨</span>
      </div>
      <div className="flex justify-between items-start mb-2">
        <span className="badge bg-brand-50 text-brand-700 capitalize">{auction.item?.category}</span>
        {isEnding && <span className="badge bg-red-100 text-red-700">Ending soon</span>}
      </div>
      <h3 className="font-semibold text-gray-800 group-hover:text-brand-600 truncate">{auction.item?.title}</h3>
      <div className="mt-3 flex justify-between items-end">
        <div>
          <p className="text-xs text-gray-400">Current bid</p>
          <p className="text-xl font-bold text-brand-600">${auction.current_price.toFixed(2)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">{auction.bid_count} bids</p>
          <p className="text-sm text-gray-600">{timeLeft} left</p>
        </div>
      </div>
    </Link>
  );
}
