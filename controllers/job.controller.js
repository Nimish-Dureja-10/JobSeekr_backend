import { Job } from "../models/job.model.js";

// Only recruiter can post job
export const postJob = async (req,res) => {
    try {
        const {title,description,requirements,salary,location,jobType,experienceLevel,position,companyId} = req.body;
        const userId = req.id;

        if(!title || !description || !requirements || !salary || !location || !jobType || !experienceLevel || !position || !companyId) {
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            });
        }
        const job = await Job.create({
            title,
            description,
            requirements:requirements.split(","),
            salary:Number(salary),
            location,
            jobType,
            experienceLevel,
            position,
            company:companyId,
            created_by:userId
        });
        return res.status(200).json({
            success:true,
            message:"New job created successfully",
            job
        });
    } catch (error) {
        console.log(error);
    }
};

export const getAllJobs = async (req,res) => {
    try {
        const keyword = req.query.keyword || "" ;
        const query = {
            $or : [
                {title:{$regex:keyword,$options:"i"}},
                {description:{$regex:keyword,$options:"i"}}
            ]
        };
        const jobs = await Job.find(query).populate({path:"company"}).sort({createdAt:-1});
        if(!jobs) {
            return res.status(404).json({
                success:false,
                message:"Jobs not found"
            });
        };
        return res.status(200).json({
            success:true,
            jobs
        });
    } catch (error) {
        console.log(error);
    }
};

export const getJobById = async (req,res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({path:"applications"});
        if(!job) {
            return res.status(400).json({
                success:false,
                message:"No job found"
            });
        }
        return res.status(200).json({
            success:true,
            job
        });
    } catch (error) {
        console.log(error);
    }
};

export const getJobsByRecruiter = async (req,res) => {
    try {
        const userId = req.id;
        const jobs = await Job.find({created_by:userId}).populate({path:"company",createdAt:-1});
        if(!jobs) {
            return res.status(404).json({
                success:false,
                message:"No job found"
            });
        };
        return res.status(200).json({
            success:true,
            jobs
        });
    } catch (error) {
        console.log(error);
    }
};