const express = require('express');
const Post = require('../models/Post');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
}

// Create post
router.post('/', auth, upload.single('media'), async (req, res) => {
  const post = new Post({
    user: req.user.id,
    text: req.body.text,
    media: req.file ? '/uploads/' + req.file.filename : undefined
  });
  await post.save();
  res.status(201).json(post);
});

// Get all posts
router.get('/', auth, async (req, res) => {
  const posts = await Post.find().populate('user', 'username avatar').sort({ createdAt: -1 });
  res.json(posts);
});

// Like post
router.post('/:id/like', auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post.likes.includes(req.user.id)) post.likes.push(req.user.id);
  await post.save();
  res.json(post);
});

// Comment on post
router.post('/:id/comment', auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  post.comments.push({ user: req.user.id, text: req.body.text });
  await post.save();
  res.json(post);
});

// Follow user
router.post('/follow/:userId', auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  const toFollow = await User.findById(req.params.userId);
  if (!user.following.includes(toFollow._id)) user.following.push(toFollow._id);
  if (!toFollow.followers.includes(user._id)) toFollow.followers.push(user._id);
  await user.save();
  await toFollow.save();
  res.json({ following: user.following, followers: toFollow.followers });
});

module.exports = router; 