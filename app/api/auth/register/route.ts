import { conectToDB, authentication } from './../../../middleware';
import User from './../../../models/User.model';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { sendMail } from '../../../mailer/mailerJob';


export async function POST(originalReq: Request) {

    const { email, password } = await originalReq.json();

    if (!email || !password) {
        return NextResponse.json({ message: 'All fields are required"', error: true }, { status: 400 });
    }
    try {
        await conectToDB();
        const isEmailDuplicated = await User.findOne({ email });
        if (isEmailDuplicated) {
            return NextResponse.json({ message: 'Email already registered', error: true }, { status: 400 });
        }

        const req = (await authentication(originalReq)) as Request & {
            payload?: { _id: string };
        };

        const userId = req.payload?._id;

        if (!userId) {
            return NextResponse.json({ message: 'Token is invalid', error: true }, { status: 401 });
        }
        const isUserAlreadyRegistered = await User.findOne({ _id: userId });
        if (isUserAlreadyRegistered && isUserAlreadyRegistered.email) {
            return NextResponse.json({ message: 'You already have an account', error: true }, { status: 400 });
        }

        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!regex.test(email)) {
            return NextResponse.json({ message: 'Invalid email', error: true }, { status: 400 });
        }

        // const regexPassword =
        //     /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{5,}$/gm;
        // if (regexPassword.test(password) === false) {
        //     res
        //         .status(400)
        //         .json({ message: "Password must be at least 5 characters long and contain at least one uppercase letter, one lowercase letter and one number", error: true });
        //     return;
        // }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const activationToken = uuidv4();

        await User.findOneAndUpdate(
            { _id: userId },
            { $set: { email, password: passwordHash, "token.value": activationToken } }
        );

        const message = `<p>Hi there ${email}!</p>
        <p>Please click on the link below to activate your account:</p>
        <p><a href="${process.env.ORIGIN || "http://localhost:5173"}/account/activate/${activationToken}">Activate Account</a></p>`


        sendMail(email, 'Activate Your Account', message);

        return NextResponse.json({ message: 'User created successfully', error: false });

    } catch (error) {
        console.log("error registering: ", error)
        return NextResponse.json({ error: 'Error registering' }, { status: 500 });

    }

}