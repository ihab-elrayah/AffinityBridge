// routes/postRoutes.js

const express = require('express');
const postController = require('../controllers/postController');
const multer = require('multer'); // Middleware for handling file uploads
const AWS = require('aws-sdk'); // AWS SDK for S3 operations
const Post = require('../models/post');
const Photo = require('../models/photo');
const fs = require('fs');
const db = require('../db/db');

const router = express.Router();

// Configure the AWS SDK set to AWS credentials
AWS.config.update({
  accessKeyId: 'AKIA2TG6VBKFHTF2SUUY',
  secretAccessKey: 'UszKaMf2DAU83pN7CkuMk8IIRQlhALibWkJ8qLT7Y',
  region: 'us-east-1',
});

// Create an S3 instance
const s3 = new AWS.S3();

// Multer configuration for handling file uploads
const storage = multer.memoryStorage(); // Use memory storage for file uploads
const upload = multer({ storage });

// Post creation route with multiple photos (Authorization required)
router.post('/create', upload.array('photos', 5), async (req, res) => {
  try {
    const { content } = req.body;
    const photos = req.files.map((file) => file.filename); // Assuming multer saves the files locally

    // Validation: Ensure the post has at most 5 photos
    if (photos.length > 5) {
      return res.status(400).json({ error: 'A post can have at most 5 photos.' });
    }

    // Create the post in the database
    const newPost = await Post.create({ content });

    // Fetch the existing photos associated with the post
    const existingPhotos = await Photo.findAll({ where: { post_id: newPost.id } });

    // Calculate the number of new photos needed to reach the limit of 5
    const remainingSlots = 5 - existingPhotos.length;

    // Take the first 'remainingSlots' new photos and append them to the existing ones
    const newPhotos = photos.slice(0, remainingSlots);

    // Upload photos to AWS S3 and save their URLs in the "photos" table
    const photoPromises = newPhotos.map(async (photo) => {
      const s3params = {
        Bucket: 'affinitybridge1',
        Key: `photos/${photo}`, // Assuming you want to store photos in a folder called "photos"
        Body: fs.createReadStream(`uploads/${photo}`), // Assuming multer saves the files locally
        ACL: 'public-read', // Adjust the ACL based on your security requirements
      };

      const uploadedPhoto = await s3.upload(s3params).promise();

      // Save the photo URL in the "photos" table, linked to the corresponding post
      await Photo.create({
        post_id: newPost.id,
        photo_url: uploadedPhoto.Location,
      });
    });

    await Promise.all(photoPromises);

    return res.status(201).json({ message: 'Post created successfully.' });
  } catch (err) {
    console.error('Error creating post:', err);
    return res.status(500).json({ error: 'An error occurred while creating the post.' });
  }
});

// Get all posts route (Public access)
router.get('/all', postController.getAllPosts);

module.exports = router;


