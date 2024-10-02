import { Request, Response, NextFunction } from 'express';
import { expressjwt } from 'express-jwt';
import User from '../models/User.model';

// Configure the Express JWT authentication middleware
const authentication = (req: Request, res: Response, next: NextFunction) => {
    try {
        // Call express-jwt middleware inside try/catch
        expressjwt({
            secret: process.env.TOKEN_SECRET as string,
            algorithms: ['HS256'],
            requestProperty: 'payload',
            getToken: (req) => {
                if (!req.headers || !req.headers.authorization) {
                    return undefined;
                }

                const [tokenType, token] = req.headers.authorization.split(' ');

                if (tokenType !== 'Bearer') {
                    return undefined;
                }

                return token;
            }
        })(req, res, (err) => {
            if (err) {
                throw err; // Re-throw the error so it gets caught by the catch block
            }
            next(); // Call next() to proceed to the next middleware
        });
    } catch (error) {
        console.error('Authentication error:', error);
        // Send an appropriate response when an error occurs
        res.status(401).json({ message: 'Unauthorized', error });
    }
};


// Middleware to check user existence
const checkUserExistence = async (req: Request, res: Response, next: NextFunction) => {

    try {

        const _id = (req as Request & { payload?: { _id: string } }).payload?._id;

        // Check if payload exists before accessing _id
        if (!_id) {
            res.status(401).json({ message: 'No token or payload found' });
            return
        }

        console.log('Request payload:', _id); // Log for debugging
        // const _id = req.payload; // Safe to access _id now
        const user = await User.findById(_id);

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return
        }

        // Attach user to the request if needed
        req.user = user;
        next();
        return
    } catch (error) {
        console.error('Error verifying user:', error);
        res.status(500).json({ message: 'Error verifying user', error });
        return
    }
};

export { authentication, checkUserExistence };
