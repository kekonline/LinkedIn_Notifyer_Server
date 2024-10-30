import { NextResponse } from 'next/server';
import User from './../../../models/User.model';
import SearchTerm from './../../../models/SearchTerm.model';
import { conectToDB, authentication } from './../../../middleware';

export async function DELETE(originalReq: Request) {

    const url = new URL(originalReq.url);
    const searchTermToDelete = url.pathname.split('/').pop();

    try {

        await conectToDB();
        const req = (await authentication(originalReq)) as Request & {
            payload?: { _id: string };
        };
        const userId = (req as Request & { payload?: { _id: string } }).payload?._id;

        if (!userId) {
            return NextResponse.json({ message: 'Token is invalid', error: true }, { status: 401 });
        }

        const searchTerm = await SearchTerm.findById(searchTermToDelete);
        if (!searchTerm) {

            return NextResponse.json({ message: "Search term not found", error: true }, { status: 404 });
        }

        await SearchTerm.findOneAndUpdate(
            {
                _id: searchTermToDelete
            },
            {
                $pull: { users: userId }
            }
        );

        await User.findOneAndUpdate(
            {
                _id: userId
            },
            {
                $pull: { searchTerms: searchTermToDelete }
            }
        );


        return NextResponse.json({ message: "Search term deleted successfully", error: false });

    } catch (error) {
        console.log("error in delete search term: ", error)
        return NextResponse.json({ error: 'Error deleting search term' }, { status: 500 });
    }

};