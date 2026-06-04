import { GenerateAiContent } from "@/lib/Gemini";
import { ImproveContentBody, ImproveResumeTextBody } from "@/types/ai.types";
import { ApiResponse } from "@/types/Api.types";
import { NextRequest, NextResponse } from "next/server";



export async function POST(req:NextRequest){
    try {
        const body:ImproveResumeTextBody = await req.json()

        const {resumeText} = body

        if (!resumeText) {
            return NextResponse.json<ApiResponse>({
                success:false,
                message:"All fields are required"
            },{status:400})
        }

     const prompt = `
        You are a Senior Technical Recruiter, Hiring Manager, Resume Writer, and ATS Optimization Specialist.

        Analyze the provided resume and evaluate its ATS (Applicant Tracking System) compatibility.

        Resume Text:
        ${resumeText}

        Instructions:

        * Analyze the resume content for ATS optimization.
        * Evaluate keyword usage, technical skills, readability, formatting suitability, professional language, experience descriptions, and overall resume quality.
        * Consider how well the resume would perform in a modern ATS screening process.
        * Provide a realistic ATS score between 0 and 100.
        * Do not generate a perfect score unless clearly justified.
        * Explain the major strengths and weaknesses.
        * Provide actionable recommendations for improvement.
        * Base the analysis only on the provided resume content.
        * Do not invent missing information.
        * Return ONLY valid JSON.
        * Do not return markdown.
        * Do not return explanations outside the JSON object.

        Scoring Guidelines:

        90-100:
        Excellent ATS optimization with strong keywords, structure, and role relevance.

        80-89:
            Very good ATS optimization with minor improvement opportunities.

            70-79:
                Good ATS optimization but missing some keywords or content depth.

                60-69:
                    Moderate ATS optimization with noticeable weaknesses.

                    Below 60:
                        Significant ATS issues that should be addressed.

        Return EXACTLY in this format:

        {
            "atsScore": 85,
            "summary": "Brief ATS evaluation summary.",
            "strengths": [
                "Strength 1",
                "Strength 2",
                "Strength 3"
            ],
            "weaknesses": [
                "Weakness 1",
                "Weakness 2"
            ],
            "recommendations": [
                "Recommendation 1",
                "Recommendation 2",
                "Recommendation 3"
            ]
        }
        `;



         const result = await GenerateAiContent(prompt)

         let atsScore = result

         if(typeof atsScore === "string") {
          try {
            atsScore = JSON.parse(atsScore)
          } catch (error) {
            console.log("Failed to parse summary", error);
          }
         }

         return NextResponse.json({
            success:true,
            message:"Skills created Successfully",
            data:{
                atsScore
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