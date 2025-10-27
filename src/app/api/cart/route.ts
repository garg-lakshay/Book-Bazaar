import prisma from"@/lib/prisma";
import { NextResponse } from "next/server";
import {AuthenticatedNextRequest} from "@/lib/types";
import {verifyAuth} from "@/lib/authmiddleware";    

export async function GET(req: AuthenticatedNextRequest){
    const authResult = await verifyAuth(req,["USER","SELLER"]);
    if(!authResult.ok) return authResult.res!; 

    const userId = authResult.req!.user.id;

    const cart = await prisma.cartItem.findMany({
        where:{userId},
        include:{book:{select:{id:true,title:true,author:true,price:true}}}
    }); 
    if(!cart || cart.length ===0){
        return NextResponse.json({message:"Cart is empty", items:[]},{status:200});
    }

    return NextResponse.json({items:cart},{status:200});
}
