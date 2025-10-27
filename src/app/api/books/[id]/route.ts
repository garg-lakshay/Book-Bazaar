import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAuth } from "@/lib/authmiddleware";
import { AuthenticatedNextRequest } from "@/lib/types";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const result = await verifyAuth(req, ["USER", "SELLER", "OWNER"]);
  if (!result.ok && result.res) {
    return result.res;
  }
  const bookId = params.id;

  const book = await prisma.book.findUnique({
    where: { id: bookId },
    include: {
      seller: { select: { name: true, email: true } },
    },
  });

  if (!book) {
    return NextResponse.json({ error: "Book not found" }, { status: 404 });
  }

  return NextResponse.json({ book });
}



    