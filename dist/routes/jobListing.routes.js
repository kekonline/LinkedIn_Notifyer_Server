"use strict";
const router = require("express").Router();
const jobListingController = require('../controllers/jobListing.controller');
// GET - /api/job
router.get('/:page', jobListingController.getAllJobs);
// GET - /api/job/:jobId
router.get('/:jobId', jobListingController.getJobById);
// PUT - /api/job/:jobId
router.put('/:jobId', jobListingController.markJobId);
module.exports = router;
