export type MaintenanceCategory = 'Corretiva' | 'Preventiva' | 'Ordem de Serviço';
export type MaintenanceType = 'Mecânica' | 'Elétrica' | 'Melhoria';
export type MaintenanceStatus = 'Planejada' | 'Em Andamento' | 'Concluída';
export type UserRole = 'Administrador' | 'Técnico' | 'Visualizador';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  password?: string;
}

export interface MaintenanceRecord {
  id: string;
  osNumber?: string;
  category: MaintenanceCategory;
  equipmentName: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  type: MaintenanceType;
  description: string;
  partsList: string;
  status: MaintenanceStatus;
  assignedTo?: string; // User ID
  createdAt: number;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  createdAt: number;
  read: boolean;
  type: 'info' | 'warning' | 'alert';
}

