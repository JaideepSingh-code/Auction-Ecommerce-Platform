interface Bid {
  id: number; amount: number; bidder_id: number; created_at: string;
}

export default function BidHistory({ bids }: { bids: Bid[] }) {
  if (bids.length === 0) return <div className="card"><p className="text-gray-500 text-center">No bids yet. Be the first!</p></div>;

  return (
    <div className="card">
      <h3 className="font-semibold text-gray-800 mb-4">Bid History</h3>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {bids.map((bid, i) => (
          <div key={bid.id} className={`flex justify-between items-center p-3 rounded-lg ${i === 0 ? "bg-brand-50 border border-brand-200" : "bg-gray-50"}`}>
            <div>
              <span className="font-medium text-gray-800">${bid.amount.toFixed(2)}</span>
              {i === 0 && <span className="ml-2 badge bg-brand-100 text-brand-700">Highest</span>}
            </div>
            <span className="text-xs text-gray-400">
              {new Date(bid.created_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
