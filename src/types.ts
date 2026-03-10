export type MaintenanceCategory = 'Corretiva' | 'Preventiva' | 'Ordem de Serviço';
export type MaintenanceType = 'Mecânica' | 'Elétrica' | 'Melhoria';
export type MaintenanceStatus = 'Planejada' | 'Em Andamento' | 'Concluída';

export interface MaintenanceRecord {
  id: string;
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
  createdAt: number;
}
