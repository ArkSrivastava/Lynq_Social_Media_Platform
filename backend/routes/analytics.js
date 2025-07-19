const express = require('express');
const Analytics = require('../models/Analytics');
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

// Post analytics event
router.post('/', auth, async (req, res) => {
  const { action, targetId } = req.body;
  const event = new Analytics({ user: req.user.id, action, targetId });
  await event.save();
  res.status(201).json(event);
});

// Get analytics for user
router.get('/', auth, async (req, res) => {
  const events = await Analytics.find({ user: req.user.id });
  res.json(events);
});

module.exports = router; 