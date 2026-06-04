import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./Jwt";
import { cookies } from "next/headers";


export async function getCurrentUser() {
   
   try {
        const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value
        console.log("Token:", token);

    
    if(!token) throw new Error("Unauthorized")

    const decoded = verifyToken(token)

    console.log("Decoded:", decoded);

    if(!decoded) throw new Error("Unauthorized")

      console.log("userId:", decoded.userId);
      

  return decoded.userId
    
   } catch (error) {
    throw new Error("Failed to get current user")
   }
}