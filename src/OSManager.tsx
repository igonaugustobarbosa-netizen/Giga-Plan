import React, { useState } from 'react';
import { MaintenanceList } from './MaintenanceList';
import { MaintenanceCategory } from './types';

export const OSManager: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<MaintenanceCategory>('Ordem de Serviço');

  const categories: { id: MaintenanceCategory; label: string }[] = [
    { id: 'Ordem de Serviço', label: 'Ordens de Serviço' },
    { id: 'Corretiva', label: 'Manutenção Corretiva' },
    { id: 'Preventiva', label: 'Manutenção Preventiva' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 flex gap-2 overflow-x-auto">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeCategory === cat.id
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <MaintenanceList category={activeCategory} />
    </div>
  );
};
