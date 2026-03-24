import type { Metadata } from "next";
import { Archivo } from "next/font/google"; // Using Archivo Regular for a clean, unified system feel
import "./globals.css";
import TonConnectProvider from "@/components/TonConnectProvider";
import TelegramProvider from "@/components/TelegramProvider";
import Script from "next/script";

const archivo = Archivo({
  weight: ["400", "700"], // Supporting both regular and bold weights
  variable: "--font-archivo",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "IntentON | AI Agent for TON",
  description: "Execute blockchain intents with natural language on TON.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script 
          src="https://telegram.org/js/telegram-web-app.js" 
          strategy="beforeInteractive" 
        />
      </head>
      <body className={`${archivo.variable} antialiased selection:bg-black selection:text-white bg-white font-archivo`}>
        <TelegramProvider>
          <TonConnectProvider>
            {children}
          </TonConnectProvider>
        </TelegramProvider>
      </body>
    </html>
  );
}
