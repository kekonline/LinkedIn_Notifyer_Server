// src/controllers/userController.js

const User = require('../models/user'); // Import the User model

// Handler for fetching a list of users
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find(); // Retrieve users from the database
        res.status(200).json(users); // Send users as JSON response
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching users' });
    }
};

// Handler for creating a new user
exports.createUser = async (req, res) => {
    try {
        const newUser = new User(req.body); // Create a new user instance
        await newUser.save(); // Save user to the database
        res.status(201).json(newUser); // Send the created user as JSON response
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while creating the user' });
    }
};
