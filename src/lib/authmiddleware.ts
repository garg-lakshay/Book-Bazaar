// import { NextResponse, NextRequest } from "next/server";
// import jwt from "jsonwebtoken";
// import { AuthenticatedNextRequest } from "./types";
// type Handler = (req: AuthenticatedNextRequest) => Promise<NextResponse>;

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
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { AuthenticatedNextRequest } from "./types";

/**
 * Reusable higher-order middleware
 * Usage: export const POST = authMiddleware(["SELLER"])(handler);
 */
export function authMiddleware(allowedRoles: string[] = []) {
  return function <T extends (req: AuthenticatedNextRequest) => Promise<NextResponse>>(handler: T) {
    return async function (req: NextRequest): Promise<NextResponse> {
      try {
        const authHeader = req.headers.get("Authorization") || req.headers.get("authorization");
        console.log("🔍 Received Authorization Header:", authHeader);
        if (!authHeader) {
          return NextResponse.json({ error: "No token provided" }, { status: 401 });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
          return NextResponse.json({ error: "Malformed token" }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
          id: string;
          email: string;
          role: string;
        };

        if (allowedRoles.length && !allowedRoles.includes(decoded.role)) {
          return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // ✅ Attach user to request
        (req as AuthenticatedNextRequest).user = decoded;

        // ✅ Proceed to actual handler
        return handler(req as AuthenticatedNextRequest);
      } catch (err) {
        console.error("Auth error:", err);
        return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
      }
    };
  };
}
