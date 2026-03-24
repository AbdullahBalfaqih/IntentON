"use client";

import { useState } from "react";

interface ParsedIntentBlockProps {
  data: Record<string, unknown>;
}

export default function ParsedIntentBlock({ data }: ParsedIntentBlockProps) {
  const [copied, setCopied] = useState(false);
  const json = JSON.stringify(data, null, 2);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <h3 className="text-xs uppercase tracking-widest text-neutral-400">
          Recent Intents
        </h3>
        <button
          id="copy-json-btn"
          onClick={handleCopy}
          className="text-xs text-neutral-500 hover:text-black border border-neutral-200 hover:border-neutral-400 px-2.5 py-1 rounded-md transition-all duration-150"
          aria-label="Copy JSON"
        >
          {copied ? "COPIED" : "Copy JSON"}
        </button>
      </div>
      <pre className="bg-neutral-950 text-neutral-100 text-[10px] p-4 rounded-lg overflow-x-auto leading-relaxed border border-neutral-800 font-archivo">
        <code className="font-archivo">{json}</code>
      </pre>
    </div>
  );
}
