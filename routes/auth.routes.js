const router = require("express").Router();
const userController = require('../controllers/user.controller');

//POST /api/auth/signin - Registration
router.post("/signin", userController.signIn);

//POST /api/auth/login - Authentication
router.post("/login", userController.logIn);

//GET /api/auth/verify - Validation Authorization
router.get("/verify", userController.verify);

//POST /api/auth/newpassword - Validation Authorization
router.post("/newpassword", userController.newPassword);

module.exports = router;
