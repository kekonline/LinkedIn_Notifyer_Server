const router = require("express").Router();
const authentication = require("../middlewares/authentication.js");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model")


router.get("/", async (req, res, next) => {
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
});


router.get("/private", authentication, (req, res, next) => {
  try {
    // Access the token payload if needed


    // Example: Respond with a message and the token payload
    res.status(200).json({
      message: "All good in here but its private",

    });
  } catch (err) {
    console.log(err);
    next(err);
  }
});

// login, signin, verify
const authRouter = require("./auth.routes")
router.use("/auth", authRouter)

// searchTerm routes
const searchTermRouter = require("./searchTerm.routes")
router.use("/searchterm", searchTermRouter)

// job routes
const jobRouter = require("./job.routes")
router.use("/job", jobRouter)

module.exports = router;
