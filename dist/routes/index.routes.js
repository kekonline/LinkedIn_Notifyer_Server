"use strict";
// const router = require("express").Router();
// const { authentication, checkUserExistence } = require("../middlewares/authentication.js");
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
// import searchTermRouter from './searchTerm.routes';
// import jobRouter from './jobListing.routes';
// Create a new router instance
const router = (0, express_1.Router)();
// Auth routes
router.use('/auth', auth_routes_1.default);
// Search term routes with authentication middleware
// router.use('/searchterm', authentication, checkUserExistence, searchTermRouter);
// Job routes with authentication middleware
// router.use('/job', authentication, checkUserExistence, jobRouter);
exports.default = router;
