const router = require("express").Router();
const userController = require('../controllers/user.controller');
const { authentication } = require("../middlewares/authentication.js");

//POST /api/auth/signin - Registration
router.post("/register", authentication, userController.signIn);

//POST /api/auth/login - Authentication
router.post("/login", authentication, userController.logIn);

//GET /api/auth/verify - Validation Authorization
router.get("/verify", authentication, userController.verify);

//POST /api/auth/newpassword - Validation Authorization
router.post("/newpassword", authentication, userController.newPassword);

//GET /api/auth/gettoken - Validation Authorization
router.get("/gettoken", userController.getToken);

//PUT /api/auth/user - Update User Info
router.put("/user", authentication, userController.userInfo);

module.exports = router;
