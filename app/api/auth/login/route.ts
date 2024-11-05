import { NextResponse } from 'next/server';
import User from './../../../models/User.model';
import { authentication } from './../../../middleware';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export async function POST(originalReq: Request) {

    try {

        const req = (await authentication(originalReq)) as Request & {
            payload?: { _id: string };
        };

        const userId = req.payload?._id;

        if (!userId) {
            return NextResponse.json({ message: 'Token is invalid', error: true }, { status: 401 });
        }

        const { email, password } = await originalReq.json();

        if (!email || !password) {
            return NextResponse.json({ message: 'All fields are required', error: true }, { status: 400 });
        }

        const logingInUser = await User.findOne({ email });
        if (logingInUser === null) {
            return NextResponse.json({ message: 'Email not registered', error: true }, { status: 400 });
        }

        if (!logingInUser || !logingInUser.email || !logingInUser.password) {
            return NextResponse.json({ message: 'Email not registered', error: true }, { status: 400 });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            logingInUser.password
        );
        // const isPasswordCorrect = password === logingInUser.password;

        if (!isPasswordCorrect) {
            return NextResponse.json({ message: 'Incorrect password', error: true }, { status: 400 });
        }

        console.log("logingInUser._id," + logingInUser._id);

        const payload = {
            _id: logingInUser._id,
        };
        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET as string, {
            algorithm: "HS256",
            expiresIn: "365d",
        });
        return NextResponse.json({ authToken });
    } catch (error) {
        console.log("Error logging in:", error);
        return NextResponse.json({ message: 'Error logging in', error: true }, { status: 500 });
    }

}