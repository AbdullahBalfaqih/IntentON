"use client";

import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { useEffect, useState } from "react";

export default function TonConnectProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <>{children}</>;

  return (
    <TonConnectUIProvider manifestUrl="https://raw.githubusercontent.com/ton-connect/demo-dapp-with-react-ui/master/public/tonconnect-manifest.json">
      {children}
    </TonConnectUIProvider>
  );
}
