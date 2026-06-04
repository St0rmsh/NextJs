export interface GenerateSummaryBody {
    experienceLevel: string,
    skills: string[],
    jobTitle: string,
}

export interface GenearteSkillsBody {
    experienceLevel: string,
    jobTitle: string,

}

export interface GenearteProjectBodyDescription {
    experienceLevel: string,
    jobTitle: string,
    techStack: string[]
}

export interface GenearteExperienceBodyDescription {
    experienceLevel: string,
    techStack: string[],
    yearsOfExperience:number,
    jobRole:string
}

export interface ImproveContentBody {
    content:string
}

export interface ImproveResumeTextBody {
    resumeText:string
}