import React, { createContext, useContext, useState, useEffect } from 'react';
import { MaintenanceRecord, User, AppNotification } from './types';
import { isBefore, isAfter, addHours, parseISO } from 'date-fns';

interface MaintenanceContextType {
  records: MaintenanceRecord[];
  users: User[];
  currentUser: User | null;
  notifications: AppNotification[];
  addRecord: (record: Omit<MaintenanceRecord, 'id' | 'createdAt' | 'osNumber'>) => void;
  updateRecord: (id: string, record: Partial<MaintenanceRecord>) => void;
  deleteRecord: (id: string) => void;
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;
  setCurrentUser: (user: User | null) => void;
  addNotification: (notification: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
}

const MaintenanceContext = createContext<MaintenanceContextType | undefined>(undefined);

const defaultUsers: User[] = [
  { id: '1', name: 'Admin', email: 'admin@gigaplan.com', role: 'Administrador', password: 'admin' },
  { id: '2', name: 'Técnico João', email: 'joao@gigaplan.com', role: 'Técnico', password: '123' },
  { id: '3', name: 'Visualizador Maria', email: 'maria@gigaplan.com', role: 'Visualizador', password: '123' },
];

export const MaintenanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [records, setRecords] = useState<MaintenanceRecord[]>(() => {
    const saved = localStorage.getItem('gigaPlanRecords');
    return saved ? JSON.parse(saved) : [];
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('gigaPlanUsers');
    if (saved) {
      const parsedUsers = JSON.parse(saved);
      // Migrate old users that don't have a password
      return parsedUsers.map((u: User) => {
        if (!u.password) {
          const defaultUser = defaultUsers.find(du => du.email === u.email);
          return { ...u, password: defaultUser ? defaultUser.password : '123' };
        }
        return u;
      });
    }
    return defaultUsers;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('gigaPlanCurrentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('gigaPlanNotifications');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('gigaPlanRecords', JSON.stringify(records));
  }, [records]);

  useEffect(() => {
    localStorage.setItem('gigaPlanUsers', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('gigaPlanCurrentUser', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('gigaPlanNotifications', JSON.stringify(notifications));
  }, [notifications]);

  const addNotification = (notification: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => {
    const newNotification: AppNotification = {
      ...notification,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      read: false,
    };
    setNotifications((prev) => [newNotification, ...prev]);
    
    // Simulate SMS/Email sending
    console.log(`[SIMULAÇÃO DE ENVIO SMS/EMAIL] Enviando ${notification.type} para usuários relevantes:`, notification.title, notification.message);
  };

  // Automatic Alarm Checker
  useEffect(() => {
    const checkAlarms = () => {
      const currentTime = new Date();
      const warningTime = addHours(currentTime, 24);

      records.forEach(record => {
        if (record.status === 'Planejada') {
          const startDateTime = parseISO(`${record.startDate}T${record.startTime}`);
          const isApproaching = isBefore(startDateTime, warningTime) && isAfter(startDateTime, currentTime);
          const isPastDue = isBefore(startDateTime, currentTime);

          if (isApproaching || isPastDue) {
            const notifTitle = isPastDue ? 'Manutenção Atrasada' : 'Manutenção Próxima';
            const notifMessage = `A manutenção do equipamento ${record.equipmentName} está ${isPastDue ? 'atrasada' : 'próxima'}.`;
            
            // Check if we already notified about this specific state for this record
            const alreadyNotified = notifications.some(n => 
              n.title === notifTitle && n.message === notifMessage
            );

            if (!alreadyNotified) {
              addNotification({
                title: notifTitle,
                message: notifMessage,
                type: isPastDue ? 'alert' : 'warning'
              });
            }
          }
        }
      });
    };

    checkAlarms();
    const interval = setInterval(checkAlarms, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [records, notifications]);

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const addRecord = (record: Omit<MaintenanceRecord, 'id' | 'createdAt' | 'osNumber'>) => {
    const currentYear = new Date().getFullYear();
    const osRecordsThisYear = records.filter(r => r.osNumber?.startsWith(`OS-${currentYear}-`));
    
    let maxNumber = 0;
    osRecordsThisYear.forEach(r => {
      const match = r.osNumber?.match(/OS-\d{4}-(\d+)/);
      if (match && match[1]) {
        const num = parseInt(match[1], 10);
        if (num > maxNumber) maxNumber = num;
      }
    });
    
    const nextNumber = maxNumber + 1;
    const osNumber = `OS-${currentYear}-${nextNumber.toString().padStart(4, '0')}`;

    const newRecord: MaintenanceRecord = {
      ...record,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      osNumber,
    };
    setRecords((prev) => [...prev, newRecord]);

    if (record.assignedTo) {
      const assignedUser = users.find(u => u.id === record.assignedTo);
      if (assignedUser) {
        addNotification({
          title: 'Nova Ordem de Serviço Atribuída',
          message: `O técnico ${assignedUser.name} foi atribuído à OS do equipamento: ${record.equipmentName}`,
          type: 'info'
        });
      }
    }
  };

  const updateRecord = (id: string, updatedFields: Partial<MaintenanceRecord>) => {
    setRecords((prev) =>
      prev.map((record) => (record.id === id ? { ...record, ...updatedFields } : record))
    );
  };

  const deleteRecord = (id: string) => {
    setRecords((prev) => prev.filter((record) => record.id !== id));
  };

  const addUser = (user: Omit<User, 'id'>) => {
    const newUser: User = { ...user, id: crypto.randomUUID() };
    setUsers((prev) => [...prev, newUser]);
  };

  const updateUser = (id: string, updatedFields: Partial<User>) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === id ? { ...user, ...updatedFields } : user))
    );
  };

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
  };

  return (
    <MaintenanceContext.Provider value={{ 
      records, addRecord, updateRecord, deleteRecord,
      users, addUser, updateUser, deleteUser,
      currentUser, setCurrentUser,
      notifications, addNotification, markNotificationAsRead
    }}>
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
