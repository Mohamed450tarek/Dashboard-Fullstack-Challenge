import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import dotenv from "dotenv";
dotenv.config();

// Import Routes
import authRoutes from "./routes/authRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import announcementRoutes from "./routes/announcementRoutes.js";

// Initialize App
const app = express();
const PORT = process.env.PORT || 5000;

 // Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to  DB"))
  .catch((err) => console.error(" Failed to connect to DB:", err));

 // middlewares
app.use(helmet());  

 app.use(
  cors({
    origin: ["http://localhost:8080", "http://localhost:5173", "http://localhost:5001"], 
    credentials: true,
  })
);

 
app.use(express.json());  
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(compression());  
app.use(morgan("dev")); // Logs requests

 
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is running  ",
    timestamp: new Date().toISOString(),
  });
});

 // routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/quizzes", quizRoutes);
app.use("/api/v1/announcements", announcementRoutes);

 
//  Handler
 
 app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Route ${req.originalUrl} not found`,
  });
});


 
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}/`);
});

export default app;
