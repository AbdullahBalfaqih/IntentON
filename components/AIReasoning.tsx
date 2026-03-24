"use client";

interface AIReasoningProps {
  explanation: string;
}

export default function AIReasoning({ explanation }: AIReasoningProps) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400">
        AI Reasoning
      </h3>
      <div className="border border-neutral-200 rounded-lg p-4 bg-neutral-50 shadow-sm">
        <p className="text-sm text-neutral-800 leading-relaxed font-bold">{explanation}</p>
      </div>
    </div>
  );
}
