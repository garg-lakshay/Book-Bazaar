// import { NextRequest, NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import { verifyAuth } from "@/lib/authmiddleware";
// import { AuthenticatedNextRequest } from "@/lib/types";

// export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
//   const result = await verifyAuth(req, ["USER", "SELLER", "OWNER"]);
//   if (!result.ok && result.res) {
//     return result.res;
//   }
//   const bookId = params.id;

//   const book = await prisma.book.findUnique({
//     where: { id: bookId },
//     include: {
//       seller: { select: { name: true, email: true } },
//     },
//   });

//   if (!book) {
//     return NextResponse.json({ error: "Book not found" }, { status: 404 });
//   }

//   return NextResponse.json({ book });
// }
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAuth } from "@/lib/authmiddleware";
import { AuthenticatedNextRequest } from "@/lib/types";

export async function GET(req: NextRequest) {
  try {
    // ✅ Extract the book ID manually from the URL
    const url = new URL(req.url);
    const segments = url.pathname.split("/");
    const bookId = segments[segments.indexOf("books") + 1]; // works for /api/books/[id]

    if (!bookId) {
      return NextResponse.json({ error: "Missing book ID" }, { status: 400 });
    }

    // ✅ Auth check (unchanged)
    const result = await verifyAuth(req, ["USER", "SELLER", "OWNER"]);
    if (!result.ok && result.res) {
      return result.res;
    }

    // ✅ Fetch book (unchanged)
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
  } catch (err: unknown) {
    const error =
      err instanceof Error ? err.message : "Failed to fetch book details";
    console.error("GET /api/books/[id] error:", error);
    return NextResponse.json({ error }, { status: 500 });
  }
}



    