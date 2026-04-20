// src/components/modals/ExcelReportesModal.jsx
import React from 'react';

export default function ExcelReportesModal({ isOpen, onClose, onReporte }) {
  if (!isOpen) return null;

  const reportes = [
    {
      tipo: 'controlAR',
      colorBg: 'bg-indigo-50', colorBorder: 'border-indigo-200', colorHover: 'hover:bg-indigo-100 hover:border-indigo-300',
      iconBg: 'bg-indigo-200 text-indigo-700', iconHoverBg: 'group-hover:bg-indigo-600 group-hover:text-white',
      icon: 'fa-chart-pie',
      titulo: 'Control AR (Cuentas por Cobrar)',
      desc: 'Análisis detallado de antigüedad de saldos y días vencidos.',
    },
    {
      tipo: 'clientes',
      colorBg: 'bg-purple-50', colorBorder: 'border-purple-200', colorHover: 'hover:bg-purple-100 hover:border-purple-300',
      iconBg: 'bg-purple-200 text-purple-700', iconHoverBg: 'group-hover:bg-purple-600 group-hover:text-white',
      icon: 'fa-users',
      titulo: 'Resumen Corporativo',
      desc: 'Reporte totalizado por cliente en hojas separadas.',
    },
    {
      tipo: 'csv',
      colorBg: '', colorBorder: 'border-gray-200', colorHover: 'hover:bg-emerald-50 hover:border-emerald-300',
      iconBg: 'bg-emerald-100 text-emerald-600', iconHoverBg: 'group-hover:bg-emerald-600 group-hover:text-white',
      icon: 'fa-table',
      titulo: 'Vista Filtrada Actual',
      desc: 'Descarga en CSV exactamente lo que ves en pantalla.',
      separator: true,
    },
    {
      tipo: 'vencidas',
      colorBg: '', colorBorder: 'border-gray-200', colorHover: 'hover:bg-amber-50 hover:border-amber-300',
      iconBg: 'bg-amber-100 text-amber-600', iconHoverBg: 'group-hover:bg-amber-600 group-hover:text-white',
      icon: 'fa-clock',
      titulo: 'Cartera Vencida',
      desc: 'Facturas vigentes con fecha de vencimiento superada.',
    },
    {
      tipo: 'pagadas',
      colorBg: '', colorBorder: 'border-gray-200', colorHover: 'hover:bg-blue-50 hover:border-blue-300',
      iconBg: 'bg-blue-100 text-blue-600', iconHoverBg: 'group-hover:bg-blue-600 group-hover:text-white',
      icon: 'fa-check-double',
      titulo: 'Facturas Pagadas',
      desc: 'Facturas vigentes pero sin saldo pendiente.',
    },
    {
      tipo: 'canceladas',
      colorBg: '', colorBorder: 'border-gray-200', colorHover: 'hover:bg-red-50 hover:border-red-300',
      iconBg: 'bg-red-100 text-red-600', iconHoverBg: 'group-hover:bg-red-600 group-hover:text-white',
      icon: 'fa-ban',
      titulo: 'Solo Canceladas',
      desc: 'Histórico de facturas anuladas.',
    },
  ];

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-60 backdrop-blur-sm z-50 flex justify-center items-center">
      <div className="bg-white rounded-xl shadow-2xl w-11/12 max-w-md overflow-hidden fade-in-up border border-emerald-100">
        <div className="bg-emerald-600 p-4 text-white flex justify-between items-center">
          <h3 className="font-bold text-lg"><i className="fa-solid fa-file-excel mr-2" /> Centro de Reportes Excel</h3>
          <button onClick={onClose} className="hover:text-emerald-200 transition"><i className="fa-solid fa-times text-xl" /></button>
        </div>
        <div className="p-6 space-y-3 max-h-[70vh] overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
          {reportes.map(r => (
            <React.Fragment key={r.tipo}>
              {r.separator && <div className="border-t border-gray-100 my-2 pt-2" />}
              <button
                onClick={() => { onReporte(r.tipo); onClose(); }}
                className={`w-full text-left p-4 border ${r.colorBorder} rounded-lg ${r.colorBg} ${r.colorHover} transition flex items-center gap-4 group shadow-sm`}>
                <div className={`${r.iconBg} p-3 rounded-full ${r.iconHoverBg} transition`}>
                  <i className={`fa-solid ${r.icon} text-lg w-5 text-center`} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{r.titulo}</h4>
                  <p className="text-xs text-gray-500">{r.desc}</p>
                </div>
              </button>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
