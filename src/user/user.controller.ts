import { Controller, Post, Put, Get, Body, Param, UseGuards } from '@nestjs/common';
import { UserService } from '../services/user.service'; // Equivalent to userController in Express
// import { AuthGuard } from '../guards/auth.guard'; // Assuming you have an AuthGuard for authentication

@Controller('auth')
export class UserController {
    constructor(private readonly userService: UserService) { }

    // POST /api/auth/register - Registration
    @Post('register')
    // @UseGuards(AuthGuard) // Authentication guard applied
    async register(@Body() body) {
        return this.userService.register(body);
    }

    // POST /api/auth/login - Login
    @Post('login')
    // @UseGuards(AuthGuard)
    async logIn(@Body() body) {
        return this.userService.logIn(body);
    }

    // GET /api/auth/verify - User Verification
    @Get('verify')
    // @UseGuards(AuthGuard)
    async verify() {
        return this.userService.verify();
    }

    // PUT /api/auth/newpassword - password change request
    @Put('newpassword')
    // @UseGuards(AuthGuard)
    async newPassword(@Body() body) {
        return this.userService.newPassword(body);
    }

    // GET /api/auth/gettoken - Get Token
    @Get('gettoken')
    async getToken() {
        return this.userService.getToken();
    }

    // PUT /api/auth/user - Update User Info
    @Put('user')
    // @UseGuards(AuthGuard)
    async updateUser(@Body() body) {
        return this.userService.userInfo(body);
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
    async reSendActivation() {
        return this.userService.reSendActivation();
    }

    // POST /api/auth/sendforgotpasswordemail - Forgot Password
    @Post('sendforgotpasswordemail')
    // @UseGuards(AuthGuard)
    async sendForgotPasswordEmail(@Body() body) {
        return this.userService.sendForgotPasswordEmail(body);
    }

    // POST /api/auth/resetpassword - Reset Password
    @Post('resetpassword')
    // @UseGuards(AuthGuard)
    async resetPassword(@Body() body) {
        return this.userService.resetPassword(body);
    }
}
