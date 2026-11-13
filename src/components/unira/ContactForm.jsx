import { useState } from "react";
import { api } from "@/api/client";
import { Check } from "lucide-react";

const MOTIVOS = [
  ["convocatoria", "Una convocatoria está mal o ya venció"],
  ["institucion", "Quiero sumar una institución o convocatoria"],
  ["problema", "Tuve un problema en la plataforma"],
  ["otro", "Otro asunto"],
];

const inp = "w-full h-12 px-4 rounded-xl border border-border bg-white outline-none focus:border-[#2B4BFF]";

export default function ContactForm() {
  const [f, setF] = useState({ nombre: "", correo: "", motivo: "convocatoria", mensaje: "" });
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));

  const enviar = async (e) => {
    e.preventDefault();
    if (!f.mensaje.trim() || f.mensaje.trim().length < 10) {
      setError("Cuéntanos un poco más en el mensaje (al menos 10 letras).");
      return;
    }
    setError("");
    setEnviando(true);
    try {
      await api.entities.MensajeContacto.create({
        nombre: f.nombre.trim(),
        correo: f.correo.trim(),
        motivo: f.motivo,
        mensaje: f.mensaje.trim(),
        estado: "nuevo",
      });
      setEnviado(true);
    } catch {
      setError("No pudimos enviar tu mensaje. Intenta de nuevo en un momento.");
    } finally {
      setEnviando(false);
    }
  };

  if (enviado) {
    return (
      <div className="bg-white rounded-[20px] shadow-soft p-6 flex items-start gap-3">
        <Check className="w-6 h-6 p-1 rounded-full bg-[#1E9E5A] text-white shrink-0" />
        <div>
          <p className="font-bold">Ya recibimos tu mensaje.</p>
          <p className="text-sm text-[#5B6180] mt-1">
            Lo revisamos y, si nos dejaste correo, te respondemos ahí. Gracias por ayudar a que el
            catálogo siga siendo confiable.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={enviar} className="bg-white rounded-[20px] shadow-soft p-5 md:p-6 grid gap-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <label className="grid gap-1 text-sm font-medium">
          Tu nombre (opcional)
          <input className={inp} value={f.nombre} onChange={(e) => set("nombre", e.target.value)} placeholder="Cómo te llamas" maxLength={80} />
        </label>
        <label className="grid gap-1 text-sm font-medium">
          Tu correo (opcional)
          <input className={inp} type="email" value={f.correo} onChange={(e) => set("correo", e.target.value)} placeholder="para responderte" maxLength={120} />
        </label>
      </div>
      <label className="grid gap-1 text-sm font-medium">
        Motivo
        <select className={inp} value={f.motivo} onChange={(e) => set("motivo", e.target.value)}>
          {MOTIVOS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </label>
      <label className="grid gap-1 text-sm font-medium">
        Mensaje
        <textarea
          className="w-full min-h-[120px] p-4 rounded-xl border border-border bg-white outline-none focus:border-[#2B4BFF]"
          value={f.mensaje}
          onChange={(e) => set("mensaje", e.target.value)}
          placeholder="Cuéntanos qué pasó, con qué convocatoria o qué necesitas."
          maxLength={2000}
        />
      </label>
      {error && <p className="text-sm text-[#B42318]">{error}</p>}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={enviando}
          className="h-12 px-6 rounded-full bg-primary text-primary-foreground font-bold disabled:opacity-50"
        >
          {enviando ? "Enviando…" : "Enviar mensaje"}
        </button>
        <p className="text-xs text-[#5B6180]">Nunca te pediremos contraseñas, CURP ni datos bancarios.</p>
      </div>
    </form>
  );
}