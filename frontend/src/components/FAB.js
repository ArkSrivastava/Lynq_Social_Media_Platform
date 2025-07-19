import React from 'react';
import { Fab, Box } from '@mui/material';
import { motion } from 'framer-motion';
import { FaPlus } from 'react-icons/fa';

export default function AnimatedFAB({ onClick }) {
  return (
    <Box sx={{ position: 'fixed', bottom: 32, right: 32, zIndex: 1200 }}>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.15, rotate: 20 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <Fab
          color="primary"
          aria-label="add"
          onClick={onClick}
          sx={{
            background: 'linear-gradient(135deg, #FF6B81 0%, #5F9DF7 100%)',
            color: '#fff',
            boxShadow: '0 8px 32px rgba(95,157,247,0.18)',
            fontSize: 28,
            width: 64,
            height: 64,
          }}
        >
          <FaPlus />
        </Fab>
      </motion.div>
    </Box>
  );
} 
