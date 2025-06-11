import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import chatRoutes from './routes/chat.route.js'; 
import  connectDB from '../lib/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'; 

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
})); 

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes); 
app.use("/api/chat", chatRoutes); 

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
console.log(`Server address: http://localhost:${PORT}`);