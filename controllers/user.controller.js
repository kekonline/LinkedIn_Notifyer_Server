const User = require("../models/User.model")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.getToken = async (req, res, next) => {

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

exports.register = async (req, res, next) => {

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
        if (isUserAlreadyRegistered.email) {
            res
                .status(400)
                .json({ message: "You already have an account", error: true });
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

        await User.findOneAndUpdate(
            { _id: userId },
            { $set: { email, password: passwordHash } }
        );

        res.status(201).json({ message: "User updated successfully", error: false });

    } catch (error) {
        next(error);
        // console.log(error);
    }

}

exports.logIn = async (req, res, next) => {
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


exports.verify = async (req, res, next) => {
    try {
        // console.log("req.payload", req.payload);
        const user = await User.findById(req.payload._id);
        console.log("user", user);

        if (!user) {
            console.log("User not found");
            return res.status(401).json({ message: "Token is invalid", error: true });
        }

        const { email, getNotifications } = user;

        res.status(200).json({
            enrolled: email ? true : false,
            email: email ? maskEmail(email) : null,
            getNotifications,
            message: "All Good User Is Authenticated",
            error: false
        });

    } catch (error) {
        console.error("Error verifying user:", error);
        next(error);
    }
};


//Post /auth/newPassword - password change request
exports.newPassword = async (req, res, next) => {
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

exports.userInfo = async (req, res, next) => {

    try {
        const user = await User.findById(req.payload._id);
        console.log("user", user);

        if (!user) {
            console.log("User not found");
            return res.status(401).json({ message: "Token is invalid", error: true });
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