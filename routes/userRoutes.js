// routes/userRoutes.js
const express = require('express');
const userController = require('../controllers/userController');
const db = require('../db/db');
const { User, Blacklist } = require('../models/models'); // Adjust the import based on your models

const router = express.Router();

// User registration route
router.post('/register', userController.registerUser);

// User login route
router.post('/login', userController.loginUser);

// User logout route
router.post('/logout', userController.logoutUser);

module.exports = router;







