// app.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { abjwtoken } = require('./middlewares/authMiddleware'); // Import the authMiddleware
const db = require('./db/db'); // Require the db.js file from the db folder
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');

const maxPayloadSize = '5mb';

const app = express();

// Middleware to parse JSON data with increased payload size limit
app.use(bodyParser.json({ limit: maxPayloadSize }));
app.use(cors());

// Use the userRoutes for user-related routes
app.use('/user', userRoutes);

// Use the postRoutes for post-related routes
app.use('/post', abjwtoken, postRoutes); // Apply the abjwtoken middleware to post-related routes

// Error handler middleware to catch the PayloadTooLargeError and handle it gracefully
app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') {
    res.status(413).json({ error: 'Request entity too large. Please upload a smaller file or image.' });
  } else {
    // Handle other errors here
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Default route handler for the root URL
app.get('/', (req, res) => {
  res.send('Welcome to AffinityBridge API');
});

// Set up the server
const port = process.env.PORT || 3010;

// Sync the models with the database and start the server
db.sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Error syncing models with the database:', error);
  });



