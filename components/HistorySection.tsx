"use client";

interface HistoryItem {
  id: string;
  text: string;
  timestamp: Date;
}

interface HistorySectionProps {
  history: HistoryItem[];
  onSelect: (text: string) => void;
}

export default function HistorySection({ history, onSelect }: HistorySectionProps) {
  if (history.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 mt-2">
      <h3 className="text-xs uppercase tracking-widest text-neutral-400">
        Recent Intents
      </h3>
      <div className="flex flex-col gap-1.5">
        {history.slice(0, 3).map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.text)}
            className="w-full text-left px-3 py-2.5 rounded-lg border border-neutral-100 bg-neutral-50 hover:bg-white hover:border-neutral-300 transition-all duration-150 group"
            aria-label={`Reload intent: ${item.text}`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-neutral-600 group-hover:text-black truncate transition-colors duration-150">
                {item.text}
              </span>
              <span className="text-xs text-neutral-300 shrink-0">
                {item.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
