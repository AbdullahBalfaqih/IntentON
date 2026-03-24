"use client";

interface IntentInputProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

export default function IntentInput({
  value,
  onChange,
  onSubmit,
  loading,
}: IntentInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      onSubmit();
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <textarea
        id="intent-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={4}
        placeholder='e.g. Send 5 TON to @ahmed tomorrow if price < 3$'
        className="w-full resize-none rounded-lg border border-neutral-300 bg-white px-4 py-3 text-sm text-black placeholder-neutral-400 outline-none transition-all duration-150 focus:border-black focus:ring-2 focus:ring-black/10 leading-relaxed font-archivo"
        disabled={loading}
        aria-label="Intent input"
      />
      <div className="flex items-center gap-2 mb-4">
        <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">Parsed Intent</span>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-[10px] text-neutral-400 uppercase tracking-widest">
          Press <kbd className="px-1.5 py-0.5 bg-neutral-100 border border-neutral-200 rounded text-[9px]">CMD Enter</kbd> to run
        </p>
        <button
          id="run-intent-btn"
          onClick={onSubmit}
          disabled={loading || !value.trim()}
          className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white text-xs rounded-xl hover:bg-neutral-800 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150 uppercase tracking-widest"
          aria-label="Run intent"
        >
          {loading ? (
            <>
              <span className="inline-block w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              INTERPRETING
            </>
          ) : (
            "Run Intent"
          )}
        </button>
      </div>
    </div>
  );
}
