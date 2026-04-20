// src/components/KPICards.jsx
import React from 'react';
import { formatter } from '../utils/mockData';

export default function KPICards({ kpis }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center gap-4 hover:shadow-md transition">
        <div className="bg-indigo-100 text-indigo-600 p-3 rounded-lg"><i className="fa-solid fa-file-invoice text-xl" /></div>
        <div>
          <p className="text-xs text-gray-500 font-medium uppercase">Total Documentos</p>
          <h3 className="text-2xl font-bold text-gray-800">{kpis.total}</h3>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center gap-4 hover:shadow-md transition border-l-4 border-l-green-500">
        <div className="bg-green-100 text-green-600 p-3 rounded-lg"><i className="fa-solid fa-money-bill-trend-up text-xl" /></div>
        <div>
          <p className="text-xs text-gray-500 font-medium uppercase">Saldo Activo (Por Cobrar)</p>
          <h3 className="text-2xl font-bold text-green-600">{formatter.format(kpis.saldo)}</h3>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center gap-4 hover:shadow-md transition border-l-4 border-l-red-500">
        <div className="bg-red-100 text-red-600 p-3 rounded-lg"><i className="fa-solid fa-ban text-xl" /></div>
        <div>
          <p className="text-xs text-gray-500 font-medium uppercase">Docs Cancelados</p>
          <h3 className="text-2xl font-bold text-red-600">{kpis.canceladas}</h3>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center gap-4 hover:shadow-md transition border-l-4 border-l-amber-500">
        <div className="bg-amber-100 text-amber-600 p-3 rounded-lg"><i className="fa-solid fa-clock text-xl" /></div>
        <div>
          <p className="text-xs text-gray-500 font-medium uppercase">Docs Pendientes</p>
          <h3 className="text-2xl font-bold text-amber-600">{kpis.pendientes}</h3>
        </div>
      </div>
    </div>
  );
}
