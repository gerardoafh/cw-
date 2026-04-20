// src/App.jsx — Orquestador principal
import React, { useState, useRef } from 'react';
import { formatter } from './utils/mockData';
import { descargarControlAR, descargarReporteMenu } from './utils/reportes';
import { useFacturas } from './hooks/useFacturas';

// Componentes base
import Header        from './components/Header';
import KPICards      from './components/KPICards';
import FiltrosBar    from './components/FiltrosBar';
import FacturasTable from './components/FacturasTable';
import ChatBot       from './components/ChatBot';

// Modales IA
import AIMenuModal       from './components/modals/AIMenuModal';
import AuditoriaModal    from './components/modals/AuditoriaModal';
import ProyeccionModal   from './components/modals/ProyeccionModal';
import CambiarioModal    from './components/modals/CambiarioModal';
import ReporteIAModal    from './components/modals/ReporteIAModal';

// Modales Reportes
import ExcelReportesModal    from './components/modals/ExcelReportesModal';
import ExcelViewerModal      from './components/modals/ExcelViewerModal';
import FacturasEmpresaModal  from './components/modals/FacturasEmpresaModal';

export default function App() {
  const [empresa, setEmpresa]         = useState('adEMPRESANUEVACHEONG');
  const [chatOpen, setChatOpen]       = useState(false);

  // Estados de modales
  const [aiMenuOpen,      setAiMenuOpen]      = useState(false);
  const [auditoriaOpen,   setAuditoriaOpen]   = useState(false);
  const [proyeccionOpen,  setProyeccionOpen]  = useState(false);
  const [cambiarioOpen,   setCambiarioOpen]   = useState(false);
  const [reporteIAOpen,   setReporteIAOpen]   = useState(false);
  const [excelMenuOpen,       setExcelMenuOpen]       = useState(false);
  const [excelViewerOpen,     setExcelViewerOpen]     = useState(false);
  const [facturasEmpresaOpen, setFacturasEmpresaOpen] = useState(false);

  const chatRef = useRef(null);

  const {
    documentosGlobales,
    documentosFiltrados,
    loading, offline, clientes, kpis, ultimaSync, progreso,
    filtroCliente, setFiltroCliente,
    filtroEstado,  setFiltroEstado,
    cargarDatos,
  } = useFacturas(empresa);

  // ── Acción del menú IA ──────────────────────────────────────────
  function handleIASelect(action) {
    if (action === 'auditoria')  setAuditoriaOpen(true);
    if (action === 'proyeccion') setProyeccionOpen(true);
    if (action === 'cambiario')  setCambiarioOpen(true);
  }

  // ── Acción del Centro de Reportes ──────────────────────────────
  function handleReporte(tipo) {
    if (tipo === 'controlAR') {
      descargarControlAR(documentosGlobales);
    } else {
      descargarReporteMenu(tipo, documentosGlobales, documentosFiltrados);
    }
  }

  // ── Exportar pantalla (CSV) ────────────────────────────────────
  function exportarPantalla() {
    descargarReporteMenu('csv', documentosGlobales, documentosFiltrados);
  }

  // ── sugerirEstrategia → inyecta en el chat ─────────────────────
  function sugerirEstrategia(folio, cliente) {
    if (!chatOpen) setChatOpen(true);
    setTimeout(() => {
      chatRef.current?.enviarPrompt(
        `Haz un análisis rápido sobre el cliente ${cliente} y su factura ${folio}. ¿Qué estrategia de cobro o revisión sugieres?`
      );
    }, 200);
  }

  // ── generarMensajeCobranza ────────────────────────────────────
  function generarMensajeCobranza(folio, cliente, saldo) {
    if (window.confirm(`¿Deseas instruir al Agente OpenClaw (Telegram) para redactar y enviar una alerta de cobranza a ${cliente} por el folio ${folio}?`)) {
      alert(`Instrucción enviada exitosamente al backend Python. El Agente redactará el mensaje en Telegram por ${formatter.format(saldo)}.`);
    }
  }

  // KPIs enriquecidos para el chatbot
  const kpisChat = { ...kpis, saldoFormateado: formatter.format(kpis.saldo) };

  return (
    <div className="bg-gray-100 font-sans h-screen flex flex-col overflow-hidden">

      {/* ── HEADER ─────────────────────────────────────────────── */}
      <Header
        empresa={empresa}
        onEmpresaChange={setEmpresa}
        ultimaSync={ultimaSync}
        progreso={progreso}
        onOpenIA={() => setAiMenuOpen(true)}
        onOpenReportes={() => setExcelMenuOpen(true)}
        onOpenFacturas={() => setFacturasEmpresaOpen(true)}
        onToggleChat={() => setChatOpen(v => !v)}
      />

      {/* ── BANNER OFFLINE ─────────────────────────────────────── */}
      {offline && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2 flex items-center justify-center gap-2 text-yellow-800 text-sm z-10">
          <i className="fa-solid fa-triangle-exclamation" />
          <span><strong>Modo Offline Activo:</strong> La API de C# local no responde. Mostrando datos locales de caché para pruebas de IA.</span>
        </div>
      )}

      {/* ── MAIN ───────────────────────────────────────────────── */}
      <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 relative">

        <KPICards kpis={kpis} />

        <FiltrosBar
          clientes={clientes}
          filtroCliente={filtroCliente} onFiltroCliente={setFiltroCliente}
          filtroEstado={filtroEstado}   onFiltroEstado={setFiltroEstado}
          onReporteIA={() => setReporteIAOpen(true)}
          onExportarPantalla={exportarPantalla}
          onRefresh={cargarDatos}
        />

        <FacturasTable
          documentos={documentosFiltrados}
          loading={loading}
          onSugerirEstrategia={sugerirEstrategia}
          onCobrar={generarMensajeCobranza}
        />

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            <i className="fa-solid fa-shield-halved text-indigo-400 mr-1" />
            Agente Autónomo OpenClaw Activo y monitoreando.
          </p>
        </div>
      </main>

      {/* ── CHATBOT FLOTANTE ────────────────────────────────────── */}
      <ChatBot
        ref={chatRef}
        isOpen={chatOpen}
        onToggle={() => setChatOpen(v => !v)}
        kpis={kpisChat}
      />

      {/* ── MODALES IA ─────────────────────────────────────────── */}
      <AIMenuModal
        isOpen={aiMenuOpen}
        onClose={() => setAiMenuOpen(false)}
        onSelect={handleIASelect}
      />
      <AuditoriaModal
        isOpen={auditoriaOpen}
        onClose={() => setAuditoriaOpen(false)}
      />
      <ProyeccionModal
        isOpen={proyeccionOpen}
        onClose={() => setProyeccionOpen(false)}
      />
      <CambiarioModal
        isOpen={cambiarioOpen}
        onClose={() => setCambiarioOpen(false)}
      />
      <ReporteIAModal
        isOpen={reporteIAOpen}
        onClose={() => setReporteIAOpen(false)}
        documentosFiltrados={documentosFiltrados}
        filtroCliente={filtroCliente}
      />

      {/* ── MODALES REPORTES ────────────────────────────────────── */}
      <ExcelReportesModal
        isOpen={excelMenuOpen}
        onClose={() => setExcelMenuOpen(false)}
        onReporte={handleReporte}
      />
      <ExcelViewerModal
        isOpen={excelViewerOpen}
        onClose={() => setExcelViewerOpen(false)}
      />
      <FacturasEmpresaModal
        isOpen={facturasEmpresaOpen}
        onClose={() => setFacturasEmpresaOpen(false)}
        empresa={empresa}
      />

    </div>
  );
}
