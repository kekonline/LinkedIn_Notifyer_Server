import { Router } from "express";
import { authentication, checkUserExistence } from "../middlewares/authentication";
import searchTermRouter from "./searchTerm.routes"
import jobRouter from "./jobListing.routes"


const router = Router();

// login, signin, verify
const authRouter = require("./auth.routes")
router.use("/auth", authRouter)

// searchTerm routes
router.use("/searchterm", authentication, checkUserExistence, searchTermRouter)

// job routes
router.use("/job", authentication, checkUserExistence, jobRouter)

export default router;