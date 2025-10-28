import prisma from "@/lib/prisma";
import { verifyAuth } from "@/lib/authmiddleware";
import { NextResponse } from "next/server";
import { AuthenticatedNextRequest } from "@/lib/types";

export async function GET(req: AuthenticatedNextRequest) {
  const auth = await verifyAuth(req, ["SELLER"]);
  if (!auth.ok) return auth.res!;

  const books = await prisma.book.findMany({
    where: { sellerId: auth.req?.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ books });
}
