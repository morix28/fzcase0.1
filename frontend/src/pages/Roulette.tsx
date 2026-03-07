import React from 'react';
import { motion } from 'framer-motion';

const Market: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="page"
    >
      <h1>Маркет</h1>
      <p>Здесь будут предметы для обмена</p>
    </motion.div>
  );
};

export default Market;