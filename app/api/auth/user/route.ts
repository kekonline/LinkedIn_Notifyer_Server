import { NextResponse } from 'next/server';
import User from './../../../models/User.model';
import { authentication } from './../../../middleware';

export async function PUT(originalReq: Request) {

    try {

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

        if (user && !user.isActive) {
            console.log("User is not active");
            return NextResponse.json({ message: 'User is not active', error: true }, { status: 401 });
        }

        if (!user.email) {
            return NextResponse.json({ message: 'User email is required', error: true }, { status: 401 });
        }

        const { getNotifications } = await originalReq.json();
        // console.log("getNotifications", getNotifications);
        // console.log("req.payload._id", req.payload._id);
        // console.log("user", user);

        await User.findByIdAndUpdate(
            userId,
            { getNotifications: getNotifications },
            { new: true }
        );

        // console.log("UpdateUserInfo", UpdateUserInfo);

        return NextResponse.json({ message: "Notifications updated successfully", error: false });

    } catch (error) {
        console.log("Error updating user information: ", error);
        return NextResponse.json({ message: 'Error updating user information', error: true }, { status: 500 });
    }
};
