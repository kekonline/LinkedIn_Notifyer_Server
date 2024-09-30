const User = require("../models/User.model")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const { sendMail } = require("../mailer/mailerJob");
require("dotenv").config();

export const getToken = async (req, res, next) => {

    try {
        console.log("Giving User Auth Token");
        const newUser = await User.create({});
        console.log("newUser", newUser);

        const payload = { _id: newUser._id };
        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
            algorithm: "HS256",
            expiresIn: "365d",
        });

        res.json({ authToken });
    } catch (error) {
        console.log("Error Signing Up User: ", error);
        next(error);
    }

}

export const register = async (req, res, next) => {

    const { email, password } = req.body;
    console.log(req.body);

    if (!email || !password) {
        res.status(400).json({ message: "All fields are required", error: true });

        return;
    }
    try {
        isEmailDuplicated = await User.findOne({ email });
        if (isEmailDuplicated) {
            res
                .status(400)
                .json({ message: "Email already registered", error: true });
            return;
        }

        let userId = req.payload._id;
        isUserAlreadyRegistered = await User.findOne({ _id: userId });
        if (isUserAlreadyRegistered && isUserAlreadyRegistered.email) {
            res
                .status(400)
                .json({ message: "You already have an account", error: true });
            return;
        }

        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!regex.test(email)) {
            res
                .status(400)
                .json({ message: "Invalid email", error: true });
            return;
        }

        // const regexPassword =
        //     /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{5,}$/gm;
        // if (regexPassword.test(password) === false) {
        //     res
        //         .status(400)
        //         .json({ message: "Password must be at least 5 characters long and contain at least one uppercase letter, one lowercase letter and one number", error: true });
        //     return;
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
        <p><a href="${process.env.ORIGIN || "http://localhost:5173"}/account/activate/${activationToken}">Activate Account</a></p>`


        sendMail(email, 'Activate Your Account', message);

        res.status(201).json({ message: "User created successfully", error: false });

    } catch (error) {
        next(error);
        // console.log(error);
    }

}

export const logIn = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ message: "All fields are required", error: true });
        return;
    }

    try {
        const logingInUser = await User.findOne({ email });
        if (logingInUser === null) {
            res
                .status(400)
                .json({ message: "Email not registered", error: true });
            return;
        }


        const isPasswordCorrect = await bcrypt.compare(
            password,
            logingInUser.password
        );

        // const isPasswordCorrect = password === logingInUser.password;

        if (!isPasswordCorrect) {
            res
                .status(400)
                .json({ message: "Incorrect password", error: true });
            return;
        }

        console.log("logingInUser._id," + logingInUser._id);

        const payload = {
            _id: logingInUser._id,
        };
        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
            algorithm: "HS256",
            expiresIn: "365d",
        });
        res.json({ authToken });
    } catch (error) {
        next(error);
    }

}

const maskEmail = (email) => {

    const [localPart, domainPart] = email.split('@');
    const visiblePart = localPart.slice(0, 4);
    const maskedPart = '*'.repeat(localPart.length - 4);

    return `${visiblePart}${maskedPart}@${domainPart}`;
};


export const verify = async (req, res, next) => {
    try {
        // console.log("req.payload", req.payload);
        const user = await User.findById(req.payload._id);
        // console.log("user", user);
        // 
        if (!user) {
            console.log("User not found");
            return res.status(401).json({ message: "Token is invalid", error: true });
        }

        const { email, getNotifications, isActive } = user;

        res.status(200).json({
            enrolled: email ? true : false,
            email: email ? maskEmail(email) : null,
            getNotifications,
            isActive,
            message: "All Good User Is Authenticated",
            error: false
        });

    } catch (error) {
        console.error("Error verifying user:", error);
        next(error);
    }
};


//Post /auth/newPassword - password change request
export const newPassword = async (req, res, next) => {
    // console.log("token", req.payload)
    // console.log(req.body);

    const { oldPassword, newPassword } = req.body;
    try {
        const userInfo = await User.findById(req.payload._id);
        const isPasswordCorrect = await bcrypt.compare(
            oldPassword,
            userInfo.password
        );
        // const isPasswordCorrect = oldPassword === userInfo.password;

        if (isPasswordCorrect) {
            // console.log("passwords are the same")
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(newPassword, salt);
            const UpdateUserInfo = await User.findByIdAndUpdate(
                req.payload._id,
                { password: passwordHash },
                { new: true }
            );
            res.json({ message: "Password updated successfully", error: false });
        } else {
            res.json({ message: "Incorrect password", error: true });
        }
    } catch (error) {
        next(error);
    }
};

export const userInfo = async (req, res, next) => {

    try {
        const user = await User.findById(req.payload._id);
        console.log("user", user);

        if (!user) {
            console.log("User not found");
            return res.status(401).json({ message: "Token is invalid", error: true });
        }

        if (user && !user.isActive) {
            console.log("User is not active");
            return res.status(401).json({ message: " User is not active", error: true });
        }

        if (!user.email) {
            return res.status(401).json({ message: "User email is required", error: true });
        }

        const { getNotifications } = req.body;
        // console.log("getNotifications", getNotifications);
        // console.log("req.payload._id", req.payload._id);
        // console.log("user", user);


        const UpdateUserInfo = await User.findByIdAndUpdate(
            req.payload._id,
            { getNotifications: getNotifications },
            { new: true }
        );

        // console.log("UpdateUserInfo", UpdateUserInfo);

        res.json({ message: "Notifications updated successfully", error: false });

    } catch (error) {
        next(error);
    }
};



export const activateUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.payload._id);
        console.log("user", user);

        if (!user) {
            console.log("User not found");
            return res.status(401).json({ message: "Token is invalid", error: true });
        }

        if (!user.email) {
            return res.status(401).json({ message: "User email is required", error: true });
        }

        if (user && user.isActive) {
            console.log("User is already active");
            return res.status(401).json({ message: "User is already active", error: true });
        }
        const UpdateUserInfo = await User.findByIdAndUpdate(
            req.payload._id, { isActive: true, "token.value": null }, { new: true }
        );
        res.json({ message: "User activated successfully", error: false });
    } catch (error) {
        next(error);
    }


}


export const reSendActivation = async (req, res, next) => {
    try {
        const user = await User.findById(req.payload._id);
        console.log("user", user);

        if (!user) {
            console.log("User not found");
            return res.status(401).json({ message: "Token is invalid", error: true });
        }
        if (user && user.isActive) {
            console.log("User is already active");
            return res.status(401).json({ message: "User is already active", error: true });
        }

        if (!user.email) {
            return res.status(401).json({ message: "User email is required", error: true });
        }

        const message = `<p>Hi there ${user.email}!</p>
        <p>Please click on the link below to activate your account:</p>
        <p><a href="${process.env.ORIGIN || "http://localhost:5173"}/account/activate/${user.token.value}">Activate Account</a></p>`

        sendMail(user.email, 'Activate Your Account', message);
        res.json({ message: "Activation email sent successfully", error: false });

    } catch (error) {
        next(error);
    }
}

export const sendForgotPasswordEmail = async (req, res, next) => {

    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "All fields are required", error: true });
        }

        const user = await User.find({ email: email });
        // console.log("user", user);

        if (user && user.length === 0) {
            console.log("User not found");
            return res.status(401).json({ message: "Token is invalid", error: true });
        }


        if (!user[0].email) {
            return res.status(401).json({ message: "User email is required", error: true });
        }
        // if (user && !user.isActive) {
        //     console.log("User is not active");
        //     return res.status(401).json({ message: " User is not active", error: true });
        // }

        if (user[0].email !== email) {
            return res.status(400).json({ message: "Invalid email", error: true });
        }

        const activationToken = uuidv4();

        await User.findByIdAndUpdate(
            user[0]._id, { isActive: true, "token.value": activationToken, "token.expiry": Date.now() + 15 * 60 * 1000 }, { new: true }
        );



        const message = `<p>Hi there ${user[0].email}!</p>
        <p>Please click on the link to follow to reset your password:</p>
        <p><a href="${process.env.ORIGIN || "http://localhost:5173"}/account/resetpassword/${activationToken}">Reset Password</a></p>`

        sendMail(user[0].email, 'Password Reset', message);
        res.json({ message: "Reset Password email sent successfully", error: false });

    } catch (error) {
        next(error);
    }
};

export const resetPassword = async (req, res, next) => {

    try {
        const { email, password, token } = req.body;

        if (!email || !password || !token) {
            return res.status(400).json({ message: "All fields are required", error: true });
        }

        const user = await User.find({ email });
        // console.log("user", user);

        if (user && user.length === 0) {
            console.log("User not found");
            return res.status(401).json({ message: "Token is invalid", error: true });
        }

        // if (user && !user.isActive) {
        //     console.log("User is not active");
        //     return res.status(401).json({ message: " User is not active", error: true });
        // }

        if (!user[0].email) {
            return res.status(401).json({ message: "User email is required", error: true });
        }

        if (user[0].email != email) {
            return res.status(400).json({ message: "Invalid email", error: true });
        }

        if (user[0].token.value !== token) {
            return res.status(400).json({ message: "Invalid token", error: true });
        }

        if (user[0].token.expiry < Date.now()) {
            return res.status(400).json({ message: "Token expired", error: true });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const UpdateUserInfo = await User.findByIdAndUpdate(user[0]._id, { password: passwordHash, "token.value": null, "token.expiry": null }, { new: true });

        res.json({ message: "Password updated successfully", error: false });

    } catch (error) {
        next(error);
    }
};