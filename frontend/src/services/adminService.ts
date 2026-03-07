import { AdminKey, AuditLogEntry, CaseStats } from '../types/admin';
import { casesData } from '../data/cases';

// Имитация хранилища в localStorage
const STORAGE_KEYS = 'fazercases_admin_keys';
const STORAGE_AUDIT = 'fazercases_admin_audit';

// Начальные тестовые данные
const initialKeys: AdminKey[] = [
  {
    id: '1',
    keyValue: 'AAAAA-BBBBB-CCCCC-DDDDD-EEEEE',
    caseId: 1,
    caseName: 'Инди-хиты',
    isUsed: true,
    usedByUserId: 123456,
    usedByUsername: 'testuser',
    usedAt: new Date().toISOString(),
    addedByAdminId: 987654321,
    addedAt: new Date().toISOString(),
  },
  {
    id: '2',
    keyValue: '11111-22222-33333-44444-55555',
    caseId: 2,
    caseName: 'Оружейный арсенал',
    isUsed: false,
    addedByAdminId: 987654321,
    addedAt: new Date().toISOString(),
  },
];

const initialAudit: AuditLogEntry[] = [
  {
    id: '1',
    action: 'add_key',
    adminId: 987654321,
    adminName: 'Admin',
    details: 'Добавлен ключ для кейса "Инди-хиты"',
    timestamp: new Date().toISOString(),
  },
];

// Инициализация хранилища
const loadKeys = (): AdminKey[] => {
  const stored = localStorage.getItem(STORAGE_KEYS);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(STORAGE_KEYS, JSON.stringify(initialKeys));
  return initialKeys;
};

const loadAudit = (): AuditLogEntry[] => {
  const stored = localStorage.getItem(STORAGE_AUDIT);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(STORAGE_AUDIT, JSON.stringify(initialAudit));
  return initialAudit;
};

export const adminService = {
  // Ключи
  getKeys: async (): Promise<AdminKey[]> => {
    // Имитация задержки сети
    await new Promise(resolve => setTimeout(resolve, 300));
    return loadKeys();
  },

  addKey: async (keyValue: string, caseId: number, adminId: number, adminName: string): Promise<AdminKey> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    const keys = loadKeys();
    const caseItem = casesData.find(c => c.id === caseId);
    const newKey: AdminKey = {
      id: Date.now().toString(),
      keyValue,
      caseId,
      caseName: caseItem?.name || 'Неизвестный кейс',
      isUsed: false,
      addedByAdminId: adminId,
      addedAt: new Date().toISOString(),
    };
    keys.push(newKey);
    localStorage.setItem(STORAGE_KEYS, JSON.stringify(keys));

    // Добавляем запись в аудит
    const audit = loadAudit();
    audit.push({
      id: Date.now().toString() + 'a',
      action: 'add_key',
      adminId,
      adminName,
      details: `Добавлен ключ для кейса "${caseItem?.name || caseId}"`,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem(STORAGE_AUDIT, JSON.stringify(audit));

    return newKey;
  },

  deleteKey: async (keyId: string, adminId: number, adminName: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    let keys = loadKeys();
    const key = keys.find(k => k.id === keyId);
    keys = keys.filter(k => k.id !== keyId);
    localStorage.setItem(STORAGE_KEYS, JSON.stringify(keys));

    if (key) {
      const audit = loadAudit();
      audit.push({
        id: Date.now().toString() + 'd',
        action: 'delete_key',
        adminId,
        adminName,
        details: `Удалён ключ ${key.keyValue} (кейс: ${key.caseName})`,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem(STORAGE_AUDIT, JSON.stringify(audit));
    }
  },

  // Статистика
  getStats: async (): Promise<CaseStats[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const keys = loadKeys();
    const cases = casesData;

    return cases.map(c => {
      const caseKeys = keys.filter(k => k.caseId === c.id);
      const used = caseKeys.filter(k => k.isUsed).length;
      return {
        caseId: c.id,
        caseName: c.name,
        totalKeys: caseKeys.length,
        usedKeys: used,
        unusedKeys: caseKeys.length - used,
      };
    });
  },

  // Аудит
  getAuditLog: async (): Promise<AuditLogEntry[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return loadAudit().sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },
};