// auth.guard.ts
import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { AuthRequest } from '../request.interface'; // Adjust the path as necessary

import { expressjwt } from 'express-jwt';

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<AuthRequest>();

        return new Promise<boolean>((resolve, reject) => {
            try {
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
                })(request, request.res, (err) => {
                    if (err) {
                        console.error('Authentication error:', err);
                        reject(new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED));
                    }
                    resolve(true);
                });
            } catch (error) {
                console.error('Authentication error:', error);
                reject(new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED));
            }
        });
    }
}
