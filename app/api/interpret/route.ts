import { NextRequest, NextResponse } from "next/server";
import { interpretIntent } from "@/lib/openai";
import { simulateIntent, generateExplanation } from "@/lib/mockSimulation";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, mode = "simulation" } = body as {
      text: string;
      mode?: "simulation" | "real";
    };

    if (!text || typeof text !== "string" || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Intent text is required" },
        { status: 400 }
      );
    }

    const parsedIntent = await interpretIntent(text.trim());
    const simulation = simulateIntent(parsedIntent, mode);
    const explanation = generateExplanation(parsedIntent);

    // Ensure the address is in a valid TON format for the SDK
    let recipientAddress = parsedIntent.recipient || "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c";
    
    // If it looks like a username, use a dummy valid address for the demo
    if (recipientAddress.startsWith("@") || !recipientAddress.startsWith("E") && !recipientAddress.startsWith("U")) {
      recipientAddress = "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c"; // A valid zero-address format
    }

    const transaction = {
      validUntil: Math.floor(Date.now() / 1000) + 300, // 5 minutes from now
      messages: [
        {
          address: recipientAddress,
          amount: (BigInt(Math.floor((parsedIntent.amount || 0) * 10**9))).toString(), // correctly convert TON to nanoTON
        },
      ],
    };

    return NextResponse.json({ 
      parsedIntent, 
      simulation, 
      explanation,
      transaction 
    });
  } catch (error) {
    console.error("Intent interpretation error:", error);
    return NextResponse.json(
      { error: "Failed to interpret intent" },
      { status: 500 }
    );
  }
}
