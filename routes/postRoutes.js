// routes/postRoutes.js


const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Post, Comment, User } = require('../models/models'); // Import your models
const abjwtoken = require('../middlewares/authMiddleware'); // Import your authentication middleware
const AWS = require('aws-sdk'); // AWS SDK for S3 operations
const fs = require('fs'); // Import the fs module



// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage });


// Configure the AWS SDK set to AWS credentials
AWS.config.update({
  accessKeyId: 'AKIA2TG6VBKFHTF2SUUY',
  secretAccessKey: 'UszKaMf2DAU83pN7CkuMk8IIRQlhALibWkJ8qLT7Y',
  region: 'us-east-1',
});

// Create an S3 instance
const s3 = new AWS.S3();

// Create a new post route
router.post('/create', upload.array('photos', 5), async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user.userId; // stored userId in the JWT payload
    const photos = req.files.map((file) => file.filename);

    // Validation: Ensure the post has at most 5 photos
    if (photos.length > 5) {
      return res.status(400).json({ error: 'A post can have at most 5 photos.' });
    }

    // Create a new post
    const post = await Post.create({ content, userId, photos });

     // Upload photos to AWS S3
     const s3UploadPromises = photos.map(async (photo) => {
      const uploadParams = {
        Bucket: 'affinitybridge1',
        Key: `photos/${photo}`,
        Body: fs.createReadStream(`uploads/${photo}`), //  multer saves the files locally
        ACL: 'public-read', // Adjust the ACL based on your security requirements
      };
      return s3.upload(uploadParams).promise();
    });

    // Wait for all S3 uploads to complete
    await Promise.all(s3UploadPromises);

    res.status(201).json({ message: 'Post created successfully.', post });
  } catch (err) {
    console.error('Error creating a post:', err);
    res.status(500).json({ error: 'An error occurred while creating the post.' });
  }
});

// Update an existing post route
router.put('/:postId', /*abjwtoken*/ async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;

  try {
    const post = await Post.findByPk(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    post.content = content;
    await post.save();

    res.status(200).json({ message: 'Post updated successfully.' });
  } catch (err) {
    console.error('Error updating the post:', err);
    res.status(500).json({ error: 'An error occurred while updating the post.' });
  }
});

// Create a comment for a post
router.post('/:postId/comments', /*abjwtoken*/ async (req, res) => {
  const { postId } = req.params;
  const { text } = req.body;
  const userId = req.user.userId; // Assuming you've stored userId in the JWT payload

  try {
    const post = await Post.findByPk(postId);

    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    // Create a comment and associate it with the post
    const comment = await Comment.create({ text, postId, userId });

    res.status(201).json({ message: 'Comment created successfully.' });
  } catch (err) {
    console.error('Error creating comment:', err);
    res.status(500).json({ error: 'An error occurred while creating the comment.' });
  }
});

// Fetch comments for a post
router.get('/:postId/comments', async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await Post.findByPk(postId, {
      include: {
        model: Comment,
        attributes: ['text', 'createdAt'], // Customize the attributes you want to fetch
        include: {
          model: User,
          attributes: ['name'], // Assuming you have a User model
        },
      },
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    res.json(post.Comments);
  } catch (err) {
    console.error('Error fetching comments:', err);
    res.status(500).json({ error: 'An error occurred while fetching comments.' });
  }
});



module.exports = router;




