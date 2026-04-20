// src/components/modals/ExcelViewerModal.jsx
// Módulo nuevo: Visor drag-and-drop de archivos Excel externos
import React, { useState, useCallback, useRef } from 'react';
import * as XLSX from 'xlsx';

function SheetTab({ name, active, onClick }) {
  return (
    <button onClick={onClick}
      className={`px-4 py-2 text-sm font-medium border-b-2 transition whitespace-nowrap ${
        active ? 'border-emerald-500 text-emerald-700 bg-emerald-50' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      }`}>
      📋 {name}
    </button>
  );
}

function CeldaValor({ valor }) {
  const num = parseFloat(valor);
  const esNumero = !isNaN(num) && valor !== '' && valor !== null && valor !== undefined;
  const esNegativo = esNumero && num < 0;
  return (
    <td className={`border border-gray-200 px-3 py-1.5 text-xs whitespace-nowrap max-w-xs overflow-hidden text-ellipsis ${
      esNumero ? (esNegativo ? 'text-right text-red-600 font-medium' : 'text-right text-gray-800') : 'text-left text-gray-700'
    }`}>
      {valor === null || valor === undefined || valor === '' ? <span className="text-gray-300">—</span> : String(valor)}
    </td>
  );
}

export default function ExcelViewerModal({ isOpen, onClose }) {
  const [workbook, setWorkbook] = useState(null);
  const [sheets, setSheets] = useState([]);
  const [activeSheet, setActiveSheet] = useState('');
  const [sheetData, setSheetData] = useState([]);
  const [filename, setFilename] = useState('');
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const fileInputRef = useRef(null);

  const procesarArchivo = useCallback((file) => {
    if (!file) return;
    if (!file.name.match(/\.(xlsx|xls|csv)$/i)) { alert('Sube un archivo .xlsx, .xls o .csv'); return; }
    setLoading(true);
    setFilename(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const wb = XLSX.read(data, { type: 'array', cellDates: true });
        setWorkbook(wb);
        setSheets(wb.SheetNames);
        const first = wb.SheetNames[0];
        setActiveSheet(first);
        const json = XLSX.utils.sheet_to_json(wb.Sheets[first], { header: 1, defval: '' });
        setSheetData(json);
        setBusqueda('');
      } catch (err) { alert('Error al leer el archivo: ' + err.message); }
      finally { setLoading(false); }
    };
    reader.readAsArrayBuffer(file);
  }, []);

  const cambiarHoja = (nombre) => {
    setActiveSheet(nombre);
    const json = XLSX.utils.sheet_to_json(workbook.Sheets[nombre], { header: 1, defval: '' });
    setSheetData(json);
    setBusqueda('');
  };

  const filasFiltradas = React.useMemo(() => {
    if (!busqueda || sheetData.length === 0) return sheetData;
    const [header, ...rows] = sheetData;
    return [header, ...rows.filter(row => row.some(c => String(c).toLowerCase().includes(busqueda.toLowerCase())))];
  }, [sheetData, busqueda]);

  const headers = filasFiltradas[0] || [];
  const rows = filasFiltradas.slice(1);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-7xl max-h-[92vh] flex flex-col overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-700 to-teal-600 text-white px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📊</span>
            <div>
              <h2 className="text-lg font-bold">Visor de Archivos Excel</h2>
              {filename && <p className="text-emerald-200 text-xs">{filename}</p>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {workbook && (
              <button onClick={() => { const ws = workbook.Sheets[activeSheet]; const csv = XLSX.utils.sheet_to_csv(ws); const b = new Blob([csv], { type: 'text/csv' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = `${activeSheet}.csv`; a.click(); }}
                className="bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition">
                💾 Exportar CSV
              </button>
            )}
            <button onClick={onClose} className="bg-white/20 hover:bg-white/30 text-white w-8 h-8 rounded-lg flex items-center justify-center text-lg transition">✕</button>
          </div>
        </div>

        {!workbook && !loading && (
          <div className="flex-1 flex items-center justify-center p-8">
            <div onDrop={(e) => { e.preventDefault(); setDragOver(false); procesarArchivo(e.dataTransfer.files[0]); }}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onClick={() => fileInputRef.current?.click()}
              className={`w-full max-w-md border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition ${dragOver ? 'border-emerald-500 bg-emerald-50' : 'border-gray-300 hover:border-emerald-400 hover:bg-gray-50'}`}>
              <div className="text-5xl mb-4">📂</div>
              <p className="text-gray-700 font-semibold text-lg mb-2">Arrastra tu archivo Excel aquí</p>
              <p className="text-gray-400 text-sm mb-4">o haz clic para seleccionarlo</p>
              <span className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium">Seleccionar archivo</span>
              <p className="text-gray-300 text-xs mt-4">Soporta .xlsx, .xls, .csv</p>
              <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" onChange={e => procesarArchivo(e.target.files[0])} className="hidden" />
            </div>
          </div>
        )}

        {loading && (
          <div className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-emerald-600">
              <div className="loader" />
              <p className="text-sm font-medium">Procesando archivo...</p>
            </div>
          </div>
        )}

        {workbook && !loading && (
          <>
            <div className="flex border-b border-gray-200 overflow-x-auto flex-shrink-0 bg-gray-50 px-4">
              {sheets.map(s => <SheetTab key={s} name={s} active={s === activeSheet} onClick={() => cambiarHoja(s)} />)}
              <div className="ml-auto flex items-center py-1 gap-2">
                <input type="text" value={busqueda} onChange={e => setBusqueda(e.target.value)}
                  placeholder="🔍 Buscar en hoja..." className="border border-gray-300 text-xs rounded-lg px-3 py-1.5 w-52" />
                <button onClick={() => fileInputRef.current?.click()} className="text-xs text-emerald-600 hover:underline px-2">📂 Cambiar</button>
                <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.csv" onChange={e => procesarArchivo(e.target.files[0])} className="hidden" />
              </div>
            </div>
            <div className="flex items-center gap-4 px-4 py-2 bg-white border-b border-gray-100 flex-shrink-0 text-xs text-gray-500">
              <span>📋 Hoja: <strong className="text-gray-700">{activeSheet}</strong></span>
              <span>📏 {rows.length} filas × {headers.length} columnas</span>
              {busqueda && <span className="text-emerald-600">Filtrando: {rows.length} resultados</span>}
            </div>
            <div className="flex-1 overflow-auto">
              {sheetData.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-400"><p>Esta hoja está vacía</p></div>
              ) : (
                <table className="text-xs border-collapse min-w-full">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-gray-100 border-b border-gray-300">
                      <th className="border border-gray-300 px-2 py-1.5 text-gray-400 font-normal text-center w-10 bg-gray-100 sticky left-0">#</th>
                      {headers.map((h, i) => (
                        <th key={i} className="border border-gray-300 px-3 py-1.5 text-left font-bold text-gray-700 bg-emerald-50 whitespace-nowrap max-w-xs">
                          {h || <span className="text-gray-300">Col {i + 1}</span>}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, ri) => (
                      <tr key={ri} className={`hover:bg-blue-50/50 transition ${ri % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                        <td className="border border-gray-200 px-2 py-1.5 text-gray-300 text-center text-xs sticky left-0 bg-inherit">{ri + 1}</td>
                        {headers.map((_, ci) => <CeldaValor key={ci} valor={row[ci]} />)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
