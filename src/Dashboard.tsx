import React, { useEffect, useState } from 'react';
import { useMaintenance } from './store';
import { format, isBefore, isAfter, addHours, parseISO } from 'date-fns';
import { AlertTriangle, Clock, CheckCircle2, Wrench } from 'lucide-react';
import { MaintenanceRecord } from './types';

export const Dashboard: React.FC = () => {
  const { records, updateRecord } = useMaintenance();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Planejada': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Em Andamento': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Concluída': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const plannedRecords = records.filter(r => r.status === 'Planejada');
  const inProgressRecords = records.filter(r => r.status === 'Em Andamento');
  
  // Alarms: Planned maintenance that is within 24 hours or past due
  const alarms = plannedRecords.filter(record => {
    const startDateTime = parseISO(`${record.startDate}T${record.startTime}`);
    const warningTime = addHours(currentTime, 24);
    return isBefore(startDateTime, warningTime);
  }).sort((a, b) => {
    const dateA = parseISO(`${a.startDate}T${a.startTime}`);
    const dateB = parseISO(`${b.startDate}T${b.startTime}`);
    return dateA.getTime() - dateB.getTime();
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard Giga Plan</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Planejadas</p>
            <p className="text-2xl font-bold text-gray-900">{plannedRecords.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-yellow-50 rounded-lg text-yellow-600">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Em Andamento</p>
            <p className="text-2xl font-bold text-gray-900">{inProgressRecords.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-green-50 rounded-lg text-green-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Concluídas</p>
            <p className="text-2xl font-bold text-gray-900">{records.filter(r => r.status === 'Concluída').length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Alarmes de Manutenção (Próximas 24h ou Atrasadas)
          </h2>
        </div>
        
        {alarms.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Nenhum alarme no momento. Tudo sob controle!
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {alarms.map(alarm => {
              const startDateTime = parseISO(`${alarm.startDate}T${alarm.startTime}`);
              const isPastDue = isBefore(startDateTime, currentTime);
              
              return (
                <div key={alarm.id} className={`p-4 flex items-center justify-between hover:bg-gray-50 transition-colors ${isPastDue ? 'bg-red-50/50' : ''}`}>
                  <div className="flex items-start gap-4">
                    <div className={`mt-1 p-2 rounded-full ${isPastDue ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{alarm.equipmentName}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {alarm.category} - {alarm.type}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-xs font-medium">
                        <span className={`px-2 py-1 rounded-md border ${isPastDue ? 'bg-red-100 text-red-700 border-red-200' : 'bg-orange-100 text-orange-700 border-orange-200'}`}>
                          {isPastDue ? 'ATRASADA' : 'EM BREVE'}
                        </span>
                        <span className="text-gray-500">
                          Agendado para: {format(startDateTime, "dd/MM/yyyy 'às' HH:mm")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => updateRecord(alarm.id, { status: 'Em Andamento' })}
                      className="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                    >
                      Iniciar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
