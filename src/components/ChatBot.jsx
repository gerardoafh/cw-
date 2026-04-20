// src/components/ChatBot.jsx
import React, { useState, useRef, useEffect, useImperativeHandle, forwardRef } from 'react';

const ChatBot = forwardRef(function ChatBot({ isOpen, onToggle, kpis }, ref) {
  const [mensajes, setMensajes] = useState([{
    id: 0, esIA: true,
    texto: 'Hola. Soy tu Agente OpenClaw. Estoy monitoreando la empresa actual. ¿En qué te puedo ayudar hoy? Puedes pedirme resúmenes de deuda, estrategias de cobro o análisis de facturas.'
  }]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensajes, typing]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  // Permite inyectar un mensaje desde fuera (sugerirEstrategia)
  useImperativeHandle(ref, () => ({
    enviarPrompt(texto) {
      setInput(texto);
      setTimeout(() => procesarEnvio(texto), 100);
    }
  }));

  function procesarEnvio(texto) {
    const msg = texto || input.trim();
    if (!msg) return;

    setMensajes(prev => [...prev, { id: Date.now(), esIA: false, texto: msg }]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      setTyping(false);
      let respuesta = "Entendido. Procesando instrucción con la base de datos de CONTPAQi.";

      if (msg.toLowerCase().includes('cancelad')) {
        respuesta = `He detectado que en la tabla actual tienes <strong>${kpis?.canceladas ?? '?'} facturas canceladas</strong>. ¿Deseas que analice los motivos?`;
      } else if (msg.toLowerCase().includes('cobro') || msg.toLowerCase().includes('estrategia')) {
        respuesta = `Basado en el histórico, te sugiero enviar un recordatorio 3 días antes de la fecha de vencimiento. ¿Procedo a generar el borrador?`;
      } else if (msg.toLowerCase().includes('saldo') || msg.toLowerCase().includes('cartera')) {
        respuesta = `La cartera activa total es de <strong>${kpis?.saldoFormateado ?? '$0.00'}</strong> con ${kpis?.pendientes ?? 0} facturas pendientes. ¿Quieres un desglose por cliente?`;
      } else if (msg.toLowerCase().includes('analiz') || msg.toLowerCase().includes('factura')) {
        respuesta = `Revisando el historial... Detecté ${kpis?.pendientes ?? 0} facturas sin cobrar. Sugiero priorizar las de mayor antigüedad. ¿Deseas que genere un reporte?`;
      }

      setMensajes(prev => [...prev, { id: Date.now() + 1, esIA: true, texto: respuesta }]);
    }, 1500);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    procesarEnvio(input);
  };

  return (
    <div className={`fixed bottom-6 right-6 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 flex flex-col overflow-hidden fade-in-up ${isOpen ? '' : 'hidden'}`}>
      {/* Header */}
      <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-8 h-8 bg-indigo-500 rounded-full flex justify-center items-center font-bold shadow-inner">
              <i className="fa-solid fa-robot" />
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-slate-900 rounded-full" />
          </div>
          <div>
            <h4 className="font-bold text-sm leading-tight">Agente OpenClaw</h4>
            <p className="text-xs text-slate-300">Conectado a CONTPAQi</p>
          </div>
        </div>
        <button onClick={onToggle} className="text-slate-300 hover:text-white transition">
          <i className="fa-solid fa-times text-lg" />
        </button>
      </div>

      {/* Mensajes */}
      <div className="flex flex-col" style={{ height: '400px' }}>
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2" style={{ maxHeight: '340px' }}>
          {mensajes.map(m => (
            <div key={m.id}
              className={m.esIA
                ? "bg-gray-100 text-gray-800 p-3 rounded-lg rounded-bl-none max-w-[85%] self-start text-sm border border-gray-200 fade-in-up"
                : "bg-indigo-600 text-white p-3 rounded-lg rounded-br-none max-w-[85%] self-end text-sm fade-in-up"}
              dangerouslySetInnerHTML={{ __html: m.texto }}
            />
          ))}
          {typing && (
            <div className="bg-gray-100 border border-gray-200 p-3 rounded-lg rounded-bl-none max-w-[85%] self-start flex gap-1 items-center">
              {[0, 1, 2].map(i => (
                <span key={i} className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce inline-block"
                  style={{ animationDelay: `${i * 0.16}s` }} />
              ))}
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-200 p-3 bg-gray-50">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              autoComplete="off"
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Pregúntale a la IA..."
            />
            <button type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2 transition shadow flex justify-center items-center">
              <i className="fa-solid fa-paper-plane" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
});

export default ChatBot;
