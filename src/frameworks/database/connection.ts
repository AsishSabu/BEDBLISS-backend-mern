import mongoose from "mongoose";
import configKeys from "../../config";

const connectDb = async () => {
  try {
    await mongoose.connect(configKeys.MONGO_DB_URL);
    console.log("Database connected sucessfully");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
export default connectDb;
