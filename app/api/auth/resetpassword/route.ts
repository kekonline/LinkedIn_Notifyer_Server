import { NextResponse } from 'next/server';
import User from './../../../models/User.model';
import bcrypt from 'bcryptjs';


export async function POST(originalReq: Request) {
    try {
        const { email, password, token } = await originalReq.json();

        if (!email || !password || !token) {
            return NextResponse.json({ message: 'All fields are required', error: true }, { status: 400 });
        }

        const user = await User.find({ email });
        // console.log("user", user);

        if (user && user.length === 0) {
            console.log("User not found");
            return NextResponse.json({ message: 'All fields are required', error: true }, { status: 401 });
        }

        // if (user && !user.isActive) {
        //     console.log("User is not active");
        //     return res.status(401).json({ message: " User is not active", error: true });
        // }

        if (!user[0].email) {
            return NextResponse.json({ message: 'User email is required', error: true }, { status: 401 });
        }

        if (user[0].email != email) {
            return NextResponse.json({ message: 'Invalid email', error: true }, { status: 400 });
        }

        if (user[0].token.value !== token) {
            return NextResponse.json({ message: 'Invalid token', error: true }, { status: 400 });
        }

        if (user[0].token.expiry.getTime() < Date.now()) {
            return NextResponse.json({ message: 'Token expired"', error: true }, { status: 400 });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        await User.findByIdAndUpdate(user[0]._id, { password: passwordHash, "token.value": null, "token.expiry": null }, { new: true });

        return NextResponse.json({ message: "Password updated successfully", error: false });

    } catch (error) {
        console.log("Error Reseting Password", error);
        return NextResponse.json({ message: 'Error Reseting Password', error: true }, { status: 500 });
    }
};