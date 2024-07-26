const router = require("express").Router();
const userController = require('../controllers/user.controller');

//POST /api/auth/signin - Registration
router.post("/signin", userController.signIn);

//POST /api/auth/login - Authentication
// router.post("/login", userController.logIn);

//GET /api/auth/verify - Validation Authorization
// router.get("/verify", userController.verfiy);

module.exports = router;
