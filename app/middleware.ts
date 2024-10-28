// app/middleware.ts
import { NextResponse } from 'next/server';
import { connectToMongo } from './utils/dbConfig';
import User from './models/User.model';
import { expressjwt } from 'express-jwt';

export async function conectToDB() {
    await connectToMongo();
    return NextResponse.next();
}

export async function authentication(request: Request) {
    const authMiddleware = expressjwt({
        secret: process.env.TOKEN_SECRET as string,
        algorithms: ['HS256'],
        requestProperty: 'payload',
        getToken: (req) => {
            const authHeader = req.headers.get('Authorization');
            if (!authHeader) return null;

            const [tokenType, token] = authHeader.split(' ');
            return tokenType === 'Bearer' ? token : null;
        }
    });

    try {
        // Wrap the middleware call in a promise
        await new Promise<void>((resolve, reject) => {
            authMiddleware(request as Request, {} as any, (err: any) => {
                if (err) {
                    console.error("Authentication error:", err);
                    return reject(err);
                }
                resolve();
            });
        });

        return request;
    } catch (error: any) {
        return NextResponse.json({ message: "Unauthorized", error: error.message }, { status: 401 });
    }
}

export const checkUserExistence = async (request: Request) => {
    const _id = (request as Request & { payload?: { _id: string } }).payload?._id;

    if (!_id) {
        return NextResponse.json({ message: 'No token or payload found' }, { status: 401 });
    }

    const user = await User.findById(_id);
    if (!user) {
        return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    (request as any).user = user;
    return NextResponse.next();
};

export const config = {
    matcher: ['/api/:path*'], // Apply middleware to API routes
};
