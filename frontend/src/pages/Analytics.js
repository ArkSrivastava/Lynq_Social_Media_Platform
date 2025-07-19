import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Box } from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function Analytics() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/analytics', { headers: { Authorization: `Bearer ${token}` } });
      setEvents(res.data);
    };
    fetchAnalytics();
  }, []);

  return (
    <Container maxWidth="sm">
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}>
        <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
          <Typography variant="h5" align="center" gutterBottom>Analytics Dashboard</Typography>
          <Box>
            {events.map((e, i) => (
              <Typography key={i} variant="body2">
                {e.action} on {e.targetId} at {new Date(e.timestamp).toLocaleString()}
              </Typography>
            ))}
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
} 