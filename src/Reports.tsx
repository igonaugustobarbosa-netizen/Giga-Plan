import React, { useState, useRef } from 'react';
import { useMaintenance } from './store';
import { format, parseISO, isWithinInterval } from 'date-fns';
import { FileText, Download, Filter, Loader2 } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export const Reports: React.FC = () => {
  const { records } = useMaintenance();
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-01'));
  const [endDate, setEndDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [statusFilter, setStatusFilter] = useState('Todas');
  const [isPrinting, setIsPrinting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const filteredRecords = records.filter(record => {
    const recordDate = parseISO(record.startDate);
    const start = parseISO(startDate);
    const end = parseISO(endDate);
    
    const isWithinDate = isWithinInterval(recordDate, { start, end });
    const isStatusMatch = statusFilter === 'Todas' || record.status === statusFilter;
    
    return isWithinDate && isStatusMatch;
  }).sort((a, b) => b.createdAt - a.createdAt);

  const handlePrint = async () => {
    if (!reportRef.current) return;
    
    setIsPrinting(true);
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      let heightLeft = pdfHeight;
      let position = 0;
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      // Add subsequent pages if content is longer than one page
      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`relatorio-gigaplan-${format(new Date(), 'dd-MM-yyyy')}.pdf`);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Ocorreu um erro ao gerar o PDF. Tente novamente.');
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <h1 className="text-2xl font-bold text-gray-900">Relatórios de Serviços</h1>
        <button
          onClick={handlePrint}
          disabled={isPrinting || filteredRecords.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors shadow-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPrinting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Download className="w-5 h-5" />
          )}
          {isPrinting ? 'Gerando PDF...' : 'Imprimir / PDF'}
        </button>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 print:hidden">
        <div className="flex items-center gap-2 mb-4 text-gray-900 font-semibold">
          <Filter className="w-5 h-5" />
          Filtros
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data Inicial</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data Final</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white"
            >
              <option value="Todas">Todas</option>
              <option value="Planejada">Planejada</option>
              <option value="Em Andamento">Em Andamento</option>
              <option value="Concluída">Concluída</option>
            </select>
          </div>
        </div>
      </div>

      <div 
        ref={reportRef}
        className="bg-[#ffffff] text-[#111827] rounded-xl border border-[#f3f4f6] p-8 print:shadow-none print:border-none print:p-0"
      >
        <div className="text-center mb-8 pb-8 border-b border-[#e5e7eb]">
          <h2 className="text-3xl font-bold text-[#111827]">GIGA Plan</h2>
          <p className="text-[#6b7280] mt-2">Relatório de Serviços</p>
          <p className="text-sm text-[#9ca3af] mt-1">
            Período: {format(parseISO(startDate), 'dd/MM/yyyy')} a {format(parseISO(endDate), 'dd/MM/yyyy')}
          </p>
          {statusFilter !== 'Todas' && (
            <p className="text-sm font-medium text-[#2563eb] mt-1">
              Status: {statusFilter}
            </p>
          )}
        </div>

        {filteredRecords.length === 0 ? (
          <div className="text-center py-12 text-[#6b7280]">
            Nenhum serviço encontrado para os filtros selecionados.
          </div>
        ) : (
          <div className="space-y-8">
            {filteredRecords.map((record) => (
              <div key={record.id} className="border border-[#e5e7eb] rounded-lg p-6 break-inside-avoid">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-[#111827] flex items-center gap-2">
                      <FileText className="w-5 h-5 text-[#2563eb]" />
                      {record.equipmentName}
                    </h3>
                    <p className="text-sm font-medium text-[#2563eb] mt-1">
                      {record.category} - {record.type}
                    </p>
                  </div>
                  <div className="text-right text-sm text-[#6b7280]">
                    <p>Início: {format(parseISO(record.startDate), 'dd/MM/yyyy')} às {record.startTime}</p>
                    <p>Fim: {format(parseISO(record.endDate), 'dd/MM/yyyy')} às {record.endTime}</p>
                  </div>
                </div>
                
                <div className="mt-4 space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-[#111827] uppercase tracking-wider mb-2">Descrição dos Trabalhos</h4>
                    <p className="text-[#374151] whitespace-pre-wrap bg-[#f9fafb] p-4 rounded-lg border border-[#f3f4f6]">
                      {record.description}
                    </p>
                  </div>
                  
                  {record.partsList && (
                    <div>
                      <h4 className="text-sm font-semibold text-[#111827] uppercase tracking-wider mb-2">Peças Utilizadas</h4>
                      <p className="text-[#374151] whitespace-pre-wrap bg-[#f9fafb] p-4 rounded-lg border border-[#f3f4f6]">
                        {record.partsList}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
