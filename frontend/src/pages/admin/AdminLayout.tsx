import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';

const AdminLayout: React.FC = () => {
  return (
    <div className="admin-layout">
      <div className="admin-sidebar">
        <h2>Админ-панель</h2>
        <nav className="admin-nav">
          <NavLink to="/admin/keys" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
            🗝️ Ключи
          </NavLink>
          <NavLink to="/admin/stats" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
            📊 Статистика
          </NavLink>
          <NavLink to="/admin/audit" className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}>
            📋 Журнал аудита
          </NavLink>
        </nav>
      </div>
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;