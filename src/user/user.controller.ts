import { Controller, Post, Put, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '../user/guards/auth.guard';
import { AuthRequest } from './request.interface';

@Controller('auth')
export class UserController {
    constructor(private readonly userService: UserService) { }

    // POST /api/auth/register - Registration
    @Post('register')
    async register(@Request() req: AuthRequest, @Body('email') email: string, @Body('password') password: string) {
        console.log("req", req);
        return this.userService.register(email, password, req);
    }

    // POST /api/auth/login - Login
    @Post('login')
    // @UseGuards(AuthGuard)
    async logIn(@Body('email') email: string, @Body('password') password: string) {
        return this.userService.logIn(email, password);
    }

    // GET /api/auth/verify - User Verification
    @Get('verify')
    @UseGuards(AuthGuard)
    async verify(@Body('userId') userId: string) {
        return this.userService.verify(userId);
    }

    // PUT /api/auth/newpassword - password change request
    @Put('newpassword')
    // @UseGuards(AuthGuard)
    async newPassword(@Body('userId') userId: string, @Body('oldPassword') oldPassword: string, @Body('newPassword') newPassword: string) {
        return this.userService.newPassword(userId, oldPassword, newPassword);
    }

    // GET /api/auth/gettoken - Get Token
    @Get('gettoken')
    async getToken() {
        return this.userService.getToken();
    }

    // PUT /api/auth/user - Update User Info
    @Put('user')
    // @UseGuards(AuthGuard)
    async updateUser(@Body('userId') userId: string, @Body('getNotifications') getNotifications: boolean) {
        return this.userService.userInfo(userId, getNotifications);
    }

    // GET /api/auth/activate/:token - Activate User
    @Get('activate/:token')
    // @UseGuards(AuthGuard)
    async activateUser(@Param('token') token: string) {
        return this.userService.activateUser(token);
    }

    // GET /api/auth/resendactivation - Resend Activation
    @Get('resendactivation')
    // @UseGuards(AuthGuard)
    async reSendActivation(@Body('userId') userId: string) {
        return this.userService.reSendActivation(userId);
    }

    // POST /api/auth/sendforgotpasswordemail - Forgot Password
    @Post('sendforgotpasswordemail')
    // @UseGuards(AuthGuard)
    async sendForgotPasswordEmail(@Body() body) {
        return this.userService.sendForgotPasswordEmail(body);
    }

    // POST /api/auth/resetpassword - Reset Password
    // @Post('resetpassword')
    // // @UseGuards(AuthGuard)
    // async resetPassword(@Body('email') email: string, @Body('password') password: string, @Body('token') token: string) {
    //     return this.userService.resetPassword(email, password, token);
    // }
}
