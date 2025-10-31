import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
// ...optional auth middleware, used if available
import { verifyAuth } from "@/lib/authmiddleware";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const bookId = params.id;
  try {
    // Remove any cast, handle auth properly
    try {
      const auth = await verifyAuth(req);
      if (!auth.ok) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.debug(
          "verifyAuth threw, proceeding without auth:",
          err.message
        );
      }
    }

    const body = await req.json().catch(() => ({}));
    const amount =
      typeof body?.amount === "number" ? Math.floor(body.amount) : 1;

    // Get current book stock
    const book = await prisma.book.findUnique({
      where: { id: bookId },
      select: { stock: true },
    });

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    if (book.stock < amount) {
      return NextResponse.json(
        {
          error: `Insufficient stock: requested ${amount}, available ${book.stock}`,
        },
        { status: 400 }
      );
    }

    // Update stock
    const updated = await prisma.book.update({
      where: { id: bookId },
      data: { stock: { decrement: amount } },
    });

    console.log(
      `Stock updated for book ${bookId}: ${book.stock} -> ${updated.stock}`
    );
    return NextResponse.json({ success: true, stock: updated.stock });
  } catch (err: unknown) {
    const error =
      err instanceof Error ? err.message : "Failed to decrement stock";
    console.error("Decrement stock error:", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
