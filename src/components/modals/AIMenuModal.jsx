// src/components/modals/AIMenuModal.jsx
import React from 'react';

export default function AIMenuModal({ isOpen, onClose, onSelect }) {
  if (!isOpen) return null;

  const opciones = [
    {
      action: 'auditoria',
      color: 'indigo',
      icon: 'fa-magnifying-glass-chart',
      titulo: 'Auditoría Inteligente',
      desc: 'Detectar anomalías en CFDI y riesgos.',
    },
    {
      action: 'proyeccion',
      color: 'emerald',
      icon: 'fa-chart-line',
      titulo: 'Proyección de Flujo',
      desc: 'Estimar ingresos a 30 y 60 días.',
    },
    {
      action: 'cambiario',
      color: 'amber',
      icon: 'fa-money-bill-transfer',
      titulo: 'Riesgo Cambiario',
      desc: 'Análisis de fluctuación MXN/USD/EUR.',
    },
  ];

  const colorMap = {
    indigo: { bg: 'bg-indigo-100', text: 'text-indigo-600', hover: 'hover:bg-indigo-50 hover:border-indigo-300', gBg: 'group-hover:bg-indigo-600', gText: 'group-hover:text-white' },
    emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600', hover: 'hover:bg-emerald-50 hover:border-emerald-300', gBg: 'group-hover:bg-emerald-600', gText: 'group-hover:text-white' },
    amber:   { bg: 'bg-amber-100',  text: 'text-amber-600',  hover: 'hover:bg-amber-50 hover:border-amber-300',   gBg: 'group-hover:bg-amber-600',  gText: 'group-hover:text-white' },
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-60 backdrop-blur-sm z-50 flex justify-center items-center">
      <div className="bg-white rounded-xl shadow-2xl w-11/12 max-w-md overflow-hidden fade-in-up border border-indigo-100">
        <div className="bg-indigo-600 p-4 text-white flex justify-between items-center">
          <h3 className="font-bold text-lg"><i className="fa-solid fa-brain mr-2" /> Centro de Comando IA</h3>
          <button onClick={onClose} className="hover:text-indigo-200 transition"><i className="fa-solid fa-times text-xl" /></button>
        </div>
        <div className="p-6 space-y-3">
          {opciones.map(op => {
            const c = colorMap[op.color];
            return (
              <button key={op.action}
                onClick={() => { onSelect(op.action); onClose(); }}
                className={`w-full text-left p-4 border border-gray-200 rounded-lg ${c.hover} transition flex items-center gap-4 group`}>
                <div className={`${c.bg} ${c.text} p-3 rounded-full ${c.gBg} ${c.gText} transition`}>
                  <i className={`fa-solid ${op.icon} text-lg w-5 text-center`} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{op.titulo}</h4>
                  <p className="text-xs text-gray-500">{op.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
