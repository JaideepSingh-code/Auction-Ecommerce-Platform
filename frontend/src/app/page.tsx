import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gradient-to-r from-brand-800 to-brand-900 text-white">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">AuctionHub</h1>
          <div className="space-x-4">
            <Link href="/login" className="hover:text-brand-200">Login</Link>
            <Link href="/login" className="bg-white text-brand-700 px-4 py-2 rounded-lg font-medium hover:bg-brand-50">Sign Up</Link>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
          <h2 className="text-5xl font-bold mb-6">
            Buy & Sell at Auction
          </h2>
          <p className="text-xl text-brand-100 mb-8 max-w-2xl mx-auto">
            List your items, place competitive bids, and win incredible deals
            on our real-time auction platform.
          </p>
          <div className="space-x-4">
            <Link href="/auctions" className="bg-white text-brand-700 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-brand-50 inline-block">
              Browse Auctions
            </Link>
            <Link href="/create-listing" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-white/10 inline-block">
              Start Selling
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 py-20">
        <h3 className="text-3xl font-bold text-center mb-12 text-gray-800">How It Works</h3>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard icon="📦" title="List Your Item" description="Create a listing with photos, description, and a starting price. Set your auction duration." />
          <FeatureCard icon="🔨" title="Place Bids" description="Browse active auctions and compete with other bidders. Outbid the competition to win." />
          <FeatureCard icon="🏆" title="Win & Pay" description="Highest bid when the timer runs out wins. Secure checkout with card validation." />
        </div>
      </section>

      <section className="bg-brand-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8 text-center">
          <div><p className="text-4xl font-bold">500+</p><p className="text-brand-200">Active Auctions</p></div>
          <div><p className="text-4xl font-bold">10K+</p><p className="text-brand-200">Registered Users</p></div>
          <div><p className="text-4xl font-bold">$2M+</p><p className="text-brand-200">Total Value Traded</p></div>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-400 py-8 mt-auto">
        <p className="text-center">&copy; 2026 AuctionHub. Built with Next.js and FastAPI.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="card text-center">
      <div className="text-4xl mb-4">{icon}</div>
      <h4 className="text-xl font-semibold mb-2 text-gray-800">{title}</h4>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
