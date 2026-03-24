import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Fetch from CoinGecko API on the server to bypass client-side CORS/rate-limits
    const response = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=the-open-network&vs_currencies=usd",
      {
        next: { revalidate: 30 }, // Cache for 30 seconds
      }
    );

    if (!response.ok) {
      throw new Error("CoinGecko API request failed");
    }

    const data = await response.json();
    const price = data["the-open-network"]?.usd;

    if (!price) {
      throw new Error("Price not found in response");
    }

    return NextResponse.json({ price });
  } catch (error) {
    console.error("Price fetch error:", error);
    // Fallback price to prevent UI breakage
    return NextResponse.json({ price: 1.31, error: "Failed to fetch live price" }, { status: 200 });
  }
}
