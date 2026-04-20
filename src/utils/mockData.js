// src/utils/mockData.js

export const formatter = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' });

export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return String(dateStr).split(' ')[0];
};

export const MOCK_DOCUMENTOS_RAW = [
  { fecha: "04/15/2026", folio: "15801", cliente: "LG ELECTRONICS USA, INC", concepto: "4", nombreConcepto: "Factura", moneda: "USD", total: 7554.03, saldo: 0, cancelada: false, uuid: "636D2BD0", fechaVencimiento: "05/15/2026", serie: "A", neto: 6510.37, impuesto: 1043.66, tipoCambio: 17.5, referencia: "" },
  { fecha: "01/12/2026", folio: "15803", cliente: "MEXIPC", concepto: "4", nombreConcepto: "Factura", moneda: "MXN", total: 37197.72, saldo: 37197.72, cancelada: false, uuid: "F2DD53DD", fechaVencimiento: "02/12/2026", serie: "A", neto: 32066.14, impuesto: 5131.58, tipoCambio: 1.0, referencia: "OC-2026-01" },
  { fecha: "04/05/2026", folio: "15804", cliente: "MEXIPC", concepto: "4", nombreConcepto: "Factura", moneda: "MXN", total: 5000, saldo: 5000, cancelada: 1, uuid: "CANCELADA-123", fechaVencimiento: "05/05/2026", serie: "A", neto: 4310.34, impuesto: 689.66, tipoCambio: 1.0, referencia: "" },
  { fecha: "03/13/2022", folio: "15607", cliente: "CW QUERETARO MEXICO", concepto: "4", nombreConcepto: "Factura", moneda: "MXN", total: 1516318.84, saldo: 1516318.84, cancelada: false, uuid: "54841FA0", fechaVencimiento: "04/13/2022", serie: "A", neto: 1307171.41, impuesto: 209147.43, tipoCambio: 1.0, referencia: "" },
  { fecha: "04/11/2026", folio: "15609", cliente: "CW QUERETARO MEXICO", concepto: "4", nombreConcepto: "Factura", moneda: "MXN", total: 1000.00, saldo: 1000.00, cancelada: false, uuid: "XXXXX", fechaVencimiento: "05/11/2026", serie: "A", neto: 862.07, impuesto: 137.93, tipoCambio: 1.0, referencia: "" },
  { fecha: "02/20/2026", folio: "15700", cliente: "WHIRLPOOL MEXICO SA DE CV", concepto: "4", nombreConcepto: "Factura", moneda: "MXN", total: 245000.00, saldo: 245000.00, cancelada: false, uuid: "AAA-001", fechaVencimiento: "05/20/2026", serie: "B", neto: 211206.90, impuesto: 33793.10, tipoCambio: 1.0, referencia: "PO-44521" },
  { fecha: "03/01/2026", folio: "15701", cliente: "WHIRLPOOL MEXICO SA DE CV", concepto: "4", nombreConcepto: "Factura", moneda: "USD", total: 12000.00, saldo: 0, cancelada: false, uuid: "AAA-002", fechaVencimiento: "05/30/2026", serie: "B", neto: 10344.83, impuesto: 1655.17, tipoCambio: 17.2, referencia: "" },
  { fecha: "03/10/2026", folio: "15750", cliente: "LENNOX INTERNATIONAL INC", concepto: "4", nombreConcepto: "Factura", moneda: "MXN", total: 88500.00, saldo: 88500.00, cancelada: false, uuid: "BBB-010", fechaVencimiento: "04/09/2026", serie: "A", neto: 76293.10, impuesto: 12206.90, tipoCambio: 1.0, referencia: "LEN-2026" },
  { fecha: "04/01/2026", folio: "15790", cliente: "NIDEC MEXICO SA DE CV", concepto: "4", nombreConcepto: "Factura", moneda: "MXN", total: 33000.00, saldo: 33000.00, cancelada: false, uuid: "CCC-005", fechaVencimiento: "05/01/2026", serie: "A", neto: 28448.28, impuesto: 4551.72, tipoCambio: 1.0, referencia: "" },
];

export function normalizarDocumentos(rawDocs) {
  return rawDocs.map(d => {
    let isCanc = false;
    let isPagada = false;

    const keysCanc = ['cancelada', 'Cancelada', 'ccancelado', 'CCANCELADO'];
    keysCanc.forEach(k => {
      if (d[k] !== undefined) {
        let v = String(d[k]).toLowerCase().trim();
        if (v === '1' || v === '1.000000' || v === 'true') isCanc = true;
      }
    });

    const keysEst = ['estado', 'estatus', 'cEstatus', 'Estatus', 'cstatus', 'CSTATUS'];
    keysEst.forEach(k => {
      if (d[k] !== undefined) {
        let v = String(d[k]).toLowerCase().trim();
        if (v === '3' || v.includes('cancelad')) isCanc = true;
      }
    });

    if (parseFloat(d.saldo) <= 0) isPagada = true;

    const keysPend = ['pendiente', 'cPendiente', 'Pendiente', 'CPENDIENTE'];
    keysPend.forEach(k => {
      if (d[k] !== undefined) {
        let v = String(d[k]).toLowerCase().trim();
        if (v === '0' || v === '0.000000' || v === 'false') isPagada = true;
        if (v === '1' || v === '1.000000' || v === 'true') isPagada = false;
      }
    });

    if (isCanc) isPagada = false;

    return { ...d, cancelada: isCanc, pagada: isPagada };
  });
}

export const MOCK_DOCUMENTOS = normalizarDocumentos(MOCK_DOCUMENTOS_RAW);
