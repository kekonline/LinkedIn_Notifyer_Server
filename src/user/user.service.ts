import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { AuthRequest } from './request.interface';


@Injectable()
export class UserService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private jwtService: JwtService,
        private configService: ConfigService,
        private mailService: MailService,
    ) { }

    async getToken(): Promise<any> {
        try {
            console.log('Giving User Auth Token');
            const newUser = await this.userModel.create({});
            const payload = { _id: newUser._id };
            const authToken = this.jwtService.sign(payload, {
                secret: this.configService.get<string>('TOKEN_SECRET'),
                algorithm: 'HS256',
                expiresIn: '365d',
            });
            return { authToken };
        } catch (error) {
            console.log('Error Signing Up User: ', error);
            throw new HttpException('Failed to generate token', HttpStatus.BAD_REQUEST);
        }
    }

    async register(email: string, password: string, req: AuthRequest): Promise<{ message: string, error: boolean }> {
        if (!email || !password) {
            throw new HttpException('All fields are required', HttpStatus.BAD_REQUEST);
        }

        const isEmailDuplicated = await this.userModel.findOne({ email });
        if (isEmailDuplicated) {
            throw new HttpException('Email already registered', HttpStatus.BAD_REQUEST);
        }

        const userId = req.payload?._id;


        const isUserAlreadyRegistered = await this.userModel.findOne({ _id: userId });
        if (isUserAlreadyRegistered && isUserAlreadyRegistered.email) {
            throw new HttpException('You already have an account', HttpStatus.BAD_REQUEST);
        }

        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!regex.test(email)) {
            throw new HttpException('Invalid email', HttpStatus.BAD_REQUEST);
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        const activationToken = uuidv4();

        await this.userModel.findOneAndUpdate(
            { _id: userId },
            { $set: { email, password: passwordHash, "token.value": activationToken } }
        );

        const message = `<p>Hi there ${email}!</p>
      <p>Please click on the link below to activate your account:</p>
      <p><a href="${this.configService.get('ORIGIN') || 'http://localhost:5173'}/account/activate/${activationToken}">Activate Account</a></p>`;

        await this.mailService.sendMail(email, 'Activate Your Account', message);
        return { message: 'User created successfully', error: false };
    }

    async logIn(email: string, password: string): Promise<{ authToken: string }> {
        if (!email || !password) {
            throw new HttpException('All fields are required', HttpStatus.BAD_REQUEST);
        }

        const user = await this.userModel.findOne({ email });
        if (!user || !user.password) {
            throw new HttpException('Email not registered', HttpStatus.BAD_REQUEST);
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            throw new HttpException('Incorrect password', HttpStatus.BAD_REQUEST);
        }

        const payload = { _id: user._id };
        const authToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('TOKEN_SECRET'),
            algorithm: 'HS256',
            expiresIn: '365d',
        });
        return { authToken };
    }

    maskEmail(email: string): string {
        const [localPart, domainPart] = email.split('@');
        const visiblePart = localPart.slice(0, 4);
        const maskedPart = '*'.repeat(localPart.length - 4);
        return `${visiblePart}${maskedPart}@${domainPart}`;
    }

    async verify(userId: string): Promise<any> {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new HttpException('Token is invalid', HttpStatus.UNAUTHORIZED);
        }

        const { email, getNotifications, isActive } = user;
        return {
            enrolled: !!email,
            email: email ? this.maskEmail(email) : null,
            getNotifications,
            isActive,
            message: 'All Good User Is Authenticated',
            error: false,
        };
    }

    async newPassword(userId: string, oldPassword: string, newPassword: string): Promise<{ message: string, error: boolean }> {
        const user = await this.userModel.findById(userId);
        if (!user || !oldPassword || !newPassword) {
            throw new HttpException('All fields are required', HttpStatus.BAD_REQUEST);
        }

        const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordCorrect) {
            throw new HttpException('Incorrect password', HttpStatus.BAD_REQUEST);
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(newPassword, salt);
        await this.userModel.findByIdAndUpdate(userId, { password: passwordHash });
        return { message: 'Password updated successfully', error: false };
    }

    async userInfo(userId: string, getNotifications: boolean): Promise<{ message: string, error: boolean }> {
        const user = await this.userModel.findById(userId);
        if (!user || !user.email || !user.isActive) {
            throw new HttpException('User is not active or email missing', HttpStatus.UNAUTHORIZED);
        }

        await this.userModel.findByIdAndUpdate(userId, { getNotifications });
        return { message: 'Notifications updated successfully', error: false };
    }

    async activateUser(userId: string): Promise<{ message: string, error: boolean }> {
        const user = await this.userModel.findById(userId);
        if (!user || !user.email || user.isActive) {
            throw new HttpException('User not found or already active', HttpStatus.BAD_REQUEST);
        }

        await this.userModel.findByIdAndUpdate(userId, { isActive: true, 'token.value': null });
        return { message: 'User activated successfully', error: false };
    }

    async reSendActivation(userId: string): Promise<{ message: string, error: boolean }> {
        const user = await this.userModel.findById(userId);
        if (!user || user.isActive || !user.email) {
            throw new HttpException('User not found or already active', HttpStatus.BAD_REQUEST);
        }

        const message = `<p>Hi there ${user.email}!</p>
      <p>Please click on the link below to activate your account:</p>
      <p><a href="${this.configService.get('ORIGIN') || 'http://localhost:5173'}/account/activate/${user.token.value}">Activate Account</a></p>`;

        await this.mailService.sendMail(user.email, 'Activate Your Account', message);
        return { message: 'Activation email sent successfully', error: false };
    }

    async sendForgotPasswordEmail(email: string): Promise<{ message: string, error: boolean }> {
        if (!email) {
            throw new HttpException('Email is required', HttpStatus.BAD_REQUEST);
        }

        const user = await this.userModel.findOne({ email });
        if (!user) {
            throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
        }

        const activationToken = uuidv4();

        await this.userModel.findByIdAndUpdate(
            user[0]._id, { isActive: true, "token.value": activationToken, "token.expiry": Date.now() + 15 * 60 * 1000 }, { new: true }
        );

        const message = `<p>Hi there ${user[0].email}!</p>
        <p>Please click on the link to follow to reset your password:</p>
        <p><a href="${process.env.ORIGIN || "http://localhost:5173"}/account/resetpassword/${activationToken}">Reset Password</a></p>`

        this.mailService.sendMail(user[0].email, 'Password Reset', message);

        return { message: 'Password reset email sent', error: false };
    }

    async resetPassword(email: string, password: string, token: string): Promise<{ message: string, error: boolean }> {

        if (!email || !password || !token) {
            throw new HttpException('All fields are required"', HttpStatus.BAD_REQUEST);
        }

        const user = await this.userModel.find({ email });

        if (user && user.length === 0) {
            console.log("User not found");
            throw new HttpException('Token is invalid', HttpStatus.UNAUTHORIZED);
        }

        if (user && !user[0].isActive) {
            console.log("User is not active");
            throw new HttpException('User is not active', HttpStatus.UNAUTHORIZED);
        }

        if (!user[0].email) {
            throw new HttpException('User email is required', HttpStatus.UNAUTHORIZED);
        }

        if (user[0].email != email) {
            throw new HttpException('Invalid emai', HttpStatus.UNAUTHORIZED);
        }

        if (user[0].token.value !== token) {
            throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
        }

        if (user[0].token.expiry.getTime() < Date.now()) {
            throw new HttpException('Token expired', HttpStatus.UNAUTHORIZED);
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        await this.userModel.findByIdAndUpdate(user[0]._id, { password: passwordHash, "token.value": null, "token.expiry": null }, { new: true });

        return { message: 'Password updated successfully', error: false };

    }



}
