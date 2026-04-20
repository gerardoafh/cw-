// src/components/Header.jsx
import React from 'react';

export default function Header({ empresa, onEmpresaChange, ultimaSync, progreso, onOpenIA, onOpenReportes, onOpenFacturas, onToggleChat }) {
  const timeStr = ultimaSync ? ultimaSync.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }) : '--:--';

  return (
    <header className="bg-slate-900 text-white shadow-md relative z-20">
      <div className="max-w-full px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <i className="fa-solid fa-bolt text-yellow-400 text-xl" />
          <h1 className="text-xl font-bold tracking-tight">
            OpenClaw <span className="text-indigo-400 font-light">CONTPAQi</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={onOpenIA} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition shadow flex items-center gap-2">
            <i className="fa-solid fa-robot" /> Menú IA
          </button>
          <button onClick={onOpenReportes} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition shadow flex items-center gap-2">
            <i className="fa-solid fa-folder-tree" /> Centro Reportes
          </button>
          <button onClick={onOpenFacturas} className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition shadow flex items-center gap-2">
            <i className="fa-solid fa-table-list" /> Facturas CW MX
          </button>
          <button onClick={onToggleChat} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition shadow flex items-center gap-2">
            <i className="fa-solid fa-comment-dots" /> Chatbot
          </button>
          <div className="text-right hidden sm:block ml-2">
            <p className="text-xs text-gray-400">Última Sincronización</p>
            <p className="text-sm font-semibold text-green-400">{timeStr}</p>
          </div>
          <div className="h-8 w-px bg-slate-700" />
          <select value={empresa} onChange={e => onEmpresaChange(e.target.value)}
            className="bg-slate-800 border border-slate-600 text-white text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2">
            <option value="adEMPRESANUEVACHEONG">adEMPRESANUEVACHEONG</option>
            <option value="adOtraEmpresa">adOtraEmpresa</option>
          </select>
        </div>
      </div>
      <div className="h-1 bg-slate-800 w-full">
        <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${progreso}%` }} />
      </div>
    </header>
  );
}
