import  prisma  from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req:Request){
    try{
        const {email,password} = await req.json();

        const user = await prisma.user.findUnique({
            where: { email }
        })
        if(!user){
            return NextResponse.json({error:"Invalid email or password"},{status:400});
        }

        const passwordMatch = await bcrypt.compare(password,user.password);
        if(!passwordMatch){
            return NextResponse.json({error:"Invalid email or password"},{status:400});
        }

        const token = jwt.sign(
            {id:user.id,email:user.email,role:user.role},
            process.env.JWT_SECRET!,
            {expiresIn: "1hr"}
        );
        return NextResponse.json({message:"Login Sucessfully",
            token,
            user:{
                id:user.id,
                name:user.name,
                email:user.email,
                role:user.role
            }
        })

    }
    catch(err){
        console.error(err);
        return NextResponse.json({error:"Internal Server Error"},{status:500});
    }

}