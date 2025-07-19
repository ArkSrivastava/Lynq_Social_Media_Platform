import React, { useState, useEffect } from 'react';
import { TextField, Button, Container, Typography, Box, Avatar, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/profile', { headers: { Authorization: `Bearer ${token}` } });
      setUser(res.data);
      setUsername(res.data.username);
      setEmail(res.data.email);
      setAvatar(res.data.avatar);
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const res = await axios.put('/api/profile', { username, email }, { headers: { Authorization: `Bearer ${token}` } });
    setUser(res.data);
    setMessage('Profile updated!');
  };

  const handleAvatar = async (e) => {
    e.preventDefault();
    if (!file) return;
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('avatar', file);
    const res = await axios.post('/api/profile/avatar', formData, { headers: { Authorization: `Bearer ${token}` } });
    setAvatar(res.data.avatar);
    setMessage('Avatar updated!');
  };

  if (!user) return <Typography>Loading...</Typography>;

  return (
    <Container maxWidth="sm" sx={{ backdropFilter: 'blur(8px)', background: 'rgba(255,255,255,0.55)', borderRadius: 6, boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)', border: '1.5px solid rgba(255,255,255,0.25)' }}>
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}>
        <Paper elevation={3} sx={{ p: 4, mt: 8, background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(6px)', borderRadius: 6, boxShadow: '0 4px 24px 0 rgba(30,136,229,0.10)', border: '1.5px solid rgba(255,255,255,0.25)' }}>
          <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
            <Avatar src={avatar} sx={{ width: 80, height: 80, mb: 2 }} />
            <Box display="flex" gap={3} mb={2}>
              <Box textAlign="center">
                <Typography variant="subtitle2" color="text.secondary">Followers</Typography>
                <Typography variant="h6" fontWeight={700}>{user.followers?.length || 0}</Typography>
              </Box>
              <Box textAlign="center">
                <Typography variant="subtitle2" color="text.secondary">Following</Typography>
                <Typography variant="h6" fontWeight={700}>{user.following?.length || 0}</Typography>
              </Box>
            </Box>
            <form onSubmit={handleAvatar} style={{ marginBottom: 16 }}>
              <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} />
              <Button type="submit" variant="outlined" size="small">Upload Avatar</Button>
            </form>
          </Box>
          <form onSubmit={handleUpdate}>
            <TextField label="Username" fullWidth margin="normal" value={username} onChange={e => setUsername(e.target.value)} />
            <TextField label="Email" fullWidth margin="normal" value={email} onChange={e => setEmail(e.target.value)} />
            <Box mt={2}>
              <Button type="submit" variant="contained" color="primary" fullWidth>Update Profile</Button>
            </Box>
          </form>
          {message && <Typography color="primary" align="center" mt={2}>{message}</Typography>}
        </Paper>
      </motion.div>
    </Container>
  );
} 