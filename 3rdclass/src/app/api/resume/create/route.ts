import ConnectDB from "@/lib/DB";
import { getCurrentUser } from "@/lib/GenearteUser";
import Resume from "@/models/Resume.model";
import { NextRequest, NextResponse } from "next/server";


export async function POST() {
    try {

        await ConnectDB()

        const userId = await getCurrentUser()

        const resume = await Resume.create({
            user_id: userId,
            title: "",
            summary: "",
            personalInfo: {},
            workExperience: [],
            projects: [],
            education: [],
            certifications: [],
            skills: []
        })


        return NextResponse.json({
            success: true,
            message: "Resume created successfully",
            data: resume
        },{
            status:201
        })


    } catch (error) {
        return NextResponse.json({
            success: false,
            message: "Failed to create resume",
            data: null
        },{
            status:500
        })
    }
    
}