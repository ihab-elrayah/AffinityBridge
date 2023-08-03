// errorHandler.js

function errorHandler(err, req, res, next) {
    // Default status code and message in case the error doesn't have one
    let statusCode = 500;
    let message = 'Internal Server Error';
  
    // Check if the error has a specific status code and message
    if (err.statusCode && typeof err.message === 'string') {
      statusCode = err.statusCode;
      message = err.message;
    }
    // Log the error (you can customize the logging format and destination)
    console.error(`[${new Date().toISOString()}] [Error] ${statusCode}: ${message}`);
    
    // Respond to the client with the error details
    res.status(statusCode).json({ error: message });
  }
  
  module.exports = errorHandler;
  