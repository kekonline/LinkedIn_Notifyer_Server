// src/user/interfaces/request.interface.ts
import { Request } from 'express';
import { User } from './schemas/user.schema'; // Adjust the path as necessary

export interface AuthRequest extends Request {
    payload?: {
        _id: string; // or whatever other properties you expect
    };
    user?: User; // Optional user property
}
