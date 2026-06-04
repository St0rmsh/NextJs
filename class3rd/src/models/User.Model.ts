import mongoose, { Document } from "mongoose";
import bcrypt from "bcrypt"
import { IUser } from "@/types/user.types";

interface UserDocument extends  Omit<IUser,"_id">, Document{
    comparePassword:(password: string) => boolean
}


const UserSchema = new mongoose.Schema<UserDocument>({
    username: {
        type: String,
        trim: true,
        required: [true, "Username is required"]
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        required: [true, "email is required"]
    },
    password: {
        type: String,
        trim: true,
        required: [true, "Password is required"]
    },
    mobile: {
        type: String,
        trim: true,
    },


},{
    timestamps:true
})


UserSchema.pre("save", function () {
    if (!this.isModified("password")) return
    this.password = bcrypt.hashSync(this.password,10)
    
})

UserSchema.methods.comparePassword=async function (password:string) {
    return bcrypt.compareSync(password,this.password)
}

const User = mongoose.model("Users",UserSchema)
export default User

// merge two sorted array || unique array 