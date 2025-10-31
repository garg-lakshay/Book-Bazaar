import { NextResponse, NextRequest } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import prisma from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-09-30.clover",
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature");

  let event: Stripe.Event;

  try {
    if (!sig) throw new Error("No signature found");
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    const error = err as Error;
    return NextResponse.json(
      { error: `Webhook Error: ${error.message}` },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      const bookIds = JSON.parse(session.metadata?.bookIds || "[]") as string[];
      if (!Array.isArray(bookIds)) {
        throw new Error("Invalid book IDs format");
      }

      // Update book quantities
      await Promise.all(
        bookIds.map((bookId: string) =>
          prisma.book.update({
            where: { id: bookId },
            data: {
              stock: {
                decrement: 1, // Decrease stock by 1
              },
            },
          })
        )
      );

      return NextResponse.json({ success: true });
    } catch (err) {
      const error = err as Error;
      console.error("Error updating book quantities:", error);
      return NextResponse.json(
        { error: error.message || "Failed to update book quantities" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}
