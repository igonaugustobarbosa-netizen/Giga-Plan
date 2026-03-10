/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MaintenanceProvider, useMaintenance } from './store';
import { Sidebar } from './Sidebar';
import { Dashboard } from './Dashboard';
import { OSManager } from './OSManager';
import { EquipmentHistory } from './EquipmentHistory';
import { Reports } from './Reports';
import { UserManager } from './UserManager';
import { Login } from './Login';

const AppContent: React.FC = () => {
  const { currentUser } = useMaintenance();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!currentUser) {
    return <Login />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'os':
        return <OSManager />;
      case 'historico':
        return <EquipmentHistory />;
      case 'relatorios':
        return <Reports />;
      case 'usuarios':
        return <UserManager />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen print:ml-0 print:p-0 print:h-auto print:overflow-visible">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <MaintenanceProvider>
      <AppContent />
    </MaintenanceProvider>
  );
}
