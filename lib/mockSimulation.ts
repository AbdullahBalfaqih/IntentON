import { ParsedIntent } from "./openai";

export type SimulationStatus = "success" | "pending" | "failed";

export interface SimulationResult {
  status: SimulationStatus;
  gasEstimate: string;
  executionSummary: string;
  txHash: string;
}

function randomGas(): string {
  const base = 0.003 + Math.random() * 0.007;
  return base.toFixed(6) + " TON";
}

function randomHash(): string {
  const chars = "0123456789abcdef";
  let hash = "0x";
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

export function simulateIntent(
  intent: ParsedIntent,
  mode: "simulation" | "real"
): SimulationResult {
  const hasCondition = !!intent.conditions;
  const hasRecipient = !!intent.recipient;

  let status: SimulationStatus = "success";

  if (hasCondition) {
    // Conditions not yet met → pending
    status = "pending";
  } else if (!hasRecipient && intent.action === "transfer") {
    status = "failed";
  }

  const recipient = intent.recipient ?? "unknown recipient";
  const amount = intent.amount ?? 0;
  const token = intent.token ?? "TON";

  let summary = "";
  if (status === "success") {
    summary = `${mode === "real" ? "Transaction submitted" : "Simulated transfer"}: ${amount} ${token} → ${recipient}.`;
  } else if (status === "pending") {
    summary = `Intent queued. Waiting for condition: ${intent.conditions}. Will execute ${amount} ${token} transfer to ${recipient}.`;
  } else {
    summary = `Could not resolve recipient. Please specify a valid TON address or username.`;
  }

  return {
    status,
    gasEstimate: randomGas(),
    executionSummary: summary,
    txHash: randomHash(),
  };
}

export function generateExplanation(intent: ParsedIntent): string {
  const parts: string[] = [];

  if (intent.action === "transfer") {
    parts.push(
      `This request will transfer ${intent.amount ?? "an unknown"} ${intent.token} to ${intent.recipient ?? "the specified recipient"}.`
    );
  } else if (intent.action === "swap") {
    parts.push(`This request will perform a token swap on the TON network.`);
  } else if (intent.action === "mint") {
    parts.push(`This request will mint ${intent.amount ?? ""} ${intent.token} tokens.`);
  }

  if (intent.conditions) {
    parts.push(
      `The transaction will only execute if the following condition is met: "${intent.conditions}". Until then, it will remain in a pending state.`
    );
  } else {
    parts.push(`No special conditions detected — the transaction can execute immediately.`);
  }

  return parts.join(" ");
}
