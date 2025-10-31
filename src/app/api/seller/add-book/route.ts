import { NextResponse, NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAuth } from "@/lib/authmiddleware";
import { AuthenticatedNextRequest } from "@/lib/types";

export async function POST(req: NextRequest) {
  // ✅ Step 1: Verify token and role
  const auth = await verifyAuth(req, ["SELLER"]);
  if (!auth.ok) return auth.res!; // Stop if unauthorized

  // ✅ Step 2: Extract book details
  const { title, author, price, stock, description } = await req.json();
  if (!title || !author || !price || !stock) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // ✅ Step 3: Create book
  const newBook = await prisma.book.create({
    data: {
      title,
      author,
      price: Number(price),
      stock: Number(stock),
      description: description || "",
      sellerId: auth.req!.user.id,
      ownerId: auth.req!.user.id,
    },
  });

  return NextResponse.json(
    { message: "Book added successfully!", book: newBook },
    { status: 201 }
  );
}
