// import prisma from "@/lib/prisma";
// import { NextResponse } from "next/server";
// import { AuthenticatedNextRequest } from "@/lib/types";
// import { verifyAuth } from "@/lib/authmiddleware";

// export async function GET(req: AuthenticatedNextRequest) {
//     const auth = await verifyAuth(req, ["OWNER"]);
//     if (!auth.ok) return auth.res!;

//     const owners = await prisma.user.findMany({
//         where: { role: "OWNER" },
//         select: { id: true, name: true, email: true, createdAt: true },
//     });

//     return NextResponse.json({ owners });   