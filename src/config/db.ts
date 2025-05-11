import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (!process.env.DB_URL) {
      throw new Error("MONGO_URI not found in environment variables.");
    }

    await mongoose.connect(process.env.DB_URL);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }

  mongoose.connection.on('error', (err) => {
    console.error('❌ Mongoose runtime connection error:', err);
  });
};

export default connectDB;