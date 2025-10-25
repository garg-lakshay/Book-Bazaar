import {NextResponse , NextRequest} from "next/server";
import jwt from "jsonwebtoken";
import { AuthenticatedNextRequest } from "./types";
type Handler = (req: NextRequest, res: NextResponse) => Promise<NextResponse>;

export const authMiddleware = (allowedRoles: string[] = []) => {
    return async (req: NextRequest , res: NextResponse ,  handler: Handler) => {
        const authHeader = req.headers.get("Authorization");
        if(!authHeader) {
            return NextResponse.json({error: "No token Provided"},{status:401});
        }

        const token = authHeader.split(" ")[1];
        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET!) as {
                id:string, email:string, role:string
            }
            if(allowedRoles.length && !allowedRoles.includes(decode.role)){
                return NextResponse.json({error:"Forbidden"},{status:403});
            }
            const authReq = req as AuthenticatedNextRequest;
            authReq.user = decode;
            return handler(authReq, res);
            
          

        }
        catch(err){
            console.error(err);
            return NextResponse.json({error:"Invalid Token"},{status:401});
        }
    };

}