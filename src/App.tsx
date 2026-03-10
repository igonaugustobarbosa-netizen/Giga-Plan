/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MaintenanceProvider } from './store';
import { Sidebar } from './Sidebar';
import { Dashboard } from './Dashboard';
import { MaintenanceList } from './MaintenanceList';
import { Reports } from './Reports';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'corretiva':
        return <MaintenanceList category="Corretiva" />;
      case 'preventiva':
        return <MaintenanceList category="Preventiva" />;
      case 'os':
        return <MaintenanceList category="Ordem de Serviço" />;
      case 'relatorios':
        return <Reports />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <MaintenanceProvider>
      <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen print:ml-0 print:p-0 print:h-auto print:overflow-visible">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </MaintenanceProvider>
  );
}
