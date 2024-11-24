
import User from '../../../models/User.model';
import { v4 as uuidv4 } from 'uuid';
import { sendMail } from '../../../mailer/mailerJob';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { GraphQLError } from 'graphql';

const maskEmail = (email: string) => {
    const [localPart, domainPart] = email.split('@');
    const visiblePart = localPart.slice(0, 4);
    const maskedPart = '*'.repeat(localPart.length - 4);
    return `${visiblePart}${maskedPart}@${domainPart}`;
};

export const resolvers = {
    Query: {
        verifyToken: async (_: any, __: any, context: any) => {
            try {

                const { userId } = context;

                if (!userId) {
                    return {
                        message: 'Token is invalid',
                        error: true,
                        enrolled: false,
                        email: null,
                        getNotifications: false,
                        isActive: false,
                    };
                }

                const user = await User.findById(userId);

                if (!user) {
                    console.log("User not found");
                    return {
                        message: 'Token is invalid',
                        error: true,
                        enrolled: false,
                        email: null,
                        getNotifications: false,
                        isActive: false,
                    };
                }

                const { email, getNotifications, isActive } = user;

                return {
                    enrolled: Boolean(email),
                    email: email ? maskEmail(email) : null,
                    getNotifications,
                    isActive,
                    message: "All Good User Is Authenticated",
                    error: false,
                };
            } catch (error) {
                console.log("Error verifying user:", error);
                return {
                    message: 'Error verifying user',
                    error: true,
                    enrolled: false,
                    email: null,
                    getNotifications: false,
                    isActive: false,
                };
            }
        },
    },
    Mutation: {
        updateNotificationPreference: async (_: any, args: { getNotifications: boolean }, context: any) => {
            try {
                const { userId } = context;

                if (!userId) {
                    throw new GraphQLError('User not authenticated', {
                        extensions: { code: 'UNAUTHENTICATED' },
                    });
                }

                const user = await User.findById(userId);

                if (!user) {
                    return { message: 'Token is invalid', error: true };
                }

                if (!user.isActive) {
                    return { message: 'User is not active', error: true };
                }

                if (!user.email) {
                    return { message: 'User email is required', error: true };
                }

                await User.findByIdAndUpdate(
                    userId,
                    { getNotifications: args.getNotifications },
                    { new: true }
                );

                return { message: "Notifications updated successfully", error: false };

            } catch (error) {
                console.error("Error updating user information: ", error);
                return { message: 'Error updating user information', error: true };
            }
        },
        getToken: async (context: any) => {
            try {

                console.log("Giving User Auth Token");

                const newUser = await User.create({}); // Create a new user (adjust as necessary)
                console.log("newUser", newUser);

                const payload = { _id: newUser._id };
                const authToken = jwt.sign(payload, process.env.TOKEN_SECRET as string, {
                    algorithm: "HS256",
                    expiresIn: "365d",
                });

                return { authToken, message: "User Auth Token Given", error: false };
            } catch (error) {
                console.log("Error Signing Up User: ", error);
                return { authToken: null, message: 'Error Signing Up User', error: true };
            }

        },
        sendResetPasswordEmail: async (_: any, { email }: { email: string }, context: any) => {
            try {
                const { userId } = context;

                if (!userId) {
                    throw new GraphQLError('User not authenticated', {
                        extensions: { code: 'UNAUTHENTICATED' },
                    });
                }

                if (!email) {
                    return { message: 'All fields are required', error: true };
                }

                const user = await User.findOne({ email });

                if (!user) {
                    return { message: 'User not found', error: true };
                }

                const activationToken = uuidv4();

                await User.findByIdAndUpdate(
                    user._id,
                    { isActive: true, "token.value": activationToken, "token.expiry": Date.now() + 15 * 60 * 1000 },
                    { new: true }
                );

                const message = `<p>Hi there ${user.email}!</p>
                <p>Please click on the link to follow to reset your password:</p>
                <p><a href="${process.env.ORIGIN || "http://localhost:5173"}/account/resetpassword/${activationToken}">Reset Password</a></p>`;

                await sendMail(user.email, 'Password Reset', message);

                return { message: "Reset Password email sent successfully", error: false };

            } catch (error) {
                console.log("Error Sending Forgot Password Email:", error);
                return { message: 'Error sending forgot password email', error: true };
            }
        },
        resetPassword: async (_: any, { email, password, token }: { email: string; password: string; token: string }) => {
            try {
                if (!email || !password || !token) {
                    return { message: 'All fields are required', error: true };
                }

                const user = await User.findOne({ email });

                if (!user) {
                    return { message: 'User not found', error: true };

                }

                if (!user.email) {
                    return { message: 'User email is required', error: true };
                }

                if (user.email !== email) {
                    return { message: 'Invalid email', error: true };
                }

                if (user.token.value !== token) {
                    return { message: 'Invalid token', error: true };
                }

                if (new Date(user.token.expiry).getTime() < Date.now()) {
                    return { message: 'Token expired', error: true };
                }

                const salt = await bcrypt.genSalt(10);
                const passwordHash = await bcrypt.hash(password, salt);

                await User.findByIdAndUpdate(
                    user._id,
                    { password: passwordHash, "token.value": null, "token.expiry": null },
                    { new: true }
                );

                return { message: "Password updated successfully", error: false };

            } catch (error) {
                console.log("Error Resetting Password", error);
                return { message: 'Error resetting password', error: true };
            }
        },

        resendActivationEmail: async (_: any, __: any, context: any) => {
            try {
                const { userId } = context;

                if (!userId) {
                    throw new GraphQLError('User not authenticated', {
                        extensions: { code: 'UNAUTHENTICATED' },
                    });
                }

                const user = await User.findById(userId);

                if (!user) {
                    console.log("User not found");
                    return { message: 'Token is invalid', error: true };
                }

                if (user.isActive) {
                    console.log("User is already active");
                    return { message: 'User is already active', error: true };
                }

                if (!user.email) {
                    return { message: 'User email is required', error: true };
                }

                const message = `<p>Hi there ${user.email}!</p>
                    <p>Please click on the link below to activate your account:</p>
                    <p><a href="${process.env.ORIGIN || "http://localhost:5173"}/account/activate/${user.token.value}">Activate Account</a></p>`;

                await sendMail(user.email, 'Activate Your Account', message);
                return { message: "Activation email sent successfully", error: false };

            } catch (error) {
                console.log("Error re-sending activation email", error);
                return { message: 'Error re-sending activation email', error: true };
            }
        },
        registerUser: async (_: any, args: { email: string; password: string }, context: { req: Request, userId: string }) => {
            const { email, password } = args;

            if (!email || !password) {
                return { message: 'All fields are required', error: true };
            }

            try {
                const isEmailDuplicated = await User.findOne({ email });
                if (isEmailDuplicated) {
                    return { message: 'Email already registered', error: true };
                }

                const { userId } = context;

                if (!userId) {
                    throw new GraphQLError('User not authenticated', {
                        extensions: { code: 'UNAUTHENTICATED' },
                    });
                }

                const isUserAlreadyRegistered = await User.findOne({ _id: userId });
                if (isUserAlreadyRegistered && isUserAlreadyRegistered.email) {
                    return { message: 'You already have an account', error: true };
                }

                const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                if (!emailRegex.test(email)) {
                    return { message: 'Invalid email', error: true };
                }

                // Password regex for strength validation (optional)
                // const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{5,}$/;
                // if (!passwordRegex.test(password)) {
                //     return {
                //         message: "Password must be at least 5 characters long and contain at least one uppercase letter, one lowercase letter, and one number",
                //         error: true,
                //     };
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
                    <p><a href="${process.env.ORIGIN || "http://localhost:5173"}/account/activate/${activationToken}">Activate Account</a></p>`;

                await sendMail(email, 'Activate Your Account', message);

                return { message: 'User created successfully', error: false };

            } catch (error) {
                console.log("Error registering user: ", error);
                return { message: 'Error registering user', error: true };
            }
        },
        updatePassword: async (_: any, args: { oldPassword: string; newPassword: string }, context: { req: Request, userId: string }) => {
            const { userId } = context;

            if (!userId) {
                throw new GraphQLError('User not authenticated', {
                    extensions: { code: 'UNAUTHENTICATED' },
                });
            }

            const { oldPassword, newPassword } = args;

            if (!oldPassword || !newPassword) {
                return { message: 'All fields are required', error: true };
            }

            try {
                const userInfo = await User.findById(userId);

                if (!userInfo || !userInfo.password) {
                    return { message: 'User not found', error: true };
                }

                const isPasswordCorrect = await bcrypt.compare(oldPassword, userInfo.password);

                if (isPasswordCorrect) {
                    const salt = await bcrypt.genSalt(10);
                    const passwordHash = await bcrypt.hash(newPassword, salt);

                    await User.findByIdAndUpdate(
                        userId,
                        { password: passwordHash },
                        { new: true }
                    );

                    return { message: 'Password updated successfully', error: false };
                } else {
                    return { message: 'Incorrect password', error: true };
                }
            } catch (error) {
                console.log('Error updating password:', error);
                return { message: 'Error updating password', error: true };
            }
        },
        login: async (_: any, args: { email: string; password: string }, context: { req: Request, userId: string }) => {
            try {

                const { userId } = context;

                if (!userId) {
                    throw new GraphQLError('User not authenticated', {
                        extensions: { code: 'UNAUTHENTICATED' },
                    });
                }

                const { email, password } = args;

                if (!email || !password) {
                    return { message: 'All fields are required', error: true };
                }

                const logingInUser = await User.findOne({ email });
                if (!logingInUser || !logingInUser.email || !logingInUser.password) {
                    return { message: 'Email not registered', error: true };
                }

                const isPasswordCorrect = await bcrypt.compare(password, logingInUser.password);
                if (!isPasswordCorrect) {
                    return { message: 'Incorrect password', error: true };
                }

                // Generate JWT
                const payload = { _id: logingInUser._id };
                const authToken = jwt.sign(payload, process.env.TOKEN_SECRET as string, {
                    algorithm: "HS256",
                    expiresIn: "365d",
                });

                return { authToken, message: 'Login successful', error: false };
            } catch (error) {
                console.log("Error logging in:", error);
                return { message: 'Error logging in', error: true };
            }
        },
        signUp: async (_: any, args: { email: string; password: string }) => {
            try {

                const { email, password } = args;

                // Check if email already exists
                const existingUser = await User.findOne({ email });
                if (existingUser) {
                    return { message: 'Email already registered', error: true };
                }

                // Hash password
                const salt = await bcrypt.genSalt(10);
                const passwordHash = await bcrypt.hash(password, salt);

                // Create new user
                const newUser = await User.create({ email, password: passwordHash });
                console.log("newUser", newUser);

                // Generate JWT token
                const payload = { _id: newUser._id };
                const authToken = jwt.sign(payload, process.env.TOKEN_SECRET as string, {
                    algorithm: "HS256",
                    expiresIn: "365d",
                });

                return { authToken, message: 'User created successfully', error: false };
            } catch (error) {
                console.log("Error Signing Up User:", error);
                return { message: 'Error Signing Up User', error: true };
            }
        },
        activateUser: async (_: any, args: { authToken: string }) => {
            try {
                const { authToken } = args;

                // Verify the JWT token
                const decoded: any = jwt.verify(authToken, process.env.TOKEN_SECRET as string);
                const userId = decoded?._id;

                if (!userId) {
                    throw new Error('Token is invalid');
                }

                // Fetch user from the database
                const user = await User.findById(userId);
                if (!user) {
                    throw new Error('User not found');
                }

                if (!user.email) {
                    throw new Error('User email is required');
                }

                // Check if the user is already active
                if (user.isActive) {
                    throw new Error('User is already active');
                }

                // Update the user to active
                await User.findByIdAndUpdate(userId, { isActive: true, 'token.value': null }, { new: true });

                return true;  // Successfully activated the user
            } catch (error) {
                console.error('Error Activating User:', error);
                throw new Error('Error Activating User');
            }
        },

    },
};

export default resolvers;
