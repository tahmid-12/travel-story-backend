import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import connectDB from './config/db.js';
import authRoutes from "./routes/authRoutes.js";
import travelRoutes from "./routes/travelRoutes.js";
import imageRoutes from "./routes/imageRoute.js";

dotenv.config();

const app = express();

const allowedOrigin = process.env.CLIENT_URL;

app.use(express.json());
app.use(cookieParser());
// app.use(cors({ origin: "*" }));
app.use(cors({
  origin: allowedOrigin,
  credentials: true,
}));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api/auth", authRoutes);
app.use("/api/travel", travelRoutes);
app.use("/api/image", imageRoutes);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running at http://localhost:${process.env.PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
  }
};

startServer();