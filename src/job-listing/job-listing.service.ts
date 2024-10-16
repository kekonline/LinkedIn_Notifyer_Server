import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JobListing } from './schemas/job-listing.schema';
import { SearchTerm } from '../search-term/schemas/search-term.schema';
import { User } from '../user/schemas/user.schema';

@Injectable()
export class JobListingService {
    constructor(
        @InjectModel(JobListing.name) private jobListingModel: Model<JobListing>,
        @InjectModel(SearchTerm.name) private searchTermModel: Model<SearchTerm>,
        @InjectModel(User.name) private userModel: Model<User>,
    ) { }

    async getAllJobs(userId: string, page: string): Promise<JobListing[]> {
        if (!userId) {
            throw new UnauthorizedException('User not authenticated');
        }

        const searchTerms = await this.searchTermModel.find({ users: userId })
            .populate({
                path: 'jobListings',
                select: '-users',
            });

        let jobListings: JobListing[] = searchTerms.flatMap(term => term.jobListings as unknown as JobListing[]);

        jobListings.sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return dateB - dateA;
        });

        const user = await this.userModel.findById(userId).select('seenJobListings').lean();

        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (page === 'starred') {
            const starredIds = user.seenJobListings
                .filter(item => item.starred)
                .map(item => item.jobListing.toString());

            jobListings = jobListings.filter(job => starredIds.includes(job._id.toString()));
        } else {
            const seenJobIds = user.seenJobListings
                .filter(item => item.seen)
                .map(item => item.jobListing.toString());

            if (page === 'new') {
                jobListings = jobListings.filter(job => !seenJobIds.includes(job._id.toString()));
            } else if (page === 'seen') {
                jobListings = jobListings.filter(job => seenJobIds.includes(job._id.toString()));
            }
        }
        return jobListings;
    }

    async getJobById(jobId: string): Promise<JobListing> {
        const jobListing = await this.jobListingModel.findById(jobId).select('-users');
        if (!jobListing) {
            throw new NotFoundException('Job listing not found');
        }
        return jobListing;
    }

    async markJobId(userId: string, jobId: string, markAs: 'seen' | 'starred'): Promise<void> {
        const updatedUser = await this.userModel.findOneAndUpdate(
            {
                _id: userId,
                "seenJobListings.jobListing": jobId
            },
            {
                $set: {
                    [`seenJobListings.$.${markAs}`]: true,
                }
            },
            {
                new: true,
                upsert: false,
            }
        );

        if (!updatedUser) {
            await this.userModel.findByIdAndUpdate(
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
    }
}
