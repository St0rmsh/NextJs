import { GenerateAiContent } from "@/lib/Gemini";
import { GenearteSkillsBody } from "@/types/ai.types";
import { ApiResponse } from "@/types/Api.types";
import { NextRequest, NextResponse } from "next/server";



export async function POST(req:NextRequest){
    try {
        const body:GenearteSkillsBody = await req.json()

        const {experienceLevel,jobTitle} = body

        if (!experienceLevel || !jobTitle) {
            return NextResponse.json<ApiResponse>({
                success:false,
                message:"All fields are required"
            },{status:400})
        }

        const prompt = `
            You are a Senior Technical Recruiter, Hiring Manager, and ATS Optimization Specialist.

            Your task is to identify the most relevant technical skills for the specified role and experience level.

            Candidate Information:

            Job Title: ${jobTitle}

            Experience Level: ${experienceLevel}

            Instructions:

            - Generate only technical skills.
            - Include programming languages, frameworks, libraries, databases, cloud platforms, DevOps tools, testing tools, APIs, and development technologies relevant to the role.
            - Prioritize skills commonly found in real job descriptions.
            - Prioritize ATS-friendly keywords used by recruiters.
            - Exclude soft skills, personality traits, and communication skills.
            - Exclude duplicate skills.
            - Include both core and supporting technologies.
            - Return between 20 and 30 skills.
            - Ensure the skills are appropriate for the specified experience level.
            - Return ONLY valid JSON.
            - Do NOT return markdown.
            - Do NOT return explanations.
            - Do NOT return comments.
            - Do NOT return code fences.
            - The response must be parseable using JSON.parse().

            IMPORTANT:
            - The first character of the response must be '{'.
            - The last character of the response must be '}'.

            Return EXACTLY in the following format:

            {
                "skills": [
                    "Skill 1",
                    "Skill 2",
                    "Skill 3"
                ]
            }
        `;

         const result = await GenerateAiContent(prompt)
         console.log(result);
         

         let skills = result

         console.log(skills);


         if (typeof skills === "string") {
            try {
                skills = JSON.parse(skills)
            } catch (error) {
                console.log("failed to parse Skills",error);     
            }
         }

         console.log("skills:",skills);
         

         return NextResponse.json<ApiResponse>({
            success:true,
            message:"Skills created Successfully",
            data: skills
            
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