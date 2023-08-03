// conttrollers/postController.js

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//const db = require('../db/db');
const moment = require('moment');
const Post = require('../models/post'); // Import the Post model

// Assuming this is your /post/all endpoint
async function getAllPosts(req, res) {
  try {
    const posts = await getPostsFromDatabase(); // Replace this with your actual function to fetch posts from the database

    // Calculate time difference for each post and update the posts array
    const postsWithTimeDiff = posts.map((post) => ({
      ...post.toJSON(),
      timeDiff: getTimeDifference(moment(post.createdAt)),
    }));

    // Return the updated posts with time difference
    res.json(postsWithTimeDiff);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Error fetching posts. Please try again later.' });
  }
}

// Function to fetch posts from the database
async function getPostsFromDatabase() {
  try {
    // Fetch all posts from the database using the findAll() method
    const posts = await Post.findAll();

    // Return the fetched posts
    return posts;
  } catch (error) {
    // Handle any errors that occur during the database query
    throw new Error('Error fetching posts from the database');
  }
}
// User registration
async function createPost(req, res) {
  const { title, description, photo } = req.body;
  const jwtToken = req.header('Authorization')?.replace('Bearer ', ''); // Extract JWT token from the request header

  console.log('Received data:', { title, description, photo, jwtToken });

  try {
    // Input validation
    if (!title || !description || !photo || !jwtToken) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Verify the JWT token to check if the user is authenticated
    const decodedToken = jwt.verify(jwtToken, 'abjwtoken');

    // If the token is valid, the user is authenticated
    const userId = decodedToken.userId;

    // Insert the post's details into the database, associating it with the logged-in user
    await Post.create({title, description, photo, userId});

    // Return a success response
    res.status(201).json({ message: 'Post created successfully' });
  } catch (error) {
    console.error('Error during post creation:', error);
    res.status(500).json({ message: 'Error during post creation. Please try again later.' });
  }
}
// Function to calculate time difference
function getTimeDifference(createdAt) {
  const currentTime = moment();
  const diffSeconds = currentTime.diff(createdAt, 'seconds');
  const diffDays = currentTime.diff(createdAt, 'days');
  const diffWeeks = currentTime.diff(createdAt, 'weeks');
  const diffMonths = currentTime.diff(createdAt, 'months');
  const diffYears = currentTime.diff(createdAt, 'years');

  if (diffSeconds < 60) {
    return `${diffSeconds}s ago`;
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else if (diffWeeks < 4) {
    return `${diffWeeks}w ago`;
  } else if (diffMonths < 12) {
    return `${diffMonths}m ago`;
  } else {
    return `${diffYears}yr ago`;
  }
}

module.exports = {
  getAllPosts, // Add the getAllPosts function to the exported module
  createPost,
};





