"use client";

import { useEffect, useState } from "react";
import { useTonWallet } from "@tonconnect/ui-react";

export default function WalletBalance() {
  const wallet = useTonWallet();
  const [balance, setBalance] = useState<string | null>(null);

  useEffect(() => {
    if (!wallet?.account.address) {
      setBalance(null);
      return;
    }

    const fetchBalance = async () => {
      try {
        // Use Toncenter API (Mainnet or Testnet based on wallet)
        const isTestnet = wallet.account.chain === "-3"; 
        const baseUrl = isTestnet 
          ? "https://testnet.toncenter.com/api/v2" 
          : "https://toncenter.com/api/v2";
          
        const res = await fetch(`${baseUrl}/getAddressInformation?address=${wallet.account.address}`);
        const data = await res.json();
        
        if (data.ok && data.result) {
          const rawBalance = data.result.balance;
          // Convert nanotons to TON
          const tonBalance = (parseInt(rawBalance) / 1000000000).toFixed(2);
          setBalance(tonBalance);
        }
      } catch (err) {
        console.error("Failed to fetch wallet balance:", err);
      }
    };

    fetchBalance();
    const interval = setInterval(fetchBalance, 30000); // 30s update
    return () => clearInterval(interval);
  }, [wallet?.account.address, wallet?.account.chain]);

  if (!wallet || balance === null) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-black rounded-lg border border-black shadow-sm h-[38px]">
      <span className="text-[10px] text-neutral-400 uppercase tracking-widest">Balance</span>
      <span className="text-xs text-white">
        {balance} TON
      </span>
    </div>
  );
}
