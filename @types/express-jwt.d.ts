// express.d.ts
import { Request } from 'express';

// Define the structure of your JWT payload
interface JwtPayload {
    _id: string;
}

// Declare the module to augment the existing Express types
declare module 'express' {
    export interface Request {
        payload?: JwtPayload;
    }
}
