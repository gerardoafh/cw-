// src/components/modals/FacturasEmpresaModal.jsx
// Descarga datos REALES desde la API CONTPAQi C#
// Mismo endpoint que el dashboard: http://localhost:5000/api/facturas/{empresa}/descarga
// Si la API no responde → muestra datos de caché del Excel subido

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { normalizarDocumentos } from '../../utils/mockData';

const API_BASE_URL = 'http://localhost:5000/api/facturas';

// ── Datos de caché offline (del Excel FACTURAS_2026) ─────────────────────────
const CACHE_OFFLINE = [
  { fecha:'1/13/2026', remision:'26-00081', folio:'15025', escaneado:'OK',  cliente:'WHIRLPOOL OVERSEAS MANUFACTURING, S.A.R.L', comentarios:'OK', firma:'OK', sello:'N/A', neto:2171.08, impuesto:0,       total:2171.08,   saldo:2171.08,   moneda:'Dólar Americano', tipoCambio:17.9842, cancelada:false, pagada:false, fechaVencimiento:'1/13/2026', uuid:'9485D25C-9AE3-4618-9894-57FD58C5F142', referencia:'21000379' },
  { fecha:'1/13/2026', remision:'26-00086', folio:'15032', escaneado:'OK',  cliente:'NIDEC GLOBAL APPLIANCE NORTH AMERICA, INC', comentarios:'CANCELADA POR CLIENTE', firma:'OK', sello:'N/A', neto:2148.69, impuesto:0, total:2148.69, saldo:0, moneda:'Dólar Americano', tipoCambio:17.9842, cancelada:true, pagada:false, fechaVencimiento:'1/13/2026', uuid:'68086ED0-995C-4025-B331-1B1D96305A89', referencia:'5100189717' },
  { fecha:'1/14/2026', remision:'N/A',      folio:'15033', escaneado:'N/A', cliente:'MEXIPC', comentarios:'N/A', firma:'N/A', sello:'N/A', neto:18600, impuesto:2976, total:21576, saldo:21576, moneda:'Peso Mexicano', tipoCambio:1, cancelada:false, pagada:false, fechaVencimiento:'1/14/2026', uuid:'DE45CA89-CAD8-46C8-8411-B4AAD894A6E7', referencia:'' },
  { fecha:'1/14/2026', remision:'26-00088', folio:'15034', escaneado:'OK',  cliente:'WHIRLPOOL OVERSEAS MANUFACTURING, S.A.R.L', comentarios:'OK', firma:'OK', sello:'N/A', neto:1959.43, impuesto:0, total:1959.43, saldo:1959.43, moneda:'Dólar Americano', tipoCambio:17.9074, cancelada:false, pagada:false, fechaVencimiento:'1/14/2026', uuid:'8C5D9610-8A19-4827-B083-44C6ED28FDA0', referencia:'21000379' },
  { fecha:'1/14/2026', remision:'26-00089', folio:'15035', escaneado:'OK',  cliente:'WHIRLPOOL OVERSEAS MANUFACTURING, S.A.R.L', comentarios:'CANCELADA POR CAMBIO DE PRECIO', firma:'OK', sello:'N/A', neto:1818.6, impuesto:0, total:1818.6, saldo:0, moneda:'Dólar Americano', tipoCambio:17.9074, cancelada:true, pagada:false, fechaVencimiento:'1/14/2026', uuid:'1E6B30D4-FE2F-4136-B605-91899A51C89F', referencia:'21000379' },
  { fecha:'1/15/2026', remision:'26-00104', folio:'15052', escaneado:'OK',  cliente:'IMPCO', comentarios:'OK', firma:'OK', sello:'OK', neto:1216.8, impuesto:194.69, total:1411.49, saldo:1411.49, moneda:'Dólar Americano', tipoCambio:17.854, cancelada:false, pagada:false, fechaVencimiento:'2/14/2026', uuid:'8272A28A-F01E-4492-B0E7-273434C9AC2F', referencia:'2410001991' },
  { fecha:'1/15/2026', remision:'N/A',      folio:'15055', escaneado:'N/A', cliente:'HANMAC MEXICO', comentarios:'N/A', firma:'N/A', sello:'N/A', neto:1140087.94, impuesto:182414.06, total:1322502, saldo:1322502, moneda:'Peso Mexicano', tipoCambio:1, cancelada:false, pagada:false, fechaVencimiento:'1/15/2026', uuid:'765026A3-65D1-45B0-AD1E-4079D8B55563', referencia:'' },
  { fecha:'1/16/2026', remision:'N/A',      folio:'15062', escaneado:'N/A', cliente:'LG ELECTRONICS USA, INC', comentarios:'N/A', firma:'N/A', sello:'N/A', neto:1181423.08, impuesto:0, total:1181423.08, saldo:1181423.08, moneda:'Dólar Americano', tipoCambio:17.8167, cancelada:false, pagada:false, fechaVencimiento:'1/16/2026', uuid:'D16FE1B8-7DB0-4307-A615-1B38C0315516', referencia:'' },
  { fecha:'1/20/2026', remision:'26-00129', folio:'15087', escaneado:'OK',  cliente:'WHIRLPOOL OVERSEAS MANUFACTURING, S.A.R.L', comentarios:'CANCELADA POR CAMBIO DE REQUERIMIENTO WHP', firma:'N/A', sello:'N/A', neto:4007.5, impuesto:0, total:4007.5, saldo:0, moneda:'Dólar Americano', tipoCambio:17.6867, cancelada:true, pagada:false, fechaVencimiento:'1/20/2026', uuid:'850AE560-C41B-45FF-B319-8142E5490894', referencia:'21000379/1040' },
  { fecha:'2/02/2026', remision:'26-00158', folio:'15120', escaneado:'OK',  cliente:'WHIRLPOOL OVERSEAS MANUFACTURING, S.A.R.L', comentarios:'OK', firma:'OK', sello:'N/A', neto:3218.5, impuesto:0, total:3218.5, saldo:3218.5, moneda:'Dólar Americano', tipoCambio:20.5312, cancelada:false, pagada:false, fechaVencimiento:'2/02/2026', uuid:'A1B2C3D4-0001-4001-8001-000000000001', referencia:'21000379' },
  { fecha:'2/05/2026', remision:'N/A',      folio:'15133', escaneado:'N/A', cliente:'HANMAC MEXICO', comentarios:'N/A', firma:'N/A', sello:'N/A', neto:638000, impuesto:0, total:638000, saldo:638000, moneda:'Peso Mexicano', tipoCambio:1, cancelada:false, pagada:false, fechaVencimiento:'2/05/2026', uuid:'A1B2C3D4-0001-4001-8001-000000000006', referencia:'' },
  { fecha:'2/12/2026', remision:'N/A',      folio:'15152', escaneado:'N/A', cliente:'LG ELECTRONICS USA, INC', comentarios:'N/A', firma:'N/A', sello:'N/A', neto:285585.82, impuesto:0, total:285585.82, saldo:285585.82, moneda:'Dólar Americano', tipoCambio:20.31, cancelada:false, pagada:false, fechaVencimiento:'2/12/2026', uuid:'A1B2C3D4-0001-4001-8001-000000000009', referencia:'' },
  { fecha:'3/02/2026', remision:'26-00255', folio:'15230', escaneado:'OK',  cliente:'WHIRLPOOL OVERSEAS MANUFACTURING, S.A.R.L', comentarios:'OK', firma:'OK', sello:'N/A', neto:2916.25, impuesto:0, total:2916.25, saldo:2916.25, moneda:'Dólar Americano', tipoCambio:20.8712, cancelada:false, pagada:false, fechaVencimiento:'3/02/2026', uuid:'B1C2D3E4-0002-4002-8002-000000000001', referencia:'21000379' },
  { fecha:'3/14/2026', remision:'N/A',      folio:'15270', escaneado:'N/A', cliente:'LG ELECTRONICS USA, INC', comentarios:'N/A', firma:'N/A', sello:'N/A', neto:403069.55, impuesto:0, total:403069.55, saldo:403069.55, moneda:'Dólar Americano', tipoCambio:20.72, cancelada:false, pagada:false, fechaVencimiento:'3/14/2026', uuid:'B1C2D3E4-0002-4002-8002-000000000010', referencia:'' },
];

// ── Formateadores ─────────────────────────────────────────────────────────────
const fmtMXN = new Intl.NumberFormat('es-MX', { style:'currency', currency:'MXN', minimumFractionDigits:2 });
const fmtUSD = new Intl.NumberFormat('en-US', { style:'currency', currency:'USD', minimumFractionDigits:2 });

function fmtMonto(val, moneda) {
  const n = parseFloat(val) || 0;
  return (moneda?.includes('Dólar') || moneda === 'USD') ? fmtUSD.format(n) : fmtMXN.format(n);
}

function getMes(fechaStr) {
  if (!fechaStr) return 0;
  const s = String(fechaStr);
  // Formato MM/DD/YYYY
  if (s.includes('/')) { const p = s.split('/'); return parseInt(p[0]); }
  // Formato YYYY-MM-DD
  if (s.includes('-')) { const p = s.split('-'); return parseInt(p[1]); }
  // Número serial Excel (días desde 1900-01-01)
  if (/^\d+$/.test(s)) {
    const d = new Date((parseInt(s) - 25569) * 86400000);
    return d.getMonth() + 1;
  }
  return new Date(s).getMonth() + 1;
}

// Normaliza un documento crudo de la API para que tenga los campos esperados
function normalizarDoc(d) {
  let isCanc = false;
  let isPagada = false;
  const keysCanc = ['cancelada','Cancelada','ccancelado','CCANCELADO','Cancelado'];
  keysCanc.forEach(k => {
    if (d[k] !== undefined) {
      const v = String(d[k]).toLowerCase().trim();
      if (v === '1' || v === '1.000000' || v === 'true' || v === 'cancelado') isCanc = true;
    }
  });
  const keysEst = ['estado','estatus','cEstatus','Estatus','cstatus','CSTATUS'];
  keysEst.forEach(k => {
    if (d[k] !== undefined) {
      const v = String(d[k]).toLowerCase().trim();
      if (v === '3' || v.includes('cancelad')) isCanc = true;
    }
  });
  if (parseFloat(d.saldo ?? d.Pendiente ?? d.pendiente) <= 0) isPagada = true;
  if (isCanc) isPagada = false;

  return {
    ...d,
    fecha:           d.fecha || d.Fecha || '',
    folio:           d.folio || d.Folio || '',
    remision:        d.remision || d.REMISION || d.Remision || 'N/A',
    escaneado:       d.escaneado || d.Escaneado || 'N/A',
    cliente:         d.cliente || d['Razón Social'] || d.razonSocial || '',
    comentarios:     d.comentarios || d.COMENTARIOS || '',
    firma:           d.firma || d.FIRMA || 'N/A',
    sello:           d.sello || d.SELLO || 'N/A',
    neto:            parseFloat(d.neto || d.Neto || 0),
    impuesto:        parseFloat(d.impuesto || d['Impuesto 1'] || 0),
    total:           parseFloat(d.total || d.Total || 0),
    saldo:           parseFloat(d.saldo || d.Pendiente || d.pendiente || 0),
    moneda:          d.moneda || d['Nombre de la Moneda'] || 'MXN',
    tipoCambio:      parseFloat(d.tipoCambio || d['Tipo de Cambio'] || 1),
    cancelada:       isCanc,
    pagada:          isPagada,
    fechaVencimiento:d.fechaVencimiento || d['Fecha de Vencimiento'] || '',
    uuid:            d.uuid || d.UUID || '',
    referencia:      d.referencia || d.Referencia || '',
    mes:             getMes(d.fecha || d.Fecha || ''),
  };
}

// ── Sub-componentes ──────────────────────────────────────────────────────────
function KPICard({ icon, label, value, sub, colorText, colorBorder, colorBg }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-200 border-l-4 ${colorBorder} p-3 flex items-center gap-3 hover:shadow-md transition`}>
      <div className={`${colorBg} ${colorText} p-2.5 rounded-lg text-lg flex-shrink-0`}>{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 font-medium uppercase truncate">{label}</p>
        <h3 className={`text-lg font-bold ${colorText} truncate`}>{value}</h3>
        {sub && <p className="text-xs text-gray-400">{sub}</p>}
      </div>
    </div>
  );
}

function EstadoBadge({ doc }) {
  if (doc.cancelada) return <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-[10px] font-bold border border-red-200 whitespace-nowrap">❌ CANCELADA</span>;
  if (doc.pagada)    return <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold border border-green-200 whitespace-nowrap">✅ PAGADA</span>;
  return               <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold border border-amber-200 whitespace-nowrap">⏳ PENDIENTE</span>;
}

// ── Componente principal ─────────────────────────────────────────────────────
export default function FacturasEmpresaModal({ isOpen, onClose, empresa = 'adEMPRESANUEVACHEONG' }) {
  const [docs, setDocs]           = useState([]);
  const [loading, setLoading]     = useState(false);
  const [offline, setOffline]     = useState(false);
  const [ultimaSync, setUltimaSync] = useState(null);

  // Filtros
  const [tabMes, setTabMes]               = useState('TODOS');
  const [filtroCliente, setFiltroCliente] = useState('TODOS');
  const [filtroMoneda, setFiltroMoneda]   = useState('TODAS');
  const [filtroEstado, setFiltroEstado]   = useState('TODOS');
  const [busqueda, setBusqueda]           = useState('');
  const [sortCol, setSortCol]             = useState('fecha');
  const [sortAsc, setSortAsc]             = useState(false);

  // ── Carga de datos ──────────────────────────────────────────────────────────
  const cargarDatos = useCallback(async () => {
    setLoading(true);
    try {
      const url = `${API_BASE_URL}/${empresa}/descarga?limite=2000&formato=json`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('API offline');
      const json = await res.json();
      const rawDocs = json.documentos || json.data || json || [];
      const normalized = Array.isArray(rawDocs) ? rawDocs.map(normalizarDoc) : [];
      setDocs(normalized);
      setOffline(false);
    } catch {
      // Fallback: datos del Excel cacheado
      setDocs(CACHE_OFFLINE);
      setOffline(true);
    } finally {
      setLoading(false);
      setUltimaSync(new Date());
    }
  }, [empresa]);

  useEffect(() => {
    if (isOpen) cargarDatos();
  }, [isOpen, empresa]);

  // ── Clientes únicos para el filtro ─────────────────────────────────────────
  const clientes = useMemo(() => {
    const set = new Set(docs.map(d => d.cliente).filter(Boolean));
    return ['TODOS', ...Array.from(set).sort()];
  }, [docs]);

  // ── Meses disponibles ──────────────────────────────────────────────────────
  const meses = useMemo(() => {
    const set = new Set(docs.map(d => d.mes).filter(Boolean));
    return Array.from(set).sort((a, b) => a - b);
  }, [docs]);

  const NOMBRE_MES = {1:'Enero',2:'Febrero',3:'Marzo',4:'Abril',5:'Mayo',6:'Junio',7:'Julio',8:'Agosto',9:'Septiembre',10:'Octubre',11:'Noviembre',12:'Diciembre'};

  // ── Filtrado y ordenamiento ────────────────────────────────────────────────
  const docsFiltrados = useMemo(() => {
    let f = docs;
    if (tabMes !== 'TODOS')           f = f.filter(d => d.mes === Number(tabMes));
    if (filtroCliente !== 'TODOS')    f = f.filter(d => d.cliente === filtroCliente);
    if (filtroMoneda === 'USD')        f = f.filter(d => d.moneda?.includes('Dólar') || d.moneda === 'USD');
    if (filtroMoneda === 'MXN')        f = f.filter(d => !d.moneda?.includes('Dólar') && d.moneda !== 'USD');
    if (filtroEstado === 'VIGENTES')   f = f.filter(d => !d.cancelada);
    if (filtroEstado === 'CANCELADAS') f = f.filter(d => d.cancelada);
    if (filtroEstado === 'PENDIENTES') f = f.filter(d => !d.cancelada && !d.pagada);
    if (filtroEstado === 'PAGADAS')    f = f.filter(d => !d.cancelada && d.pagada);
    if (busqueda) {
      const q = busqueda.toLowerCase();
      f = f.filter(d =>
        String(d.folio).toLowerCase().includes(q) ||
        String(d.cliente).toLowerCase().includes(q) ||
        String(d.uuid).toLowerCase().includes(q) ||
        String(d.remision).toLowerCase().includes(q) ||
        String(d.comentarios).toLowerCase().includes(q)
      );
    }
    return [...f].sort((a, b) => {
      let va = a[sortCol] ?? '', vb = b[sortCol] ?? '';
      if (typeof va === 'string') { va = va.toLowerCase(); vb = vb.toLowerCase(); }
      return sortAsc ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
    });
  }, [docs, tabMes, filtroCliente, filtroMoneda, filtroEstado, busqueda, sortCol, sortAsc]);

  // ── KPIs ───────────────────────────────────────────────────────────────────
  const kpis = useMemo(() => {
    const activas = docsFiltrados.filter(d => !d.cancelada);
    return {
      total:      docsFiltrados.length,
      activas:    activas.length,
      canceladas: docsFiltrados.filter(d => d.cancelada).length,
      usd:        activas.filter(d => d.moneda?.includes('Dólar')).reduce((s, d) => s + (d.saldo || 0), 0),
      mxn:        activas.filter(d => !d.moneda?.includes('Dólar')).reduce((s, d) => s + (d.saldo || 0), 0),
    };
  }, [docsFiltrados]);

  // ── Exportar Excel ────────────────────────────────────────────────────────
  function exportarExcel() {
    const rows = docsFiltrados.map(d => ({
      'Fecha':             d.fecha,
      'Remisión':          d.remision,
      'Folio':             d.folio,
      'Escaneado':         d.escaneado,
      'Cliente':           d.cliente,
      'Comentarios':       d.comentarios,
      'Firma':             d.firma,
      'Sello':             d.sello,
      'Neto':              d.neto,
      'Impuesto':          d.impuesto,
      'Total':             d.total,
      'Saldo Pendiente':   d.saldo,
      'Moneda':            d.moneda,
      'Tipo de Cambio':    d.tipoCambio,
      'Cancelado':         d.cancelada ? 'Sí' : 'No',
      'Fecha Vencimiento': d.fechaVencimiento,
      'UUID':              d.uuid,
      'Referencia':        d.referencia,
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    const mesLabel = tabMes === 'TODOS' ? 'TODAS' : (NOMBRE_MES[tabMes] || tabMes);
    XLSX.utils.book_append_sheet(wb, ws, `FACTURAS ${mesLabel}`);
    XLSX.writeFile(wb, `Facturas_${empresa}_${mesLabel}_${new Date().toISOString().split('T')[0]}.xlsx`);
  }

  function handleSort(col) {
    if (sortCol === col) setSortAsc(v => !v);
    else { setSortCol(col); setSortAsc(true); }
  }

  const SortBtn = ({ col }) => <span className="ml-1 opacity-60">{sortCol === col ? (sortAsc ? '↑' : '↓') : '⇅'}</span>;

  const timeStr = ultimaSync?.toLocaleTimeString('es-MX', { hour:'2-digit', minute:'2-digit' }) ?? '--:--';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[96vw] max-h-[96vh] flex flex-col overflow-hidden">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-slate-800 to-cyan-800 text-white px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📋</span>
            <div>
              <h2 className="text-lg font-bold">Facturas {empresa}</h2>
              <p className="text-cyan-300 text-xs flex items-center gap-2">
                {loading
                  ? <><span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse inline-block" /> Cargando desde CONTPAQi API...</>
                  : offline
                    ? <><span className="w-2 h-2 bg-orange-400 rounded-full inline-block" /> Modo offline — datos de caché</>
                    : <><span className="w-2 h-2 bg-green-400 rounded-full inline-block" /> Conectado · Sync {timeStr} · {docs.length} registros</>
                }
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={cargarDatos} disabled={loading}
              className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1 disabled:opacity-50">
              <i className={`fa-solid fa-rotate-right ${loading ? 'animate-spin' : ''}`} /> Actualizar
            </button>
            <button onClick={exportarExcel}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1">
              <i className="fa-solid fa-file-excel" /> Exportar Excel
            </button>
            <button onClick={onClose}
              className="bg-white/20 hover:bg-white/30 text-white w-8 h-8 rounded-lg flex items-center justify-center text-lg transition">✕</button>
          </div>
        </div>

        {/* ── Banner offline ──────────────────────────────────────────────── */}
        {offline && (
          <div className="bg-orange-50 border-b border-orange-200 px-4 py-2 flex items-center gap-2 text-orange-800 text-xs flex-shrink-0">
            <i className="fa-solid fa-triangle-exclamation" />
            <span><strong>Modo Offline:</strong> No se pudo conectar a <code>http://localhost:5000</code>. Mostrando datos del Excel cacheado. Verifica que tu API C# esté corriendo.</span>
          </div>
        )}

        {/* ── KPIs ────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 px-4 py-3 bg-gray-50 border-b border-gray-200 flex-shrink-0">
          <KPICard icon="🧾" label="Total Registros"  value={kpis.total}               colorText="text-indigo-600" colorBorder="border-l-indigo-500" colorBg="bg-indigo-100" />
          <KPICard icon="✅" label="Facturas Activas"  value={kpis.activas}             colorText="text-green-600"  colorBorder="border-l-green-500"  colorBg="bg-green-100" />
          <KPICard icon="❌" label="Canceladas"         value={kpis.canceladas}          colorText="text-red-600"    colorBorder="border-l-red-500"    colorBg="bg-red-100" />
          <KPICard icon="💵" label="Pendiente USD"      value={fmtUSD.format(kpis.usd)}  colorText="text-blue-600"   colorBorder="border-l-blue-500"   colorBg="bg-blue-100"   sub="Dólar Americano" />
          <KPICard icon="💴" label="Pendiente MXN"      value={fmtMXN.format(kpis.mxn)}  colorText="text-amber-600"  colorBorder="border-l-amber-500"  colorBg="bg-amber-100"  sub="Peso Mexicano" />
        </div>

        {/* ── Tabs de mes ─────────────────────────────────────────────────── */}
        <div className="flex border-b border-gray-200 flex-shrink-0 bg-white overflow-x-auto">
          {/* Tab Todos */}
          <button onClick={() => setTabMes('TODOS')}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition whitespace-nowrap flex-shrink-0 ${tabMes === 'TODOS' ? 'border-cyan-500 text-cyan-700 bg-cyan-50' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
            📋 Todos
          </button>
          {meses.map(m => (
            <button key={m} onClick={() => setTabMes(String(m))}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition whitespace-nowrap flex-shrink-0 ${tabMes === String(m) ? 'border-cyan-500 text-cyan-700 bg-cyan-50' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              📅 {NOMBRE_MES[m] || `Mes ${m}`}
            </button>
          ))}

          {/* Filtros inline */}
          <div className="ml-auto flex items-center gap-2 px-3 py-1 flex-shrink-0">
            <input value={busqueda} onChange={e => setBusqueda(e.target.value)}
              placeholder="🔍 Folio, cliente, UUID..."
              className="border border-gray-300 text-xs rounded-lg px-3 py-1.5 w-48 focus:ring-cyan-500 focus:border-cyan-500 outline-none" />

            <select value={filtroCliente} onChange={e => setFiltroCliente(e.target.value)}
              className="border border-gray-300 text-xs rounded-lg px-2 py-1.5 max-w-[200px]">
              {clientes.map(c => (
                <option key={c} value={c}>{c === 'TODOS' ? 'Todos los clientes' : (c.length > 32 ? c.substring(0, 30) + '…' : c)}</option>
              ))}
            </select>

            <select value={filtroMoneda} onChange={e => setFiltroMoneda(e.target.value)}
              className="border border-gray-300 text-xs rounded-lg px-2 py-1.5">
              <option value="TODAS">💱 Todas las monedas</option>
              <option value="USD">💵 USD</option>
              <option value="MXN">💴 MXN</option>
            </select>

            <select value={filtroEstado} onChange={e => setFiltroEstado(e.target.value)}
              className="border border-gray-300 text-xs rounded-lg px-2 py-1.5">
              <option value="TODOS">Todos los estatus</option>
              <option value="VIGENTES">🟢 Vigentes</option>
              <option value="PENDIENTES">⏳ Pendientes</option>
              <option value="PAGADAS">✅ Pagadas</option>
              <option value="CANCELADAS">❌ Canceladas</option>
            </select>
          </div>
        </div>

        {/* ── Tabla ──────────────────────────────────────────────────────── */}
        <div className="flex-1 overflow-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-cyan-600">
              <div className="loader" />
              <p className="text-sm font-medium">Extrayendo datos de CONTPAQi...</p>
              <p className="text-xs text-gray-400">Conectando a {API_BASE_URL}/{empresa}/descarga</p>
            </div>
          ) : (
            <table className="min-w-full text-xs border-collapse">
              <thead className="bg-slate-800 text-white sticky top-0 z-10">
                <tr>
                  {[
                    ['fecha',           'Fecha'],
                    ['remision',        'Remisión'],
                    ['folio',           'Folio'],
                    [null,              'Escaneado'],
                    ['cliente',         'Razón Social'],
                    ['comentarios',     'Comentarios'],
                    ['neto',            'Neto'],
                    ['impuesto',        'IVA'],
                    ['total',           'Total'],
                    ['saldo',           'Saldo Pend.'],
                    ['moneda',          'Moneda'],
                    ['tipoCambio',      'T.C.'],
                    [null,              'Estado'],
                    ['fechaVencimiento','Vencimiento'],
                    [null,              'UUID'],
                    ['referencia',      'Referencia'],
                  ].map(([col, label]) => (
                    <th key={label}
                      onClick={() => col && handleSort(col)}
                      className={`px-3 py-2.5 text-left font-semibold uppercase tracking-wider whitespace-nowrap select-none ${col ? 'cursor-pointer hover:bg-slate-700' : ''}`}>
                      {label}{col && <SortBtn col={col} />}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {docsFiltrados.length === 0 ? (
                  <tr><td colSpan={16} className="text-center py-16 text-gray-400">
                    <p className="text-4xl mb-3">📭</p>
                    <p className="font-medium">No se encontraron registros</p>
                    <p className="text-xs mt-1">Intenta cambiar los filtros o actualizar los datos</p>
                  </td></tr>
                ) : (
                  docsFiltrados.map((d, i) => {
                    const isCanc = d.cancelada;
                    const rowCls = isCanc
                      ? 'bg-red-50/60 opacity-75 hover:bg-red-50'
                      : i % 2 === 0 ? 'bg-white hover:bg-cyan-50/20' : 'bg-gray-50/40 hover:bg-cyan-50/20';

                    return (
                      <tr key={`${d.folio}-${i}`} className={`border-b border-gray-100 transition ${rowCls}`}>
                        <td className="px-3 py-2 whitespace-nowrap text-gray-500">{String(d.fecha).split(' ')[0]}</td>
                        <td className="px-3 py-2 whitespace-nowrap font-mono text-gray-600">{d.remision || '—'}</td>
                        <td className="px-3 py-2 whitespace-nowrap font-bold text-cyan-700">{d.folio}</td>
                        <td className="px-3 py-2 text-center">
                          {d.escaneado === 'OK'
                            ? <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded text-[10px] font-bold">✅ OK</span>
                            : d.escaneado === 'N/A'
                              ? <span className="text-gray-300 text-[10px]">N/A</span>
                              : <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded text-[10px] font-bold">{d.escaneado}</span>
                          }
                        </td>
                        <td className="px-3 py-2 max-w-[220px] truncate font-medium text-gray-800" title={d.cliente}>{d.cliente}</td>
                        <td className="px-3 py-2 max-w-[200px] truncate text-gray-500 italic" title={d.comentarios}>
                          {d.comentarios && d.comentarios !== 'N/A' ? d.comentarios : ''}
                        </td>
                        <td className="px-3 py-2 text-right text-gray-700 font-medium">{fmtMonto(d.neto, d.moneda)}</td>
                        <td className="px-3 py-2 text-right text-gray-400">{d.impuesto > 0 ? fmtMonto(d.impuesto, d.moneda) : '—'}</td>
                        <td className="px-3 py-2 text-right font-bold text-gray-800">{fmtMonto(d.total, d.moneda)}</td>
                        <td className={`px-3 py-2 text-right font-bold whitespace-nowrap ${isCanc ? 'line-through text-gray-400' : d.saldo > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {fmtMonto(d.saldo, d.moneda)}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${d.moneda?.includes('Dólar') ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                            {d.moneda?.includes('Dólar') ? '$ USD' : '$ MXN'}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-right text-gray-400 whitespace-nowrap">
                          {d.tipoCambio === 1 || d.tipoCambio === '1' ? '1.00' : parseFloat(d.tipoCambio).toFixed(4)}
                        </td>
                        <td className="px-3 py-2"><EstadoBadge doc={d} /></td>
                        <td className="px-3 py-2 whitespace-nowrap text-gray-400">
                          {String(d.fechaVencimiento).split(' ')[0] || '—'}
                        </td>
                        <td className="px-3 py-2 font-mono text-gray-300 text-[10px] whitespace-nowrap" title={d.uuid}>
                          {d.uuid ? d.uuid.substring(0, 16) + '…' : '—'}
                        </td>
                        <td className="px-3 py-2 text-gray-500 whitespace-nowrap">{d.referencia || '—'}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* ── Footer ─────────────────────────────────────────────────────── */}
        {!loading && (
          <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-t border-gray-200 flex-shrink-0 text-xs text-gray-500">
            <span>
              Mostrando <strong className="text-gray-700">{docsFiltrados.length}</strong> de <strong className="text-gray-700">{docs.length}</strong> registros
            </span>
            <span className="flex items-center gap-2">
              <span className="bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold">❌ {kpis.canceladas} canceladas</span>
              <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold">✅ {kpis.activas} activas</span>
              <span className="text-gray-300">·</span>
              <span>Clic en encabezados para ordenar</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
