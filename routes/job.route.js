import express from "express";
import { postJob, getAllJobs, getJobById, getJobsByRecruiter } from "../controllers/job.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.post("/create/new",isAuthenticated,postJob);
router.get("/get",getAllJobs);
router.get("/get/:id",isAuthenticated,getJobById);
router.get("/admin/get",isAuthenticated,getJobsByRecruiter);

export default router;