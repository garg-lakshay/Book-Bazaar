// import { NextRequest, NextResponse } from "next/server";
// import { stripe } from "@/lib/stripe";
// import prisma from "@/lib/prisma";
// import { verifyAuth } from "@/lib/authmiddleware";

// export async function POST(req: NextRequest) {
//   try {
//     // ✅ Verify authentication
//     const auth = await verifyAuth(req);
//     if (!auth.ok || !auth.req?.user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const buyerId = auth.req.user.id;
//     const { bookId } = await req.json(); // bookId: string[]
//     console.log("🧾 Incoming payment body:", { bookId });

//     if (!Array.isArray(bookId) || bookId.length === 0) {
//       return NextResponse.json({ error: "Book IDs required" }, { status: 400 });
//     }

//     // ✅ Fetch all books (including sellers)
//     const books = await prisma.book.findMany({
//       where: { id: { in: bookId } },
//       include: { seller: true },
//     });

//     if (books.length !== bookId.length) {
//       return NextResponse.json(
//         { error: "Some books were not found" },
//         { status: 404 }
//       );
//     }

//     // ✅ Ensure all books belong to the same seller (optional)
//     const uniqueSellers = new Set(books.map((b) => b.sellerId));
//     if (uniqueSellers.size > 1) {
//       return NextResponse.json(
//         {
//           error:
//             "All selected books must belong to the same seller for one payment",
//         },
//         { status: 400 }
//       );
//     }

//     const sellerId = books[0].sellerId;

//     // ✅ Get seller’s Stripe account
//     const sellerStripe = await prisma.stripeAccount.findUnique({
//       where: { userId: sellerId },
//     });

//     if (!sellerStripe?.accountId) {
//       return NextResponse.json(
//         { error: "Seller has not connected Stripe account" },
//         { status: 400 }
//       );
//     }

//     // ✅ Calculate total amount and platform fee
//     const totalPrice = books.reduce((sum, b) => sum + b.price, 0);
//     const amountInPaise = Math.round(totalPrice * 100);
//     const platformFee = Math.round(amountInPaise * 0.02); // 2% fee

//     // ✅ Create Stripe PaymentIntent
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: amountInPaise,
//       currency: "inr",
//       automatic_payment_methods: { enabled: true },
//       application_fee_amount: platformFee,
//       transfer_data: {
//         destination: sellerStripe.accountId, // transfer 98% to seller
//       },
//       metadata: {
//         bookIds: bookId.join(","), // store comma-separated IDs
//         buyerId,
//         sellerId,
//       },
//     });

//     // ✅ Create a parent order
//     const order = await prisma.order.create({
//       data: {
//         buyerId,
//         sellerId,
//         total: totalPrice,
//         status: "pending",
//         stripePaymentId: paymentIntent.id,
//         orderItems: {
//           create: books.map((b) => ({
//             bookId: b.id,
//             price: b.price,
//           })),
//         },
//       },
//       include: { orderItems: true },
//     });

//     return NextResponse.json({
//       clientSecret: paymentIntent.client_secret,
//       message: "Payment initiated successfully",
//       orderId: order.id,
//     });
//   } catch (error) {
//     console.error("Stripe Payment Error:", error);
//     return NextResponse.json({ error: "Payment failed" }, { status: 500 });
//   }
// }

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
    const { amount, currency = "inr", productName, bookIds } = body; // Add bookIds

    // Validate input: amount must be an integer representing smallest currency unit
    if (
      typeof amount !== "number" ||
      !Number.isFinite(amount) ||
      amount <= 0 ||
      !Number.isInteger(amount)
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid or missing 'amount' (integer, smallest currency unit required)",
        },
        { status: 400 }
      );
    }

    // Create Checkout Session with metadata
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
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/cancel",
      metadata: {
        bookIds: JSON.stringify(bookIds), // Store book IDs in metadata
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
