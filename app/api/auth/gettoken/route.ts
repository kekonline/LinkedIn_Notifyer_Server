import { NextResponse } from 'next/server';
import User from './../../../models/User.model';
import jwt from 'jsonwebtoken';

export async function GET() {
    try {

        console.log("Giving User Auth Token");

        const newUser = await User.create({}); // Create a new user (adjust as necessary)
        console.log("newUser", newUser);

        const payload = { _id: newUser._id };
        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET as string, {
            algorithm: "HS256",
            expiresIn: "365d",
        });

        return NextResponse.json({ authToken });
    } catch (error) {
        console.log("Error Signing Up User: ", error);
        return NextResponse.json({ message: 'Error Signing Up User', error: true }, { status: 500 });
    }
}
