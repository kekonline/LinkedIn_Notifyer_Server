import { NextResponse } from 'next/server';
import User from './../../../models/User.model';
import { conectToDB, authentication } from './../../../middleware';
import bcrypt from 'bcryptjs';

export async function PUT(originalReq: Request) {        // console.log("token", req.payload)
    // console.log(req.body);

    await conectToDB();
    const req = (await authentication(originalReq)) as Request & {
        payload?: { _id: string };
    };

    const userId = req.payload?._id;

    if (!userId) {
        return NextResponse.json({ message: 'Token is invalid', error: true }, { status: 401 });
    }

    const { oldPassword, newPassword } = await originalReq.json();
    try {
        const userInfo = await User.findById(userId);

        if (!userInfo) {
            return NextResponse.json({ message: 'User not found', error: true }, { status: 401 });
        }

        if (!userInfo.password) {
            return NextResponse.json({ message: 'User not found', error: true }, { status: 401 });
        }

        if (!oldPassword || !newPassword) {
            return NextResponse.json({ message: 'All fields are required', error: true }, { status: 401 });
        }

        const isPasswordCorrect = await bcrypt.compare(
            oldPassword,
            userInfo.password
        );
        // const isPasswordCorrect = oldPassword === userInfo.password;

        if (isPasswordCorrect) {
            // console.log("passwords are the same")
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(newPassword, salt);
            await User.findByIdAndUpdate(
                userId,
                { password: passwordHash },
                { new: true }
            );
            return NextResponse.json({ message: "Password updated successfully", error: false });
        } else {
            return NextResponse.json({ message: 'Incorrect password', error: true }, { status: 400 });
        }
    } catch (error) {
        console.log("Error Updating Password", error);
        return NextResponse.json({ message: 'Error Updating Password', error: true }, { status: 500 });
    }
};