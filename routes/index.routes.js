const router = require("express").Router();
const authentication = require("../middlewares/authentication.js");
const userController = require('../controllers/user.controller');

router.get("/getToken", userController.getToken);

// login, signin, verify
const authRouter = require("./auth.routes")
router.use("/auth", authRouter)

// searchTerm routes
const searchTermRouter = require("./searchTerm.routes")
router.use("/searchterm", authentication, searchTermRouter)

// job routes
const jobRouter = require("./jobListing.routes.js")
router.use("/job", authentication, jobRouter)

module.exports = router;
