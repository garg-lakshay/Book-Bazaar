
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecret = process.env.STRIPE_SECRET_KEY;
if (!stripeSecret) {
  // If env is missing, throw at import time so it's obvious in dev logs
  // (Next will show the error in server console)
  throw new Error("Missing STRIPE_SECRET_KEY environment variable");
}

const stripe = new Stripe(stripeSecret, { apiVersion: "2025-09-30.clover" });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, currency = "inr", productName } = body;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // Create Checkout Session with proper URL schemes
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency,
            product_data: { name: productName || "Book Purchase" },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/success`, // Will automatically include http:// or https://
      cancel_url: `${baseUrl}/cancel`,
      metadata: {
        bookIds: JSON.stringify(body.bookIds || []),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    // Log full error server-side for debugging
    console.error("/api/payment error:", err);

    // Use a proper runtime type guard instead of `any`
    if (
      err instanceof Error &&
      typeof err.message === "string" &&
      err.message.length > 0
    ) {
      return NextResponse.json({ error: err.message }, { status: 502 });
    }

    // Fallback to generic 500
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
