import React from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../context/UserContext';

const Header: React.FC = () => {
  const { user, stars, addStars } = useUser();
  const firstName = user?.first_name || 'Cadimurx';
  const initial = firstName.charAt(0).toUpperCase();

  // Мок-функция пополнения (здесь будет интеграция с Telegram Payments)
  const handleTopUp = () => {
    // Имитация покупки 100 звёзд
    addStars(100);
    alert('+100 ⭐ (тестовая покупка)');
  };

  return (
    <motion.header
      className="app-header"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="header-left">
        <div className="user-info">
          <div className="avatar">{initial}</div>
          <span className="username">{firstName}</span>
        </div>
      </div>

      <div className="header-center">
        <img src="/logo.png" alt="FazerCases" className="logo-image" />
      </div>

      <div className="header-right">
        <div className="balance">
          <span className="balance-icon">⭐</span>
          <span className="balance-amount">{stars}</span>
          <button className="top-up-button" onClick={handleTopUp}>+</button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;