const router = require("express").Router();
const authentication = require("../middlewares/authentication.js");



//POST /api/job - XXXXXXXXXXXXXXXXXXXXXX
router.post("/", authentication, (req, res, next) => {

});


module.exports = router;


// // src/routes/userRoutes.js

// const express = require('express');
// const router = express.Router();
// const userController = require('../controllers/userController');

// // Define routes and link to controller functions
// router.get('/users', userController.getUsers);
// router.post('/users', userController.createUser);

// module.exports = router;