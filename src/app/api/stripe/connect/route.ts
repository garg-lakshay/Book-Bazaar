import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import prisma from "@/lib/prisma";
import { verifyAuth } from "@/lib/authmiddleware";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-09-30.clover",
});

export async function POST(req: NextRequest) {
  // Step 1: Authenticate user
  const auth = await verifyAuth(req);
  if (!auth.ok || !auth.req?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = auth.req.user.id;

  // Step 2: Create Stripe Express account for the seller
  const account = await stripe.accounts.create({
    type: "express", // Express account type for simplified onboarding
  });

  // Step 3: Save Stripe account details in our database
  await prisma.stripeAccount.create({
    data: {
      userId,
      accountId: account.id,
      isVerified: false, // Will be updated after onboarding
    },
  });

  // Step 4: Generate onboarding link for the seller
  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: "http://localhost:3000/stripe/refresh", // If onboarding times out
    return_url: "http://localhost:3000/stripe/success", // After completion
    type: "account_onboarding",
  });

  // Return the onboarding URL where seller will be redirected
  return NextResponse.json({ url: accountLink.url });
}
