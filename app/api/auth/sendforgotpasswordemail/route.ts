import { NextResponse } from 'next/server';
import User from './../../../models/User.model';
import { conectToDB, authentication } from './../../../middleware';
import { v4 as uuidv4 } from 'uuid';
import { sendMail } from '../../../mailer/mailerJob';

export async function POST(originalReq: Request) {
    try {
        await conectToDB();
        const req = (await authentication(originalReq)) as Request & {
            payload?: { _id: string };
        };

        const userId = req.payload?._id;

        if (!userId) {
            return NextResponse.json({ message: 'Token is invalid', error: true }, { status: 401 });
        }

        const { email } = await originalReq.json();

        if (!email) {
            return NextResponse.json({ message: 'All fields are required', error: true }, { status: 400 });
        }

        const user = await User.find({ email: email });
        // console.log("user", user);

        if (user && user.length === 0) {
            console.log("User not found");
            return NextResponse.json({ message: 'Token is invalid', error: true }, { status: 401 });
        }

        if (!user[0].email) {

            return NextResponse.json({ message: 'User email is required', error: true }, { status: 401 });
        }
        // if (user && !user.isActive) {
        //     console.log("User is not active");
        //     return res.status(401).json({ message: " User is not active", error: true });
        // }

        if (user[0].email !== email) {
            return NextResponse.json({ message: 'Invalid email', error: true }, { status: 400 });
        }

        const activationToken = uuidv4();

        await User.findByIdAndUpdate(
            user[0]._id, { isActive: true, "token.value": activationToken, "token.expiry": Date.now() + 15 * 60 * 1000 }, { new: true }
        );



        const message = `<p>Hi there ${user[0].email}!</p>
        <p>Please click on the link to follow to reset your password:</p>
        <p><a href="${process.env.ORIGIN || "http://localhost:5173"}/account/resetpassword/${activationToken}">Reset Password</a></p>`

        sendMail(user[0].email, 'Password Reset', message);
        return NextResponse.json({ message: "Reset Password email sent successfully", error: false });

    } catch (error) {
        console.log("Error Sending Forgot Password Email:", error);
        return NextResponse.json({ message: 'Error sending forgot password email', error: true }, { status: 500 });
    }
};
