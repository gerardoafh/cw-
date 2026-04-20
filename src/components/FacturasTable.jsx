// src/components/FacturasTable.jsx
import React from 'react';
import { formatter } from '../utils/mockData';

export default function FacturasTable({ documentos, loading, onSugerirEstrategia, onCobrar }) {
  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-b-xl shadow-sm overflow-hidden relative">
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center z-10">
          <div className="loader mb-3" />
          <p className="text-gray-600 font-medium">Extrayendo datos vía SDK CONTPAQi...</p>
        </div>
        <div className="h-64" />
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-b-xl shadow-sm overflow-hidden relative">
      <div className="overflow-x-auto" style={{ height: '50vh', overflowY: 'auto' }}>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-slate-50 sticky top-0 z-0 shadow-sm border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Folio</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Cliente</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Concepto</th>
              <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Estatus / Pago</th>
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Saldo</th>
              <th className="px-6 py-3 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Herramientas IA</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {documentos.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-gray-500">
                  <i className="fa-solid fa-folder-open text-4xl mb-3 text-gray-300 block" />
                  No se encontraron facturas con esos criterios.
                </td>
              </tr>
            ) : (
              documentos.map((f, idx) => {
                // Badges idénticos al HTML original
                let badgeSecundario = null;
                if (!f.cancelada) {
                  badgeSecundario = f.pagada
                    ? <><br /><span className="inline-block mt-1 bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-200 shadow-sm"><i className="fa-solid fa-check-double mr-1" />PAGADA</span></>
                    : <><br /><span className="inline-block mt-1 bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold border border-amber-200 shadow-sm"><i className="fa-solid fa-clock mr-1" />PENDIENTE</span></>;
                }

                const badgeEstatus = f.cancelada
                  ? <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold border border-red-200 shadow-sm"><i className="fa-solid fa-ban mr-1" />CANCELADA</span>
                  : <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold border border-green-200 shadow-sm"><i className="fa-solid fa-check mr-1" />VIGENTE</span>;

                const claseFila = f.cancelada
                  ? "opacity-75 bg-red-50/50 hover:bg-red-50 transition"
                  : "bg-white hover:bg-gray-50 transition";

                let saldoClase = "text-blue-600 font-black";
                if (f.cancelada) saldoClase = "line-through text-gray-400";
                else if (f.pagada) saldoClase = "text-emerald-600 font-bold";

                return (
                  <tr key={idx} className={`border-b ${claseFila}`}>
                    <td className="px-6 py-3 text-sm whitespace-nowrap text-gray-600">
                      {f.fecha ? String(f.fecha).split(' ')[0] : ''}
                    </td>
                    <td className="px-6 py-3 text-sm font-bold text-gray-800">{f.folio}</td>
                    <td className="px-6 py-3 text-sm max-w-xs truncate font-medium text-gray-700" title={f.cliente}>{f.cliente}</td>
                    <td className="px-6 py-3 text-sm text-gray-500">{f.nombreConcepto}</td>
                    <td className="px-6 py-3 text-sm text-center leading-tight">
                      {badgeEstatus}
                      {badgeSecundario}
                    </td>
                    <td className={`px-6 py-3 text-right text-sm ${saldoClase}`}>
                      {formatter.format(f.saldo)} <span className="text-xs text-gray-400 ml-1 font-normal">{f.moneda || 'MXN'}</span>
                    </td>
                    <td className="px-6 py-3 text-center space-x-1 whitespace-nowrap">
                      {/* Botón Analizar — siempre visible */}
                      <button
                        onClick={() => onSugerirEstrategia(f.folio, f.cliente)}
                        className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:border-indigo-300 px-2.5 py-1.5 rounded-md text-xs transition border border-indigo-200"
                        title="Analizar con Chat IA">
                        <i className="fa-solid fa-robot" /> <span className="hidden xl:inline">Analizar</span>
                      </button>

                      {/* Botón Cobrar — solo si no está cancelada ni pagada */}
                      {!f.cancelada && !f.pagada && (
                        <button
                          onClick={() => onCobrar(f.folio, f.cliente, f.saldo)}
                          className="bg-fuchsia-50 text-fuchsia-600 hover:bg-fuchsia-100 hover:border-fuchsia-300 px-2.5 py-1.5 rounded-md text-xs transition border border-fuchsia-200">
                          <i className="fa-solid fa-paper-plane" /> <span className="hidden xl:inline">Cobrar ✨</span>
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
