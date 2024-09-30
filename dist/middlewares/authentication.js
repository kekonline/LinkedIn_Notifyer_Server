"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUserExistence = exports.authentication = void 0;
const express_jwt_1 = require("express-jwt");
const User_model_1 = __importDefault(require("../models/User.model"));
// Configure the Express JWT authentication middleware
const authentication = (0, express_jwt_1.expressjwt)({
    secret: process.env.TOKEN_SECRET, // Ensure the secret is defined
    algorithms: ['HS256'],
    requestProperty: 'payload',
    getToken: (req) => {
        if (!req.headers || !req.headers.authorization) {
            return undefined; // Return undefined instead of null
        }
        const [tokenType, token] = req.headers.authorization.split(' ');
        if (tokenType !== 'Bearer') {
            return undefined; // Return undefined instead of null
        }
        return token;
    }
});
exports.authentication = authentication;
// Middleware to check user existence
const checkUserExistence = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id } = req.payload; // Ensure `payload` is correctly typed
        const user = yield User_model_1.default.findById(_id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Attach user to the request if needed
        req.user = user;
        next();
    }
    catch (error) {
        console.error('Error verifying user:', error);
        return res.status(500).json({ message: 'Error verifying user', error });
    }
});
exports.checkUserExistence = checkUserExistence;
