export interface AdminKey {
  id: string;
  keyValue: string;
  caseId: number;
  caseName: string;
  isUsed: boolean;
  usedByUserId?: number;
  usedByUsername?: string;
  usedAt?: string; // ISO date
  addedByAdminId: number;
  addedAt: string;
}

export interface AuditLogEntry {
  id: string;
  action: 'add_key' | 'use_key' | 'delete_key' | 'edit_key' | 'admin_login';
  adminId: number;
  adminName: string;
  details: string;
  timestamp: string;
}

export interface CaseStats {
  caseId: number;
  caseName: string;
  totalKeys: number;
  usedKeys: number;
  unusedKeys: number;
}