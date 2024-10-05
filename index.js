import express from "express";
import cookieParser from "cookie-parser";
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from "./utils/db.js";
import userRoutes from "./routes/user.route.js";
import companyRoutes from "./routes/company.route.js";
import jobRoutes from "./routes/job.route.js";
import applicationRoutes from "./routes/application.route.js";

dotenv.config({});
connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

const allowedUrls = [
    "https://job-seekr-one.vercel.app",
    "https://job-seekr-rjhtjwzb3-nimishdureja10s-projects.vercel.app"
];

app.use(cors({
    origin : allowedUrls,
    credentials:true,
    methods:["POST","GET","PUT","DELETE"]
}));

app.get("/",(req,res)=>{
    res.status(200).json({
        message:"Backend Working fine",
        success:true
    });
});

app.use("/api/v1/user",userRoutes);
app.use("/api/v1/company",companyRoutes);
app.use("/api/v1/job",jobRoutes);
app.use("/api/v1/application",applicationRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});