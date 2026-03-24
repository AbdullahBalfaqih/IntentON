import Link from "next/link";
import Header from "@/components/Header";
import TonLogo from "@/components/TonLogo";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen selection:bg-black selection:text-white overflow-x-hidden">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 relative">
        {/* Background Decorative Element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neutral-100 rounded-full blur-[120px] -z-10 opacity-50" />

        {/* Ton Logo Animation */}
        <div className="mb-12 relative cursor-default">
          <TonLogo size={120} />
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full border border-neutral-200 bg-white shadow-sm text-[10px] font-bold uppercase tracking-widest text-neutral-400">
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 inline-block animate-pulse" />
            Wallet Ready
          </div>
        </div>

        {/* Hero */}
        <div className="max-w-3xl text-center flex flex-col items-center gap-8 animate-fade-in">
          <h1 className="text-6xl sm:text-7xl font-bold tracking-tighter text-black leading-[1.1]">
            Execute <span className="text-neutral-400">TON</span> Actions <br />
            with <span className="font-black underline decoration-neutral-100 underline-offset-8">Natural Language</span>
          </h1>

          <p className="text-xl text-neutral-500 leading-relaxed max-w-xl mx-auto">
            The bridge between your intent and the TON blockchain. 
            Connect your wallet to execute real transactions instantly using AI.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
            <Link
              id="try-demo-btn"
              href="/app"
              className="group relative inline-flex items-center gap-3 px-10 py-5 bg-black text-white text-lg font-black rounded-2xl hover:bg-neutral-800 active:scale-[0.98] transition-all duration-200 shadow-2xl shadow-black/20 uppercase tracking-widest"
            >
              Start Executing
            </Link>
            <a
              href="https://ton.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-black text-neutral-400 hover:text-black transition-colors duration-150 border-b border-transparent hover:border-black uppercase tracking-widest"
            >
              Explore Ecosystem
            </a>
          </div>
        </div>

        {/* Stats / Proof strip */}
        <div className="mt-24 pt-12 border-t border-neutral-100 grid grid-cols-1 sm:grid-cols-3 gap-12 max-w-3xl w-full text-center">
          {[
            { label: "Execution", value: "Real-time" },
            { label: "Blockchain", value: "TON Mainnet" },
            { label: "Intelligence", value: "GPT-4o Optimized" },
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-300">
                {stat.label}
              </span>
              <span className="text-lg font-bold text-black">{stat.value}</span>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-neutral-50 py-10 px-6 text-center bg-neutral-50/30">
        <p className="text-xs font-medium text-neutral-400 flex items-center justify-center gap-2">
          <span>IntentON</span>
          <span className="w-1 h-1 rounded-full bg-neutral-200" />
          <span>TON Hackathon 2024</span>
          <span className="w-1 h-1 rounded-full bg-neutral-200" />
          <span className="bg-white px-2 py-0.5 border border-neutral-100 rounded text-[10px] font-black">
             Live Mainnet Support
          </span>
        </p>
      </footer>
    </div>
  );
}
