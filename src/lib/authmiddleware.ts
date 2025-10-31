// import { NextResponse, NextRequest } from "next/server";
// import jwt from "jsonwebtoken";
// import { AuthenticatedNextRequest } from "./types";
// type Handler = (req:NextRequest) => Promise<NextResponse>;

// export const authMiddleware = (allowedRoles: string[] = []) => {
//   return async (handler: Handler) => {
//     return async (req: NextRequest): Promise<NextResponse> => {
//       try {
//         const authHeader = req.headers.get("Authorization");
//         if (!authHeader) {
//           return NextResponse.json(
//             { error: "No token Provided" },
//             { status: 401 }
//           );
//         }

//         const token = authHeader.split(" ")[1];

//         const decode = jwt.verify(token, process.env.JWT_SECRET!) as {
//           id: string;
//           email: string;
//           role: string;
//         };
//         if (allowedRoles.length && !allowedRoles.includes(decode.role)) {
//           return NextResponse.json({ error: "Forbidden" }, { status: 403 });
//         }
//         const authReq = req as AuthenticatedNextRequest;
//         authReq.user = decode;
//         const response = await handler(authReq);
//         return response;
//       } catch (err) {
//         console.error(err);
//         return NextResponse.json({ error: "Invalid Token" }, { status: 401 });
//       }
//     };
//   };
// };
// /lib/authMiddleware.ts
// import { NextRequest, NextResponse } from "next/server";
// import jwt from "jsonwebtoken";
// import { AuthenticatedNextRequest } from "./types";

// // Auth middleware function for App Router
// export async function authMiddleware(req: NextRequest, allowedRoles: string[] = []): Promise<NextResponse> {
//   try {
//     const authHeader = req.headers.get("Authorization") || req.headers.get("authorization");
//     if (!authHeader) return NextResponse.json({ error: "No token provided" }, { status: 401 });

//     const token = authHeader.split(" ")[1];
//     if (!token) return NextResponse.json({ error: "Malformed token" }, { status: 401 });

//     const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
//       id: string;
//       email: string;
//       role: string;
//     };

//     if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
//       return NextResponse.json({ error: "Forbidden" }, { status: 403 });
//     }

//     // Attach user to request
//     (req as AuthenticatedNextRequest).user = decoded;

//     return NextResponse.next(); // Just continue, handler will handle the logic
//   } catch (err) {
//     console.error("Auth error:", err);
//     return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
//   }
// }
// lib/authMiddleware.ts
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { AuthenticatedNextRequest } from "./types";

export async function verifyAuth(
  req: NextRequest,
  allowedRoles: string[] = []
): Promise<{
  ok: boolean;
  res?: NextResponse;
  req?: AuthenticatedNextRequest;
}> {
  try {
    const authHeader =
      req.headers.get("Authorization") || req.headers.get("authorization");

    console.log("🔍 Received Authorization Header:", authHeader);

    if (!authHeader) {
      return {
        ok: false,
        res: NextResponse.json({ error: "No token provided" }, { status: 401 }),
      };
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return {
        ok: false,
        res: NextResponse.json({ error: "Malformed token" }, { status: 401 }),
      };
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
      role: string;
    };

    // 3️⃣ Check role
    if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
      return {
        ok: false,
        res: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
      };
    }

    // 4️⃣ Attach user to request
    const authReq = req as AuthenticatedNextRequest;
    authReq.user = decoded;

    return { ok: true, req: authReq };
  } catch (err) {
    console.error("Auth error:", err);
    return {
      ok: false,
      res: NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      ),
    };
  }
}
// import { NextRequest, NextResponse } from "next/server";
// import jwt from "jsonwebtoken";

// // --- 1. Define the User Payload Structure ---
// interface UserPayload {
//     id: string;
//     email: string;
//     role: string;
// }

// // --- 2. Define the Authenticated Request Type (The Fix) ---
// // This interface extends NextRequest and adds the 'user' property.
// export interface AuthenticatedRequest extends NextRequest {
//     user: UserPayload;
// }

// export async function verifyAuth(req: NextRequest) {
//     try {
//         const authHeader = req.headers.get("authorization");
//         console.log("🔍 Received Authorization Header:", authHeader);

//         if (!authHeader || !authHeader.startsWith("Bearer ")) {
//             return { ok: false, error: "Missing or invalid token" };
//         }

//         const token = authHeader.split(" ")[1];

//         // Use the defined UserPayload interface for the decoded object
//         const decoded = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;

//         // Cast the generic NextRequest to the specific AuthenticatedRequest type
//         // This makes the 'user' property available and correctly typed
//         const authReq = req as AuthenticatedRequest;

//         // Assign the decoded payload
//         authReq.user = decoded;

//         // Return the correctly typed request object
//         return { ok: true, req: authReq };
//     } catch (err) {
//         console.error("❌ Token verification failed:", err);
//         return { ok: false, error: "Unauthorized" };
//     }
// }
