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
import { Menu, X, Settings, Bell } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentUser, notifications, markNotificationAsRead } = useMaintenance();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

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
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 text-white flex items-center justify-between px-4 z-20 print:hidden">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-1.5 rounded-lg text-white">
            <Settings className="w-5 h-5" />
          </div>
          <h1 className="text-lg font-bold text-white tracking-tight">GIGA Plan</h1>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 hover:bg-slate-800 rounded-full relative transition-colors"
            >
              <Bell className="w-5 h-5 text-slate-400" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-900"></span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                <div className="p-3 border-b border-gray-100 bg-gray-50 font-medium text-gray-900">
                  Notificações
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-gray-500">Nenhuma notificação</div>
                  ) : (
                    notifications.map(notif => (
                      <div 
                        key={notif.id} 
                        className={`p-3 border-b border-gray-50 text-sm cursor-pointer hover:bg-gray-50 transition-colors ${!notif.read ? 'bg-blue-50/50' : ''}`}
                        onClick={() => markNotificationAsRead(notif.id)}
                      >
                        <p className="font-medium text-gray-900">{notif.title}</p>
                        <p className="text-gray-600 mt-0.5">{notif.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isMobileMenuOpen}
        setIsOpen={setIsMobileMenuOpen}
      />
      
      <main className="flex-1 lg:ml-64 pt-20 lg:pt-8 p-4 lg:p-8 overflow-y-auto h-screen print:ml-0 print:p-0 print:h-auto print:overflow-visible">
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
