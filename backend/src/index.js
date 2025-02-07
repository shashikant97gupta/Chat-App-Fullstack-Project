import express from "express";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js"
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from 'cookie-parser';
import cors from "cors";

// Load environment variables from.env file
dotenv.config();

// Initialize express app
const app = express();

const PORT = process.env.PORT;

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));


// Middleware to parse URL-encoded bodies (optional, for form submissions)
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/message', messageRoutes);

app.get("/", (req, res) => {
    res.send("API is running");
});

app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
    connectDB();
})