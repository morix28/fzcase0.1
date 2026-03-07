import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '../context/UserContext';

const BottomNav: React.FC = () => {
  const { isAdmin } = useUser();
  
  const navItems = [
    { path: '/', label: 'Дом', icon: '🏠' },
    { path: '/market', label: 'Маркет', icon: '🛒' },
    { path: '/roulette', label: 'Рулетка', icon: '🎰' },
    { path: '/friends', label: 'Друзья', icon: '👥' },
    { path: '/tasks', label: 'Задания', icon: '📋' },
    ...(isAdmin ? [{ path: '/admin', label: 'Админ', icon: '⚙️' }] : []),
  ];

  return (
    <motion.nav
      className="bottom-nav"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {navItems.map(item => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          <span className="nav-icon">{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </NavLink>
      ))}
    </motion.nav>
  );
};

export default BottomNav;