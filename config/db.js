import mongoose from "mongoose";

const conectDB = async()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`Connected to database ${conn.connection.host}`);
    } catch (error){
        console.log(`Error in MongoDB ${error}.`);
    }
}
 
export default conectDB;