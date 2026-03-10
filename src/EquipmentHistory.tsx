import React, { useState, useMemo } from 'react';
import { useMaintenance } from './store';
import { format, parseISO } from 'date-fns';
import { Search, Calendar, Clock, Settings, FileText } from 'lucide-react';

export const EquipmentHistory: React.FC = () => {
  const { records } = useMaintenance();
  const [selectedEquipment, setSelectedEquipment] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  const uniqueEquipments = useMemo(() => {
    const equipments = new Set(records.map(r => r.equipmentName));
    return Array.from(equipments).sort();
  }, [records]);

  const filteredRecords = useMemo(() => {
    if (!selectedEquipment) return [];
    return records
      .filter(r => r.equipmentName === selectedEquipment)
      .filter(r => r.description.toLowerCase().includes(searchTerm.toLowerCase()) || r.partsList.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [records, selectedEquipment, searchTerm]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Histórico de Equipamentos</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 p-4 h-[calc(100vh-12rem)] overflow-y-auto">
          <h2 className="font-semibold text-gray-900 mb-4">Equipamentos</h2>
          {uniqueEquipments.length === 0 ? (
            <p className="text-sm text-gray-500">Nenhum equipamento cadastrado.</p>
          ) : (
            <div className="space-y-1">
              {uniqueEquipments.map(eq => (
                <button
                  key={eq}
                  onClick={() => setSelectedEquipment(eq)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedEquipment === eq
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {eq}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="md:col-span-3 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[calc(100vh-12rem)]">
          {!selectedEquipment ? (
            <div className="flex-1 flex items-center justify-center text-gray-500 p-8 text-center">
              Selecione um equipamento na lista ao lado para ver seu histórico completo de manutenções.
            </div>
          ) : (
            <>
              <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-blue-600" />
                    {selectedEquipment}
                  </h2>
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar no histórico..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {filteredRecords.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Nenhum registro encontrado para esta busca.
                  </div>
                ) : (
                  filteredRecords.map(record => (
                    <div key={record.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-200 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-2">
                            {record.category}
                          </span>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              {format(parseISO(record.startDate), 'dd/MM/yyyy')}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Settings className="w-4 h-4 text-gray-400" />
                              {record.type}
                            </span>
                          </div>
                        </div>
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${
                          record.status === 'Concluída' ? 'bg-green-100 text-green-800 border-green-200' :
                          record.status === 'Em Andamento' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                          'bg-gray-100 text-gray-800 border-gray-200'
                        }`}>
                          {record.status}
                        </span>
                      </div>
                      
                      <div className="space-y-3 mt-3">
                        <div>
                          <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-1">Descrição</h4>
                          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100 whitespace-pre-wrap">
                            {record.description}
                          </p>
                        </div>
                        
                        {record.partsList && (
                          <div>
                            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-1">Peças</h4>
                            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100 whitespace-pre-wrap">
                              {record.partsList}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
