import { GenerateAiContent } from "@/lib/Gemini";
import { ImproveContentBody } from "@/types/ai.types";
import { ApiResponse } from "@/types/Api.types";
import { NextRequest, NextResponse } from "next/server";



export async function POST(req:NextRequest){
    try {
        const body:ImproveContentBody = await req.json()

        const {content} = body

        if (!content) {
            return NextResponse.json<ApiResponse>({
                success:false,
                message:"All fields are required"
            },{status:400})
        }

     const prompt = `
        You are a Senior Resume Writer, Technical Recruiter, Hiring Manager, and ATS Optimization Specialist.

        Your task is to improve the provided resume content while preserving its original meaning and intent.

        Resume Content:
        ${content}

        Instructions:

        * Improve grammar, clarity, readability, and professionalism.
        * Rewrite the content using strong resume language.
        * Optimize the content for Applicant Tracking Systems (ATS).
        * Incorporate relevant ATS-friendly keywords when appropriate.
        * Use concise, impactful, and professional wording.
        * Preserve all important information from the original content.
        * Do not invent skills, technologies, certifications, companies, projects, achievements, or metrics.
        * Do not exaggerate experience or responsibilities.
        * Keep the content realistic and suitable for a professional resume.
        * Remove unnecessary filler words.
        * Improve sentence structure and flow.
        * Maintain the same general length unless improvement requires minor expansion or reduction.
        * Ensure the result sounds natural and human-written.
        * Do not use markdown.
        * Do not use bullet points unless the original content contains bullet points.
        * Do not include explanations.
        * Do not include notes.
        * Do not include suggestions.
        * Return ONLY the improved content.

        Output Requirements:

        * Return ONLY valid JSON.
        * The response must be parseable using JSON.parse().
        * The first character of the response must be '{'.
        * The last character of the response must be '}'.

        Return EXACTLY in this format:

        {
            "improvedContent": "Improved resume content here"
        }
        `;


         const result = await GenerateAiContent(prompt)

         let improvedContent = result

         if(typeof improvedContent === "string") {
          try {
            improvedContent = JSON.parse(improvedContent)
          } catch (error) {
            console.log("Failed to parse summary", error);
          }
         }

         return NextResponse.json({
            success:true,
            message:"Skills created Successfully",
            data:{
                improvedContent
            }
         },{
            status:201
         })

    } catch (error) {
        console.log("Error in genearte Skills Api", error);
        return NextResponse.json({
            success:false,
            message:"Something went wrong",

        },{status:500})
        
        
    }
}