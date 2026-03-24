export interface ParsedIntent {
  action: string;
  amount: number | null;
  token: string;
  recipient: string | null;
  conditions: string | null;
}

const SYSTEM_PROMPT = `You are an Intent Interpreter for TON blockchain.
Convert user natural language into structured JSON.
Extract:
- action (transfer, swap, mint)
- amount (number or null)
- token (default "TON")
- recipient (username or address, or null)
- conditions (time, price, constraints as string, or null)

Return ONLY valid JSON with these fields: action, amount, token, recipient, conditions.`;

function mockParseIntent(text: string): ParsedIntent {
  const lower = text.toLowerCase();

  // Detect action
  let action = "transfer";
  if (lower.includes("swap")) action = "swap";
  else if (lower.includes("mint")) action = "mint";
  else if (lower.includes("send") || lower.includes("transfer")) action = "transfer";

  // Detect amount
  const amountMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:ton|TON)?/i);
  const amount = amountMatch ? parseFloat(amountMatch[1]) : null;

  // Detect recipient
  // Support @username, "to Name", and Arabic "إلى Name" or "لـ Name"
  const recipientMatch = text.match(/@([\w.]+)/) || 
                         text.match(/(?:to|إلى|لـ|ل)\s+([\w\u0621-\u064A]+)/i);
  
  let recipient = null;
  if (recipientMatch) {
    recipient = recipientMatch[1] || recipientMatch[0];
  }

  // Detect conditions
  const conditionParts: string[] = [];
  const priceMatch = text.match(/price\s*[<>]\s*\$?[\d.]+/i) ||
                     text.match(/سعر\s*[<>]\s*\$?[\d.]+/i);
  if (priceMatch) conditionParts.push(priceMatch[0]);
  if (lower.includes("tomorrow") || lower.includes("بكرة")) conditionParts.push("time = tomorrow");
  if (lower.includes("today") || lower.includes("اليوم")) conditionParts.push("time = today");
  const conditions = conditionParts.length > 0 ? conditionParts.join(" and ") : null;

  return { action, amount, token: "TON", recipient, conditions };
}

export async function interpretIntent(text: string): Promise<ParsedIntent> {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    // Demo mode: use regex heuristics
    return mockParseIntent(text);
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: text },
        ],
        temperature: 0,
        response_format: { type: "json_object" },
      }),
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (!content) throw new Error("No content returned");
    return JSON.parse(content) as ParsedIntent;
  } catch {
    // fallback to mock
    return mockParseIntent(text);
  }
}
