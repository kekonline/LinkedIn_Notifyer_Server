import { NextResponse } from 'next/server';
import { sendMail } from '../../../mailer/mailerJob';
import { authentication } from './../../../middleware';
import User from './../../../models/User.model';

export async function GET(originalReq: Request) {
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

        if (user && user.isActive) {
            console.log("User is already active");
            return NextResponse.json({ message: 'User is already active', error: true }, { status: 401 });
        }

        if (!user.email) {
            return NextResponse.json({ message: 'User email is required', error: true }, { status: 401 });
        }

        const message = `<p>Hi there ${user.email}!</p>
            <p>Please click on the link below to activate your account:</p>
            <p><a href="${process.env.ORIGIN || "http://localhost:5173"}/account/activate/${user.token.value}">Activate Account</a></p>`

        sendMail(user.email, 'Activate Your Account', message);
        return NextResponse.json({ message: "Activation email sent successfully", error: false });

    } catch (error) {
        console.log("Error re sending activation email", error);
        return NextResponse.json({ message: 'Error re sending activation email', error: true }, { status: 500 });
    }
}




