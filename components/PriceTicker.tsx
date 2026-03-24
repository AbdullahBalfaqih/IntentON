"use client";

import { useEffect, useState } from "react";

const FETCH_INTERVAL = 30000; // 30 seconds

export default function PriceTicker() {
  const [price, setPrice] = useState<number | null>(null);
  const [prevPrice, setPrevPrice] = useState<number | null>(null);

  const fetchPrice = async () => {
    try {
      // Use local API proxy to avoid CORS/Rate-limit issues
      const res = await fetch("/api/ton-price");
      const data = await res.json();
      const newPrice = data.price;
      
      if (newPrice) {
        setPrevPrice(price ?? newPrice);
        setPrice(newPrice);
      }
    } catch (err) {
      console.error("Failed to fetch TON price via proxy:", err);
    }
  };

  useEffect(() => {
    fetchPrice();
    const interval = setInterval(fetchPrice, FETCH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const change = price && prevPrice ? price - prevPrice : 0;

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-neutral-50 rounded-xl border border-neutral-100 min-w-[140px]">
      <div className="flex flex-col">
        <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 leading-none mb-1">TON / USD</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-black">
            {price ? `$${price.toFixed(3)}` : "---"}
          </span>
          {price && change !== 0 && (
            <span className={`text-[10px] font-bold ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {change >= 0 ? 'UP' : 'DOWN'} {Math.abs(change).toFixed(3)}
            </span>
          )}
        </div>
      </div>
      <div className={`w-1.5 h-1.5 rounded-full ${price ? 'bg-green-500 animate-pulse' : 'bg-neutral-200'}`} />
    </div>
  );
}

export function useTonPrice() {
  const [price, setPrice] = useState(1.31); // Default fallback

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const res = await fetch("/api/ton-price");
        const data = await res.json();
        const newPrice = data.price;
        if (newPrice) setPrice(newPrice);
      } catch (err) {
        console.error("Price hook fetch failed via proxy:", err);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, FETCH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return price;
}
