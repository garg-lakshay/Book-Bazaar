import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAuth } from "@/lib/authmiddleware";

// ✅ Create new orders after successful payment
export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAuth(req);
    if (!auth.ok || !auth.req?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const buyerId = auth.req.user.id;
    const { items, totalAmount, paymentId } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }

    // ✅ Save each purchased book as a separate order
    const createdOrders = [];

    for (const item of items) {
      const book = await prisma.book.findUnique({
        where: { id: item.bookId },
      });

      if (!book) continue;

      const order = await prisma.order.create({
        data: {
          buyerId,
          sellerId: book.sellerId,
          bookId: book.id,
          total: item.price,
          stripePaymentId: paymentId,
          status: "paid",
        },
      });

      createdOrders.push(order);
    }

    return NextResponse.json({
      success: true,
      message: "✅ Orders saved successfully",
      count: createdOrders.length,
      totalItems: items.length,
    });
  } catch (err) {
    console.error("❌ Error saving order:", err);
    return NextResponse.json(
      { error: "Failed to save order" },
      { status: 500 }
    );
  }
}

// ✅ Get all paid orders for the logged-in user
export async function GET(req: NextRequest) {
  try {
    const auth = await verifyAuth(req);
    if (!auth.ok || !auth.req?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = auth.req.user.id;

    const orders = await prisma.order.findMany({
      where: {
        buyerId: userId,
        status: "paid",
      },
      include: {
        book: {
          select: { id: true, title: true, author: true, price: true,  },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders, totalItems: orders.length,});
  } catch (err) {
    console.error("❌ Error fetching orders:", err);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}