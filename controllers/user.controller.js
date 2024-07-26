const User = require("../models/User.model")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.getToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const [tokenType, token] = authHeader.split(" ");

        if (tokenType === "Bearer" && token) {
            try {
                const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
                return res.status(200).json({ message: "All Good User Is Authenticated" });
            } catch (err) {
                return res.status(401).json({ errorMessage: "Token is invalid" });
            }
        }
    }

    try {
        console.log("Signing Up User");
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

exports.signIn = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ errorMessage: "All fields are required", error: true });
        // console.log(req.body);
        return;
    }
    try {
        isEmailDuplicated = await User.findOne({ email });
        if (isEmailDuplicated) {
            res
                .status(400)
                .json({ errorMessage: "Email already registered", error: true });
            return;
        }

        const regexPassword =
            /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{5,}$/gm;
        if (regexPassword.test(password) === false) {
            res
                .status(400)
                .json({ errorMessage: "Password must be at least 5 characters long and contain at least one uppercase letter, one lowercase letter and one number", error: true });
            return;
        }

        // const salt = await bcrypt.genSalt(10);
        // const passwordHash = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            email,
            password
        });


        const payload = {
            _id: newUser._id,
        };
        const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
            algorithm: "HS256",
            expiresIn: "365d",
        });

        res.json({ authToken });
    } catch (error) {
        next(error);
        // console.log(error);
    }

}

exports.LogIn = async (req, res, next) => {
    // const { email, password } = req.body;
    // try {
    //     const logingInParent = await Parent.findOne({ email });
    //     if (logingInParent === null) {
    //         res
    //             .status(400)
    //             .json({ errorMessage: "Email not registered", validLogin: false });
    //         return;
    //     }

    //     const isPasswordCorrect = await bcrypt.compare(
    //         password,
    //         logingInParent.password
    //     );

    //     if (!isPasswordCorrect) {
    //         res
    //             .status(400)
    //             .json({ errorMessage: "Incorrect password", validLogin: false });
    //         return;
    //     }
    //     const logingInParentChilds = await Child.find({
    //         parent: logingInParent._id,
    //     }).select({ name: 1 });

    //     const payload = {
    //         _id: logingInParent._id,
    //     };
    //     const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
    //         algorithm: "HS256",
    //         expiresIn: "365d",
    //     });
    //     res.json({ authToken });
    // } catch (error) {
    //     next(error);
    // }

}

exports.verfiy = async (req, res, next) => {
    //     res.json(req.payload);
    // });

    // //Post /auth/newPassword - password change request
    // router.post("/newPassword", isAuthenticated, async (req, res, next) => {
    //     // console.log("token", req.payload)
    //     // console.log(req.body);
    //     try {
    //         const parentInfo = await Parent.findById(req.payload._id);
    //         // console.log(parentInfo)
    //         const isPasswordCorrect = await bcrypt.compare(
    //             req.body.password,
    //             parentInfo.password
    //         );
    //         if (isPasswordCorrect) {
    //             // console.log("passwords are the same")
    //             const salt = await bcrypt.genSalt(10);
    //             const passwordHash = await bcrypt.hash(req.body.newPassword, salt);
    //             const UpdateParentInfo = await Parent.findByIdAndUpdate(
    //                 req.payload._id,
    //                 { password: passwordHash },
    //                 { new: true }
    //             );
    //             res.json({ passwordUpdated: true });
    //         } else {
    //             res.json({ passwordUpdated: false });
    //         }
    //     } catch (error) {
    //         next(error);
    //     }

}