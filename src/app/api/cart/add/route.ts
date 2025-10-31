import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { AuthenticatedNextRequest } from "@/lib/types";
import { verifyAuth } from "@/lib/authmiddleware";
export async function POST(req: NextRequest) {
  const authResult = await verifyAuth(req, ["USER", "SELLER"]);
  if (!authResult.ok) return authResult.res!;

  const { bookId, quantity } = await req.json();
  if (!bookId) {
    return NextResponse.json({ error: "Book ID is required" }, { status: 400 });
  }
  const userId = authResult.req!.user.id;
  const existing = await prisma.cartItem.findUnique({
    where: {
      userId_bookId: { userId, bookId },
    },
  });

  if (existing) {
    const updated = await prisma.cartItem.update({
      where: {
        userId_bookId: { userId, bookId },
      },
      data: {
        quantity: existing.quantity + (quantity || 1),
      },
    });
    return NextResponse.json(
      { message: "Cart updated", item: updated },
      { status: 200 }
    );
  }
  const newItem = await prisma.cartItem.create({
    data: {
      userId,
      bookId,
      quantity: quantity || 1,
    },
  });
  return NextResponse.json(
    { message: "Item added to cart", item: newItem },
    { status: 201 }
  );
}
