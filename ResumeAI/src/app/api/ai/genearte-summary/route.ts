import { GenerateAiContent } from "@/lib/Gemini";
import { GenearteSkillsBody,GenerateSummaryBody } from "@/types/ai.types";
import { ApiResponse } from "@/types/Api.types";
import { NextRequest, NextResponse } from "next/server";



export async function POST(req:NextRequest){
    try {
        const body:GenerateSummaryBody = await req.json()

        const {experienceLevel,skills,jobTitle} = body

        if (!experienceLevel || !skills || !jobTitle) {
            return NextResponse.json<ApiResponse>({
                success:false,
                message:"All fields are required"
            },{status:400})
        }

      const prompt = `
        You are a Senior Technical Recruiter, Resume Writer, and ATS Optimization Specialist.

        Generate a compelling professional summary for a resume.

        Candidate Details:

        Job Title:
        ${jobTitle}

        Experience Level:
        ${experienceLevel}

        Technical Skills:
        ${Array.isArray(skills) ? skills.join(", ") : skills}

        Requirements:

        - Write a professional resume summary between 60 and 90 words.
        - Use natural, human-like language.
        - Make the summary sound polished and recruiter-friendly.
        - Incorporate the most relevant technical skills naturally.
        - Focus on technical expertise, development experience, and professional capabilities.
        - Optimize for ATS while maintaining readability.
        - Do not use clichés such as:
        - "Results-driven"
        - "Highly motivated"
        - "Passionate developer"
        - "Dedicated professional"
        - "Hardworking individual"
        - Do not invent projects, achievements, certifications, companies, or metrics.
        - Do not use bullet points.
        - Do not use headings.
        - Do not use markdown.
        - Return ONLY valid JSON.

        Response Format:

{
  "summary": "Professional summary text"
}
`;

         const result = await GenerateAiContent(prompt)

         let summary = result

         if(typeof summary === "string") {
          try {
            summary = JSON.parse(summary)
          } catch (error) {
            console.log("Failed to parse summary", error);
          }
         }

         return NextResponse.json({
            success:true,
            message:"Skills created Successfully",
            data:{
                summary
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