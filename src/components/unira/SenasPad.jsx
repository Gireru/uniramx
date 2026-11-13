import { Space, X } from "lucide-react";
import { Button } from "@/components/ui/button";

// Deletreo con abecedario manual (LSM): cada tecla muestra la letra y una mano que la representa.
const LETRAS = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");

function Mano({ letra }) {
  return (
    <svg viewBox="0 0 40 40" className="w-6 h-6" aria-hidden="true">
      <rect x="9" y="16" width="22" height="18" rx="7" fill="#FFE0EC" stroke="#C8004F" strokeWidth="1.6" />
      <path d={`M13 17V${6 + (letra.charCodeAt(0) % 6)}`} stroke="#C8004F" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M19 17V5" stroke="#C8004F" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M25 17V8" stroke="#C8004F" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M30 19V13" stroke="#C8004F" strokeWidth="2.2" strokeLinecap="round" />
      <text x="20" y="31" textAnchor="middle" fontSize="11" fontWeight="700" fill="#C8004F">{letra}</text>
    </svg>
  );
}

export default function SenasPad({ onLetra, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-foreground/40 flex items-end md:items-center justify-center p-3" role="dialog" aria-label="Teclado de señas">
      <div className="bg-white rounded-[24px] shadow-lift w-full max-w-md p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold">Escribe con señas</h3>
          <button onClick={onClose} aria-label="Cerrar" className="w-9 h-9 rounded-full bg-muted flex items-center justify-center"><X className="w-4 h-4" /></button>
        </div>
        <p className="text-xs text-[#5B6180] mt-1">Toca la letra que quieras agregar. Es un abecedario de apoyo, no reconocimiento automático de cámara.</p>
        <div className="grid grid-cols-7 gap-1.5 mt-3 max-h-[46vh] overflow-y-auto">
          {LETRAS.map((l) => (
            <button key={l} onClick={() => onLetra(l.toLowerCase())} className="aspect-square rounded-xl bg-[#FBF6EC] hover:bg-accent flex items-center justify-center" aria-label={`Letra ${l}`}>
              <Mano letra={l} />
            </button>
          ))}
        </div>
        <div className="flex gap-2 mt-3">
          <Button variant="outline" className="flex-1 h-11 rounded-full" onClick={() => onLetra(" ")}><Space className="w-4 h-4 mr-2" />Espacio</Button>
          <Button className="flex-1 h-11 rounded-full bg-primary" onClick={onClose}>Listo</Button>
        </div>
      </div>
    </div>
  );
}