const { expressjwt } = require("express-jwt");
// const jwt = require("jsonwebtoken"); 
const User = require("../models/User.model");

const authentication = expressjwt({
    secret: process.env.TOKEN_SECRET,
    algorithms: ["HS256"],
    requestProperty: "payload",
    getToken: (req) => {
        if (!req.headers || !req.headers.authorization) {
            // console.log("No Token");
            return null;
        }

        const [tokenType, token] = req.headers.authorization.split(" ");

        if (tokenType !== "Bearer") {
            // console.log("Invalid Token Type");
            return null;
        }
        // console.log("Token Has Value: ", token);
        return token;
    }
});


const checkUserExistence = async (req, res, next) => {
    try {
        const { _id } = req.payload;
        const user = await User.findById(_id);

        if (!user) {
            // console.log("User not found");
            return res.status(404).json({ message: "User not found" });
        }

        // console.log("User was found");
        // req.user = user;

        next();
    } catch (error) {
        console.error("Error verifying user:", error);
        return res.status(500).json({ message: "Error verifying user", error });
    }
};


module.exports = { authentication, checkUserExistence };
