import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js"
import dotenv from "dotenv";

import path from "path";

import { connectDB } from "./lib/db.js";
import cookieParser from 'cookie-parser';
import cors from "cors";
import { app, server } from "./lib/socket.js";

// Load environment variables from.env file
dotenv.config();

// // Initialize express app
// const app = express();

const PORT = process.env.PORT;
const __dirname = path.resolve();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));


// Middleware to parse URL-encoded bodies (optional, for form submissions)
// app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
  
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
  }

// server.listen(PORT, () => {
//     console.log(`Server is running at port ${PORT}`);
//     connectDB();
// })

connectDB().then(() => {
    server.listen(PORT, () => {
        console.log(`🚀 Server is running at port ${PORT}`);
    });
}).catch(err => {
    console.error("❌ Database connection failed:", err);
});