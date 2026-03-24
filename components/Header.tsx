"use client";

import Link from "next/link";
import { TonConnectButton } from "@tonconnect/ui-react";
import TonLogo from "./TonLogo";
import WalletBalance from "./WalletBalance";

export default function Header() {
  return (
    <header className="w-full bg-white sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <TonLogo size={32} />
          <span className="text-lg font-black text-black tracking-tight uppercase">
            IntentON
          </span>
        </Link>
        <nav className="flex items-center gap-4 text-sm uppercase tracking-widest">
          <Link
            href="/app"
            className="hidden sm:block text-neutral-500 hover:text-black transition-colors duration-150 mr-2"
          >
            App
          </Link>
          <WalletBalance />
          <TonConnectButton />
        </nav>
      </div>
    </header>
  );
}
