// src/components/modals/ReporteIAModal.jsx
import React, { useState, useEffect } from 'react';
import { formatter } from '../../utils/mockData';

export default function ReporteIAModal({ isOpen, onClose, documentosFiltrados, filtroCliente }) {
  const [contenido, setContenido] = useState(null);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setCargando(true);
    setContenido(null);

    const timer = setTimeout(() => {
      const activas = (documentosFiltrados || []).filter(d => !d.cancelada);
      const pendientes = activas.filter(d => !d.pagada);
      const canceladas = (documentosFiltrados || []).filter(d => d.cancelada);
      const sumatoria = activas.reduce((acc, el) => acc + (el.saldo || 0), 0);
      const clienteFiltro = filtroCliente || 'TODOS';

      setContenido({
        total: (documentosFiltrados || []).length,
        clienteFiltro,
        pagadas: activas.length - pendientes.length,
        pendientes: pendientes.length,
        canceladas: canceladas.length,
        sumatoria,
        alerta: pendientes.length > 5,
      });
      setCargando(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-60 backdrop-blur-sm z-50 flex justify-center items-center">
      <div className="bg-white rounded-xl shadow-2xl w-11/12 max-w-2xl overflow-hidden fade-in-up">
        <div className="bg-purple-600 p-4 text-white flex justify-between items-center">
          <h3 className="font-bold text-lg"><i className="fa-solid fa-file-invoice mr-2" /> Reporte Generativo OpenClaw</h3>
          <button onClick={onClose} className="hover:text-purple-200"><i className="fa-solid fa-times text-xl" /></button>
        </div>

        <div className="p-6">
          <div className="bg-slate-50 p-5 rounded-lg text-sm text-gray-800 h-72 overflow-y-auto border border-gray-200 font-mono leading-relaxed">
            {cargando && (
              <div className="flex items-center text-indigo-600">
                <div className="loader mr-3" style={{ width: 20, height: 20, borderWidth: 3 }} />
                Procesando con Gemini / OpenClaw...
              </div>
            )}

            {!cargando && contenido && (
              <div>
                <strong className="text-purple-700 text-base border-b border-purple-200 pb-1 block mb-3">
                  OpenClaw Insight Engine V2.0
                </strong>

                Analizando <strong>{contenido.total}</strong> documentos en pantalla
                (Filtro: {contenido.clienteFiltro}).<br /><br />

                <span className="text-green-700">● Facturas Totalmente Pagadas:</span> {contenido.pagadas}<br />
                <span className="text-amber-600">● Facturas Pendientes de Cobro:</span> {contenido.pendientes}<br />
                <span className="text-red-700">● Documentos Anulados/Cancelados:</span> {contenido.canceladas}<br /><br />

                {'> Exposición de cartera por cobrar: '}
                <strong className="text-lg bg-yellow-100 px-2 py-0.5 rounded text-yellow-800">
                  {formatter.format(contenido.sumatoria)} MXN
                </strong>
                <br /><br />

                <strong className="text-slate-800">Directriz Estratégica Sugerida:</strong><br />
                <em>
                  {contenido.alerta
                    ? "Alta fragmentación de deuda. Se recomienda utilizar el Chatbot IA para proyectar un calendario de cobros y usar el botón 'Cobrar ✨' en las facturas más antiguas."
                    : "Volumen manejable. Procede con seguimientos individuales. Las facturas pagadas y canceladas han sido aisladas de este cálculo exitosamente."}
                </em>
              </div>
            )}
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button onClick={onClose}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded shadow hover:bg-gray-300 transition">
              Cerrar
            </button>
            <button onClick={() => alert('Enviando reporte a Telegram...')}
              className="bg-purple-600 text-white px-4 py-2 rounded shadow hover:bg-purple-700 transition">
              <i className="fa-solid fa-paper-plane mr-1" /> Enviar a Telegram
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
