"use client";

interface ModeToggleProps {
  mode: "simulation" | "real";
  onChange: (m: "simulation" | "real") => void;
}

export default function ModeToggle({ mode, onChange }: ModeToggleProps) {
  return (
    <div
      id="mode-toggle"
      className="inline-flex items-center border border-neutral-200 rounded-lg p-0.5 text-[10px] uppercase tracking-widest bg-neutral-100"
      role="group"
      aria-label="Execution mode"
    >
      <button
        onClick={() => onChange("simulation")}
        className={`px-4 py-2 rounded-md transition-all duration-150 ${
          mode === "simulation"
            ? "bg-black text-white shadow-sm"
            : "text-neutral-500 hover:text-black"
        }`}
        aria-pressed={mode === "simulation"}
      >
        Simulation
      </button>
      <button
        onClick={() => onChange("real")}
        className={`px-4 py-2 rounded-md transition-all duration-150 ${
          mode === "real"
            ? "bg-black text-white shadow-sm"
            : "text-neutral-500 hover:text-black"
        }`}
        aria-pressed={mode === "real"}
      >
        Real Execution
      </button>
    </div>
  );
}
