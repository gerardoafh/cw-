// src/utils/reportes.js
// Toda la lógica de generación de Excel - migrada 1:1 del HTML original
import * as XLSX from 'xlsx';

export function obtenerCreditoCliente(cliente) {
  const c = String(cliente).toUpperCase();
  if (c.includes("WHIRLPOOL")) return 90;
  if (c.includes("LENNOX")) return 30;
  if (c.includes("BSH")) return 30;
  if (c.includes("DISEÑOS") || c.includes("DISENOS") || c.includes("DISEÑO")) return 30;
  if (c.includes("NIDEC")) return 30;
  if (c.includes("FANASA")) return 30;
  if (c.includes("KELONG") || c.includes("HENAN")) return 30;
  if (c.includes("DAEHAN")) return 30;
  if (c.includes("HANWHA")) return 30;
  if (c.includes("IMPCO")) return 30;
  if (c.includes("SEAH")) return 30;
  return 30;
}

function parsearFecha(fechaStr) {
  const hoyStr = new Date().toISOString().split('T')[0];
  if (!fechaStr) return new Date(hoyStr + 'T00:00:00');
  const fechaOriginal = String(fechaStr).split(' ')[0];
  let fDoc;
  if (fechaOriginal.includes('/')) {
    const partes = fechaOriginal.split('/');
    if (partes.length === 3) {
      let p1 = parseInt(partes[0]), p2 = parseInt(partes[1]), p3 = parseInt(partes[2]);
      if (p3 < 100) p3 += 2000;
      if (p1 > 12) fDoc = new Date(p3, p2 - 1, p1);
      else if (p2 > 12) fDoc = new Date(p3, p1 - 1, p2);
      else fDoc = new Date(p3, p1 - 1, p2);
    }
  } else if (fechaOriginal.includes('-')) {
    const partes = fechaOriginal.split('-');
    fDoc = new Date(parseInt(partes[0]), parseInt(partes[1]) - 1, parseInt(partes[2]));
  } else {
    fDoc = new Date(fechaOriginal);
  }
  if (!fDoc || isNaN(fDoc.getTime())) return new Date(hoyStr + 'T00:00:00');
  fDoc.setHours(0, 0, 0, 0);
  return fDoc;
}

// Control AR — reporte principal con hojas por cliente
export function descargarControlAR(documentosGlobales) {
  if (!documentosGlobales || documentosGlobales.length === 0) {
    alert("No hay datos cargados.");
    return;
  }
  const facturasRaw = documentosGlobales.filter(d => d.concepto === "4" || d.nombreConcepto === "Factura");
  if (facturasRaw.length === 0) {
    alert("No hay facturas para generar el Control AR.");
    return;
  }

  const wb = XLSX.utils.book_new();
  const hoyStr = new Date().toISOString().split('T')[0];
  const hoy = new Date(hoyStr + 'T00:00:00');

  const facturas = facturasRaw.map(f => {
    const credito = obtenerCreditoCliente(f.cliente);
    const fechaOriginal = f.fecha ? String(f.fecha).split(' ')[0] : hoyStr;
    const fDoc = parsearFecha(f.fecha);
    const diasTranscurridos = Math.round((hoy.getTime() - fDoc.getTime()) / (1000 * 60 * 60 * 24));
    const tiempoPasa = credito - diasTranscurridos;
    const isVencido = tiempoPasa < 0;
    const fVenc = new Date(fDoc.getTime() + (credito * 24 * 60 * 60 * 1000));
    const monto = parseFloat(f.total || 0);
    const isCancelada = f.cancelada === true;
    const pendiente = isCancelada ? 0 : parseFloat(f.saldo || 0);
    const recivo = isCancelada ? 0 : (monto - pendiente);

    return {
      ...f,
      fechaLimpia: fechaOriginal,
      creditoCalc: credito,
      fVencCalcStr: isNaN(fVenc.getTime()) ? hoyStr : fVenc.toISOString().split('T')[0],
      tiempoPasa,
      isVencido,
      isCancelada,
      montoC: monto,
      recivoC: recivo,
      pendienteC: pendiente,
    };
  });

  let resumeRows = [];
  resumeRows.push(["▣ LISTA DE CLIENTE AR", "", "", "", "", "", "", "", "", "", "", ""]);
  resumeRows.push(["NO", "CLIENTE", "MONEDA", "VENCIDO", "", "", "TIEMPO", "", "", "TOTAL", "", ""]);
  resumeRows.push(["", "", "", "MONTO", "RECIVO", "PENDIENTE", "MONTO", "RECIVO", "PENDIENTE", "MONTO", "RECIVO", "PENDIENTE"]);

  const clientes = [...new Set(facturas.map(f => f.cliente))];
  let cIndex = 1;
  let sheetsData = [];

  clientes.forEach(cli => {
    const facsCli = facturas.filter(f => f.cliente === cli);
    const monedas = [...new Set(facsCli.map(f => (f.moneda === "Dólar Americano" || f.moneda === "USD") ? "USD" : "MXN"))];

    monedas.forEach(mon => {
      const facsMon = facsCli.filter(f => ((f.moneda === "Dólar Americano" || f.moneda === "USD") ? "USD" : "MXN") === mon);
      let vencidoMonto = 0, vencidoRecivo = 0, vencidoPendiente = 0;
      let tiempoMonto = 0, tiempoRecivo = 0, tiempoPendiente = 0;

      facsMon.forEach(f => {
        if (!f.isCancelada) {
          if (f.isVencido) { vencidoMonto += f.montoC; vencidoRecivo += f.recivoC; vencidoPendiente += f.pendienteC; }
          else { tiempoMonto += f.montoC; tiempoRecivo += f.recivoC; tiempoPendiente += f.pendienteC; }
        }
      });

      resumeRows.push([cIndex++, cli, mon,
        vencidoMonto, vencidoRecivo, vencidoPendiente,
        tiempoMonto, tiempoRecivo, tiempoPendiente,
        vencidoMonto + tiempoMonto, vencidoRecivo + tiempoRecivo, vencidoPendiente + tiempoPendiente
      ]);
    });

    let sheetRows = [];
    sheetRows.push(["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""]);
    sheetRows.push(["CLIENTE", "NO.FACT", "CONCEPTO", "FECHA ENTREGA", "MONEDA", "①MONTO", "CREDITO", "FECHA VENCIDO", "FECHA HOY", "TIEMPO PASA", "CHECA", "FECHA DE PAGO", "②RECIVO", "DIF (①-②③)", "", "DESP", "MONTO", "RECIVO", "AR PENDING"]);

    let cVencidoMonto = 0, cVencidoRecivo = 0, cVencidoPendiente = 0;
    let cTiempoMonto = 0, cTiempoRecivo = 0, cTiempoPendiente = 0;

    facsCli.forEach(f => {
      if (!f.isCancelada) {
        if (f.isVencido) { cVencidoMonto += f.montoC; cVencidoRecivo += f.recivoC; cVencidoPendiente += f.pendienteC; }
        else { cTiempoMonto += f.montoC; cTiempoRecivo += f.recivoC; cTiempoPendiente += f.pendienteC; }
      }
    });

    for (let i = 0; i < facsCli.length; i++) {
      const f = facsCli[i];
      const checaStatus = f.isCancelada ? "CANCELADA" : (f.isVencido ? "VENCIDO" : "TIEMPO");
      const dif = f.isCancelada ? 0 : (f.recivoC - f.montoC);
      const row = [
        f.cliente, f.folio, "", f.fechaLimpia,
        (f.moneda === "Dólar Americano" || f.moneda === "USD") ? "USD" : "MXN",
        f.montoC, f.creditoCalc, f.fVencCalcStr, hoyStr, f.tiempoPasa,
        checaStatus, "", f.recivoC === 0 ? "" : f.recivoC, dif, ""
      ];
      if (i === 0) row.push("VENCIDO", cVencidoMonto, cVencidoRecivo, cVencidoPendiente);
      else if (i === 1) row.push("TIEMPO", cTiempoMonto, cTiempoRecivo, cTiempoPendiente);
      else if (i === 2) row.push("TOTAL", cVencidoMonto + cTiempoMonto, cVencidoRecivo + cTiempoRecivo, cVencidoPendiente + cTiempoPendiente);
      else row.push("", "", "", "");
      sheetRows.push(row);
    }

    const safeName = String(cli).replace(/[/\\?*[\]]/g, '').substring(0, 25);
    sheetsData.push({ name: safeName, data: sheetRows });
  });

  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(resumeRows), "0.RESUME");
  sheetsData.forEach((s, idx) => {
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(s.data), `${idx + 1}.${s.name}`);
  });
  XLSX.writeFile(wb, `CONTROL_DE_AR_${new Date().getFullYear()}.xlsx`);
}

function formatearDatoCorporativo(d) {
  return {
    'Fecha': d.fecha ? String(d.fecha).split(' ')[0] : '',
    'Serie': d.serie || '',
    'Folio': d.folio || '',
    'Razón Social': d.cliente || '',
    'COMENTARIOS': d.comentarios || '',
    'Neto': parseFloat(d.neto || 0),
    'Impuesto 1': parseFloat(d.impuesto || 0),
    'Total': parseFloat(d.total || 0),
    'Pendiente': parseFloat(d.saldo || 0),
    'Nombre de la Moneda': d.moneda || 'MXN',
    'Tipo de Cambio': parseFloat(d.tipoCambio || 1.0),
    'Cancelado': d.cancelada ? 'Cancelado' : 'Activo',
    'Fecha de Vencimiento': d.fechaVencimiento ? String(d.fechaVencimiento).split(' ')[0] : '',
    'UUID': d.uuid || '',
    'Docto asociado ADD': '',
    'Referencia': d.referencia || '',
    'Estatus': d.cancelada ? 'Cancelado' : 'Activo',
  };
}

// Descarga de reportes genéricos: csv | clientes | canceladas | pagadas | vencidas
export function descargarReporteMenu(tipo, documentosGlobales, documentosFiltrados) {
  if (!documentosGlobales || documentosGlobales.length === 0) {
    alert("No hay datos cargados en el sistema para exportar.");
    return;
  }

  if (tipo === 'clientes') {
    const facturas = documentosGlobales.filter(d => d.concepto === "4");
    if (facturas.length === 0) { alert("No hay facturas para agrupar."); return; }
    const wb = XLSX.utils.book_new();
    const vigentes = facturas.filter(d => !d.cancelada);
    const agrupado = {};
    vigentes.forEach(f => {
      const key = `${f.cliente}|${f.moneda || 'MXN'}`;
      if (!agrupado[key]) agrupado[key] = { "Razón Social": f.cliente, "Nombre de la Moneda": f.moneda || 'MXN', "Total": 0, "Pendiente": 0 };
      agrupado[key].Total += parseFloat(f.total || 0);
      agrupado[key].Pendiente += parseFloat(f.saldo || 0);
    });
    const resumenData = Object.values(agrupado).sort((a, b) => b.Pendiente - a.Pendiente);
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(resumenData), "RESUMEN TOTALES");
    const clientesUnicos = [...new Set(facturas.map(f => f.cliente))];
    clientesUnicos.forEach(cli => {
      const facturasCli = facturas.filter(f => f.cliente === cli).map(d => formatearDatoCorporativo(d));
      const nombrePestana = String(cli).replace(/[/\\?*[\]]/g, '').substring(0, 31);
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(facturasCli), nombrePestana);
    });
    XLSX.writeFile(wb, `Reporte_Corporativo_${new Date().toISOString().split('T')[0].replace(/-/g, '')}.xlsx`);
    return;
  }

  let datosAExportar = [];
  let nombreHoja = "Reporte";
  let nombreArchivo = "Reporte";
  const hoyStr = new Date().toISOString().split('T')[0];

  if (tipo === 'canceladas') {
    datosAExportar = documentosGlobales.filter(d => d.cancelada === true);
    if (datosAExportar.length === 0) { alert("¡Excelente noticia! No hay facturas canceladas."); return; }
    nombreHoja = "AUDITORIA CANCELADAS";
    nombreArchivo = "Auditoria_Cancelaciones";
  } else if (tipo === 'pagadas') {
    datosAExportar = documentosGlobales.filter(d => d.concepto === "4" && !d.cancelada && parseFloat(d.saldo || d.total) <= 0.01);
    if (datosAExportar.length === 0) { alert("No se encontraron facturas totalmente pagadas."); return; }
    nombreHoja = "FACTURAS PAGADAS";
    nombreArchivo = "Facturas_Pagadas";
  } else if (tipo === 'vencidas') {
    datosAExportar = documentosGlobales.filter(d => d.concepto === "4" && !d.cancelada && parseFloat(d.saldo || d.total) > 0.01 && d.fechaVencimiento && String(d.fechaVencimiento).split(' ')[0] < hoyStr);
    if (datosAExportar.length === 0) { alert("¡Excelentes noticias! No hay facturas vencidas actualmente."); return; }
    datosAExportar.sort((a, b) => (a.fechaVencimiento || "").localeCompare(b.fechaVencimiento || ""));
    nombreHoja = "CARTERA VENCIDA";
    nombreArchivo = "Cartera_Vencida_Morosos";
  } else if (tipo === 'csv') {
    datosAExportar = documentosFiltrados;
    nombreHoja = "DATOS";
    nombreArchivo = "Extracto_CONTPAQi_Normal";
  }

  const datosListos = datosAExportar.map(d => formatearDatoCorporativo(d));
  const ws = XLSX.utils.json_to_sheet(datosListos);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, nombreHoja);

  if (tipo === 'csv') {
    XLSX.writeFile(wb, `${nombreArchivo}.csv`, { bookType: "csv" });
  } else {
    XLSX.writeFile(wb, `${nombreArchivo}_${hoyStr.replace(/-/g, '')}.xlsx`);
  }
}
