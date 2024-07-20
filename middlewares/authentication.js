const { expressjwt } = require("express-jwt");

const authentication = expressjwt({
    secret: process.env.TOKEN_SECRET,
    algorithms: ["HS256"],
    requestProperty: "payload",
    getToken: async (req) => {  // Mark getToken as async
        if (req.headers === undefined || req.headers.authorization === undefined) {
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

module.exports = authentication