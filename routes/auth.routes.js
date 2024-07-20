const router = require("express").Router();
// const Parent = require("../models/Parent.model");
// const Child = require("../models/Child.model");
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const authentication = require("../middlewares/authentication");

//POST /api/auth/signin - Registration
router.post("/signin", async (req, res, next) => {
    // const { name, email, password, yearOfBirth, childName } = req.body;

    // if (!name || !email || !password || !yearOfBirth || !childName) {
    //     res.status(400).json({ errorMessage: "All fields are required" });
    //     // console.log(req.body);
    //     return;
    // }
    // try {
    //     isEmailDuplicated = await Parent.findOne({ email });
    //     if (isEmailDuplicated) {
    //         res
    //             .status(400)
    //             .json({ errorMessage: "Email already registered", emailValid: false });
    //         return;
    //     }

    //     const regexPassword =
    //         /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{5,}$/gm;
    //     if (regexPassword.test(password) === false) {
    //         res
    //             .status(400)
    //             .json({ errorMessage: "Password must be at least 5 characters long and contain at least one uppercase letter, one lowercase letter and one number" });
    //         return;
    //     }
    //     if (yearOfBirth.length !== 4 || isNaN(yearOfBirth)) {
    //         res.status(400).json({ errorMessage: "Year of birth is not valid" });
    //         return;
    //     }

    //     const salt = await bcrypt.genSalt(10);
    //     const passwordHash = await bcrypt.hash(password, salt);

    //     const newParent = await Parent.create({
    //         name,
    //         email,
    //         password: passwordHash,
    //         yearOfBirth,
    //         childName,
    //     });

    //     await Child.create({
    //         name: childName,
    //         parent: newParent._id,
    //     });
    //     const newChild = await Child.find({ parent: newParent._id }).select({
    //         name: 1,
    //     });

    //     const payload = {
    //         _id: newParent._id,
    //     };
    //     const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
    //         algorithm: "HS256",
    //         expiresIn: "365d",
    //     });

    //     res.json({ authToken });
    // } catch (error) {
    //     next(error);
    //     // console.log(error);
    // }
});

//POST /api/auth/login - Authentication
router.post("/login", async (req, res, next) => {
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
});

//GET /api/auth/verify - Validation Authorization
router.get("/verify", authentication, (req, res, next) => {
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
});

module.exports = router;
