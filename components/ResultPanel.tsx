"use client";

import ParsedIntentBlock from "./ParsedIntentBlock";
import SimulationResult from "./SimulationResult";
import AIReasoning from "./AIReasoning";
import { ParsedIntent } from "@/lib/openai";
import { SimulationResult as SimResult } from "@/lib/mockSimulation";

interface ResultPanelProps {
  parsedIntent: ParsedIntent;
  simulation: SimResult;
  explanation: string;
  mode: "simulation" | "real";
}

export default function ResultPanel({
  parsedIntent,
  simulation,
  explanation,
  mode,
}: ResultPanelProps) {
  return (
    <div
      id="result-panel"
      className="flex flex-col gap-6 animate-fade-in"
    >
      <div className="border-t border-neutral-100 pt-6">
        <ParsedIntentBlock data={parsedIntent as unknown as Record<string, unknown>} />
      </div>
      <SimulationResult
        status={simulation.status}
        gasEstimate={simulation.gasEstimate}
        executionSummary={simulation.executionSummary}
        txHash={simulation.txHash}
        mode={mode}
      />
      <AIReasoning explanation={explanation} />
    </div>
  );
}
