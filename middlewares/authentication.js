// const { expressjwt } = require("express-jwt");
// const jwt = require("jsonwebtoken");  // Make sure jwt is required
// const User = require("../models/User.model");

// const authentication = expressjwt({
//     secret: process.env.TOKEN_SECRET,
//     algorithms: ["HS256"],
//     requestProperty: "payload",
//     getToken: (req) => {
//         if (!req.headers || !req.headers.authorization) {
//             console.log("No Token");
//             return null;
//         }

//         const [tokenType, token] = req.headers.authorization.split(" ");

//         if (tokenType !== "Bearer") {
//             return null;
//         }

//         console.log("token", req.payload);
//         return token;
//     }
// });

// const checkUserExistence = async (req, res, next) => {
//     try {
//         const payload = req.payload;
//         const user = await User.findById(payload._id);

//         console.log("user", user);

//         if (!user) {
//             return res.redirect("gettoken");
//             // return res.status(401).json({ message: "User not found" });
//         }

//         // req.user = user;  // Attach the found user to the request
//         next();
//     } catch (error) {
//         return res.status(500).json({ message: "Error verifying user", error });
//     }
// };

// module.exports = authentication;



const { expressjwt } = require("express-jwt");
const jwt = require("jsonwebtoken");  // Make sure jwt is required
const User = require("../models/User.model");

const authentication = expressjwt({
    secret: process.env.TOKEN_SECRET,
    algorithms: ["HS256"],
    requestProperty: "payload",
    getToken: (req) => {
        if (!req.headers || !req.headers.authorization) {
            console.log("No Token");
            return null;
        }

        const [tokenType, token] = req.headers.authorization.split(" ");

        if (tokenType !== "Bearer") {
            return null;
        }

        return token;
    }
});

const checkUserExistence = async (req, res, next) => {
    try {
        const payload = req.payload;
        const user = await User.findById(payload._id);

        // console.log("user", user);

        // if (!user) {
        // return res.redirect("auth/verify");
        // return res.status(401).json({ message: "User not found" });
        // }

        // req.user = user;  // Attach the found user to the request
        next();
    } catch (error) {
        return res.status(500).json({ message: "Error verifying user", error });
    }
};

module.exports = { authentication, checkUserExistence };
