// const router = require("express").Router();
// const { authentication, checkUserExistence } = require("../middlewares/authentication.js");

// // login, signin, verify
// const authRouter = require("./auth.routes")
// router.use("/auth", authRouter)

// // searchTerm routes
// const searchTermRouter = require("./searchTerm.routes")
// router.use("/searchterm", authentication, checkUserExistence, searchTermRouter)

// // job routes
// const jobRouter = require("./jobListing.routes.js")
// router.use("/job", authentication, checkUserExistence, jobRouter)

// module.exports = router;

import { Router } from 'express';
import { authentication, checkUserExistence } from '../middlewares/authentication';
import authRouter from './auth.routes';
// import searchTermRouter from './searchTerm.routes';
// import jobRouter from './jobListing.routes';

// Create a new router instance
const router: Router = Router();

// Auth routes
router.use('/auth', authRouter);

// Search term routes with authentication middleware
// router.use('/searchterm', authentication, checkUserExistence, searchTermRouter);

// Job routes with authentication middleware
// router.use('/job', authentication, checkUserExistence, jobRouter);

export default router;
