import ConnectDB from "@/lib/DB";
import { GenerateToken } from "@/lib/Jwt";
import User from "@/models/User.model";
import { ApiResponse } from "@/types/Api.types";
import { RegisterBody } from "@/types/User.types";
import { NextRequest, NextResponse } from "next/server";



export async function POST (req: NextRequest) {

    try {
        
        await ConnectDB()

        const body: RegisterBody = await req.json()

        const {username,email,password,mobile} = body

        if (!username || !email || !password) {
            return NextResponse.json({
                success: false,
                message: "All field are required"
            },{
                status:400
            }) 
        }

        const isExistsed = await User.findOne({email})

        if (isExistsed) {
            return NextResponse.json({
                success: false,
                message: "User email is already exists"
            },{
                status:409
            })
            
        }

        const newUser = await User.create({
            username,email,password,mobile
        })

        const token = GenerateToken({userId: newUser._id})

        const response = NextResponse.json<ApiResponse>({
            success:true,
            message: "User Registered Successfully",
            data: { user: 
              {
                _id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                mobile: newUser.mobile
             }
            },
        }, { status:201 }
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
            message: "User registration failed",
            error:error

        },{
            status:500
        })
        
    }
}