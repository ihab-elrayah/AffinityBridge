// middlewares/authMiddleware.js

const db = require('../db/db');
const jwt = require('jsonwebtoken');

function abjwtoken(req, res, next) {
  const jwtToken = req.header('Authorization')?.replace('Bearer ', ''); // Extract JWT token from the request header

  if (!jwtToken) {
    return res.status(401).json({ message: 'Authorization token missing' });
  }

  try {
    // Verify the JWT token and decode its payload
    const decodedToken = jwt.verify(jwtToken, 'abjwtoken');
    req.user = decodedToken; // Add the decoded token data to the request object
    next(); // Call the next middleware or route handler
  } catch (error) {
    console.error('Error verifying JWT token:', error);
    res.status(401).json({ message: 'Invalid authorization token' });
  }
}

module.exports = {
  abjwtoken,
};
