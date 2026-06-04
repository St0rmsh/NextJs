import { IResume } from "@/types/resume.types";
import mongoose from "mongoose";


const ResumeSchema = new mongoose.Schema<IResume>({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User ID is required"],
    },
    title: {
        type: String,
        default: ""
    },
    summary: {
        type: String,
        default: ""
    },
    personalInfo: {
        type: {
            fullname: String,
            email: String,
            mobile: String,
            location: String,
            github: String,
            linkedIn: String,
            portfolio: String
        },
        default: {
            fullname: "",
            email: "",
            mobile: "",
            location: "",
            github: "",
            linkedIn: "",
            portfolio: ""
        }
    },
    workExperience: {
        type:[
             {
            company: String,
            position: String,
            startDate: String,
            endDate: String,
            description: String
        }
        ],
        default: []
    },
    projects: {
        type: [
            {
            title: String,
            description: String,
            githubUrl: String,
            liveUrl: String,
            teachStack: [String]
        }
        ],
        default: []
    },
    education: {
        type: [
            {
            institute: String,
            degree: String,
            startDate: String,
            endDate: String
       }
        ],
        default: []
    },
    certifications: {
        type: [String],
        default: []
    },
    skills: {
        type: [String],
        default: []
    },


},{
    timestamps:true
})


const Resume = mongoose.models.Resume || mongoose.model("Resume",ResumeSchema)

export default Resume
