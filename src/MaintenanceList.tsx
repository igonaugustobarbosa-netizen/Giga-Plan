import React, { useState } from 'react';
import { useMaintenance } from './store';
import { MaintenanceCategory, MaintenanceRecord } from './types';
import { MaintenanceForm } from './MaintenanceForm';
import { Plus, Edit2, Trash2, Search, Calendar, Clock, Settings, User } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface MaintenanceListProps {
  category: MaintenanceCategory;
}

export const MaintenanceList: React.FC<MaintenanceListProps> = ({ category }) => {
  const { records, deleteRecord, currentUser, users } = useMaintenance();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MaintenanceRecord | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecords = records
    .filter(r => r.category === category)
    .filter(r => r.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) || r.description.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => b.createdAt - a.createdAt);

  const handleEdit = (record: MaintenanceRecord) => {
    setEditingRecord(record);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingRecord(undefined);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Planejada': return <span className="px-2.5 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full border border-blue-200">Planejada</span>;
      case 'Em Andamento': return <span className="px-2.5 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full border border-yellow-200">Em Andamento</span>;
      case 'Concluída': return <span className="px-2.5 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full border border-green-200">Concluída</span>;
      default: return null;
    }
  };

  const canCreate = currentUser?.role === 'Administrador' || currentUser?.role === 'Técnico';
  const canEdit = currentUser?.role === 'Administrador' || currentUser?.role === 'Técnico';
  const canDelete = currentUser?.role === 'Administrador';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">
          {category === 'Ordem de Serviço' ? 'Ordens de Serviço' : `Manutenção ${category}`}
        </h1>
        {canCreate && (
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium"
          >
            <Plus className="w-5 h-5" />
            Novo Registro
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar equipamento ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-sm font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">Equipamento</th>
                <th className="px-6 py-4">Período</th>
                <th className="px-6 py-4">Responsável</th>
                <th className="px-6 py-4">Status</th>
                {(canEdit || canDelete) && <th className="px-6 py-4 text-right">Ações</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={(canEdit || canDelete) ? 5 : 4} className="px-6 py-12 text-center text-gray-500">
                    Nenhum registro encontrado.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((record) => {
                  const assignedUser = users.find(u => u.id === record.assignedTo);
                  
                  return (
                    <tr key={record.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{record.equipmentName}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs mt-1" title={record.description}>
                          {record.description}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {format(parseISO(record.startDate), 'dd/MM/yyyy')} a {format(parseISO(record.endDate), 'dd/MM/yyyy')}
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
                          <Clock className="w-4 h-4 text-gray-400" />
                          {record.startTime} - {record.endTime}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-gray-700">
                          <User className="w-4 h-4 text-gray-400" />
                          {assignedUser ? assignedUser.name : <span className="text-gray-400 italic">Não atribuído</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(record.status)}
                      </td>
                      {(canEdit || canDelete) && (
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {canEdit && (
                              <button
                                onClick={() => handleEdit(record)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Editar"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            )}
                            {canDelete && (
                              <button
                                onClick={() => {
                                  if (window.confirm('Tem certeza que deseja excluir este registro?')) {
                                    deleteRecord(record.id);
                                  }
                                }}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Excluir"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isFormOpen && (
        <MaintenanceForm
          category={category}
          onClose={handleCloseForm}
          initialData={editingRecord}
        />
      )}
    </div>
  );
};

