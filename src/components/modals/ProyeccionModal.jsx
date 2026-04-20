// src/components/modals/ProyeccionModal.jsx
import React from 'react';

export default function ProyeccionModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-60 backdrop-blur-sm z-50 flex justify-center items-center">
      <div className="bg-white rounded-xl shadow-2xl w-11/12 max-w-lg p-8 text-center fade-in-up border-t-4 border-emerald-600">
        <div className="mx-auto w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
          <i className="fa-solid fa-chart-line text-3xl" />
        </div>
        <h3 className="text-xl font-bold mb-2 text-gray-800">Proyección de Ingresos</h3>
        <p className="text-gray-600 mb-6 text-sm">
          Calculando probabilidad de pago basado en el histórico de comportamiento de los clientes,
          analizando días de retraso promedio.
        </p>
        <button onClick={onClose}
          className="bg-slate-800 text-white px-6 py-2 rounded-lg shadow hover:bg-slate-700 transition">
          Cerrar Herramienta
        </button>
      </div>
    </div>
  );
}
