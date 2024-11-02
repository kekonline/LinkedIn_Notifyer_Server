import { NextResponse } from 'next/server';
import User from '../../../../models/User.model'; // Import User interface
import JobListing from '../../../../models/JobListing.model';
import { conectToDB, authentication } from '../../../../middleware';


// Handler for creating a new job listing
export async function GET(originalReq: Request) {

    try {

        await conectToDB();
        const req = (await authentication(originalReq)) as Request & {
            payload?: { _id: string };
        };

        const userId = req.payload?._id;

        if (!userId) {
            return NextResponse.json({ message: 'Token is invalid', error: true }, { status: 401 });
        }

        const url = new URL(originalReq.url);
        const jobId = url.pathname.split('/').pop();
        const jobListing = await JobListing.findById(jobId).select('-users');

        if (!jobListing) {
            return NextResponse.json({ message: 'Job listing not found', error: true }, { status: 404 });
        }
        // console.log(jobListing);
        return NextResponse.json(jobListing);
    } catch (error) {
        console.log("Error getting job listing: ", error)
        return NextResponse.json({ message: 'Error getting job listing', error: true }, { status: 500 });
    }
};



// Handler for creating a new job listing
export async function PUT(originalReq: Request) {


    try {
        await conectToDB();
        const req = (await authentication(originalReq)) as Request & {
            payload?: { _id: string };
        };

        const userId = req.payload?._id;

        if (!userId) {
            return NextResponse.json({ message: 'Token is invalid', error: true }, { status: 401 });
        }

        const url = new URL(originalReq.url);
        const jobId = url.pathname.split('/').pop();
        const { markAs } = await req.json() as { markAs: string };

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

        return NextResponse.json({ message: 'Job listing updated successfully' });
    } catch (error) {
        console.log("error registering: ", error)
        return NextResponse.json({ message: 'Error registering', error: true }, { status: 500 });
    }
};

