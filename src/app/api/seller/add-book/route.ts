// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import { AuthenticatedNextRequest } from "@/lib/types";
// import { authMiddleware } from "@/lib/authmiddleware";

// const handler = async (
//   req: AuthenticatedNextRequest
// ): Promise<NextResponse> => {
//   if (req.method !== "POST") {
//     return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
//   }
//   try {
//     const user = req.user;
//     if (user.role !== "SELLER") {
//       return NextResponse.json(
//         { error: "Only sellers can add books" },
//         { status: 403 }
//       );
//     }
//     const body = await req.json();
//     const { title, author, price, description, stock } = body;
//     if (!title || !author || !price || !stock) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     const newbook = await prisma.book.create({
//       data: {
//         title,
//         author,
//         price: parseFloat(price),
//         description: description || "",
//         stock: stock ? Number(stock) : 1,
//         sellerId: user.id,
//         ownerId: user.id,
//       },
//     });
//     return NextResponse.json(
//       { message: "Book added successfully", book: newbook },
//       { status: 201 }
//     );
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// };
// export const POST = authMiddleware(["SELLER"])(handler);
// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import { AuthenticatedNextRequest } from "@/lib/types";
// import { authMiddleware } from "@/lib/authmiddleware";

// export async function POST(req: AuthenticatedNextRequest) {
//   // Run authMiddleware
//   const authCheck = await authMiddleware(req, ["SELLER"]);
//   if (authCheck.status !== 200) return authCheck; // If unauthorized, return error

//   const authReq = req as AuthenticatedNextRequest;

//   const { title, author, price, stock, description } = await req.json();
//   if (!title || !author || !price || !stock) {
//     return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
//   }

//   const newBook = await prisma.book.create({
//     data: {
//       title,
//       author,
//       price: Number(price),
//       stock: Number(stock),
//       description: description || "",
//       sellerId: authReq.user.id,
//       ownerId: authReq.user.id,
//     },
//   });

//   return NextResponse.json({ message: "Book added!", book: newBook }, { status: 201 });
// }
// export const POST = authMiddleware(["SELLER"])(handler)

// import { NextResponse } from "next/server";
// import prisma from "@/lib/prisma";
// import { AuthenticatedNextRequest } from "@/lib/types";
// import { verifyAuth } from "@/lib/authmiddleware";

// export async function handler(req: AuthenticatedNextRequest) {
//   const auth = await verifyAuth(req, ["SELLER"]);
//   if (!auth.ok) return auth.res!;
//   const { title, author, price, stock, description } = await req.json();

//   if (!title || !author || !price || !stock) {
//     return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
//   }

//   const user = req.user;

//   const newBook = await prisma.book.create({
//     data: {
//       title,
//       author,
//       price: Number(price),
//       stock: Number(stock),
//       description: description || "",
//       sellerId: user.id,
//       ownerId: user.id,
//     },
//   });

//   return NextResponse.json({ message: "Book added!", book: newBook }, { status: 201 });
// }
// app/api/books/add/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAuth } from "@/lib/authmiddleware";
import { AuthenticatedNextRequest } from "@/lib/types";

export async function POST(req: AuthenticatedNextRequest) {
  // ✅ Step 1: Verify token and role
  const auth = await verifyAuth(req, ["SELLER"]);
  if (!auth.ok) return auth.res!; // Stop if unauthorized

  // ✅ Step 2: Extract book details
  const { title, author, price, stock, description } = await req.json();
  if (!title || !author || !price || !stock) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
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

  return NextResponse.json({ message: "Book added successfully!", book: newBook }, { status: 201 });
}





