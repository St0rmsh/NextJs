import { GenerateAiContent } from "@/lib/Gemini";
import { GenearteProjectBodyDescription } from "@/types/ai.types";
import { ApiResponse } from "@/types/Api.types";
import { NextRequest, NextResponse } from "next/server";



export async function POST(req:NextRequest){
    try {
        
        const body:GenearteProjectBodyDescription = await req.json()

        const {experienceLevel,techStack,jobTitle} = body

        if (!experienceLevel || !techStack || !jobTitle) {
            return NextResponse.json<ApiResponse>({
              success:false,
              message:"All fields are required"
            },{
                status:400
            })
        }

       const prompt = `
        You are a Senior Resume Writer, Technical Recruiter, and ATS Optimization Specialist.

        Generate professional resume project descriptions based on the information provided.

        Candidate Information:

        Job Title:
        ${jobTitle}

        Experience Level:
        ${experienceLevel}

        Tech Stack:
        ${Array.isArray(techStack) ? techStack.join(", ") : techStack}

        Requirements:

        - Generate 4 to 6 professional resume bullet points.
        - Each bullet point must begin with a strong action verb.
        - Write in past tense.
        - Focus on technical implementation, architecture, optimization, scalability, integrations, security, performance, and user impact.
        - Naturally incorporate technologies from the provided tech stack.
        - Use ATS-friendly terminology.
        - Make the content sound like it was written by an experienced professional resume writer.
        - Avoid generic statements such as:
          - "Worked on..."
          - "Responsible for..."
          - "Helped with..."
        - Avoid unrealistic claims and fabricated metrics.
        - Do not invent certifications, companies, or achievements.
        - Keep each bullet point between 15 and 30 words.
        - Return ONLY valid JSON.
        - Do not return markdown.
        - Do not return explanations.

        Return EXACTLY in this format:

        {
          "descriptions": [
            "Designed and implemented...",
            "Developed and optimized...",
            "Integrated and maintained...",
            "Built and deployed..."
          ]
        }
      `;

        const result = await GenerateAiContent(prompt)

        let projectDescription = result

        if(typeof projectDescription === "string") {
          try {
            projectDescription = JSON.parse(projectDescription)
          } catch (error) {
            console.log("Failed to parse work experience", error);
          }
        }

        return NextResponse.json<ApiResponse>({
          success:true,
          message:"Project Description",
          data:{
            projectDescription
          }
        },{status:201})


    } catch (error) {
         console.log("Error in genearte Experience Api", error);
        return NextResponse.json({
            success:false,
            message:"Something went wrong",

        },{status:500})
        
        
    
    }
}