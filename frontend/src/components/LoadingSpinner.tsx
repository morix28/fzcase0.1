import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner: React.FC = () => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
      <motion.div
        animate={{
          rotate: 360,
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          width: '60px',
          height: '60px',
          border: '4px solid rgba(255,215,0,0.3)',
          borderTop: '4px solid #ffd700',
          borderRadius: '50%',
        }}
      />
    </div>
  );
};

export default LoadingSpinner;