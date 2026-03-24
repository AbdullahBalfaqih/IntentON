"use client";

import { useEffect, useRef, useState } from "react";

interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: "info" | "success" | "warning" | "error" | "ai";
}

interface AgentTerminalProps {
  logs: LogEntry[];
}

export default function AgentTerminal({ logs }: AgentTerminalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div className="w-2 h-2 rounded-full bg-red-400" />
            <div className="w-2 h-2 rounded-full bg-amber-400" />
            <div className="w-2 h-2 rounded-full bg-green-400" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">Agent Reasoning Terminal</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[8px] text-neutral-300 animate-pulse">LIVE NODE: MAINNET-SECURE</span>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="h-48 overflow-y-auto bg-black rounded-2xl p-4 text-[10px] leading-relaxed border border-neutral-800 shadow-2xl shadow-black/20 selection:bg-white selection:text-black font-archivo"
      >
        {logs.map((log) => (
          <div key={log.id} className="mb-1.5 flex gap-2 animate-fade-in group">
            <span className="text-neutral-600 shrink-0">[{log.timestamp}]</span>
            <span className={`
              ${log.type === 'success' ? 'text-green-300' : ''}
              ${log.type === 'warning' ? 'text-amber-300' : ''}
              ${log.type === 'error' ? 'text-red-400' : ''}
              ${log.type === 'ai' ? 'text-sky-300' : 'text-neutral-400'}
            `}>
              {log.message}
            </span>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="text-neutral-700">Waiting for intent to initialize agent...</div>
        )}
      </div>
    </div>
  );
}

export function createLog(message: string, type: LogEntry["type"] = "info"): LogEntry {
  return {
    id: Math.random().toString(36).substr(2, 9),
    timestamp: new Date().toLocaleTimeString([], { hour12: false }),
    message,
    type,
  };
}
