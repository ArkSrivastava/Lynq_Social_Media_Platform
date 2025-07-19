import React, { useState } from 'react';
import { TextField, Button, Container, Typography, Box, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import axios from 'axios';

export default function Register({ onRegister }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/auth/register', { username, email, password });
      setSuccess('Registration successful! You can now log in.');
      setError('');
      onRegister && onRegister();
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      setSuccess('');
    }
  };

  return (
    <Container maxWidth="xs">
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}>
        <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
          <Typography variant="h5" align="center" gutterBottom>Register</Typography>
          <form onSubmit={handleSubmit}>
            <TextField label="Username" fullWidth margin="normal" value={username} onChange={e => setUsername(e.target.value)} />
            <TextField label="Email" fullWidth margin="normal" value={email} onChange={e => setEmail(e.target.value)} />
            <TextField label="Password" type="password" fullWidth margin="normal" value={password} onChange={e => setPassword(e.target.value)} />
            {error && <Typography color="error">{error}</Typography>}
            {success && <Typography color="primary">{success}</Typography>}
            <Box mt={2}>
              <Button type="submit" variant="contained" color="primary" fullWidth>Register</Button>
            </Box>
          </form>
        </Paper>
      </motion.div>
    </Container>
  );
} 