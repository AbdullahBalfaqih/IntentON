"use client";

import { useEffect, useState } from "react";

interface Insight {
  id: string;
  type: "pattern" | "efficiency" | "automation";
  title: string;
  description: string;
  actionLabel: string;
}

interface StrategicInsightsProps {
  historyCount: number;
  recipientCount: number;
  onAction: (suggestion: string) => void;
}

export default function StrategicInsights({ onAction }: { onAction: (s: string) => void }) {
  const [insights, setInsights] = useState<Insight[]>([]);

  useEffect(() => {
    // Get real counts from localStorage
    const history = JSON.parse(localStorage.getItem("intenton_history") || "[]");
    const recipients = JSON.parse(localStorage.getItem("intenton_recipients") || "[]");
    
    const historyCount = history.length;
    const recipientCount = recipients.length;
    
    // Simulated heuristic-based insight generation
    const newInsights: Insight[] = [];

    if (recipientCount > 0) {
      newInsights.push({
        id: "1",
        type: "pattern",
        title: "Frequent Recipient Detected",
        description: "You frequently interact with your saved friends. Suggest scheduling a recurring transfer?",
        actionLabel: "Schedule Transfer"
      });
    }

    if (historyCount > 2) {
      newInsights.push({
        id: "2",
        type: "efficiency",
        title: "Liquidity Optimization",
        description: "TON price is currently stable. This is a high-efficiency window for bulk USDT swaps.",
        actionLabel: "Optimize Liquidity"
      });
    }

    if (historyCount > 0) {
      newInsights.push({
        id: "3",
        type: "automation",
        title: "Price Monitoring Guard",
        description: "You've checked price conditions multiple times. Want to enable 24/7 autonomous monitoring?",
        actionLabel: "Enable Guard"
      });
    }

    setInsights(newInsights.slice(0, 2)); // Show top 2 insights
  }, []);

  if (insights.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 px-1">
        <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">Strategic AI Insights</span>
        <span className="text-[8px] px-1.5 py-0.5 bg-sky-50 text-sky-500 border border-sky-100 rounded-full uppercase">Proactive</span>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {insights.map((insight) => (
          <div 
            key={insight.id}
            className="p-4 bg-white border border-neutral-100 rounded-2xl flex flex-col gap-2 transition-all hover:border-black/10 group"
          >
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider">{insight.title}</span>
              <p className="text-xs text-neutral-600 leading-relaxed">{insight.description}</p>
            </div>
            <button
              onClick={() => onAction(insight.actionLabel)}
              className="mt-1 text-[10px] uppercase tracking-widest text-black border border-neutral-200 px-3 py-1.5 rounded-lg hover:bg-black hover:text-white transition-all w-fit"
            >
              {insight.actionLabel}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
