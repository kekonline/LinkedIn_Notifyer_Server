import { Request, Response, NextFunction } from 'express';
import JobListing from '../models/JobListing.model'
import SearchTerm from '../models/SearchTerm.model'
import User from "../models/User.model"

export const getAllJobs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = (req as Request & { payload?: { _id: string } }).payload?._id;
    const page: string = req.params.page;

    if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
    }

    try {
        const searchTerms = await SearchTerm.find({ users: userId })
            .populate({
                path: 'jobListings',
                select: '-users' // Exclude the 'users' field from the job listings
            });

        // Ensure jobListings is of type JobListing[]
        let jobListings: JobListing[] = searchTerms.flatMap(term => term.jobListings as unknown as JobListing[]);

        // Sort job listings by createdAt, checking if createdAt is defined
        jobListings.sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return dateB - dateA;
        });

        const user = await User.findById(userId).select('seenJobListings').lean(); // Using lean for better performance

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        if (page === 'starred') {
            const starredIds = user.seenJobListings
                .filter(item => item.starred) // Only keep starred job listings
                .map(item => item.jobListing.toString());

            jobListings = jobListings.filter(job => starredIds.includes(job._id.toString()));
        } else {
            const seenJobIds = user.seenJobListings
                .filter(item => item.seen) // Only keep seen job listings
                .map(item => item.jobListing.toString());

            if (page === 'new') {
                // Return only unseen job listings
                jobListings = jobListings.filter(job => !seenJobIds.includes(job._id.toString()));
            } else if (page === 'seen') {
                // Return only seen job listings
                jobListings = jobListings.filter(job => seenJobIds.includes(job._id.toString()));
            }
        }
        res.status(200).json(jobListings);
        return
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching job listings' });
    }
};



// Handler for creating a new job listing
export const getJobById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const jobId = req.params.jobId;

    try {
        const jobListing = await JobListing.findById(jobId).select('-users');

        if (!jobListing) {
            res.status(404).json({ error: 'Job listing not found' });
            return
        }
        // console.log(jobListing);
        res.status(200).json(jobListing);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the job listing' });
    }
};

// Handler for creating a new job listing
export const markJobId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = (req as Request & { payload?: { _id: string } }).payload?._id;
    const jobId = req.params.jobId;
    const { markAs } = req.body;

    try {

        const updatedUser = await User.findOneAndUpdate(
            {
                _id: userId,
                "seenJobListings.jobListing": jobId // Check if the jobListing already exists
            },
            {
                $set: {
                    [`seenJobListings.$.${markAs}`]: true, // Set seen based on markAs value

                }
            },
            {
                new: true,
                upsert: false // Only update if it exists, don't create new if not found
            }
        );

        // If the jobListing doesn't exist, push it to the seenJobListings array
        if (!updatedUser) {
            await User.findByIdAndUpdate(
                userId,
                {
                    $push: {
                        seenJobListings: {
                            jobListing: jobId,
                            [markAs]: true,
                        }
                    }
                },
                { new: true }
            );
        }

        res.status(200).json({ message: 'Job listing updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while updating the job listing' });
    }
};

