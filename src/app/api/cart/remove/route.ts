import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { AuthenticatedNextRequest } from "@/lib/types";
import { verifyAuth } from "@/lib/authmiddleware";

export async function DELETE(req: NextRequest) {
  const authResult = await verifyAuth(req, ["USER", "SELLER"]);
  if (!authResult.ok) return authResult.res!;
  const { bookId } = await req.json();
  if (!bookId) {
    return NextResponse.json({ error: "Book ID is required" }, { status: 400 });
  }

  const userId = authResult.req!.user.id;
  try {
    const existing = await prisma.cartItem.findUnique({
      where: {
        userId_bookId: { userId, bookId },
      },
    });
    if (!existing) {
      return NextResponse.json(
        { error: "Item not found in cart" },
        { status: 404 }
      );
    }
    await prisma.cartItem.delete({
      where: {
        userId_bookId: { userId, bookId },
      },
    });
    return NextResponse.json(
      { message: "Item removed from cart" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error removing item from cart:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
