
import mongoose from "mongoose";

async function ConnectDB() {
   try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(process.env.MONGO_URI!);
        console.log("Connected");
    } catch (err) {
        console.error("Mongo Error:", err);
        throw err;
    }
    
}

export default ConnectDB