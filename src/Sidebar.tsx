import React from 'react';
import { LayoutDashboard, Wrench, ShieldCheck, ClipboardList, FileBarChart, Settings } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'corretiva', label: 'Manutenção Corretiva', icon: Wrench },
    { id: 'preventiva', label: 'Manutenção Preventiva', icon: ShieldCheck },
    { id: 'os', label: 'Ordens de Serviço', icon: ClipboardList },
    { id: 'relatorios', label: 'Relatórios', icon: FileBarChart },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 h-screen flex flex-col fixed left-0 top-0 z-20 print:hidden">
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg text-white">
          <Settings className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight">Giga Plan</h1>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-3">
          {menuItems.map((item) => {
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
      
      <div className="p-6 border-t border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-sm font-medium text-slate-400">
            US
          </div>
          <div className="text-sm">
            <p className="text-white font-medium">Usuário Sistema</p>
            <p className="text-slate-500">Gestor de Manutenção</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
