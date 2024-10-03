import { Router } from "express";
import { authentication, checkUserExistence } from "../middlewares/authentication";
import searchTermRouter from "./searchTerm.routes";
import jobRouter from "./jobListing.routes";
import authRouter from "./auth.routes";  // Changed from require to import

const router = Router();

// Auth routes
router.use("/auth", authRouter);

// SearchTerm routes
router.use("/searchterm", authentication, checkUserExistence, searchTermRouter);

// Job routes
router.use("/job", authentication, checkUserExistence, jobRouter);

export default router;
