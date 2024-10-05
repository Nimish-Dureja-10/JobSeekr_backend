import {Application} from "../models/application.model.js";
import {Job} from "../models/job.model.js";

export const applyJob = async (req,res) => {
    try {
        const userId = req.id;
        // const {id:jobId} = req.params; both are same
        const jobId = req.params.id;
        if(!jobId) {
            return res.status(400).json({
                success:false,
                message:"Failed to fetch job details"
            });
        };
        // check whether already applied for the current job
        const existingApplication = await Application.findOne({job:jobId,applicant:userId});
        if(existingApplication) {
            return res.status(400).json({
                success:false,
                message:"You have already applied for this job"
            });
        };
        // check if the job exist 
        const job = await Job.findById(jobId);
        if(!job){
            return res.status(400).json({
                success:false,
                message:"Job not found"
            });
        };
        // create a new application
        const newApplication = await Application.create({
            job:jobId,
            applicant:userId
        });
        job.applications.push(newApplication._id);
        await job.save();
        return res.status(200).json({
            success:true,
            message:"Job applied successfully"
        });
    } catch (error) {
        console.log(error);
    }
};

export const getAppliedJobs = async (req,res) => {
    try {
        const userId = req.id;
        const application = await Application.find({applicant:userId}).sort({createdAt:-1}).populate({
            path:"job",
            options: {sort:{createdAt:-1}},
            populate: {
                path:"company",
                options: {sort:{createdAt:-1}},
            }
        });   
        if(!application) {
            return res.status(404).json({
                success:false,
                message:"No application found"
            });
        };
        return res.status(200).json({
            success:true,
            application
        });
    } catch (error) {
        console.log(error);
    }
};

// Admin can check how many users applied on particular job
export const getApplicants = async (req,res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path:"applications",
            options:{sort:{createdAt:-1}},
            populate:{
                path: "applicant"
            }
        });
        if(!job) {
            return res.status(404).json({
                success:false,
                message:"No job found"
            });
        };
        return res.status(200).json({
            success:true,
            message:"Applicants for this job",
            job
        });
    } catch (error) {
        console.log(error);
    }
};

export const updateStatus = async (req,res) => {
    try {
        const {status} = req.body;
        const applicationId = req.params.id;
        if(!status) {
            return res.status(400).json({
                success:false,
                message:"Status is required"
            });
        };
        // find the application by applicant id
        const application = await Application.findOne({_id:applicationId});
        if(!application) {
            return res.status(400).json({
                success:false,
                message:"Failed to fetch application details"
            });
        };
        // Update status of application
        application.status = status.toLowerCase();
        await application.save();
        return res.status(200).json({
            success:true,
            message:"Application updated successfully"
        });
    } catch (error) {
        console.log(error);
    }
};