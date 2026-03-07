import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { adminService } from '../../services/adminService';
import { CaseStats } from '../../types/admin';

const AdminStats: React.FC = () => {
  const [stats, setStats] = useState<CaseStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    setLoading(true);
    const data = await adminService.getStats();
    setStats(data);
    setLoading(false);
  };

  const totalKeys = stats.reduce((acc, s) => acc + s.totalKeys, 0);
  const totalUsed = stats.reduce((acc, s) => acc + s.usedKeys, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="admin-page"
    >
      <h1>Статистика ключей</h1>

      <div className="stats-summary">
        <div className="stat-card">
          <span className="stat-value">{totalKeys}</span>
          <span className="stat-label">Всего ключей</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{totalUsed}</span>
          <span className="stat-label">Использовано</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{totalKeys - totalUsed}</span>
          <span className="stat-label">Осталось</span>
        </div>
      </div>

      <h2>По кейсам</h2>
      {loading ? (
        <div className="loading-spinner">Загрузка...</div>
      ) : (
        <table className="stats-table">
          <thead>
            <tr>
              <th>Кейс</th>
              <th>Всего ключей</th>
              <th>Использовано</th>
              <th>Осталось</th>
              <th>Процент</th>
            </tr>
          </thead>
          <tbody>
            {stats.map(s => (
              <tr key={s.caseId}>
                <td>{s.caseName}</td>
                <td>{s.totalKeys}</td>
                <td>{s.usedKeys}</td>
                <td>{s.unusedKeys}</td>
                <td>
                  {s.totalKeys ? Math.round((s.usedKeys / s.totalKeys) * 100) : 0}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </motion.div>
  );
};

export default AdminStats;