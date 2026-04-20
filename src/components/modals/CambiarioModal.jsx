// src/components/modals/CambiarioModal.jsx
import React from 'react';

export default function CambiarioModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-60 backdrop-blur-sm z-50 flex justify-center items-center">
      <div className="bg-white rounded-xl shadow-2xl w-11/12 max-w-lg p-8 text-center fade-in-up border-t-4 border-amber-500">
        <div className="mx-auto w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4">
          <i className="fa-solid fa-money-bill-transfer text-3xl" />
        </div>
        <h3 className="text-xl font-bold mb-2 text-gray-800">Análisis de Divisas</h3>
        <p className="text-gray-600 mb-6 text-sm">
          Evaluando el impacto del tipo de cambio actual vs. el tipo de cambio de la fecha de
          facturación en la cartera vencida en USD y EUR.
        </p>
        <button onClick={onClose}
          className="bg-slate-800 text-white px-6 py-2 rounded-lg shadow hover:bg-slate-700 transition">
          Cerrar Herramienta
        </button>
      </div>
    </div>
  );
}
