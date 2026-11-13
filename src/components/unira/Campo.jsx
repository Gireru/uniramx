import { useEffect, useRef, useState } from "react";
import { Mic, Hand, Square } from "lucide-react";
import SenasPad from "@/components/unira/SenasPad";

// Campo de texto con dictado por voz (es-MX) y teclado de señas (deletreo LSM).
export default function Campo({ value, onChange, placeholder, multiline = false, className = "", label, type = "text", ...rest }) {
  const [escuchando, setEscuchando] = useState(false);
  const [senas, setSenas] = useState(false);
  const [error, setError] = useState("");
  const rec = useRef(null);
  const valor = useRef(value || "");
  const cambio = useRef(onChange);

  useEffect(() => { valor.current = value || ""; }, [value]);
  useEffect(() => { cambio.current = onChange; }, [onChange]);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const r = new SR();
    r.lang = "es-MX";
    r.continuous = false;
    r.interimResults = false;
    r.onresult = (e) => {
      const t = Array.from(e.results).map((x) => x[0].transcript).join(" ");
      cambio.current(`${valor.current ? valor.current + " " : ""}${t}`.trim());
    };
    r.onerror = () => setError("No pudimos escuchar. Revisa el micrófono.");
    r.onend = () => setEscuchando(false);
    rec.current = r;
    return () => r.abort();
  }, []);

  const dictar = () => {
    if (!rec.current) { setError("Tu navegador no permite dictado; usa el teclado de señas."); return; }
    setError("");
    if (escuchando) { rec.current.stop(); setEscuchando(false); return; }
    setEscuchando(true);
    rec.current.start();
  };

  const clase = `w-full rounded-2xl border border-border bg-white px-4 pr-24 text-[16px] ${multiline ? "py-3 min-h-[96px]" : "h-12"}`;
  return (
    <div className={className}>
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}
      <div className="relative">
        {multiline ? (
          <textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={clase} {...rest} />
        ) : (
          <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={clase} {...rest} />
        )}
        <div className="absolute right-2 top-0 h-12 flex items-center gap-1">
          <button type="button" onClick={dictar} aria-label={escuchando ? "Detener dictado" : "Dictar con la voz"} title="Dictar con la voz" className={`w-9 h-9 rounded-full flex items-center justify-center ${escuchando ? "bg-primary text-white animate-pulse" : "bg-[#FDE8F0] text-[#C8004F]"}`}>
            {escuchando ? <Square className="w-4 h-4" /> : <Mic className="w-4 h-4" strokeWidth={2} />}
          </button>
          <button type="button" onClick={() => setSenas(true)} aria-label="Escribir con lenguaje de señas" title="Escribir con señas" className="w-9 h-9 rounded-full bg-[#E8ECFF] text-[#2B4BFF] flex items-center justify-center">
            <Hand className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>
      </div>
      {error && <p className="text-xs text-[#B42318] mt-1">{error}</p>}
      {senas && <SenasPad onClose={() => setSenas(false)} onLetra={(l) => onChange(l === " " ? `${value} ` : `${value}${l}`)} />}
    </div>
  );
}