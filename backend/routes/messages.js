const express = require('express');
const Message = require('../models/Message');
const jwt = require('jsonwebtoken');
const router = express.Router();

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

// Get messages with a user
router.get('/:userId', auth, async (req, res) => {
  const messages = await Message.find({
    $or: [
      { sender: req.user.id, receiver: req.params.userId },
      { sender: req.params.userId, receiver: req.user.id }
    ]
  }).sort({ createdAt: 1 });
  res.json(messages);
});

// Send message
router.post('/:userId', auth, async (req, res) => {
  const message = new Message({
    sender: req.user.id,
    receiver: req.params.userId,
    content: req.body.content
  });
  await message.save();
  res.status(201).json(message);
});

module.exports = router; 