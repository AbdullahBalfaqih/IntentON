"use client";

interface SimulationResultProps {
  status: "success" | "pending" | "failed";
  gasEstimate: string;
  executionSummary: string;
  txHash: string;
  mode: "simulation" | "real";
}

const STATUS_CONFIG = {
  success: {
    label: "Success",
    dot: "bg-neutral-800",
    badge: "bg-neutral-100 text-neutral-800 border-neutral-200",
  },
  pending: {
    label: "Pending",
    dot: "bg-neutral-400",
    badge: "bg-neutral-50 text-neutral-600 border-neutral-200",
  },
  failed: {
    label: "Failed",
    dot: "bg-neutral-950",
    badge: "bg-neutral-950 text-white border-neutral-950",
  },
};

export default function SimulationResult({
  status,
  gasEstimate,
  executionSummary,
  txHash,
  mode,
}: SimulationResultProps) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs uppercase tracking-widest text-neutral-400">
        Simulation Result
      </h3>
      <div className="border border-neutral-200 rounded-lg p-4 flex flex-col gap-3 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`inline-block w-2 h-2 rounded-full ${cfg.dot}`}
            />
            <span
              className={`text-xs px-2.5 py-1 rounded-full border ${cfg.badge}`}
            >
              {cfg.label}
            </span>
          </div>
          <span className="text-[10px] text-neutral-400 border border-neutral-200 px-2.5 py-1 rounded-full uppercase tracking-wider">
            {mode === "real" ? "Real Execution" : "Simulation"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-1">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider">Gas Estimate</span>
            <span className="text-sm text-black">{gasEstimate}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider">Tx Hash</span>
            <span className="text-[10px] text-neutral-500 truncate">{txHash.slice(0, 18)}...</span>
          </div>
        </div>

        <div className="pt-1 border-t border-neutral-100">
          <p className="text-sm text-neutral-600 leading-relaxed">{executionSummary}</p>
        </div>
      </div>
    </div>
  );
}
