# ⚡ OpenClaw CONTPAQi — React Dashboard

Monitor de cuentas por cobrar con IA para CONTPAQi. Migración completa 1:1 del dashboard HTML original a **React + Vite + Tailwind CSS**, organizado en módulos independientes.


## 🚀 Instalación

```bash
cd openclaw-react
npm install
npm run dev
# Abre http://localhost:3000
```


## 📁 Estructura completa

```
src/
├── components/
│   ├── Header.jsx            → Navbar + barra de progreso de sincronización
│   ├── KPICards.jsx          → 4 tarjetas (Total, Saldo, Canceladas, Pendientes)
│   ├── FiltrosBar.jsx        → Filtros cliente/estado + botones Reporte IA / Exportar / Refresh
│   ├── FacturasTable.jsx     → Tabla con badges VIGENTE/CANCELADA/PAGADA/PENDIENTE + botones
│   ├── ChatBot.jsx           → Chat flotante con inyección de prompt desde la tabla
│   └── modals/
│       ├── AIMenuModal.jsx       → Menú Centro de Comando IA
│       ├── AuditoriaModal.jsx    → Auditoría inteligente CFDI
│       ├── ProyeccionModal.jsx   → Proyección de flujo 30/60 días
│       ├── CambiarioModal.jsx    → Riesgo cambiario MXN/USD/EUR
│       ├── ReporteIAModal.jsx    → Insight Engine V2.0 (análisis generativo)
│       ├── ExcelReportesModal.jsx → Centro de Reportes Excel (6 tipos)
│       └── ExcelViewerModal.jsx  → 🆕 Visor drag-and-drop de archivos Excel
│
├── hooks/
│   └── useFacturas.js        → Fetch API C# + fallback offline + filtros + progreso
│
├── utils/
│   ├── mockData.js           → Datos dummy + normalizarDocumentos (detección 1/0 robusta)
│   └── reportes.js           → Toda la lógica Excel: Control AR, Corporativo, CSV, Vencidas, etc.
│
├── App.jsx                   → Orquestador raíz
└── main.jsx                  → Punto de entrada
```


## ✅ Funcionalidades migradas del HTML original

| Feature | Estado |
|---|---|
| Fetch API C# con fallback offline | ✅ |
| Detección robusta cancelada/pagada (1/0/true/false) | ✅ |
| KPIs: Total, Saldo Activo, Canceladas, Pendientes | ✅ |
| Filtros: por cliente + por estatus | ✅ |
| Tabla con badges VIGENTE/CANCELADA/PAGADA/PENDIENTE | ✅ |
| Botón Analizar → inyecta prompt en Chatbot | ✅ |
| Botón Cobrar ✨ → confirmación Telegram | ✅ |
| Reporte IA → Insight Engine V2.0 | ✅ |
| Exportar Pantalla CSV | ✅ |
| Centro Reportes → Control AR (hojas por cliente) | ✅ |
| Centro Reportes → Resumen Corporativo | ✅ |
| Centro Reportes → Cartera Vencida | ✅ |
| Centro Reportes → Facturas Pagadas | ✅ |
| Centro Reportes → Solo Canceladas | ✅ |
| Auditoría Inteligente CFDI | ✅ |
| Proyección de Flujo 30/60 días | ✅ |
| Riesgo Cambiario MXN/USD/EUR | ✅ |
| Chatbot flotante con respuestas contextuales | ✅ |
| Barra de progreso de sincronización (60s) | ✅ |
| Banner Modo Offline | ✅ |
| Visor Excel drag-and-drop (nuevo) | ✅ |


## 🔌 Conectar tu API C# de CONTPAQi

En `src/hooks/useFacturas.js`:

```js
const API_BASE_URL = 'http://localhost:5000/api/facturas';
```

Si la API no responde → modo offline automático con datos de muestra.
