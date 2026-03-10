import React, { useState } from 'react';
import { LayoutDashboard, ClipboardList, FileBarChart, Settings, Users, History, Bell, LogOut } from 'lucide-react';
import { useMaintenance } from './store';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { currentUser, setCurrentUser, users, notifications, markNotificationAsRead } = useMaintenance();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['Administrador', 'Técnico', 'Visualizador'] },
    { id: 'os', label: 'Ordens de Serviço', icon: ClipboardList, roles: ['Administrador', 'Técnico', 'Visualizador'] },
    { id: 'historico', label: 'Histórico de Equipamentos', icon: History, roles: ['Administrador', 'Técnico', 'Visualizador'] },
    { id: 'relatorios', label: 'Relatórios', icon: FileBarChart, roles: ['Administrador', 'Técnico', 'Visualizador'] },
    { id: 'usuarios', label: 'Usuários', icon: Users, roles: ['Administrador'] },
  ];

  const visibleMenuItems = menuItems.filter(item => currentUser && item.roles.includes(currentUser.role));

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 h-screen flex flex-col fixed left-0 top-0 z-20 print:hidden">
      <div className="p-6 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <Settings className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Giga Plan</h1>
        </div>
        
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
            <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
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
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {visibleMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600/10 text-blue-400 font-medium'
                      : 'hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : 'text-slate-500'}`} />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-6 border-t border-slate-800 relative">
        <button 
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="w-full flex items-center gap-3 hover:bg-slate-800 p-2 -m-2 rounded-lg transition-colors text-left"
        >
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-medium text-slate-300 shrink-0">
            {currentUser?.name.substring(0, 2).toUpperCase()}
          </div>
          <div className="text-sm truncate flex-1">
            <p className="text-white font-medium truncate">{currentUser?.name}</p>
            <p className="text-slate-500 truncate">{currentUser?.role}</p>
          </div>
        </button>

        {showUserMenu && (
          <div className="absolute bottom-full left-6 mb-2 w-52 bg-slate-800 rounded-xl shadow-xl border border-slate-700 overflow-hidden z-50">
            <div className="p-3 border-b border-slate-700 text-xs font-medium text-slate-400 uppercase tracking-wider">
              Trocar Usuário (Teste)
            </div>
            <div className="max-h-48 overflow-y-auto">
              {users.map(user => (
                <button
                  key={user.id}
                  onClick={() => {
                    setCurrentUser(user);
                    setShowUserMenu(false);
                    if (user.role !== 'Administrador' && activeTab === 'usuarios') {
                      setActiveTab('dashboard');
                    }
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-700 transition-colors ${
                    currentUser?.id === user.id ? 'text-blue-400 font-medium' : 'text-slate-300'
                  }`}
                >
                  {user.name}
                  <span className="block text-xs text-slate-500">{user.role}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
