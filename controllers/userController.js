// controllers/userController.js

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db/db');
const User = require('../models/user'); // Import the User model
const Blacklist = require('../models/blacklist'); // Import the Blacklist model

async function registerUser(req, res) {
  const { name, email, password } = req.body;

  try {
    // Check if the email is already registered
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the user's details into the database
    await User.create({ name, email, password: hashedPassword });

    // Return a success response
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during user registration:', error);
    res.status(500).json({ message: 'Error during user registration. Please try again later.' });
  }
}
async function loginUser(req, res) {
  const { email, password } = req.body;

  try {
    // Retrieve the user's details from the database
    const user = await User.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate a JWT token
    const token = jwt.sign({ userId: user.id }, 'abjwtoken', { expiresIn: '1h' });

    // Return the token as a success response
    res.json({ token });
  } catch (error) {
    console.error('Error during user login:', error);
    res.status(500).json({ message: 'Error during user login. Please try again later.' });
  }
}
async function logoutUser(req, res) {
  const jwtToken = req.header('Authorization')?.replace('Bearer ', '');

  console.log('Received JWT token:', jwtToken);

  if (!jwtToken) {
    return res.status(401).json({ message: 'Authorization token missing' });
  }

  try {
    // Check if the token is already blacklisted
    const blacklistedToken = await Blacklist.findOne({ where: { blacklistedToken: jwtToken } });
    if (blacklistedToken) {
      return res.status(401).json({ message: 'Token has already been invalidated' });
    }

    // Insert the token into the blacklist to invalidate it
    await Blacklist.create({ blacklistedToken: jwtToken });

    // Return a success response
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error during user logout:', error);
    res.status(500).json({ message: 'Error during user logout. Please try again later.' });
  }
}
module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};











