import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, TextField, Button, Avatar, IconButton, Modal, Stack, Chip } from '@mui/material';
import { Favorite, FavoriteBorder, ChatBubble, PersonAdd } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import AnimatedFAB from '../components/FAB';

// Dummy stories data for demo
const stories = [
  { username: 'arjun', avatar: '', active: true },
  { username: 'priya', avatar: '', active: false },
  { username: 'rahul', avatar: '', active: false },
  { username: 'isha', avatar: '', active: false },
  { username: 'amit', avatar: '', active: false },
];

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [comment, setComment] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [fabOpen, setFabOpen] = useState(false);
  const [newPost, setNewPost] = useState({ text: '', media: null });
  const [liked, setLiked] = useState({});

  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/posts', { headers: { Authorization: `Bearer ${token}` } });
      setPosts(res.data);
    };
    fetchPosts();
  }, []);

  const handleLike = async (id) => {
    setLiked(liked => ({ ...liked, [id]: !liked[id] }));
    const token = localStorage.getItem('token');
    await axios.post(`/api/posts/${id}/like`, {}, { headers: { Authorization: `Bearer ${token}` } });
    setPosts(posts => posts.map(p => p._id === id ? { ...p, likes: liked[id] ? p.likes.filter(u => u !== 'me') : [...p.likes, 'me'] } : p));
  };

  const handleComment = async (id) => {
    const token = localStorage.getItem('token');
    await axios.post(`/api/posts/${id}/comment`, { text: comment }, { headers: { Authorization: `Bearer ${token}` } });
    setComment('');
    setSelectedPost(null);
  };

  const handleFollow = async (userId) => {
    const token = localStorage.getItem('token');
    await axios.post(`/api/posts/follow/${userId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
  };

  // --- New Post Modal ---
  const handleNewPost = () => setFabOpen(true);
  const handleClose = () => setFabOpen(false);
  const handleNewPostChange = e => setNewPost({ ...newPost, [e.target.name]: e.target.value });
  const handleMediaChange = e => setNewPost({ ...newPost, media: e.target.files[0] });
  const handleCreatePost = () => {
    // TODO: Implement backend call
    setFabOpen(false);
    setNewPost({ text: '', media: null });
  };

  return (
    <Container maxWidth="sm" sx={{ pt: 2, backdropFilter: 'blur(8px)', background: 'rgba(255,255,255,0.55)', borderRadius: 6, boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)', border: '1.5px solid rgba(255,255,255,0.25)' }}>
      {/* Stories Bar removed */}
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}>
        <Stack spacing={3}>
          {posts.map(post => (
            <motion.div whileHover={{ scale: 1.025, boxShadow: '0 8px 32px 0 rgba(30,136,229,0.18)' }} transition={{ type: 'spring', stiffness: 200 }}>
              <Paper key={post._id} elevation={0} sx={{ borderRadius: 4, boxShadow: '0 4px 24px 0 rgba(30,136,229,0.10)', p: 0, overflow: 'hidden', mb: 2, background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(6px)', border: '1.5px solid rgba(255,255,255,0.25)' }}>
                {/* Post Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', p: 2, pb: 1 }}>
                  <Avatar src={post.user.avatar} sx={{ mr: 2, width: 44, height: 44 }} />
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>{post.user.username}</Typography>
                    <Typography variant="caption" color="text.secondary">2h ago</Typography>
                  </Box>
                  <IconButton onClick={() => handleFollow(post.user._id)} size="small" sx={{ ml: 'auto' }}><PersonAdd /></IconButton>
                </Box>
                {/* Post Media */}
                {post.media && (
                  <motion.img
                    src={post.media}
                    alt="media"
                    style={{ width: '100%', maxHeight: 340, objectFit: 'cover', display: 'block' }}
                    initial={{ scale: 1.05 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5 }}
                  />
                )}
                {/* Post Content */}
                <Box sx={{ p: 2, pt: 1 }}>
                  <Typography variant="body1" sx={{ mb: 1 }}>{post.text}</Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <motion.div
                      whileTap={{ scale: 1.3 }}
                      animate={liked[post._id] ? { scale: [1, 1.3, 1], color: '#FF6B81' } : {}}
                      transition={{ type: 'spring', stiffness: 400 }}
                    >
                      <IconButton onClick={() => handleLike(post._id)}>
                        {liked[post._id] ? <Favorite sx={{ color: '#FF6B81' }} /> : <FavoriteBorder />}
                      </IconButton>
                    </motion.div>
                    <Typography variant="body2">{post.likes.length}</Typography>
                    <IconButton onClick={() => setSelectedPost(post._id)}><ChatBubble /></IconButton>
                    <Typography variant="body2">{post.comments.length}</Typography>
                  </Box>
                  <AnimatePresence>
                    {selectedPost === post._id && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                      >
                        <Box mt={1}>
                          <TextField label="Comment" fullWidth value={comment} onChange={e => setComment(e.target.value)} />
                          <Button onClick={() => handleComment(post._id)} variant="contained" size="small" sx={{ mt: 1 }}>Comment</Button>
                        </Box>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <Box mt={1}>
                    {post.comments.map((c, i) => (
                      <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                        <Typography variant="body2"><b>{c.user?.username || 'User'}:</b> {c.text}</Typography>
                      </motion.div>
                    ))}
                  </Box>
                </Box>
              </Paper>
            </motion.div>
          ))}
        </Stack>
      </motion.div>
      <AnimatedFAB onClick={handleNewPost} />
      <Modal open={fabOpen} onClose={handleClose}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', p: 4, borderRadius: 3, boxShadow: 24, minWidth: 320 }}>
          <Typography variant="h6" mb={2}>Create New Post</Typography>
          <TextField label="What's on your mind?" name="text" fullWidth multiline rows={3} value={newPost.text} onChange={handleNewPostChange} sx={{ mb: 2 }} />
          <Button variant="outlined" component="label" fullWidth sx={{ mb: 2 }}>
            Upload Image
            <input type="file" hidden onChange={handleMediaChange} />
          </Button>
          <Button variant="contained" color="primary" fullWidth onClick={handleCreatePost}>Post</Button>
        </Box>
      </Modal>
    </Container>
  );
} 