import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AppBar, Toolbar, Button, Box, IconButton, CircularProgress } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMoon, FaSun } from 'react-icons/fa';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Feed from './pages/Feed';
import Chat from './pages/Chat';
import Analytics from './pages/Analytics';
import Notifications from './pages/Notifications';

function App() {
  const [user, setUserState] = useState(null);
  const [dark, setDark] = useState(false);
  const [loading, setLoading] = useState(true);

  // Persist login state
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      setUserState(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  // Set user and persist to localStorage
  const setUser = (userObj) => {
    setUserState(userObj);
    if (userObj) {
      localStorage.setItem('user', JSON.stringify(userObj));
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  };

  useEffect(() => {
    document.body.setAttribute('data-theme', dark ? 'dark' : '');
  }, [dark]);

  // Navigation handler for sidebar
  const navigate = window.location ? (path) => window.location.pathname !== path && (window.location.href = path) : () => {};

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', bgcolor: 'var(--background)' }}>
        <CircularProgress color="primary" size={60} />
      </Box>
    );
  }

  return (
    <Router>
      <Sidebar onNav={navigate} />
      <Box sx={{ ml: { xs: 0, sm: 12, md: 14 }, pl: 12, minHeight: '100vh', bgcolor: 'var(--background)', transition: 'background 0.2s' }}>
        <AppBar position="static" color="primary" sx={{ boxShadow: '0 4px 24px rgba(30,136,229,0.08)', borderRadius: 3, mt: 2, mx: 'auto', maxWidth: 900 }}>
          <Toolbar sx={{ display: 'flex', gap: 2 }}>
            <Box flex={1} />
            <motion.div whileHover={{ rotate: 20 }}>
              <IconButton color="inherit" onClick={() => setDark(d => !d)}>
                {dark ? <FaSun /> : <FaMoon />}
              </IconButton>
            </motion.div>
            {!user && <Button color="inherit" component={Link} to="/login">Login</Button>}
            {!user && <Button color="inherit" component={Link} to="/register">Register</Button>}
            {user && <Button color="inherit" onClick={handleLogout}>Logout</Button>}
          </Toolbar>
        </AppBar>
        <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, mb: 8 }}>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/login" element={<motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }}><Login onLogin={setUser} /></motion.div>} />
              <Route path="/register" element={<motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }}><Register onRegister={() => {}} /></motion.div>} />
              <Route path="/profile" element={user ? <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }}><Profile /></motion.div> : <Navigate to="/login" />} />
              <Route path="/feed" element={user ? <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }}><Feed /></motion.div> : <Navigate to="/login" />} />
              <Route path="/chat" element={user ? <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }}><Chat /></motion.div> : <Navigate to="/login" />} />
              <Route path="/analytics" element={user ? <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }}><Analytics /></motion.div> : <Navigate to="/login" />} />
              <Route path="/notifications" element={user ? <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -40 }}><Notifications /></motion.div> : <Navigate to="/login" />} />
              <Route path="*" element={<Navigate to="/feed" />} />
            </Routes>
          </AnimatePresence>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
