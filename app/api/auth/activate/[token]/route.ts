import { NextResponse } from 'next/server';
import { conectToDB, authentication } from '../../../../middleware';
import User from '../../../../models/User.model';


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
        const user = await User.findById(userId);
        console.log("user", user);

        if (!user) {
            console.log("User not found");
            return NextResponse.json({ message: 'Token is invalid', error: true }, { status: 401 });
        }

        if (!user.email) {
            return NextResponse.json({ message: 'User email is required', error: true }, { status: 401 });
        }

        if (user && user.isActive) {
            console.log("User is already active");
            return NextResponse.json({ message: 'User is already active', error: true }, { status: 401 });
        }

        await User.findByIdAndUpdate(
            userId, { isActive: true, "token.value": null }, { new: true }
        );
        return NextResponse.json({ message: "User activated successfully", error: false });
    } catch (error) {
        console.log("Error Activating User", error);
        return NextResponse.json({ message: 'Error Activating User', error: true }, { status: 500 });
    }
}
