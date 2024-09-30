import dotenv from 'dotenv';
import express, { Express, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import errorHandler from '../middlewares/errors';
import indexRoutes from '../routes/index.routes';

// Load environment variables from .env file
dotenv.config();

// Initialize the app
const app: Express = express();

// Middleware configuration
const configureMiddleware = (app: Express) => {
    // Trust proxy setting for deployments behind proxies
    app.set("trust proxy", 1);

    // CORS configuration
    const FRONTEND_URL = process.env.ORIGIN || "http://localhost:5173";
    app.use(cors({ origin: [FRONTEND_URL] }));

    // Logging middleware
    app.use(morgan('dev')); // Morgan logs in 'dev' format for development

    // Body parsing middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
};

// Apply middleware
configureMiddleware(app);

// Import and use routes
app.use("/api", indexRoutes);

// Import and configure database
require("./db");

// Import and use error handling middleware
errorHandler(app);

// Export the app
export default app;
