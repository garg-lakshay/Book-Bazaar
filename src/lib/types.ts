import { NextRequest } from "next/server";

export interface AuthenticatedNextRequest extends NextRequest {
  user: {
    id: string;
    email: string;
    role: string;
  };
}
