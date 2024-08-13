require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const errorHandler = require("../middlewares/errors.js");
const indexRoutes = require("../routes/index.routes");

// ℹ️ Initialize the app
const app = express();

// ℹ️ Middleware configuration
const configureMiddleware = (app) => {
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

// ℹ️ Apply middleware
configureMiddleware(app);

// ℹ️ Import and use routes
app.use("/api", indexRoutes);

// ℹ️ Import and configure database
require("./db");

// ℹ️ Import and use error handling middleware
errorHandler(app);

module.exports = app;
