import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import MiGuia from "@/components/unira/MiGuia";
import { generarBorrador } from "@/lib/server-fns";

const PREGUNTAS = [
  "¿Por qué quieres esta oportunidad?",
  "¿Qué has hecho que muestre tu esfuerzo o talento? (logros reales)",
  "¿Qué te gusta estudiar o hacer, y por qué?",
  "¿Cuál es tu meta a futuro?",
  "¿Qué dificultades has superado?",
];

export default function CartaTab({ po, onChange }) {
  const [b, setB] = useState(undefined);
  const [resp, setResp] = useState(PREGUNTAS.map(() => ""));
  const [cargando, setCargando] = useState(false);
  const [edit, setEdit] = useState(false);
  const [texto, setTexto] = useState("");
  const gen = useServerFn(generarBorrador);

  const cargar = async () => {
    const r = await base44.entities.Borrador.filter({ postulacion_id: po.id }, { limit: 1 });
    setB(r.items[0] || null);
    setTexto(r.items[0]?.texto || "");
  };
  useEffect(() => { cargar(); }, [po.id]);

  const crear = async () => {
    setCargando(true);
    const hechos = PREGUNTAS.map((q, i) => ({ id: `h${i + 1}`, pregunta: q, respuesta: resp[i] })).filter((h) => h.respuesta.trim());
    const nuevo = b || (await base44.entities.Borrador.create({ postulacion_id: po.id, tipo: "carta_motivacion", hechos_aportados: hechos, version: 0 }));
    if (b) await base44.entities.Borrador.update(b.id, { hechos_aportados: hechos });
    await gen({ data: { borrador_id: nuevo.id } });
    await base44.entities.Postulacion.update(po.id, { etapa: "redactando", siguiente_accion: "Tu carta está lista para revisar" });
    await cargar();
    onChange();
    setCargando(false);
  };
  const guardar = async () => { await base44.entities.Borrador.update(b.id, { texto, version: (b.version || 1) + 1, aprobado_por_usuario: false }); setEdit(false); cargar(); };
  const aprobar = async (ev) => {
    await base44.entities.Borrador.update(b.id, { aprobado_por_usuario: true, estado: "final" });
    const r = ev.currentTarget.getBoundingClientRect();
    confetti({ particleCount: 60, spread: 55, colors: ["#E6005C", "#2B4BFF", "#FFFFFF", "#FFC83D"], disableForReducedMotion: true, origin: { x: (r.left + r.width / 2) / window.innerWidth, y: r.top / window.innerHeight } });
    const ts = await base44.entities.TareaGuia.filter({ postulacion_id: po.id, tipo: "escrito" }, { limit: 5 });
    for (const t of ts.items) await base44.entities.TareaGuia.update(t.id, { estado: "completada" });
    toast.success("Carta aprobada");
    cargar(); onChange();
  };

  if (b === undefined) return <div className="h-40 bg-white rounded-[20px] animate-pulse" />;
  if (b?.texto) {
    const sin = b.afirmaciones_sin_respaldo || [];
    return (
      <div className="bg-white rounded-[20px] shadow-soft p-6">
        <span className="text-xs bg-[#FDE8F0] text-[#C8004F] font-bold px-3 py-1 rounded-full">Generada con tu guía</span>
        {edit ? <textarea value={texto} onChange={(e) => setTexto(e.target.value)} className="w-full mt-4 min-h-[260px] border border-border rounded-2xl p-4" /> : <p className="mt-4 whitespace-pre-wrap leading-7">{b.texto}</p>}
        {sin.length > 0 && <div className="mt-4 bg-[#FFF3C4] rounded-2xl p-4 text-sm"><b>Afirmaciones sin respaldo en tus respuestas:</b><ul className="list-disc pl-5">{sin.map((s) => <li key={s}>{s}</li>)}</ul>Edítalas o quítalas antes de aprobar.</div>}
        <ul className="mt-4 space-y-1 text-sm">{(b.criterios || []).map((c) => <li key={c.criterio}>{c.cumple ? "✓" : "Falta mejorar:"} {c.criterio}{!c.cumple && c.sugerencia ? ` · ${c.sugerencia}` : ""}</li>)}</ul>
        <div className="mt-5 flex flex-wrap gap-3">
          {edit ? <button onClick={guardar} className="h-12 px-6 rounded-full bg-primary text-white font-bold">Guardar</button> : <button onClick={() => setEdit(true)} className="h-12 px-6 rounded-full border-2 border-primary text-primary font-bold">Editar</button>}
          <button onClick={aprobar} disabled={b.aprobado_por_usuario || edit} className="h-12 px-6 rounded-full bg-primary text-white font-bold disabled:opacity-50">{b.aprobado_por_usuario ? "Aprobada ✓" : "Aprobar"}</button>
          <button onClick={crear} disabled={cargando} className="h-12 px-6 rounded-full border border-border font-medium">{cargando ? "Generando…" : "Volver a generar"}</button>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-[20px] shadow-soft p-6">
      <div className="flex items-center gap-3"><MiGuia estado={cargando ? "escribiendo" : "reposo"} className="w-16 h-14" /><p className="font-medium">Respóndeme con tus palabras. Solo usaré lo que me digas, sin inventar nada.</p></div>
      <div className="mt-4 space-y-4">
        {PREGUNTAS.map((q, i) => (
          <label key={q} className="block text-sm font-medium">{q}
            <textarea value={resp[i]} onChange={(e) => setResp(resp.map((x, j) => (j === i ? e.target.value : x)))} className="mt-1 w-full border border-border rounded-2xl p-3 min-h-[70px] font-normal" />
          </label>
        ))}
      </div>
      <button onClick={crear} disabled={cargando || resp.filter((x) => x.trim()).length < 3} className="mt-5 h-12 px-8 rounded-full bg-primary text-white font-bold disabled:opacity-50">{cargando ? "Escribiendo tu carta…" : "Crear mi carta"}</button>
      <p className="text-xs text-[#5B6180] mt-2">Responde al menos 3 preguntas.</p>
    </div>
  );
}