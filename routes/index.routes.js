const router = require("express").Router();
const { authentication, checkUserExistence } = require("../middlewares/authentication.js");

// login, signin, verify
const authRouter = require("./auth.routes")
router.use("/auth", authRouter)

// searchTerm routes
const searchTermRouter = require("./searchTerm.routes")
router.use("/searchterm", authentication, checkUserExistence, searchTermRouter)

// job routes
const jobRouter = require("./jobListing.routes.js")
router.use("/job", authentication, checkUserExistence, jobRouter)

module.exports = router;