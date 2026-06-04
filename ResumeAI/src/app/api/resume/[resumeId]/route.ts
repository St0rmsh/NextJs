import ConnectDB from "@/lib/DB";
import { getCurrentUser } from "@/lib/GenearteUser";
import Resume from "@/models/Resume.model";
import { ApiResponse } from "@/types/Api.types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest, {params}: {params: Promise<{resumeId:string}>} ){

    try {

    await ConnectDB()

      const user = await getCurrentUser()

      const {resumeId} = await params

      if(!user) {
        return NextResponse.json<ApiResponse>({
            success:false,
            message:"User not found"
        },{status:404})
      }

      const resume = await Resume.findOne({
        _id:resumeId,
        user_id: user.userId
      })

      if(!resume) {
        return NextResponse.json<ApiResponse>({
            success:false,
            message:"Resume not found"
        },{status:404})
      }

      return NextResponse.json({
        success:true,
        message:"Resume fetched successfully",
        data:resume
      },{status:200})
  
    } catch (error) {
        console.log("Error in fetching resume",error);
        return NextResponse.json<ApiResponse>({
            success:false,
            message:"Something went wrong"
        })   
    }
}


export async function PATCH(req:NextRequest, {params}: {params: Promise<{resumeId:string}>} ) {

  try {
    
    await ConnectDB()


    const user = await getCurrentUser()

    const body = await req.json()


    const {resumeId} = await params

    if(!user) {
      return NextResponse.json<ApiResponse>({
        success:false,
        message:"User not found"
      },{status:404})
    }

    const updatedResume = await Resume.findOneAndUpdate({
      _id:resumeId,
      user_id: user.userId
    },
    {
        $set:body
    },
    {
      new:true,
      runValidators:true
    }
)

    if(!updatedResume) {
      return NextResponse.json<ApiResponse>({
        success:false,
        message:"Resume updation failed"
      },{status:400})
    }

    return NextResponse.json({
      success:true,
      message:"Resume updated successfully",
      data:updatedResume
    },{status:200})

  } catch (error) {
    console.log("Error in updating resume",error);
    return NextResponse.json<ApiResponse>({
      success:false,
      message:"Something went wrong"
    })
  }
  
}