import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useUser } from '../../context/UserContext';
import { adminService } from '../../services/adminService';
import { AdminKey } from '../../types/admin';
import { casesData } from '../../data/cases';

const AdminKeys: React.FC = () => {
  const { user, initData } = useUser();
  const [keys, setKeys] = useState<AdminKey[]>([]);
  const [newKey, setNewKey] = useState('');
  const [selectedCase, setSelectedCase] = useState<number>(casesData[0]?.id || 1);
  const [filterCase, setFilterCase] = useState<number | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'used' | 'unused'>('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadKeys();
  }, []);

  const loadKeys = async () => {
    setLoading(true);
    const data = await adminService.getKeys();
    setKeys(data);
    setLoading(false);
  };

  const handleAddKey = async () => {
    if (!newKey.trim() || !user) return;
    await adminService.addKey(newKey.trim(), selectedCase, user.id, user.first_name || 'Admin');
    setNewKey('');
    loadKeys();
  };

  const handleDeleteKey = async (keyId: string) => {
    if (!user) return;
    await adminService.deleteKey(keyId, user.id, user.first_name || 'Admin');
    loadKeys();
  };

  const filteredKeys = keys.filter(key => {
    if (filterCase !== 'all' && key.caseId !== filterCase) return false;
    if (filterStatus === 'used' && !key.isUsed) return false;
    if (filterStatus === 'unused' && key.isUsed) return false;
    return true;
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="admin-page"
    >
      <h1>Управление ключами</h1>

      <div className="add-key-section">
        <h2>Добавить новый ключ</h2>
        <div className="add-key-form">
          <input
            type="text"
            value={newKey}
            onChange={e => setNewKey(e.target.value)}
            placeholder="XXXXX-XXXXX-XXXXX-XXXXX-XXXXX"
            className="key-input"
          />
          <select
            value={selectedCase}
            onChange={e => setSelectedCase(Number(e.target.value))}
            className="case-select"
          >
            {casesData.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <button onClick={handleAddKey} className="add-button">Добавить</button>
        </div>
      </div>

      <div className="filters-section">
        <h2>Фильтры</h2>
        <div className="filters">
          <select
            value={filterCase}
            onChange={e => setFilterCase(e.target.value === 'all' ? 'all' : Number(e.target.value))}
            className="filter-select"
          >
            <option value="all">Все кейсы</option>
            {casesData.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as typeof filterStatus)}
            className="filter-select"
          >
            <option value="all">Все статусы</option>
            <option value="unused">Не выбит</option>
            <option value="used">Выбит</option>
          </select>
        </div>
      </div>

      <div className="keys-table-container">
        {loading ? (
          <div className="loading-spinner">Загрузка...</div>
        ) : (
          <table className="keys-table">
            <thead>
              <tr>
                <th>Ключ</th>
                <th>Кейс</th>
                <th>Статус</th>
                <th>Кто выбил</th>
                <th>Дата добавления</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredKeys.map(key => (
                <tr key={key.id}>
                  <td className="key-value">{key.keyValue}</td>
                  <td>{key.caseName}</td>
                  <td>
                    <span className={`status-badge ${key.isUsed ? 'used' : 'unused'}`}>
                      {key.isUsed ? 'Выбит' : 'Не выбит'}
                    </span>
                  </td>
                  <td>
                    {key.isUsed ? (
                      <span title={`ID: ${key.usedByUserId}`}>
                        {key.usedByUsername || 'Неизвестно'}
                      </span>
                    ) : '-'}
                  </td>
                  <td>{new Date(key.addedAt).toLocaleString()}</td>
                  <td>
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteKey(key.id)}
                      disabled={key.isUsed} // нельзя удалить использованный ключ?
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </motion.div>
  );
};

export default AdminKeys;