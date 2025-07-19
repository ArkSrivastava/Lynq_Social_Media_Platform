import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Box, Stack } from '@mui/material';
import { FaHeart, FaRegCommentDots, FaUserPlus } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const iconMap = {
  like: <FaHeart color="#FF6B81" />,
  comment: <FaRegCommentDots color="#5F9DF7" />,
  follow: <FaUserPlus color="#FFC107" />,
};

const listVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
};

export default function Notifications() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/analytics', { headers: { Authorization: `Bearer ${token}` } });
      setEvents(res.data.reverse());
      setLoading(false);
    };
    fetchAnalytics();
  }, []);

  return (
    <Container maxWidth="sm" sx={{ pt: 4, height: '80vh', display: 'flex', flexDirection: 'column' }}>
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}>
        <Typography variant="h5" align="center" gutterBottom>Notifications</Typography>
        <Box sx={{ flex: 1, overflowY: 'auto', pr: 1, pb: 1, mt: 2, borderRadius: 4, scrollbarWidth: 'thin', scrollbarColor: '#A88BEB #E3F0FF' }} className="notifications-scroll">
          <AnimatePresence>
            <motion.div
              variants={listVariants}
              initial="hidden"
              animate="visible"
              style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
            >
              {loading ? (
                <Typography align="center">Loading...</Typography>
              ) : events.length === 0 ? (
                <Typography align="center" color="text.secondary">No notifications yet.</Typography>
              ) : events.map((e, i) => (
                <motion.div
                  key={i}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: 32 }}
                  whileHover={{ boxShadow: '0 0 16px 2px #A88BEB88', scale: 1.03, borderColor: '#A88BEB' }}
                  style={{ borderRadius: 12, border: '2px solid transparent' }}
                >
                  <Paper elevation={2} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 2, borderRadius: 4, background: 'var(--card-bg)', boxShadow: 'var(--shadow)', minHeight: 64 }}>
                    <Box sx={{ fontSize: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 40 }}>
                      {iconMap[e.action] || <FaHeart />}
                    </Box>
                    <Box>
                      <Typography variant="body1">
                        {e.action === 'like' && 'Someone liked your post.'}
                        {e.action === 'comment' && 'Someone commented on your post.'}
                        {e.action === 'follow' && 'You have a new follower!'}
                        {!['like','comment','follow'].includes(e.action) && e.action}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(e.timestamp).toLocaleString()}
                      </Typography>
                    </Box>
                  </Paper>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </Box>
      </motion.div>
      <style>{`
        .notifications-scroll::-webkit-scrollbar {
          width: 8px;
          background: #E3F0FF;
          border-radius: 8px;
        }
        .notifications-scroll::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #A88BEB 0%, #5F9DF7 100%);
          border-radius: 8px;
        }
      `}</style>
    </Container>
  );
} 