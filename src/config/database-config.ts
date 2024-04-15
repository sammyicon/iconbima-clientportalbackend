import mongoose from "mongoose";
import { config } from "dotenv";
config();
const url = process.env.MONGO_URL as string;
const connectToDatabase = async () => {
  try {
    await mongoose.connect(url);
    console.info("Database connected successfully");
  } catch (error) {
    console.error(error);
  }
};
export default connectToDatabase;
