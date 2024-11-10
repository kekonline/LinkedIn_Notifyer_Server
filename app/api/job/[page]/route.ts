import { NextResponse } from 'next/server';
import User, { User as UserDocument } from './../../../models/User.model'; // Import User interface
import JobListing from './../../../models/JobListing.model';
import SearchTerm from './../../../models/SearchTerm.model';
import { authentication } from './../../../middleware';

export async function GET(originalReq: Request) {


    try {
        await JobListing.find({});
        const req = (await authentication(originalReq)) as Request & {
            payload?: { _id: string };
        };
        const userId = (req as Request & { payload?: { _id: string } }).payload?._id;

        const url = new URL(originalReq.url);
        const page = url.pathname.split('/').pop();

        if (!userId) {
            return NextResponse.json({ message: 'User not authenticated', error: true }, { status: 401 });
        }
        const searchTerms = await SearchTerm.find({ users: userId })
            .populate({
                path: 'jobListings',
                select: '-users' // Exclude the 'users' field from the job listings
            });

        let jobListings: JobListing[] = searchTerms.flatMap(term => term.jobListings as unknown as JobListing[]);

        jobListings.sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return dateB - dateA;
        });

        // Assert the type of the user
        const user = await User.findById(userId).select('seenJobListings').lean() as UserDocument;

        if (!user) {
            return NextResponse.json({ message: 'User not found', error: true }, { status: 404 });
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
                jobListings = jobListings.filter(job => !seenJobIds.includes(job._id.toString()));
            } else if (page === 'seen') {
                jobListings = jobListings.filter(job => seenJobIds.includes(job._id.toString()));
            }
        }
        return NextResponse.json({ jobListings }, { status: 200 });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'An error occurred while fetching job listings', error: true }, { status: 500 });
    }
}
