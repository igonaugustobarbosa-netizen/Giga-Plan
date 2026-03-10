import React, { createContext, useContext, useState, useEffect } from 'react';
import { MaintenanceRecord } from './types';

interface MaintenanceContextType {
  records: MaintenanceRecord[];
  addRecord: (record: Omit<MaintenanceRecord, 'id' | 'createdAt'>) => void;
  updateRecord: (id: string, record: Partial<MaintenanceRecord>) => void;
  deleteRecord: (id: string) => void;
}

const MaintenanceContext = createContext<MaintenanceContextType | undefined>(undefined);

export const MaintenanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [records, setRecords] = useState<MaintenanceRecord[]>(() => {
    const saved = localStorage.getItem('gigaPlanRecords');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('gigaPlanRecords', JSON.stringify(records));
  }, [records]);

  const addRecord = (record: Omit<MaintenanceRecord, 'id' | 'createdAt'>) => {
    const newRecord: MaintenanceRecord = {
      ...record,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    setRecords((prev) => [...prev, newRecord]);
  };

  const updateRecord = (id: string, updatedFields: Partial<MaintenanceRecord>) => {
    setRecords((prev) =>
      prev.map((record) => (record.id === id ? { ...record, ...updatedFields } : record))
    );
  };

  const deleteRecord = (id: string) => {
    setRecords((prev) => prev.filter((record) => record.id !== id));
  };

  return (
    <MaintenanceContext.Provider value={{ records, addRecord, updateRecord, deleteRecord }}>
      {children}
    </MaintenanceContext.Provider>
  );
};

export const useMaintenance = () => {
  const context = useContext(MaintenanceContext);
  if (!context) {
    throw new Error('useMaintenance must be used within a MaintenanceProvider');
  }
  return context;
};
