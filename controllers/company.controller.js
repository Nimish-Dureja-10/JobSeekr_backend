// import Company from "../models/company.model.js";
import { Company } from "../models/company.model.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/datauri.js";

export const registerCompany = async (req,res) => {
    try {
        const {companyName} = req.body;
        if(!companyName) {
            return res.status(400).json({
                success:false,
                message:"Company Name is required"
            });
        };
        let company = await Company.findOne({name:companyName});
        if(company) {
            return res.status(400).json({
                success:false,
                message: "Company with this name already registered"
            });
        };
        company = await Company.create({
            name : companyName,
            userId: req.id
        });

        return res.status(200).json({
            success:true,
            message:"Company registered successfully",
            company
        });
    } catch (error) {
        console.log(error);
    }
};

// All companies created by user
export const getCompany = async (req,res) => {
    try {
        const userId = req.id;
        const companies = await Company.find({userId});
        if(!companies) {
            return res.status(400).json({
                success:false,
                message:"Companies not found",
            });
        };
        return res.status(200).json({
            success:true,
            message :"User created companies",
            companies
        });
    } catch (error) {
        console.log(error);
    }
};

export const getCompanyById = async (req,res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if(!company) {
            return res.status(400).json({
                success:false,
                message:"Company not found",
            });
        }
        return res.status(200).json({
            success:true,
            message: "Company Info",
            company
        });
    } catch (error) {
        console.log(error);
    }
};

export const updateCompany = async (req,res) => {
    try {
        const {name,description,website,location} = req.body;

        const file = req.file;
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

        const logo = cloudResponse.secure_url;

        const updateData = {name,description,website,location,logo};
        const company = await Company.findByIdAndUpdate(req.params.id,updateData,{new:true});
        if(!company) {
            return res.status(400).json({
                success:false,
                message:"Company not found"
            });
        }
        return res.status(200).json({
            success:true,
            message:"Company information updated",
            company
        });
    } catch (error) {
        console.log(error);
    }
};