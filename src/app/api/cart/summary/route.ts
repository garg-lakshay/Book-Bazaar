import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { AuthenticatedNextRequest } from "@/lib/types";
import { verifyAuth } from "@/lib/authmiddleware";  

export async function GET(req:AuthenticatedNextRequest){
    const authResult = await verifyAuth (req,["USER","SELLER"]);
    if(!authResult.ok) return authResult.res!;

    const userId = authResult.req!.user.id;

    const cart = await prisma.cartItem.findMany({
        where:{userId},
        include:{book:{select:{title:true,price:true}}}
    });
    if(!cart || cart.length ===0){
        return NextResponse.json({message:"Cart is empty", items:[]},{status:200});
    }
    const totalItems = cart.length;
    const totalQuantity = cart.reduce((sum,item) => sum + item.quantity,0);
    const totalPrice = cart.reduce((sum,item) => sum + item.quantity * item.book.price,0);  


return NextResponse.json({
    totalItems,
    totalQuantity,
    totalPrice,
    items:cart
},{status:200});
}