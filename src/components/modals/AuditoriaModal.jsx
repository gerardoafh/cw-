// src/components/modals/AuditoriaModal.jsx
import React from 'react';

export default function AuditoriaModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-60 backdrop-blur-sm z-50 flex justify-center items-center">
      <div className="bg-white rounded-xl shadow-2xl w-11/12 max-w-lg p-8 text-center fade-in-up border-t-4 border-indigo-600">
        <div className="mx-auto w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
          <i className="fa-solid fa-magnifying-glass-chart text-3xl" />
        </div>
        <h3 className="text-xl font-bold mb-2 text-gray-800">Auditoría en Progreso</h3>
        <p className="text-gray-600 mb-6 text-sm">
          El Agente OpenClaw está escaneando los UUIDs y cruzando la información con la base de datos SQL
          para encontrar discrepancias de cancelación o fechas de vencimiento anómalas.
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div className="bg-indigo-600 h-2 rounded-full w-2/3 animate-pulse" />
        </div>
        <button onClick={onClose}
          className="bg-slate-800 text-white px-6 py-2 rounded-lg shadow hover:bg-slate-700 transition">
          Cancelar Análisis
        </button>
      </div>
    </div>
  );
}
