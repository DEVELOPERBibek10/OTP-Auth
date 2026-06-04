import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}`
    );
    console.log(
      `\nMONGO DB connect !! DB HOST: ${connectionInstance.connection.host}\n`
    );
    return connectionInstance;
  } catch (error) {
    console.error("MONGO DB connection error", error);
    process.exit(1);
  }
};

export default connectDB;
