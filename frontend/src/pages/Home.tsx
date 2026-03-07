import React from 'react';
import { motion } from 'framer-motion';
import DailyRewards from '../components/DailyRewards';
import { useUser } from '../context/UserContext';

const Home: React.FC = () => {
  const { user } = useUser();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="page"
    >
      <div className="welcome-banner">
        <h1>Добро пожаловать, {user?.first_name || 'Cadimurx'}!</h1>
      </div>
      <DailyRewards />
    </motion.div>
  );
};

export default Home;