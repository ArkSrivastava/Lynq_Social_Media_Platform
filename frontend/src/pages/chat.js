import React, { useState, useEffect, useRef } from 'react';
import { Container, Typography, Box, Paper, TextField, Button, List, ListItem, ListItemAvatar, ListItemText, Avatar, InputAdornment, IconButton, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import { FaSmile, FaPaperclip, FaPaperPlane } from 'react-icons/fa';
import { io } from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:5012');

export default function Chat() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/profile', { headers: { Authorization: `Bearer ${token}` } });
      setCurrentUserId(res.data._id);
      const all = await axios.get('/api/posts', { headers: { Authorization: `Bearer ${token}` } });
      setUsers([...new Map(all.data.map(p => [p.user._id, p.user])).values()].filter(u => u._id !== res.data._id));
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!selectedUser) return;
    const fetchMessages = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get(`/api/messages/${selectedUser._id}`, { headers: { Authorization: `Bearer ${token}` } });
      setMessages(res.data);
    };
    fetchMessages();
    socket.on('message', msg => {
      if (msg.sender === selectedUser._id || msg.receiver === selectedUser._id) {
        setMessages(m => [...m, msg]);
      }
    });
    return () => socket.off('message');
  }, [selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!content.trim()) return;
    const token = localStorage.getItem('token');
    const res = await axios.post(`/api/messages/${selectedUser._id}`, { content }, { headers: { Authorization: `Bearer ${token}` } });
    socket.emit('message', res.data);
    setMessages(m => [...m, res.data]);
    setContent('');
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 120px)', bgcolor: 'var(--background)', backdropFilter: 'blur(8px)', background: 'rgba(255,255,255,0.55)' }}>
      <Box sx={{ display: 'flex', width: '100%', maxWidth: 900, height: '80vh', minHeight: 520, bgcolor: 'rgba(255,255,255,0.75)', borderRadius: 6, boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)', border: '1.5px solid rgba(255,255,255,0.25)', overflow: 'hidden', alignItems: 'stretch', m: 0 }}>
        {/* Sidebar: Conversations */}
        <Box sx={{ width: 280, bgcolor: 'rgba(255,255,255,0.65)', borderRight: '1.5px solid #ececec', display: { xs: 'none', sm: 'block' }, py: 2, height: '100%', backdropFilter: 'blur(6px)' }}>
          <Box sx={{ px: 2, pb: 2, borderBottom: '1.5px solid #ececec', fontWeight: 700, fontSize: 20 }}>Messages</Box>
          <List sx={{ p: 0, height: 'calc(80vh - 64px)', overflowY: 'auto' }}>
            {users.map(u => (
              <ListItem button key={u._id} selected={selectedUser?._id === u._id} onClick={() => setSelectedUser(u)} alignItems="flex-start" sx={{ py: 1.5, px: 2, borderRadius: 2, mb: 1, '&.Mui-selected': { bgcolor: 'var(--primary)', color: '#fff' } }}>
                <ListItemAvatar>
                  <Avatar src={u.avatar} />
                </ListItemAvatar>
                <ListItemText primary={u.username} secondary={<Typography variant="caption" color="text.secondary">Online</Typography>} />
              </ListItem>
            ))}
          </List>
        </Box>
        {/* Main Chat Area */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', bgcolor: 'var(--background)', height: '100%' }}>
          {/* Chat Header */}
          <Box sx={{ p: 2, borderBottom: '1.5px solid #ececec', display: 'flex', alignItems: 'center', gap: 2, minHeight: 64 }}>
            {selectedUser && <Avatar src={selectedUser.avatar} sx={{ mr: 1 }} />}
            <Typography variant="subtitle1" fontWeight={600}>{selectedUser ? selectedUser.username : 'Select a user'}</Typography>
          </Box>
          {/* Messages */}
          <Box sx={{ flex: 1, overflowY: 'auto', px: 4, py: 3, display: 'flex', flexDirection: 'column', gap: 1, justifyContent: 'flex-end' }}>
            {selectedUser ? (
              messages.map((m, i) => {
                const isMe = m.sender === currentUserId;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}
                  >
                    <Box
                      sx={{
                        bgcolor: isMe ? 'linear-gradient(90deg, #5F9DF7 0%, #A88BEB 100%)' : 'rgba(255,255,255,0.85)',
                        color: isMe ? 'var(--chat-me-text)' : 'var(--text)',
                        px: 2.2,
                        py: 1.2,
                        borderRadius: 3,
                        maxWidth: '70%',
                        mb: 0.5,
                        fontSize: 16,
                        boxShadow: isMe ? '0 4px 18px #5F9DF7aa' : '0 2px 12px #A88BEB22',
                        alignSelf: isMe ? 'flex-end' : 'flex-start',
                        border: isMe ? '2px solid #5F9DF7' : '1.5px solid #e3e6ee',
                        transition: 'transform 0.18s, box-shadow 0.18s',
                        '&:hover': {
                          transform: 'scale(1.04) rotate(-2deg)',
                          boxShadow: isMe ? '0 8px 32px #5F9DF7cc' : '0 8px 32px #A88BEB44',
                        },
                      }}
                    >
                      {m.content}
                    </Box>
                    <Typography variant="caption" sx={{ color: isMe ? 'var(--chat-me-text)' : 'var(--text)', alignSelf: isMe ? 'flex-end' : 'flex-start', mb: 1 }}>
                      {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Typography>
                  </motion.div>
                );
              })
            ) : (
              <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 8 }}>Select a user to start chatting.</Typography>
            )}
            <div ref={messagesEndRef} />
          </Box>
          {/* Input Bar */}
          {selectedUser && (
            <Box sx={{ p: 2, borderTop: '1.5px solid #ececec', display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'var(--surface)', position: 'relative' }}>
              <IconButton><FaSmile /></IconButton>
              <IconButton><FaPaperclip /></IconButton>
              <TextField
                fullWidth
                placeholder="Message..."
                value={content}
                onChange={e => setContent(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                sx={{ borderRadius: 3, bgcolor: 'var(--background)' }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton color="primary" onClick={sendMessage}><FaPaperPlane /></IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
} 
