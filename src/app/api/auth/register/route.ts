// import { NextResponse, NextRequest } from "next/server";
// import bcrypt from "bcryptjs";
// import prisma from "@/lib/prisma";

// export async function POST(req: Request) {
//   try {
//     const { name, email, password, role } = await req.json();

//     const existingUser = await prisma.user.findUnique({
//       where: { email },
//     });
//     if (existingUser) {
//       return NextResponse.json(
//         { error: "User already exists" },
//         { status: 400 }
//       );
//     }
//     const existingowner = await prisma.user.findFirst({
//       where: { role: "OWNER" },
//     });
//     if (role === "OWNER" && existingowner) {
//       return NextResponse.json(
//         { error: "An OWNER account already exists" },
//         { status: 400 }
//       );
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = await prisma.user.create({
//       data: {
//         name,
//         email,
//         password: hashedPassword,
//         role: role || "user",
//       },
//     });
//     return NextResponse.json(
//       { message: "User registered successfully", user },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }
import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

interface RegisterBody {
  name: string;
  email: string;
  password: string;
  role?: "USER" | "SELLER" | "OWNER";
}

export async function POST(req: Request) {
  try {
    const { name, email, password, role }: RegisterBody = await req.json();

    console.log("📩 Incoming registration data:", { name, email, role });

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Check if an OWNER already exists
    const existingOwner = await prisma.user.findFirst({
      where: { role: "OWNER" },
    });
    if (role === "OWNER" && existingOwner) {
      return NextResponse.json(
        { error: "An OWNER account already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "USER", // Default to USER if not provided
      },
    });

    console.log("✅ User created:", user);

    return NextResponse.json(
      { message: "User registered successfully", user },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof Error) {
      console.error("❌ Registration error:", error.message);
      return NextResponse.json(
        { error: "Internal Server Error", details: error.message },
        { status: 500 }
      );
    }
    console.error("❌ Unknown error:", error);
    return NextResponse.json(
      { error: "Unexpected Server Error" },
      { status: 500 }
    );
  }
}
