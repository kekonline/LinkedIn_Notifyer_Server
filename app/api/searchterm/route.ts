import { NextResponse } from 'next/server';
import User from './../../models/User.model';
import SearchTerm from './../../models/SearchTerm.model';
import { conectToDB, authentication } from './../../middleware';

export async function GET(originalReq: Request) {

    try {
        await conectToDB();
        const req = (await authentication(originalReq)) as Request & {
            payload?: { _id: string };
        };
        const userId = (req as Request & { payload?: { _id: string } }).payload?._id;

        if (!userId) {
            return NextResponse.json({ message: 'Token is invalid', error: true }, { status: 401 });
        }

        const searchTerms = await SearchTerm.find({ users: userId }).select('-users').sort({ term: 1 });

        return NextResponse.json({ searchTerms, error: false });
    } catch (error) {
        console.log("error in get search terms: ", error);
        return NextResponse.json({ error: 'Error getting search terms' }, { status: 500 });
    }
};

export async function POST(originalReq: Request) {

    try {
        await conectToDB();
        await conectToDB();
        const req = (await authentication(originalReq)) as Request & {
            payload?: { _id: string };
        };
        const userId = (req as Request & { payload?: { _id: string } }).payload?._id;

        if (!userId) {
            return NextResponse.json({ message: 'Token is invalid', error: true }, { status: 401 });
        }

        const { term, location, jobType } = await originalReq.json();

        if (!term || !location) {
            return NextResponse.json({ message: "All fields are required", error: true }, { status: 400 });
        }

        const updatedSearchTerm = await SearchTerm.findOneAndUpdate(
            {
                term: term.trim().toLowerCase(),
                location: location.trim().toLowerCase(),
                jobType: jobType ? jobType.trim().toLowerCase() : jobType
            },
            {
                $addToSet: { users: userId }
            },
            {
                new: true,
                upsert: true     // Create a new document if none match the query
            }
        );

        const searchTermId = updatedSearchTerm ? updatedSearchTerm._id : null;

        if (searchTermId) {
            await User.findByIdAndUpdate(
                userId,
                {
                    $addToSet: { searchTerms: searchTermId }
                }
            );
        }


        return NextResponse.json({ message: "Search term updated successfully", error: false }, { status: 201 });
    } catch (error) {
        console.log("error in post search term: ", error)
        return NextResponse.json({ error: 'Error updating search term' }, { status: 500 });
    }
};
