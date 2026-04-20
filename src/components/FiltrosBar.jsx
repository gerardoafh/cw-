// src/components/FiltrosBar.jsx
import React from 'react';

export default function FiltrosBar({
  clientes, filtroCliente, onFiltroCliente,
  filtroEstado, onFiltroEstado,
  onReporteIA, onExportarPantalla, onRefresh
}) {
  return (
    <div className="bg-white p-4 rounded-t-xl shadow-sm border border-gray-200 border-b-0 flex flex-wrap gap-3 items-center justify-between">
      <div className="flex gap-2 flex-wrap items-center">
        {/* Filtro Cliente */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <i className="fa-solid fa-filter text-gray-400" />
          </div>
          <select value={filtroCliente} onChange={e => onFiltroCliente(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 pl-10 p-2">
            {clientes.map(c => (
              <option key={c} value={c}>{c === 'TODOS' ? 'Todos los Clientes' : c}</option>
            ))}
          </select>
        </div>

        {/* Filtro Estado — idéntico al original */}
        <select value={filtroEstado} onChange={e => onFiltroEstado(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 p-2 font-medium">
          <option value="TODOS">Todos los Estatus</option>
          <option value="VIGENTES">🟢 Todas las Vigentes</option>
          <option value="CANCELADAS">🔴 Solo Canceladas</option>
          <option value="PENDIENTES">⏳ Vigentes - Pendientes de Pago</option>
          <option value="PAGADAS">✅ Vigentes - Totalmente Pagadas</option>
        </select>
      </div>

      <div className="flex gap-2">
        {/* Reporte IA */}
        <button onClick={onReporteIA}
          className="bg-purple-50 border border-purple-200 text-purple-700 hover:bg-purple-100 px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm flex items-center gap-2">
          <i className="fa-solid fa-wand-magic-sparkles" /> Reporte IA
        </button>

        {/* Exportar Pantalla */}
        <button onClick={onExportarPantalla}
          className="bg-emerald-600 border border-emerald-700 text-white hover:bg-emerald-700 px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm flex items-center gap-2"
          title="Descargar CSV de la vista actual">
          <i className="fa-solid fa-download" /> Exportar Pantalla
        </button>

        {/* Refresh */}
        <button onClick={onRefresh}
          className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
          title="Refrescar Manualmente">
          <i className="fa-solid fa-rotate-right" />
        </button>
      </div>
    </div>
  );
}
