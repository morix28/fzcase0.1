import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { adminService } from '../../services/adminService';
import { AuditLogEntry } from '../../types/admin';

const AdminAudit: React.FC = () => {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setLoading(true);
    const data = await adminService.getAuditLog();
    setLogs(data);
    setLoading(false);
  };

  const getActionLabel = (action: AuditLogEntry['action']) => {
    switch (action) {
      case 'add_key': return '➕ Добавление ключа';
      case 'use_key': return '🎲 Использование ключа';
      case 'delete_key': return '🗑️ Удаление ключа';
      case 'edit_key': return '✏️ Редактирование ключа';
      case 'admin_login': return '🔑 Вход в админку';
      default: return action;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="admin-page"
    >
      <h1>Журнал аудита</h1>

      {loading ? (
        <div className="loading-spinner">Загрузка...</div>
      ) : (
        <div className="audit-table-container">
          <table className="audit-table">
            <thead>
              <tr>
                <th>Время</th>
                <th>Администратор</th>
                <th>Действие</th>
                <th>Детали</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id}>
                  <td>{new Date(log.timestamp).toLocaleString()}</td>
                  <td>{log.adminName} (ID: {log.adminId})</td>
                  <td>
                    <span className={`action-badge ${log.action}`}>
                      {getActionLabel(log.action)}
                    </span>
                  </td>
                  <td>{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default AdminAudit;