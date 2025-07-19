import React from 'react';
import { Box, IconButton, Badge, Avatar, Tooltip, Typography } from '@mui/material';
import { FaHome, FaRegCommentDots, FaHeart, FaPlusSquare, FaUserCircle } from 'react-icons/fa';

const navItems = [
  { label: 'Home', icon: <FaHome />, path: '/feed' },
  { label: 'Messages', icon: <FaRegCommentDots />, path: '/chat', badge: 3 },
  { label: 'Notifications', icon: <FaHeart />, path: '/notifications', badge: 1 },
  { label: 'Create', icon: <FaPlusSquare />, path: '/create' },
  { label: 'Profile', icon: <FaUserCircle />, path: '/profile' },
];

export default function Sidebar({ onNav }) {
  return (
    <Box sx={{
      position: 'fixed',
      left: 0,
      top: 0,
      height: '100vh',
      width: 90,
      bgcolor: 'transparent',
      background: 'var(--sidebar-glass)',
      borderRight: 'var(--sidebar-border)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      py: 6,
      zIndex: 1201,
      boxShadow: '0 0 32px 0 #5F9DF799',
      backdropFilter: 'blur(16px)',
      borderRadius: '0 28px 28px 0',
      gap: 2,
    }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 6, mt: 1 }}>
        <Typography
          className="lynq-logo"
          sx={{
            background: 'var(--lynq-logo)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textFillColor: 'transparent',
            color: 'var(--primary)',
            fontWeight: 900,
            textShadow: 'var(--logo-glow)',
            px: 3,
            py: 1.5,
            borderRadius: '22px',
            boxShadow: '0 4px 24px #5F9DF799, 0 2px 12px #A88BEB44',
            fontFamily: 'Pacifico, Poppins, Roboto, Arial, sans-serif',
            fontSize: 32,
            mb: 2,
            mt: 1,
            letterSpacing: 2.5,
            textAlign: 'center',
            display: 'block',
          }}
          onClick={() => onNav && onNav('/feed')}
        >
          Lynq
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: 4, justifyContent: 'center' }}>
        {navItems.map((item, i) => (
          <Tooltip title={item.label} placement="right" key={item.label} arrow>
            <Box>
              <IconButton
                size="large"
                sx={{
                  color: 'var(--primary)',
                  borderRadius: 2,
                  background: 'rgba(40,48,72,0.7)',
                  boxShadow: 'var(--icon-glow)',
                  transition: 'background 0.25s, color 0.25s, transform 0.18s',
                  '&:hover': {
                    background: 'linear-gradient(90deg, var(--accent) 0%, var(--secondary) 100%)',
                    color: '#fff',
                    boxShadow: '0 4px 16px #A88BEBcc',
                    transform: 'scale(1.13) rotate(-8deg)',
                  },
                  width: 56,
                  height: 56,
                  m: 1.2,
                }}
                onClick={() => onNav && onNav(item.path)}
              >
                {item.badge ? (
                  <Badge badgeContent={item.badge} color="secondary">
                    {item.icon}
                  </Badge>
                ) : item.icon}
              </IconButton>
            </Box>
          </Tooltip>
        ))}
      </Box>
    </Box>
  );
} 