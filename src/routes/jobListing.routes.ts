import { Router } from 'express';
import * as jobListingController from '../controllers/jobListing.controller';

const jobRouter: Router = Router();

// GET - /api/job/:page
jobRouter.get('/:page', jobListingController.getAllJobs);

// GET - /api/job/:jobId
jobRouter.get('/:jobId', jobListingController.getJobById);

// PUT - /api/job/:jobId
jobRouter.put('/:jobId', jobListingController.markJobId);

export default jobRouter;
