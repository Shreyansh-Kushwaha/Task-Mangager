import express from "express";
import dotenv from "dotenv";

import authRoutes from './routes/auth.js';
import userRoutes from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import connectDB from "./config/db.js";
import path from 'path';
import cors from "cors";

dotenv.config();
connectDB();
const app = express();


app.use(cors());
app.use(express.json());

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

app.get("/", (req, res) => {
  res.send("🚀 Task Manager API is running...");
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});



