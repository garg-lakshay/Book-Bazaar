import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAuth } from "@/lib/authmiddleware";

export async function POST(req: NextRequest) {
  const auth = await verifyAuth(req);
  if (!auth.ok || !auth.req?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { accountId } = await req.json();

    if (!accountId) {
      return NextResponse.json(
        { error: "Stripe account ID is required" },
        { status: 400 }
      );
    }

    await prisma.stripeAccount.upsert({
      where: {
        userId: auth.req.user.id,
      },
      update: {
        accountId: accountId,
      },
      create: {
        userId: auth.req.user.id,
        accountId: accountId,
        isVerified: true,
      },
    });

    return NextResponse.json({
      message: "Stripe account ID saved successfully",
    });
  } catch (error) {
    console.error("Error saving Stripe account:", error);
    return NextResponse.json(
      { error: "Failed to save Stripe account ID" },
      { status: 500 }
    );
  }
}
