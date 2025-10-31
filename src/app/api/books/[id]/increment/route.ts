import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAuth } from "@/lib/authmiddleware";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const bookId = params.id;
  try {
    // optional auth (no `any` casting)
    try {
      const auth = await verifyAuth(req);
      if (!auth.ok) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    } catch (err: unknown) {
      // If verifyAuth throws because it's not enforced in this environment,
      // swallow the error and continue. Log if it's an Error for debugging.
      if (err instanceof Error) {
        console.debug(
          "verifyAuth threw, proceeding without auth:",
          err.message
        );
      } else {
        console.debug(
          "verifyAuth threw an unknown error, proceeding without auth"
        );
      }
    }

    const body = await req.json().catch(() => ({}));
    const amount =
      typeof body?.amount === "number" ? Math.floor(body.amount) : 1;

    if (amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be positive" },
        { status: 400 }
      );
    }

    // Get current book
    const book = await prisma.book.findUnique({
      where: { id: bookId },
      select: { stock: true },
    });

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    // Update stock
    const updated = await prisma.book.update({
      where: { id: bookId },
      data: { stock: { increment: amount } },
    });

    console.log(
      `Stock updated for book ${bookId}: ${book.stock} -> ${updated.stock} (increment: ${amount})`
    );

    return NextResponse.json({ success: true, stock: updated.stock });
  } catch (err: unknown) {
    console.error("Increment stock error:", err);
    return NextResponse.json(
      { error: "Failed to increment stock" },
      { status: 500 }
    );
  }
}
