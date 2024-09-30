"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const errors_1 = __importDefault(require("../middlewares/errors"));
const index_routes_1 = __importDefault(require("../routes/index.routes"));
// Load environment variables from .env file
dotenv_1.default.config();
// Initialize the app
const app = (0, express_1.default)();
// Middleware configuration
const configureMiddleware = (app) => {
    // Trust proxy setting for deployments behind proxies
    app.set("trust proxy", 1);
    // CORS configuration
    const FRONTEND_URL = process.env.ORIGIN || "http://localhost:5173";
    app.use((0, cors_1.default)({ origin: [FRONTEND_URL] }));
    // Logging middleware
    app.use((0, morgan_1.default)('dev')); // Morgan logs in 'dev' format for development
    // Body parsing middleware
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: false }));
    app.use((0, cookie_parser_1.default)());
};
// Apply middleware
configureMiddleware(app);
// Import and use routes
app.use("/api", index_routes_1.default);
// Import and configure database
require("./db");
// Import and use error handling middleware
(0, errors_1.default)(app);
// Export the app
exports.default = app;
