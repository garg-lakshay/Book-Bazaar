import prisma from "@/lib/prisma";
import { verifyAuth } from "@/lib/authmiddleware";
import { NextResponse, NextRequest } from "next/server";
import { AuthenticatedNextRequest } from "@/lib/types";

export async function GET(req: NextRequest) {
  const auth = await verifyAuth(req, ["SELLER"]);
  if (!auth.ok) return auth.res!;

  const books = await prisma.book.findMany({
    where: { sellerId: auth.req?.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ books });
}
