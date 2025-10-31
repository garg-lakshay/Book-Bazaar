import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAuth } from "@/lib/authmiddleware";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const bookId = params.id;

  try {
    await verifyAuth(req);

    const body = await req.json().catch(() => ({}));
    const amount =
      typeof body?.amount === "number" ? Math.floor(body.amount) : 1;

    const book = await prisma.book.findUnique({
      where: { id: bookId },
      select: { stock: true, reserved: true },
    });

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    if (book.stock < amount) {
      return NextResponse.json(
        { error: "Not enough stock for purchase" },
        { status: 400 }
      );
    }

    const updated = await prisma.book.update({
      where: { id: bookId },
      data: {
        stock: { decrement: amount },
        reserved: { decrement: amount },
      },
    });

    console.log(`💳 Purchase completed for ${bookId}. New stock: ${updated.stock}`);
    return NextResponse.json({ success: true, stock: updated.stock });
  } catch (err) {
    console.error("Purchase stock error:", err);
    return NextResponse.json({ error: "Failed to finalize purchase" }, { status: 500 });
  }
}

