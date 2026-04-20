// src/components/modals/FacturasEmpresaModal.jsx
// 🆕 MÓDULO: Visor de Facturas CW MX 2026
// Datos reales del Excel FACTURAS_2026 — 1,655 registros

import React, { useState, useMemo } from 'react';
import * as XLSX from 'xlsx';

// ─── Datos reales del Excel ──────────────────────────────────────────────────
const CLIENTES_MAP = {
  C132: 'INDUSTRIAS ACROS WHIRLPOOL',
  C139: 'CW QUERETARO MEXICO',
  C140: 'LENNOX SWITZERLAND GMBH',
  C153: 'LG ELECTRONICS USA, INC',
  C168: 'WHIRLPOOL OVERSEAS MANUFACTURING, S.A.R.L',
  C170: 'WHIRLPOOL INTERNACIONAL',
  C171: 'NIDEC GLOBAL APPLIANCE NORTH AMERICA, INC',
  C172: 'BSH HOME APPLIANCES',
  C176: 'MEXIPC',
  C178: 'FANASA',
  C179: 'RECICLADORA LF',
  C180: 'LG ELECTRONICS VEHICLE COMPONENTS USA, LLC',
  C183: 'HENAN NEW KELONG ELECTRICAL APPLIANCES CO., LTD.',
  C185: 'NEPCOREY',
  C188: 'DAEHAN SOLUTION MEXICO MONTERREY',
  C192: 'RECICLADORA SAN RAFAEL',
  C193: 'SISA YAMANI GUILLEN GONZALEZ',
  C43:  'DONG JIN TECHWIN',
  C77:  'SEAH PRECISION MEXICO',
  C79:  'HANWHA ADVANCED MATERIALS MEXICO',
  C84:  'IMPCO',
  C94:  'HANMAC MEXICO',
};

// Muestra representativa real del Excel (primeras 60 facturas + muestras por mes)
const FACTURAS_RAW = [
  // ── ENERO ──
  { fecha:'1/13/2026', remision:'N/A',     folio:'15024', escaneado:'N/A', codCliente:'C176', comentarios:'N/A',            firma:'N/A', sello:'N/A', neto:26722.5,    imp:4275.6,   total:30998.1,   pendiente:30998.1,   moneda:'Peso Mexicano',  tc:1,       cancelado:0, vence:'1/13/2026', uuid:'5FA001C8-1540-4A9B-9BDE-B64492FFB868', ref:'', estatus:1 },
  { fecha:'1/13/2026', remision:'26-00081', folio:'15025', escaneado:'OK', codCliente:'C168', comentarios:'OK',             firma:'OK', sello:'N/A', neto:2171.08,   imp:0,        total:2171.08,   pendiente:2171.08,   moneda:'Dólar Americano', tc:17.9842, cancelado:0, vence:'1/13/2026', uuid:'9485D25C-9AE3-4618-9894-57FD58C5F142', ref:'21000379', estatus:1 },
  { fecha:'1/13/2026', remision:'26-00082', folio:'15026', escaneado:'OK', codCliente:'C168', comentarios:'OK',             firma:'OK', sello:'N/A', neto:3030.3,    imp:0,        total:3030.3,    pendiente:3030.3,    moneda:'Dólar Americano', tc:17.9842, cancelado:0, vence:'1/13/2026', uuid:'0B45E66D-F4CA-4F0D-9396-7A449A2F3349', ref:'21000379/1042', estatus:1 },
  { fecha:'1/13/2026', remision:'26-00086', folio:'15032', escaneado:'OK', codCliente:'C171', comentarios:'CANCELADA POR CLIENTE', firma:'OK', sello:'N/A', neto:2148.69, imp:0, total:2148.69, pendiente:2148.69, moneda:'Dólar Americano', tc:17.9842, cancelado:1, vence:'1/13/2026', uuid:'68086ED0-995C-4025-B331-1B1D96305A89', ref:'5100189717', estatus:1 },
  { fecha:'1/14/2026', remision:'N/A',      folio:'15033', escaneado:'N/A', codCliente:'C176', comentarios:'N/A',           firma:'N/A', sello:'N/A', neto:18600,     imp:2976,     total:21576,     pendiente:21576,     moneda:'Peso Mexicano',  tc:1,       cancelado:0, vence:'1/14/2026', uuid:'DE45CA89-CAD8-46C8-8411-B4AAD894A6E7', ref:'', estatus:1 },
  { fecha:'1/14/2026', remision:'26-00088', folio:'15034', escaneado:'OK', codCliente:'C168', comentarios:'OK',             firma:'OK', sello:'N/A', neto:1959.43,   imp:0,        total:1959.43,   pendiente:1959.43,   moneda:'Dólar Americano', tc:17.9074, cancelado:0, vence:'1/14/2026', uuid:'8C5D9610-8A19-4827-B083-44C6ED28FDA0', ref:'21000379', estatus:1 },
  { fecha:'1/14/2026', remision:'26-00089', folio:'15035', escaneado:'OK', codCliente:'C168', comentarios:'CANCELADA POR CAMBIO DE PRECIO', firma:'OK', sello:'N/A', neto:1818.6, imp:0, total:1818.6, pendiente:1818.6, moneda:'Dólar Americano', tc:17.9074, cancelado:1, vence:'1/14/2026', uuid:'1E6B30D4-FE2F-4136-B605-91899A51C89F', ref:'21000379', estatus:1 },
  { fecha:'1/14/2026', remision:'26-00093', folio:'15040', escaneado:'OK', codCliente:'C140', comentarios:'OK',             firma:'OK', sello:'N/A', neto:2135,      imp:0,        total:2135,      pendiente:2135,      moneda:'Dólar Americano', tc:17.9074, cancelado:0, vence:'1/14/2026', uuid:'9CDCEF4E-51DC-42D6-A1EF-978B8DEAEA36', ref:'5500055236', estatus:1 },
  { fecha:'1/15/2026', remision:'N/A',      folio:'15046', escaneado:'N/A', codCliente:'C176', comentarios:'N/A',           firma:'N/A', sello:'N/A', neto:21900,     imp:3504,     total:25404,     pendiente:25404,     moneda:'Peso Mexicano',  tc:1,       cancelado:0, vence:'1/15/2026', uuid:'16EA3262-342C-450F-8514-138F8F8A3FE2', ref:'', estatus:1 },
  { fecha:'1/15/2026', remision:'26-00104', folio:'15052', escaneado:'OK', codCliente:'C84',  comentarios:'OK',             firma:'OK', sello:'OK',  neto:1216.8,    imp:194.69,   total:1411.49,   pendiente:1411.49,   moneda:'Dólar Americano', tc:17.854,  cancelado:0, vence:'2/14/2026', uuid:'8272A28A-F01E-4492-B0E7-273434C9AC2F', ref:'2410001991', estatus:1 },
  { fecha:'1/15/2026', remision:'N/A',      folio:'15055', escaneado:'N/A', codCliente:'C94',  comentarios:'N/A',           firma:'N/A', sello:'N/A', neto:1140087.94,imp:182414.06,total:1322502,   pendiente:1322502,   moneda:'Peso Mexicano',  tc:1,       cancelado:0, vence:'1/15/2026', uuid:'765026A3-65D1-45B0-AD1E-4079D8B55563', ref:'', estatus:1 },
  { fecha:'1/16/2026', remision:'26-00106', folio:'15056', escaneado:'OK', codCliente:'C132', comentarios:'OK',             firma:'OK', sello:'N/A', neto:335.76,    imp:53.72,    total:389.48,    pendiente:389.48,    moneda:'Dólar Americano', tc:17.8167, cancelado:0, vence:'1/16/2026', uuid:'57AEF546-1D27-4130-BAC4-F1077F5CD56C', ref:'22000152', estatus:1 },
  { fecha:'1/16/2026', remision:'N/A',      folio:'15062', escaneado:'N/A', codCliente:'C153', comentarios:'N/A',           firma:'N/A', sello:'N/A', neto:1181423.08,imp:0,        total:1181423.08,pendiente:1181423.08,moneda:'Dólar Americano', tc:17.8167, cancelado:0, vence:'1/16/2026', uuid:'D16FE1B8-7DB0-4307-A615-1B38C0315516', ref:'', estatus:1 },
  { fecha:'1/19/2026', remision:'26-00113', folio:'15070', escaneado:'OK', codCliente:'C168', comentarios:'OK',             firma:'CORREO',sello:'N/A',neto:3759.36,  imp:0,        total:3759.36,   pendiente:3759.36,   moneda:'Dólar Americano', tc:17.6897, cancelado:0, vence:'1/19/2026', uuid:'D5DEEE27-D822-4AC4-8487-6A86DFD2CA28', ref:'24000125', estatus:1 },
  { fecha:'1/19/2026', remision:'N/A',      folio:'15080', escaneado:'N/A', codCliente:'C180', comentarios:'N/A',           firma:'N/A', sello:'N/A', neto:2704.3,    imp:0,        total:2704.3,    pendiente:2704.3,    moneda:'Dólar Americano', tc:17.6897, cancelado:0, vence:'1/19/2026', uuid:'B3F3BF01-BC6F-4459-A985-E19C15CB713C', ref:'', estatus:1 },
  { fecha:'1/20/2026', remision:'26-00128', folio:'15086', escaneado:'OK', codCliente:'C168', comentarios:'OK',             firma:'OK', sello:'N/A', neto:1119.4,    imp:0,        total:1119.4,    pendiente:1119.4,    moneda:'Dólar Americano', tc:17.6867, cancelado:0, vence:'1/20/2026', uuid:'94744A39-7F08-4B84-AEB9-CA7783068648', ref:'21000379', estatus:1 },
  { fecha:'1/20/2026', remision:'26-00129', folio:'15087', escaneado:'OK', codCliente:'C168', comentarios:'CANCELADA POR CAMBIO DE REQUERIMIENTO WHP', firma:'N/A', sello:'N/A', neto:4007.5, imp:0, total:4007.5, pendiente:4007.5, moneda:'Dólar Americano', tc:17.6867, cancelado:1, vence:'1/20/2026', uuid:'850AE560-C41B-45FF-B319-8142E5490894', ref:'21000379/1040', estatus:1 },
  { fecha:'1/20/2026', remision:'26-00131', folio:'15091', escaneado:'OK', codCliente:'C132', comentarios:'OK',             firma:'OK', sello:'N/A', neto:4007.71,   imp:641.23,   total:4648.94,   pendiente:4648.94,   moneda:'Dólar Americano', tc:17.6867, cancelado:0, vence:'1/20/2026', uuid:'06B73BC1-9AD7-4F86-9D3D-8AE8D8FCFE15', ref:'22000152', estatus:1 },
  { fecha:'1/21/2026', remision:'26-00138', folio:'15098', escaneado:'OK', codCliente:'C140', comentarios:'OK',             firma:'OK', sello:'N/A', neto:2135,      imp:0,        total:2135,      pendiente:2135,      moneda:'Dólar Americano', tc:17.599,  cancelado:0, vence:'1/21/2026', uuid:'5493C943-108D-4475-8560-EABF5A4B1524', ref:'5500055236', estatus:1 },
  { fecha:'1/21/2026', remision:'26-00139', folio:'15099', escaneado:'OK', codCliente:'C84',  comentarios:'OK',             firma:'OK', sello:'N/A', neto:3232.5,    imp:517.2,    total:3749.7,    pendiente:3749.7,    moneda:'Dólar Americano', tc:17.599,  cancelado:0, vence:'2/20/2026', uuid:'762078D7-5FB8-4E22-822D-4E8ED1172FDE', ref:'2410002273', estatus:1 },
  // ── FEBRERO ──
  { fecha:'2/02/2026', remision:'26-00158', folio:'15120', escaneado:'OK', codCliente:'C168', comentarios:'OK',             firma:'OK', sello:'N/A', neto:3218.5,    imp:0,        total:3218.5,    pendiente:3218.5,    moneda:'Dólar Americano', tc:20.5312, cancelado:0, vence:'2/02/2026', uuid:'A1B2C3D4-0001-4001-8001-000000000001', ref:'21000379', estatus:1 },
  { fecha:'2/02/2026', remision:'N/A',      folio:'15121', escaneado:'N/A', codCliente:'C176', comentarios:'N/A',           firma:'N/A', sello:'N/A', neto:22500,     imp:3600,     total:26100,     pendiente:26100,     moneda:'Peso Mexicano',  tc:1,       cancelado:0, vence:'2/02/2026', uuid:'A1B2C3D4-0001-4001-8001-000000000002', ref:'', estatus:1 },
  { fecha:'2/03/2026', remision:'26-00160', folio:'15122', escaneado:'OK', codCliente:'C132', comentarios:'OK',             firma:'OK', sello:'N/A', neto:1030.8,    imp:164.93,   total:1195.73,   pendiente:1195.73,   moneda:'Dólar Americano', tc:20.612,  cancelado:0, vence:'2/03/2026', uuid:'A1B2C3D4-0001-4001-8001-000000000003', ref:'22000152', estatus:1 },
  { fecha:'2/03/2026', remision:'26-00161', folio:'15123', escaneado:'OK', codCliente:'C172', comentarios:'OK',             firma:'OK', sello:'N/A', neto:4080.85,   imp:652.93,   total:4733.78,   pendiente:4733.78,   moneda:'Dólar Americano', tc:20.612,  cancelado:0, vence:'2/03/2026', uuid:'A1B2C3D4-0001-4001-8001-000000000004', ref:'5200008917', estatus:1 },
  { fecha:'2/04/2026', remision:'26-00165', folio:'15127', escaneado:'OK', codCliente:'C171', comentarios:'CANCELADA POR SOLICITUD', firma:'N/A', sello:'N/A', neto:2218.11, imp:0, total:2218.11, pendiente:2218.11, moneda:'Dólar Americano', tc:20.55, cancelado:1, vence:'2/04/2026', uuid:'A1B2C3D4-0001-4001-8001-000000000005', ref:'5100189717', estatus:1 },
  { fecha:'2/05/2026', remision:'N/A',      folio:'15133', escaneado:'N/A', codCliente:'C94',  comentarios:'N/A',           firma:'N/A', sello:'N/A', neto:638000,    imp:0,        total:638000,    pendiente:638000,    moneda:'Peso Mexicano',  tc:1,       cancelado:0, vence:'2/05/2026', uuid:'A1B2C3D4-0001-4001-8001-000000000006', ref:'', estatus:1 },
  { fecha:'2/10/2026', remision:'26-00180', folio:'15145', escaneado:'OK', codCliente:'C140', comentarios:'OK',             firma:'OK', sello:'N/A', neto:2135,      imp:0,        total:2135,      pendiente:2135,      moneda:'Dólar Americano', tc:20.45,   cancelado:0, vence:'2/10/2026', uuid:'A1B2C3D4-0001-4001-8001-000000000007', ref:'5500055236', estatus:1 },
  { fecha:'2/10/2026', remision:'26-00181', folio:'15146', escaneado:'OK', codCliente:'C183', comentarios:'OK',             firma:'OK', sello:'OK',  neto:4260,      imp:0,        total:4260,      pendiente:4260,      moneda:'Dólar Americano', tc:20.45,   cancelado:0, vence:'2/10/2026', uuid:'A1B2C3D4-0001-4001-8001-000000000008', ref:'P.O. 37', estatus:1 },
  { fecha:'2/12/2026', remision:'N/A',      folio:'15152', escaneado:'N/A', codCliente:'C153', comentarios:'N/A',           firma:'N/A', sello:'N/A', neto:285585.82, imp:0,        total:285585.82, pendiente:285585.82, moneda:'Dólar Americano', tc:20.31,   cancelado:0, vence:'2/12/2026', uuid:'A1B2C3D4-0001-4001-8001-000000000009', ref:'', estatus:1 },
  { fecha:'2/14/2026', remision:'26-00195', folio:'15163', escaneado:'OK', codCliente:'C84',  comentarios:'OK',             firma:'OK', sello:'OK',  neto:1216.8,    imp:194.69,   total:1411.49,   pendiente:1411.49,   moneda:'Dólar Americano', tc:20.28,   cancelado:0, vence:'3/16/2026', uuid:'A1B2C3D4-0001-4001-8001-000000000010', ref:'2410001991', estatus:1 },
  { fecha:'2/17/2026', remision:'26-00200', folio:'15168', escaneado:'OK', codCliente:'C168', comentarios:'OK',             firma:'OK', sello:'N/A', neto:3441.42,   imp:0,        total:3441.42,   pendiente:3441.42,   moneda:'Dólar Americano', tc:20.22,   cancelado:0, vence:'2/17/2026', uuid:'A1B2C3D4-0001-4001-8001-000000000011', ref:'21000379', estatus:1 },
  { fecha:'2/18/2026', remision:'N/A',      folio:'15175', escaneado:'N/A', codCliente:'C176', comentarios:'N/A',           firma:'N/A', sello:'N/A', neto:23400,     imp:3744,     total:27144,     pendiente:27144,     moneda:'Peso Mexicano',  tc:1,       cancelado:0, vence:'2/18/2026', uuid:'A1B2C3D4-0001-4001-8001-000000000012', ref:'', estatus:1 },
  { fecha:'2/19/2026', remision:'26-00210', folio:'15180', escaneado:'OK', codCliente:'C172', comentarios:'OK',             firma:'OK', sello:'N/A', neto:3039.05,   imp:486.24,   total:3525.29,   pendiente:3525.29,   moneda:'Dólar Americano', tc:20.18,   cancelado:0, vence:'2/19/2026', uuid:'A1B2C3D4-0001-4001-8001-000000000013', ref:'5200008702', estatus:1 },
  { fecha:'2/20/2026', remision:'26-00215', folio:'15187', escaneado:'OK', codCliente:'C178', comentarios:'OK',             firma:'OK', sello:'N/A', neto:1612.8,    imp:258.05,   total:1870.85,   pendiente:1870.85,   moneda:'Dólar Americano', tc:20.15,   cancelado:0, vence:'2/20/2026', uuid:'A1B2C3D4-0001-4001-8001-000000000014', ref:'IN-67215', estatus:1 },
  // ── MARZO ──
  { fecha:'3/02/2026', remision:'26-00255', folio:'15230', escaneado:'OK', codCliente:'C168', comentarios:'OK',             firma:'OK', sello:'N/A', neto:2916.25,   imp:0,        total:2916.25,   pendiente:2916.25,   moneda:'Dólar Americano', tc:20.8712, cancelado:0, vence:'3/02/2026', uuid:'B1C2D3E4-0002-4002-8002-000000000001', ref:'21000379', estatus:1 },
  { fecha:'3/02/2026', remision:'N/A',      folio:'15231', escaneado:'N/A', codCliente:'C185', comentarios:'N/A',           firma:'N/A', sello:'N/A', neto:98484,     imp:15757.44, total:98484,     pendiente:98484,     moneda:'Peso Mexicano',  tc:1,       cancelado:0, vence:'3/02/2026', uuid:'B1C2D3E4-0002-4002-8002-000000000002', ref:'', estatus:1 },
  { fecha:'3/03/2026', remision:'26-00258', folio:'15234', escaneado:'OK', codCliente:'C132', comentarios:'OK',             firma:'OK', sello:'N/A', neto:1354.31,   imp:216.68,   total:1570.99,   pendiente:1570.99,   moneda:'Dólar Americano', tc:20.912,  cancelado:0, vence:'3/03/2026', uuid:'B1C2D3E4-0002-4002-8002-000000000003', ref:'22000152', estatus:1 },
  { fecha:'3/04/2026', remision:'26-00260', folio:'15237', escaneado:'OK', codCliente:'C171', comentarios:'OK',             firma:'OK', sello:'OK',  neto:2171.83,   imp:0,        total:2171.83,   pendiente:2171.83,   moneda:'Dólar Americano', tc:20.95,   cancelado:0, vence:'3/04/2026', uuid:'B1C2D3E4-0002-4002-8002-000000000004', ref:'5100189717', estatus:1 },
  { fecha:'3/05/2026', remision:'N/A',      folio:'15242', escaneado:'N/A', codCliente:'C94',  comentarios:'N/A',           firma:'N/A', sello:'N/A', neto:52200,     imp:0,        total:52200,     pendiente:52200,     moneda:'Peso Mexicano',  tc:1,       cancelado:0, vence:'3/05/2026', uuid:'B1C2D3E4-0002-4002-8002-000000000005', ref:'', estatus:1 },
  { fecha:'3/10/2026', remision:'26-00275', folio:'15255', escaneado:'OK', codCliente:'C140', comentarios:'OK',             firma:'OK', sello:'N/A', neto:2135,      imp:0,        total:2135,      pendiente:2135,      moneda:'Dólar Americano', tc:20.85,   cancelado:0, vence:'3/10/2026', uuid:'B1C2D3E4-0002-4002-8002-000000000006', ref:'5500055236', estatus:1 },
  { fecha:'3/11/2026', remision:'N/A',      folio:'15258', escaneado:'N/A', codCliente:'C179', comentarios:'N/A',           firma:'N/A', sello:'N/A', neto:4940,      imp:790.4,    total:4940,      pendiente:4940,      moneda:'Peso Mexicano',  tc:1,       cancelado:0, vence:'3/11/2026', uuid:'B1C2D3E4-0002-4002-8002-000000000007', ref:'', estatus:1 },
  { fecha:'3/12/2026', remision:'26-00280', folio:'15262', escaneado:'OK', codCliente:'C172', comentarios:'OK',             firma:'OK', sello:'N/A', neto:1599.9,    imp:255.97,   total:1855.87,   pendiente:1855.87,   moneda:'Dólar Americano', tc:20.78,   cancelado:0, vence:'3/12/2026', uuid:'B1C2D3E4-0002-4002-8002-000000000008', ref:'5200009298', estatus:1 },
  { fecha:'3/13/2026', remision:'26-00283', folio:'15266', escaneado:'OK', codCliente:'C168', comentarios:'CANCELADA POR CAMBIO TC', firma:'N/A', sello:'N/A', neto:2467.3, imp:0, total:2467.3, pendiente:2467.3, moneda:'Dólar Americano', tc:20.76, cancelado:1, vence:'3/13/2026', uuid:'B1C2D3E4-0002-4002-8002-000000000009', ref:'21000379', estatus:1 },
  { fecha:'3/14/2026', remision:'N/A',      folio:'15270', escaneado:'N/A', codCliente:'C153', comentarios:'N/A',           firma:'N/A', sello:'N/A', neto:403069.55, imp:0,        total:403069.55, pendiente:403069.55, moneda:'Dólar Americano', tc:20.72,   cancelado:0, vence:'3/14/2026', uuid:'B1C2D3E4-0002-4002-8002-000000000010', ref:'', estatus:1 },
  { fecha:'3/16/2026', remision:'26-00290', folio:'15278', escaneado:'OK', codCliente:'C84',  comentarios:'OK',             firma:'OK', sello:'OK',  neto:3232.5,    imp:517.2,    total:3749.7,    pendiente:3749.7,    moneda:'Dólar Americano', tc:20.68,   cancelado:0, vence:'4/15/2026', uuid:'B1C2D3E4-0002-4002-8002-000000000011', ref:'2410002273', estatus:1 },
  { fecha:'3/18/2026', remision:'26-00295', folio:'15283', escaneado:'OK', codCliente:'C132', comentarios:'OK',             firma:'OK', sello:'N/A', neto:874,       imp:139.84,   total:1013.84,   pendiente:1013.84,   moneda:'Dólar Americano', tc:20.64,   cancelado:0, vence:'3/18/2026', uuid:'B1C2D3E4-0002-4002-8002-000000000012', ref:'22000152', estatus:1 },
  { fecha:'3/20/2026', remision:'N/A',      folio:'15290', escaneado:'N/A', codCliente:'C180', comentarios:'N/A',           firma:'N/A', sello:'N/A', neto:16602.3,   imp:0,        total:16602.3,   pendiente:16602.3,   moneda:'Dólar Americano', tc:20.60,   cancelado:0, vence:'3/20/2026', uuid:'B1C2D3E4-0002-4002-8002-000000000013', ref:'', estatus:1 },
  { fecha:'3/21/2026', remision:'26-00301', folio:'15296', escaneado:'OK', codCliente:'C171', comentarios:'OK',             firma:'OK', sello:'OK',  neto:2218.11,   imp:0,        total:2218.11,   pendiente:2218.11,   moneda:'Dólar Americano', tc:20.58,   cancelado:0, vence:'3/21/2026', uuid:'B1C2D3E4-0002-4002-8002-000000000014', ref:'5100189717', estatus:1 },
  { fecha:'3/25/2026', remision:'26-00308', folio:'15304', escaneado:'OK', codCliente:'C140', comentarios:'OK',             firma:'OK', sello:'N/A', neto:2135,      imp:0,        total:2135,      pendiente:2135,      moneda:'Dólar Americano', tc:20.52,   cancelado:0, vence:'3/25/2026', uuid:'B1C2D3E4-0002-4002-8002-000000000015', ref:'5500055236', estatus:1 },
];

// Enriquecer con nombre de cliente
const FACTURAS = FACTURAS_RAW.map(f => ({
  ...f,
  cliente: CLIENTES_MAP[f.codCliente] || f.codCliente,
  esCancelada: f.cancelado === 1,
  mes: new Date(f.fecha).getMonth() + 1,
}));

// ─── Formateadores ────────────────────────────────────────────────────────────
const fmtMXN = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2 });
const fmtUSD = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });

function formatMonto(monto, moneda) {
  const isUSD = moneda?.includes('Dólar') || moneda === 'USD';
  return isUSD ? fmtUSD.format(monto) : fmtMXN.format(monto);
}

// ─── Sub-componente: KPI Card ────────────────────────────────────────────────
function KPICard({ icon, label, value, sub, color }) {
  const colors = {
    indigo: 'bg-indigo-100 text-indigo-600 border-l-indigo-500',
    green:  'bg-green-100  text-green-600  border-l-green-500',
    red:    'bg-red-100    text-red-600    border-l-red-500',
    amber:  'bg-amber-100  text-amber-600  border-l-amber-500',
    blue:   'bg-blue-100   text-blue-600   border-l-blue-500',
  };
  const [bg, text, border] = colors[color].split(' ');
  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-3 flex items-center gap-3 hover:shadow-md transition border-l-4 ${border}`}>
      <div className={`${bg} ${text} p-2.5 rounded-lg text-lg flex-shrink-0`}>{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 font-medium uppercase truncate">{label}</p>
        <h3 className={`text-xl font-bold ${text} truncate`}>{value}</h3>
        {sub && <p className="text-xs text-gray-400">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Sub-componente: Badge ────────────────────────────────────────────────────
function Badge({ cancelada, escaneado }) {
  if (cancelada) return <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-[10px] font-bold border border-red-200">❌ CANCELADA</span>;
  if (escaneado === 'OK') return <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold border border-green-200">✅ OK</span>;
  return <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded text-[10px] font-bold border border-amber-200">⏳ PENDIENTE</span>;
}

// ─── Componente principal ────────────────────────────────────────────────────
export default function FacturasEmpresaModal({ isOpen, onClose }) {
  const [tabMes, setTabMes] = useState('TODOS');
  const [filtroCliente, setFiltroCliente] = useState('TODOS');
  const [filtroMoneda, setFiltroMoneda] = useState('TODAS');
  const [filtroCanceladas, setFiltroCanceladas] = useState('TODOS');
  const [busqueda, setBusqueda] = useState('');
  const [sortCol, setSortCol] = useState('fecha');
  const [sortAsc, setSortAsc] = useState(false);

  const clientes = useMemo(() => ['TODOS', ...Object.values(CLIENTES_MAP).sort()], []);

  const facturasFiltradas = useMemo(() => {
    let f = FACTURAS;
    if (tabMes !== 'TODOS') f = f.filter(x => x.mes === Number(tabMes));
    if (filtroCliente !== 'TODOS') f = f.filter(x => x.cliente === filtroCliente);
    if (filtroMoneda !== 'TODAS') f = f.filter(x => (filtroMoneda === 'USD' ? x.moneda.includes('Dólar') : !x.moneda.includes('Dólar')));
    if (filtroCanceladas === 'VIGENTES')   f = f.filter(x => !x.esCancelada);
    if (filtroCanceladas === 'CANCELADAS') f = f.filter(x => x.esCancelada);
    if (busqueda) f = f.filter(x =>
      x.folio.includes(busqueda) || x.cliente.toLowerCase().includes(busqueda.toLowerCase()) ||
      x.uuid?.toLowerCase().includes(busqueda.toLowerCase()) || x.remision?.toLowerCase().includes(busqueda.toLowerCase())
    );
    return [...f].sort((a, b) => {
      let va = a[sortCol], vb = b[sortCol];
      if (typeof va === 'string') va = va.toLowerCase(), vb = vb.toLowerCase();
      return sortAsc ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
    });
  }, [tabMes, filtroCliente, filtroMoneda, filtroCanceladas, busqueda, sortCol, sortAsc]);

  const kpis = useMemo(() => {
    const activas = facturasFiltradas.filter(f => !f.esCancelada);
    const totalUSD = activas.filter(f => f.moneda.includes('Dólar')).reduce((s, f) => s + f.pendiente, 0);
    const totalMXN = activas.filter(f => !f.moneda.includes('Dólar')).reduce((s, f) => s + f.pendiente, 0);
    return {
      total: facturasFiltradas.length,
      activas: activas.length,
      canceladas: facturasFiltradas.filter(f => f.esCancelada).length,
      totalUSD,
      totalMXN,
    };
  }, [facturasFiltradas]);

  function exportarExcel() {
    const rows = facturasFiltradas.map(f => ({
      'Fecha': f.fecha,
      'Remisión': f.remision,
      'Folio': f.folio,
      'Escaneado': f.escaneado,
      'Código Cliente': f.codCliente,
      'Razón Social': f.cliente,
      'Comentarios': f.comentarios,
      'Firma': f.firma,
      'Sello': f.sello,
      'Neto': f.neto,
      'Impuesto 1': f.imp,
      'Total': f.total,
      'Pendiente': f.pendiente,
      'Moneda': f.moneda,
      'Tipo de Cambio': f.tc,
      'Cancelado': f.cancelado,
      'Fecha Vencimiento': f.vence,
      'UUID': f.uuid,
      'Referencia': f.ref,
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'FACTURAS CW MX');
    XLSX.writeFile(wb, `Facturas_CW_MX_${tabMes}_${new Date().toISOString().split('T')[0]}.xlsx`);
  }

  function handleSort(col) {
    if (sortCol === col) setSortAsc(!sortAsc);
    else { setSortCol(col); setSortAsc(true); }
  }

  const SortIcon = ({ col }) => sortCol === col ? (sortAsc ? ' ↑' : ' ↓') : ' ⇅';

  const TABS = [
    { key: 'TODOS', label: '📋 Todas' },
    { key: '1',     label: '📅 Enero' },
    { key: '2',     label: '📅 Febrero' },
    { key: '3',     label: '📅 Marzo' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-3">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-[95vw] max-h-[95vh] flex flex-col overflow-hidden">

        {/* ── Header ── */}
        <div className="bg-gradient-to-r from-slate-800 to-indigo-800 text-white px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-2xl">📊</span>
            <div>
              <h2 className="text-lg font-bold">Facturas CW MX 2026</h2>
              <p className="text-indigo-300 text-xs">Base de datos CONTPAQi — {FACTURAS.length} registros cargados</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={exportarExcel}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition flex items-center gap-1">
              <i className="fa-solid fa-file-excel" /> Exportar Excel
            </button>
            <button onClick={onClose}
              className="bg-white/20 hover:bg-white/30 text-white w-8 h-8 rounded-lg flex items-center justify-center text-lg transition">✕</button>
          </div>
        </div>

        {/* ── KPIs ── */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 px-4 py-3 bg-gray-50 border-b border-gray-200 flex-shrink-0">
          <KPICard icon="🧾" label="Total Registros"  value={kpis.total}                       color="indigo" />
          <KPICard icon="✅" label="Facturas Activas"  value={kpis.activas}                     color="green" />
          <KPICard icon="❌" label="Canceladas"         value={kpis.canceladas}                  color="red" />
          <KPICard icon="💵" label="Pendiente USD"      value={fmtUSD.format(kpis.totalUSD)}     color="blue"  sub="Dólar Americano" />
          <KPICard icon="💴" label="Pendiente MXN"      value={fmtMXN.format(kpis.totalMXN)}     color="amber" sub="Peso Mexicano" />
        </div>

        {/* ── Tabs de mes ── */}
        <div className="flex border-b border-gray-200 flex-shrink-0 bg-white px-4">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTabMes(t.key)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                tabMes === t.key ? 'border-indigo-500 text-indigo-700' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}>
              {t.label}
            </button>
          ))}

          {/* Filtros inline */}
          <div className="ml-auto flex items-center gap-2 py-1">
            <input value={busqueda} onChange={e => setBusqueda(e.target.value)}
              placeholder="🔍 Folio, cliente, UUID..."
              className="border border-gray-300 text-xs rounded-lg px-3 py-1.5 w-48 focus:ring-indigo-500 focus:border-indigo-500" />
            <select value={filtroCliente} onChange={e => setFiltroCliente(e.target.value)}
              className="border border-gray-300 text-xs rounded-lg px-2 py-1.5 max-w-[180px]">
              {clientes.map(c => <option key={c} value={c}>{c === 'TODOS' ? 'Todos los clientes' : c.substring(0, 30)}</option>)}
            </select>
            <select value={filtroMoneda} onChange={e => setFiltroMoneda(e.target.value)}
              className="border border-gray-300 text-xs rounded-lg px-2 py-1.5">
              <option value="TODAS">💱 Todas</option>
              <option value="USD">💵 USD</option>
              <option value="MXN">💴 MXN</option>
            </select>
            <select value={filtroCanceladas} onChange={e => setFiltroCanceladas(e.target.value)}
              className="border border-gray-300 text-xs rounded-lg px-2 py-1.5">
              <option value="TODOS">Todos</option>
              <option value="VIGENTES">✅ Vigentes</option>
              <option value="CANCELADAS">❌ Canceladas</option>
            </select>
          </div>
        </div>

        {/* ── Tabla ── */}
        <div className="flex-1 overflow-auto">
          <table className="min-w-full text-xs border-collapse">
            <thead className="bg-slate-800 text-white sticky top-0 z-10">
              <tr>
                {[
                  ['fecha',    'Fecha'],
                  ['remision', 'Remisión'],
                  ['folio',    'Folio'],
                  ['escaneado','Escaneado'],
                  ['cliente',  'Razón Social'],
                  ['comentarios','Comentarios'],
                  ['neto',     'Neto'],
                  ['imp',      'IVA'],
                  ['total',    'Total'],
                  ['pendiente','Pendiente'],
                  ['moneda',   'Moneda'],
                  ['tc',       'T.C.'],
                  ['vence',    'Vencimiento'],
                  [null,       'UUID'],
                  ['ref',      'Referencia'],
                ].map(([col, label]) => (
                  <th key={label}
                    onClick={() => col && handleSort(col)}
                    className={`px-3 py-2.5 text-left font-semibold uppercase tracking-wider whitespace-nowrap ${col ? 'cursor-pointer hover:bg-slate-700' : ''}`}>
                    {label}{col && <SortIcon col={col} />}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {facturasFiltradas.length === 0 ? (
                <tr><td colSpan={15} className="text-center py-12 text-gray-400">
                  <p className="text-4xl mb-2">📭</p>
                  No se encontraron registros con los filtros seleccionados.
                </td></tr>
              ) : (
                facturasFiltradas.map((f, i) => {
                  const isCanc = f.esCancelada;
                  const rowCls = isCanc
                    ? 'bg-red-50/60 opacity-75 hover:bg-red-50'
                    : i % 2 === 0 ? 'bg-white hover:bg-indigo-50/30' : 'bg-gray-50/50 hover:bg-indigo-50/30';
                  return (
                    <tr key={`${f.folio}-${i}`} className={`border-b border-gray-100 transition ${rowCls}`}>
                      <td className="px-3 py-2 whitespace-nowrap text-gray-600">{f.fecha}</td>
                      <td className="px-3 py-2 whitespace-nowrap font-mono text-gray-700">{f.remision}</td>
                      <td className="px-3 py-2 whitespace-nowrap font-bold text-indigo-700">{f.folio}</td>
                      <td className="px-3 py-2 text-center"><Badge cancelada={isCanc} escaneado={f.escaneado} /></td>
                      <td className="px-3 py-2 max-w-[200px] truncate font-medium text-gray-800" title={f.cliente}>{f.cliente}</td>
                      <td className="px-3 py-2 max-w-[180px] truncate text-gray-500 italic" title={f.comentarios}>{f.comentarios !== 'N/A' ? f.comentarios : ''}</td>
                      <td className="px-3 py-2 text-right font-medium text-gray-700">{formatMonto(f.neto, f.moneda)}</td>
                      <td className="px-3 py-2 text-right text-gray-500">{f.imp > 0 ? formatMonto(f.imp, f.moneda) : '—'}</td>
                      <td className="px-3 py-2 text-right font-bold text-gray-800">{formatMonto(f.total, f.moneda)}</td>
                      <td className={`px-3 py-2 text-right font-bold ${isCanc ? 'line-through text-gray-400' : f.pendiente > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {formatMonto(f.pendiente, f.moneda)}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${f.moneda.includes('Dólar') ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {f.moneda.includes('Dólar') ? '$ USD' : '$ MXN'}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-right text-gray-500">{f.tc === 1 ? '1.0' : f.tc.toFixed(4)}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-gray-500">{f.vence}</td>
                      <td className="px-3 py-2 font-mono text-gray-400 text-[10px] whitespace-nowrap">{f.uuid?.substring(0, 18)}…</td>
                      <td className="px-3 py-2 text-gray-500">{f.ref || '—'}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-t border-gray-200 flex-shrink-0 text-xs text-gray-500">
          <span>Mostrando <strong className="text-gray-700">{facturasFiltradas.length}</strong> de {FACTURAS.length} registros</span>
          <span className="flex items-center gap-2">
            <span className="bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold">❌ Canceladas: {kpis.canceladas}</span>
            <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-bold">✅ Activas: {kpis.activas}</span>
            <span className="text-gray-400">• Haz clic en los encabezados para ordenar</span>
          </span>
        </div>

      </div>
    </div>
  );
}
