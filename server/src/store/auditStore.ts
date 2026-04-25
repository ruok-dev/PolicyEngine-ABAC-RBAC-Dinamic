
export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  effect: 'allow' | 'deny';
  reason: string;
  context: any;
  severity: 'info' | 'warning' | 'critical';
  isAlert?: boolean;
}

class AuditStore {
  private logs: AuditLog[] = [];
  private readonly MAX_LOGS = 50;

  add(log: Omit<AuditLog, 'id' | 'timestamp'>): void {
    const newLog: AuditLog = {
      ...log,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
    };
    this.logs.unshift(newLog); // Newest first
    if (this.logs.length > this.MAX_LOGS) {
      this.logs.pop();
    }
  }

  getAll(): AuditLog[] {
    return this.logs;
  }
}

export const auditStore = new AuditStore();
