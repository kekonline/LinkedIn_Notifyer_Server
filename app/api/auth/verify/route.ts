// app/api/token/route.ts
import { NextResponse } from 'next/server';
import User from './../../../models/User.model';
import { conectToDB, authentication } from './../../../middleware';

const maskEmail = (email: string) => {

    const [localPart, domainPart] = email.split('@');
    const visiblePart = localPart.slice(0, 4);
    const maskedPart = '*'.repeat(localPart.length - 4);

    return `${visiblePart}${maskedPart}@${domainPart}`;
};

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

        if (!user) {
            console.log("User not found");
            return NextResponse.json({ message: 'Token is invalid', error: true }, { status: 401 });
        }

        const { email, getNotifications, isActive } = user;

        return NextResponse.json({
            enrolled: email ? true : false,
            email: email ? maskEmail(email) : null,
            getNotifications,
            isActive,
            message: "All Good User Is Authenticated",
            error: false
        });

    } catch (error) {
        console.log("Error verifying user:", error);
        return NextResponse.json({ message: 'Error verifying user', error: true }, { status: 500 });
    }
}
