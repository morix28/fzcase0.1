import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BalanceProps {
  stars: number;
}

const Balance: React.FC<BalanceProps> = ({ stars }) => {
  const [prevStars, setPrevStars] = useState(stars);
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    if (prevStars !== stars) {
      setChanged(true);
      const timer = setTimeout(() => setChanged(false), 500);
      setPrevStars(stars);
      return () => clearTimeout(timer);
    }
  }, [stars, prevStars]);

  return (
    <motion.div
      className="balance"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <motion.span
        animate={changed ? { scale: [1, 1.3, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        ⭐ {stars}
      </motion.span>
    </motion.div>
  );
};

export default Balance;