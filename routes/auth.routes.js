const router = require("express").Router();
const userController = require('../controllers/user.controller');
const authentication = require("../middlewares/authentication.js");

//POST /api/auth/signin - Registration
router.post("/signin", authentication, userController.signIn);

//POST /api/auth/login - Authentication
router.post("/login", authentication, userController.logIn);

//GET /api/auth/verify - Validation Authorization
router.get("/verify", authentication, userController.verify);

//POST /api/auth/newpassword - Validation Authorization
router.post("/newpassword", authentication, userController.newPassword);

module.exports = router;
