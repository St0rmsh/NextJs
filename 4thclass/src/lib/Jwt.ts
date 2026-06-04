import { JWTPayload } from "@/types/user.types"
import jwt from "jsonwebtoken"


export  function GenerateToken(payload:JWTPayload):string {
     
    return jwt.sign(payload,process.env.JWT_SECRET!,{
        expiresIn:"1h"
    })
}

export function verifyToken(payload: string):any {
    return jwt.verify(payload,process.env.JWT_SECRET!)
}