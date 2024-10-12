// check-user-existence.guard.ts
import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema';

@Injectable()
export class CheckUserExistenceGuard implements CanActivate {
    constructor(@InjectModel(User.name) private readonly userModel: Model<User>) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const _id = (request as Request & { payload?: { _id: string } }).payload?._id;

        if (!_id) {
            throw new HttpException('No token or payload found', HttpStatus.UNAUTHORIZED);
        }

        try {
            const user = await this.userModel.findById(_id);
            if (!user) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }

            // Attach the user to the request
            // request.user = user;
            return true;
        } catch (error) {
            console.error('Error verifying user:', error);
            throw new HttpException('Error verifying user', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
