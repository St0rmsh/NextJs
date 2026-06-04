import { IUser } from "@/types/User.types";
import mongoose, { Document } from "mongoose";
import bcrypt from "bcrypt"


interface UserDocumnet extends Omit<IUser, "_id">,Document {
    comparePassword:(password:string) => boolean
}


const UserSchema = new mongoose.Schema<UserDocumnet>({

    username:{
        type: String,
        trim: true,
        required: [true, "Username is required"],
    },
    email:{
        type: String,
        trim: true,
        unique:true,
        required: [true, "Email is required"],
    },
    password:{
        type: String,
        trim: true,
        required: [true, "Password is required"],
    },
    mobile: {
        type: String,
        trim: true
    }

},{
    timestamps:true
})

UserSchema.pre("save", function(){
     if (!this.isModified("password")) return ;
     this.password = bcrypt.hashSync(this.password,10)
})

UserSchema.methods.comparePassword = async function (password:string) {
    return bcrypt.compareSync(password,this.password)
}

const User = mongoose.models.User || mongoose.model("User",UserSchema)

export default User