import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import modelRoutes, { initializeCloudinaryStorage, setupRoutes } from "./routes/modelRoutes.js";

connectDB();

const uploadMiddleware = initializeCloudinaryStorage();
setupRoutes(uploadMiddleware);

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/models", modelRoutes);
app.get("/check_server",(req,res)=>{
  res.status(200).json({
    status:200,
    message:"server is listen"
  })
})


app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});

app.listen(5000, () => console.log("Server running on port 5000"));