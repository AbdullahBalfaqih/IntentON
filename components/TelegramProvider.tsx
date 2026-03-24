"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface TelegramContextType {
  isTMA: boolean;
  user: any;
  platform: string;
}

const TelegramContext = createContext<TelegramContextType>({
  isTMA: false,
  user: null,
  platform: "unknown",
});

export const useTelegram = () => useContext(TelegramContext);

export default function TelegramProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<TelegramContextType>({
    isTMA: false,
    user: null,
    platform: "unknown",
  });

  useEffect(() => {
    // Check if running inside Telegram
    const tg = (window as any).Telegram?.WebApp;
    if (tg && tg.initData) {
      setState({
        isTMA: true,
        user: tg.initDataUnsafe?.user || null,
        platform: tg.platform || "unknown",
      });
      tg.ready();
      tg.expand();
      
      // Set theme colors if possible
      document.documentElement.style.setProperty('--tg-theme-bg-color', tg.backgroundColor || '#ffffff');
    }
  }, []);

  return (
    <TelegramContext.Provider value={state}>
      {children}
    </TelegramContext.Provider>
  );
}
