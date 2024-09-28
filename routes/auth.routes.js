const router = require("express").Router();
const userController = require('../controllers/user.controller');
const { authentication } = require("../middlewares/authentication.js");

//POST /api/auth/register - Registration
router.post("/register", authentication, userController.register);

//POST /api/auth/login - Login
router.post("/login", authentication, userController.logIn);

//GET /api/auth/verify - User Verification
router.get("/verify", authentication, userController.verify);

//POST /api/auth/newpassword - password change request
router.put("/newpassword", authentication, userController.newPassword);

//GET /api/auth/gettoken - Get Token
router.get("/gettoken", userController.getToken);

//PUT /api/auth/user - Update User Info
router.put("/user", authentication, userController.userInfo);

//GET /api/auth/activate - Activate User
router.get("/activate/:token", authentication, userController.activateUser);

//GET /api/auth/resendactivation - Resend Activation
router.get("/resendactivation", authentication, userController.reSendActivation);

//POST /api/auth/sendforgotpasswordemail - Forgot Password
router.post("/sendforgotpasswordemail", authentication, userController.sendForgotPasswordEmail);

//POST /api/auth/sendforgotpasswordemail - Forgot Password
router.post("/resetpassword", authentication, userController.resetPassword);

module.exports = router;
