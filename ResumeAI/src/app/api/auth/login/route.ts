import ConnectDB from "@/lib/DB";
import { GenerateToken } from "@/lib/Jwt";
import User from "@/models/User.model";
import { LoginBody } from "@/types/User.types";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { ApiResponse } from "@/types/Api.types";

export const POST = async (req: NextRequest) => {
    try {

        await ConnectDB()

        const body:LoginBody = await req.json()

        const {email,password} = body

        if(!email || !password) {
            return NextResponse.json({
                success:false,
                message:"All field are required"
            },{status:400})
      
        }

        const user = await User.findOne({email})

        if(!user) {
            return NextResponse.json({
                success:false,
                message:"User not found"
            },{status:404})
        }

        const isPasswordvalid = await bcrypt.compare(password,user.password)

        if(!isPasswordvalid) {
            return NextResponse.json({
                success:false,
                message:"Invalid Password"
            },{status:401})
        }

        const token = GenerateToken({userId: user._id})

        const response = NextResponse.json<ApiResponse>({
            success:true,
            message: "User logged in successfully",
            data: {
                user: {
                    _id: user._id,
                    username: user.username,
                    email: user.email,
                    mobile: user.mobile
                }
            },
        },   { status: 200}
)

        response.cookies.set("token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 1000,
            path: "/",
        })

        return response
        

        


        
    } catch (error) {
         console.log("error in request api ",error);
        return NextResponse.json({
            success:false,
            message: "User login failed",
            error:error

        },{
            status:500
        })

    }
}