import { GenerateAiContent } from "@/lib/Gemini";
import { GenearteExperienceBodyDescription } from "@/types/ai.types";
import { ApiResponse } from "@/types/Api.types";
import { NextRequest, NextResponse } from "next/server";



export async function POST(req:NextRequest){
    try {
        
        const body:GenearteExperienceBodyDescription = await req.json()

        const {experienceLevel,techStack,yearsOfExperience,jobRole} = body

        if (
          !experienceLevel?.trim() ||
          !jobRole?.trim() ||
          !Array.isArray(techStack) ||
          techStack.length === 0 ||
          yearsOfExperience === undefined ||
          yearsOfExperience === null
        ) {
            return NextResponse.json<ApiResponse>({
            success: false,
            message: "All fields are required"
            }, {
            status: 400
            });
        }

       const prompt = `
            You are a Senior Resume Writer, Technical Recruiter, and ATS Optimization Specialist.

            Generate professional ATS-friendly work experience descriptions for a resume.

            Candidate Information:

            Job Role:
            ${jobRole}

            Experience Level:
            ${experienceLevel}

            Years of Experience:
            ${yearsOfExperience}

            Tech Stack:
            ${Array.isArray(techStack) ? techStack.join(", ") : techStack}

            Instructions:

            * Generate 4 to 6 realistic resume experience bullet points.
            * Each bullet point must begin with a strong action verb.
            * Write in past tense.
            * Keep each bullet point between 15 and 30 words.
            * Use professional resume language.
            * Naturally incorporate relevant technologies from the provided tech stack.
            * Focus on responsibilities and contributions typically associated with the specified role.
            * Include concepts such as:

            * Application development
            * API development
            * Database management
            * Authentication and security
            * Testing and debugging
            * Deployment and CI/CD
            * Performance optimization
            * Scalability and maintainability
            * Collaboration with teams

            Rules:

            * Use ATS-friendly keywords naturally.
            * Avoid generic phrases such as:

            * "Worked on"
            * "Responsible for"
            * "Helped with"
            * Avoid unrealistic claims and fabricated metrics.
            * Do not invent companies, certifications, awards, or achievements.
            * Do not use buzzwords such as:

            * "Revolutionized"
            * "World-class"
            * "Industry-leading"
            * Make the experience sound realistic for the specified role and experience level.

            Special Instructions:

            * If Experience Level is "Fresher" OR Years of Experience is 0:

            * Generate internship-style or project-based experience bullets.
            * Focus on practical development experience, academic projects, personal projects, and technical learning.
            * Do not imply full-time professional employment.

            * If Years of Experience is greater than 0:

            * Generate realistic professional work-experience bullets appropriate for that level of experience.

            Output Requirements:

            * Return ONLY valid JSON.
            * Do not return markdown.
            * Do not return explanations.
            * Do not return code fences.
            * The response must be parseable using JSON.parse().

            Return EXACTLY in this format:

            {
            "descriptions": [
            "Developed ...",
            "Designed ...",
            "Implemented ...",
            "Optimized ..."
            ]
            }
            `;


        const result = await GenerateAiContent(prompt)

        let workExperienceDescription = result

        if(typeof workExperienceDescription === "string") {
          try {
            workExperienceDescription = JSON.parse(workExperienceDescription)
          } catch (error) {
            console.log("Failed to parse work experience", error);
          }
        }

        return NextResponse.json<ApiResponse>({
          success:true,
          message:"Work Experience",
          data:{
            workExperienceDescription
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