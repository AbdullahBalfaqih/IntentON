"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useTonConnectUI, useTonWallet } from "@tonconnect/ui-react";
import Header from "@/components/Header";
import IntentInput from "@/components/IntentInput";
import ModeToggle from "@/components/ModeToggle";
import ResultPanel from "@/components/ResultPanel";
import HistorySection from "@/components/HistorySection";
import TonLogo from "@/components/TonLogo";
import PriceTicker, { useTonPrice } from "@/components/PriceTicker";
import RecipientManager from "@/components/RecipientManager";
import StrategicInsights from "@/components/StrategicInsights";
import WalletBalance from "@/components/WalletBalance";
import AgentTerminal, { createLog } from "@/components/AgentTerminal";
import { ParsedIntent } from "@/lib/openai";
import { SimulationResult } from "@/lib/mockSimulation";

interface IntentResult {
  parsedIntent: ParsedIntent;
  simulation: SimulationResult;
  explanation: string;
  transaction?: any;
}

interface HistoryItem {
  id: string;
  text: string;
  timestamp: Date;
}

function AppContent() {
  const searchParams = useSearchParams();
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();
  const currentPrice = useTonPrice();
  
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"simulation" | "real">("simulation");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<IntentResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  // Agent State
  const [logs, setLogs] = useState<any[]>([]);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [monitoringMessage, setMonitoringMessage] = useState("");

  const addLog = (msg: string, type: "info" | "success" | "warning" | "error" | "ai" = "info") => {
    setLogs(prev => [...prev, createLog(msg, type)].slice(-50));
  };

  // Pre-fill from ?q= query param
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setInput(decodeURIComponent(q));
  }, [searchParams]);

  // Initial greeting
  useEffect(() => {
    addLog("IntentON Agent initialized. Waiting for command...", "ai");
  }, []);

  // Condition Checker Logic
  useEffect(() => {
    if (isMonitoring && result?.parsedIntent.conditions && mode === "real") {
      const conditions = result.parsedIntent.conditions.toLowerCase();
      
      // Handle Price Condition
      if (conditions.includes("price")) {
        const matches = conditions.match(/(\d+\.?\d*)/);
        if (matches) {
          const targetPrice = parseFloat(matches[0]);
          const isLessThan = conditions.includes("<") || conditions.includes("below") || conditions.includes("less");
          
          const conditionMet = isLessThan ? currentPrice <= targetPrice : currentPrice >= targetPrice;
          
          if (conditionMet) {
            addLog(`Condition matched! Current price ($${currentPrice.toFixed(3)}) ${isLessThan ? '<=' : '>='} $${targetPrice}`, "success");
            addLog("Executing on-chain transaction via TonConnect...", "info");
            triggerTransaction(result.transaction);
            setIsMonitoring(false);
            setMonitoringMessage("Condition met! Executing...");
          } else {
            // Noisy logs prevent boring terminal
            if (Math.random() > 0.8) {
              addLog(`Price check: $${currentPrice.toFixed(3)} does not meet target $${targetPrice}. Still monitoring...`, "ai");
            }
            setMonitoringMessage(`Monitoring: Waiting for price to be ${isLessThan ? 'below' : 'above'} $${targetPrice} (Current: $${currentPrice.toFixed(3)})`);
          }
        }
      }
    }
  }, [currentPrice, isMonitoring, result, mode]);

  const triggerTransaction = async (tx: any) => {
    if (!wallet || !tx) return;
    try {
      addLog("Sending transaction request to your wallet...", "info");
      const result = await tonConnectUI.sendTransaction(tx);
      addLog("Transaction Signed and Broadcasted! View on explorer: tonviewer.com", "success");
      // Could potentially parse result.boc but for a demo, this is enough
    } catch (txErr: any) {
      // Differentiate between user cancellation and other errors
      const isCancel = txErr?.message?.toLowerCase().includes("reject") || 
                      txErr?.message?.toLowerCase().includes("cancel") ||
                      txErr?.code === 300; 
      
      const reason = isCancel ? "Transaction was rejected in your wallet." : `Failed: ${txErr?.message || "Unknown error"}`;
      addLog(reason, "error");
      setError(reason);
    }
  };

  const handleSubmit = useCallback(async () => {
    const text = input.trim();
    if (!text || loading) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setIsMonitoring(false);
    
    addLog(`User Intent Received: "${text}"`, "info");
    addLog("Analyzing natural language semantics...", "ai");

    try {
      const res = await fetch("/api/interpret", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, mode }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Request failed");
      }

      const data: IntentResult = await res.json();
      setResult(data);
      addLog(`Intent Parsed: ${data.parsedIntent.action.toUpperCase()} ${data.parsedIntent.amount ?? ''} ${data.parsedIntent.token}`, "success");

      // DNS Resolution simulation
      const recipient = data.parsedIntent.recipient;
      if (recipient?.endsWith(".ton")) {
        addLog(`TON DNS: Resolving "${recipient}"...`, "ai");
        setTimeout(() => addLog(`Resolved to: EQ...${recipient.substring(0, 4)}`, "success"), 800);
      }

      // Client-side address resolution check (Match with Address Book)
      let finalTransaction = data.transaction;
      if (recipient && finalTransaction) {
        // Try to find the recipient in our local address book
        const savedRecipients = JSON.parse(localStorage.getItem("intenton_recipients") || "[]");
        const match = savedRecipients.find((r: any) => 
          r.name.toLowerCase() === recipient.toLowerCase() || 
          r.name.toLowerCase() === recipient.replace("@", "").toLowerCase()
        );

        if (match) {
          addLog(`Recipient Match: Using saved address for "${match.name}"`, "success");
          // Override the placeholder address with the real one from our address book
          if (finalTransaction.messages?.[0]) {
            finalTransaction.messages[0].address = match.address;
          }
        }
      }

      // Handle Conditions & Safety
      if (mode === "real" && wallet) {
        // Safety: Prevent sending to the zero-address placeholder in real mode
        const targetAddr = finalTransaction?.messages?.[0]?.address;
        if (targetAddr === "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c" || !targetAddr) {
          addLog("Safety Block: Recipient address could not be resolved to a valid wallet.", "error");
          setError("I couldn't find a valid address for this recipient. Please add them to your Address Book or use a full TON address.");
          setLoading(false);
          return;
        }

        if (data.parsedIntent.conditions) {
          addLog("Conditional execution detected. Entering background monitor mode...", "warning");
          setIsMonitoring(true);
          setMonitoringMessage("Analyzing conditions...");
        } else if (finalTransaction) {
          addLog("Immediate execution required. Prompting wallet...", "info");
          await triggerTransaction(finalTransaction);
        }
      } else if (mode === "real" && !wallet) {
        addLog("Real mode Error: No wallet connected.", "error");
        setError("Please connect your wallet to execute real transactions.");
      }

      // Add to history
      setHistory((prev) => {
        const filtered = prev.filter((h) => h.text !== text);
        return [
          { id: crypto.randomUUID(), text, timestamp: new Date() },
          ...filtered,
        ].slice(0, 3);
      });
    } catch (err) {
      addLog(`System Error: ${err instanceof Error ? err.message : "Unknown failure"}`, "error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [input, mode, loading, wallet, tonConnectUI]);

  const handleRecipientSelect = (recipient: { name: string; address: string }) => {
    const existingInput = input.trim();
    if (!existingInput) {
      setInput(`Send 1 TON to ${recipient.name}`);
    } else {
      const newInput = existingInput.replace(/@\w+/g, `@${recipient.name}`).replace(/to \w+/g, `to ${recipient.name}`);
      setInput(newInput);
    }
    addLog(`Agent: Updated recipient to ${recipient.name}`, "ai");
  };

  return (
    <div className="flex flex-col min-h-screen selection:bg-black selection:text-white bg-white">
      <Header />

      <main className="flex-1 px-6 py-12 relative overflow-hidden">
        {/* Background Decorative */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-neutral-50 rounded-full blur-[120px] -z-10 opacity-40" />

        <div className="max-w-[1000px] mx-auto flex flex-col gap-10">

          {/* Header Row */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <h1 className="text-5xl tracking-tighter text-black uppercase">
                  Command Center
                </h1>
                <div className="flex gap-2">
                  <span className={`text-[9px] px-2 py-1 rounded-full border tracking-widest uppercase ${wallet ? 'bg-black text-white border-black' : 'bg-neutral-100 text-neutral-400 border-neutral-200'}`}>
                    {wallet ? "ON-CHAIN" : "SANDBOX"}
                  </span>
                  <span className="text-[9px] px-2 py-1 rounded-full border border-neutral-200 bg-neutral-50 text-neutral-400 tracking-widest uppercase">
                    v2.0-Agent
                  </span>
                </div>
              </div>
              <p className="text-sm font-medium text-neutral-500 max-w-sm">
                Next-generation AI agent infrastructure for the TON blockchain.
              </p>
            </div>
            <PriceTicker />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Sidebar: Friends, History, AND Terminal */}
            <div className="lg:col-span-4 flex flex-col gap-8">
              <AgentTerminal logs={logs} />
              <RecipientManager onSelect={handleRecipientSelect} />
              <StrategicInsights onAction={setInput} />
              {history.length > 0 && (
                <HistorySection history={history} onSelect={(text) => setInput(text)} />
              )}
            </div>

            {/* Main Section */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <div className="border border-neutral-200 rounded-[2.5rem] p-10 flex flex-col gap-8 bg-white shadow-2xl shadow-neutral-100/30 relative overflow-hidden">
                {/* Decorative glow in card */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-neutral-50 rounded-full blur-[60px] opacity-50" />
                
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">Agent Strategy</span>
                    <span className="text-[10px] text-neutral-500">TON Intent Interpreter</span>
                  </div>
                  <ModeToggle mode={mode} onChange={setMode} />
                </div>

                <IntentInput
                  value={input}
                  onChange={setInput}
                  onSubmit={handleSubmit}
                  loading={loading}
                />

                {/* Monitoring Overlay */}
                {isMonitoring && (
                  <div className="p-5 bg-black text-white rounded-3xl flex items-center justify-between animate-fade-in shadow-2xl shadow-black/20 border border-neutral-800">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-3 h-3 rounded-full bg-blue-500 animate-ping absolute opacity-75" />
                        <div className="w-3 h-3 rounded-full bg-blue-500 relative" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs tracking-wide uppercase">Autonomous Monitoring</span>
                        <span className="text-[10px] text-neutral-400">{monitoringMessage}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => setIsMonitoring(false)}
                      className="text-[10px] uppercase font-black text-neutral-500 hover:text-white transition-colors border-l border-neutral-800 pl-5 h-8"
                    >
                      ABORT
                    </button>
                  </div>
                )}

                {error && (
                  <div className="rounded-2xl border border-red-100 bg-red-50/50 px-5 py-4 text-xs font-black text-red-600 animate-fade-in flex items-center gap-3 uppercase tracking-widest">
                    ERROR: {error}
                  </div>
                )}

                {/* Results Container */}
                {result && (
                  <div className="animate-fade-in border-t border-neutral-50 pt-8">
                    <ResultPanel
                      parsedIntent={result.parsedIntent}
                      simulation={result.simulation}
                      explanation={result.explanation}
                      mode={mode}
                    />
                  </div>
                )}
              </div>

              {/* Enhanced Quick Suggestions */}
              {!result && !loading && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { t: "Send 5 TON to Ahmed", label: "Immediate" },
                    { t: "Swap 10 TON to USDT if price < 2.4", label: "Deformat" },
                    { t: "Transfer 1 TON to kaze.ton", label: "TON DNS" },
                  ].map((ex) => (
                    <button
                      key={ex.t}
                      onClick={() => setInput(ex.t)}
                      className="flex flex-col items-start gap-1 p-4 border border-neutral-100 bg-neutral-50/30 rounded-2xl hover:bg-white hover:border-black hover:shadow-xl hover:shadow-neutral-100 transition-all group"
                    >
                      <span className="text-[8px] uppercase tracking-widest text-neutral-400 group-hover:text-black">{ex.label}</span>
                      <span className="text-[11px] text-neutral-500 group-hover:text-black text-left">{ex.t}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-neutral-50 py-10 px-6 text-center bg-neutral-50/30">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-300">
          Built for the TON AI HACKATHON 2024
        </p>
      </footer>
    </div>
  );
}

import { Suspense } from "react";

export default function AppPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-6">
          <TonLogo size={80} />
          <div className="flex flex-col items-center gap-1">
             <span className="text-xs font-black uppercase tracking-[0.3em] text-black">Initializing Agent</span>
             <span className="text-[10px] font-bold text-neutral-400">TON NODE: SYNCING...</span>
          </div>
        </div>
      </div>
    }>
      <AppContent />
    </Suspense>
  );
}
