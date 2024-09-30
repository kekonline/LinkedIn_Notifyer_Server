"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController = __importStar(require("../controllers/user.controller"));
const authentication_js_1 = require("../middlewares/authentication.js");
const router = (0, express_1.Router)();
// POST /api/auth/register - Registration
router.post("/register", authentication_js_1.authentication, userController.register);
// POST /api/auth/login - Login
router.post("/login", authentication_js_1.authentication, userController.logIn);
// GET /api/auth/verify - User Verification
router.get("/verify", authentication_js_1.authentication, userController.verify);
// POST /api/auth/newpassword - password change request
router.put("/newpassword", authentication_js_1.authentication, userController.newPassword);
// GET /api/auth/gettoken - Get Token
router.get("/gettoken", userController.getToken);
// PUT /api/auth/user - Update User Info
router.put("/user", authentication_js_1.authentication, userController.userInfo);
// GET /api/auth/activate - Activate User
router.get("/activate/:token", authentication_js_1.authentication, userController.activateUser);
// GET /api/auth/resendactivation - Resend Activation
router.get("/resendactivation", authentication_js_1.authentication, userController.reSendActivation);
// POST /api/auth/sendforgotpasswordemail - Forgot Password
router.post("/sendforgotpasswordemail", authentication_js_1.authentication, userController.sendForgotPasswordEmail);
// POST /api/auth/resetpassword - Reset Password
router.post("/resetpassword", authentication_js_1.authentication, userController.resetPassword);
exports.default = router;
