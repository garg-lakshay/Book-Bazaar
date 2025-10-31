import prisma from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { AuthenticatedNextRequest } from "@/lib/types";
import { verifyAuth } from "@/lib/authmiddleware";

export async function GET(req: NextRequest) {
  const authResult = await verifyAuth(req, ["USER", "SELLER", "OWNER"]);
  if (!authResult.ok) return authResult.res!;
  try {
    const books = await prisma.book.findMany({
      include: { seller: { select: { name: true } } },
    });
    return NextResponse.json({ books }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
