// src/hooks/useFacturas.js
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { MOCK_DOCUMENTOS, normalizarDocumentos } from '../utils/mockData';

const API_BASE_URL = 'http://localhost:5000/api/facturas';
const INTERVALO_REFRESH = 60000; // 60s igual que el original

export function useFacturas(empresa) {
  const [documentosGlobales, setDocumentosGlobales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(false);
  const [ultimaSync, setUltimaSync] = useState(null);
  const [progreso, setProgreso] = useState(100);

  const [filtroCliente, setFiltroCliente] = useState('TODOS');
  const [filtroEstado, setFiltroEstado] = useState('TODOS');
  const timerRef = useRef(null);
  const progresoRef = useRef(null);

  const cargarDatos = useCallback(async () => {
    setLoading(true);
    setProgreso(100);
    clearInterval(progresoRef.current);

    try {
      const url = `${API_BASE_URL}/${empresa}/descarga?limite=1500&formato=json`;
      const response = await fetch(url);
      if (!response.ok) throw new Error("API Offline");
      const json = await response.json();
      const rawDocs = json.documentos || [];
      setDocumentosGlobales(normalizarDocumentos(rawDocs));
      setOffline(false);
    } catch {
      setDocumentosGlobales(MOCK_DOCUMENTOS);
      setOffline(true);
    } finally {
      setLoading(false);
      setUltimaSync(new Date());
      iniciarProgreso();
    }
  }, [empresa]);

  function iniciarProgreso() {
    clearInterval(progresoRef.current);
    let t = INTERVALO_REFRESH;
    progresoRef.current = setInterval(() => {
      t -= 1000;
      setProgreso(Math.max(0, (t / INTERVALO_REFRESH) * 100));
      if (t <= 0) cargarDatos();
    }, 1000);
  }

  useEffect(() => {
    cargarDatos();
    return () => { clearInterval(timerRef.current); clearInterval(progresoRef.current); };
  }, [empresa]);

  const clientes = useMemo(() => {
    const set = new Set(documentosGlobales.map(d => d.cliente).filter(Boolean));
    return ['TODOS', ...Array.from(set).sort()];
  }, [documentosGlobales]);

  const documentosFiltrados = useMemo(() => {
    return documentosGlobales.filter(d => {
      const pasaCliente = filtroCliente === 'TODOS' || d.cliente === filtroCliente;
      let pasaEstado = true;
      if (filtroEstado === 'VIGENTES') pasaEstado = !d.cancelada;
      if (filtroEstado === 'CANCELADAS') pasaEstado = d.cancelada;
      if (filtroEstado === 'PENDIENTES') pasaEstado = !d.cancelada && !d.pagada;
      if (filtroEstado === 'PAGADAS') pasaEstado = !d.cancelada && d.pagada;
      return pasaCliente && pasaEstado;
    });
  }, [documentosGlobales, filtroCliente, filtroEstado]);

  const kpis = useMemo(() => {
    const activas = documentosGlobales.filter(d => !d.cancelada);
    const canceladas = documentosGlobales.filter(d => d.cancelada);
    const pendientes = activas.filter(d => !d.pagada);
    const saldoTotalActivo = activas.reduce((sum, d) => sum + (d.saldo || 0), 0);
    return {
      total: documentosGlobales.length,
      saldo: saldoTotalActivo,
      canceladas: canceladas.length,
      pendientes: pendientes.length,
    };
  }, [documentosGlobales]);

  return {
    documentosGlobales,
    documentosFiltrados,
    loading,
    offline,
    clientes,
    kpis,
    ultimaSync,
    progreso,
    filtroCliente, setFiltroCliente,
    filtroEstado, setFiltroEstado,
    cargarDatos,
  };
}
