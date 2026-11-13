import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { api } from "@/api/client";
import MiGuia from "@/components/unira/MiGuia";
import { calcularPreparacion } from "@/lib/match";

const COL = ["#E6005C", "#2B4BFF", "#FFFFFF", "#FFC83D"];

export default function ListoTab({ po, c, tareas, onChange }) {
  const [borrador, setBorrador] = useState(null);
  const [perfil, setPerfil] = useState(null);
  const [pregunta, setPregunta] = useState(false);

  useEffect(() => {
    api.entities.Borrador.filter({ postulacion_id: po.id }, { limit: 1 }).then((r) => setBorrador(r.items[0] || null));
    api.entities.Perfil.filter({ id: po.perfil_id }, { limit: 1 }).then((r) => setPerfil(r.items[0] || null));
  }, [po.id]);

  const prep = calcularPreparacion({ tareas, borrador, etapa: po.etapa === "descubierta" ? "redactando" : po.etapa, esMenor: perfil?.es_menor, tutorAprobo: po.tutor_aprobo, convocatoria: c });
  const revisionHecha = ["revision_final", "lista_para_enviar", "enviada", "seguimiento", "resultado_registrado"].includes(po.etapa);
  const prepReal = calcularPreparacion({ tareas, borrador, etapa: po.etapa, esMenor: perfil?.es_menor, tutorAprobo: po.tutor_aprobo, convocatoria: c });
  useEffect(() => {
    if (borrador === null && !perfil) return;
    if (prepReal.indice !== (po.indice_preparacion || 0)) {
      api.entities.Postulacion.update(po.id, { indice_preparacion: prepReal.indice }).then(onChange);
    }
  }, [prepReal.indice, borrador, perfil]);
  const listo = ["lista_para_enviar", "enviada", "seguimiento", "resultado_registrado"].includes(po.etapa);

  const upd = async (d) => { await api.entities.Postulacion.update(po.id, d); onChange(); };
  const revisar = () => upd({ etapa: "revision_final", indice_preparacion: calcularPreparacion({ tareas, borrador, etapa: "revision_final", esMenor: perfil?.es_menor, tutorAprobo: po.tutor_aprobo, convocatoria: c }).indice });
  const pasarListo = () => {
    // La puerta se valida de nuevo aquí: en menores nada avanza sin tutor_aprobo.
    if (!prepReal.puedeEnviar) return;
    upd({ etapa: "lista_para_enviar", indice_preparacion: prepReal.indice, siguiente_accion: "Todo listo: tú revisas y envías" });
  };
  const yaEnvie = async () => {
    if (perfil?.es_menor && !po.tutor_aprobo) return;
    confetti({ particleCount: 160, angle: 60, spread: 70, origin: { x: 0, y: 0.7 }, colors: COL, disableForReducedMotion: true });
    confetti({ particleCount: 160, angle: 120, spread: 70, origin: { x: 1, y: 0.7 }, colors: COL, disableForReducedMotion: true });
    await upd({ etapa: "enviada", fecha_envio_autodeclarada: new Date().toISOString().slice(0, 10), siguiente_accion: "Registra el resultado cuando lo sepas" });
    setPregunta(false);
  };
  const resultado = async (r) => {
    if (r === "aceptada") confetti({ particleCount: 200, spread: 100, colors: COL, disableForReducedMotion: true });
    await upd({ resultado: r, etapa: "resultado_registrado" });
  };

  return (
    <div className="bg-white rounded-[20px] shadow-soft p-6 text-center">
      <p className="text-sm text-[#5B6180]">Tu preparación: qué tan completa y sólida está tu postulación (no es la probabilidad de ser aceptado).</p>
      <div className="font-serif-cond text-6xl text-primary mt-2">{prepReal.indice}%</div>
      {listo ? (
        <>
          <MiGuia estado="celebrando" className="w-24 h-20 mx-auto" />
          <h3 className="font-serif-cond text-3xl">Listo para enviar</h3>
          <p className="mt-1">Carta ✓ · Checklist ✓</p>
          <p className="font-medium mt-1">Tú revisas y envías.</p>
          {po.etapa === "lista_para_enviar" && (
            <div className="mt-4 flex flex-col items-center gap-3">
              <a href={c.url_postulacion || c.url_oficial} target="_blank" rel="noreferrer" onClick={() => setPregunta(true)} className="h-12 px-8 rounded-full bg-primary text-white font-bold flex items-center">Ir a enviar</a>
              {pregunta && <div><p>¿Ya enviaste tu solicitud?</p><button onClick={yaEnvie} className="mt-2 h-12 px-6 rounded-full bg-[#2B4BFF] text-white font-bold">Sí, ya la envié</button></div>}
            </div>
          )}
          {["enviada", "seguimiento"].includes(po.etapa) && (
            <div className="mt-4"><p className="font-medium">Registrar resultado</p>
              <div className="flex flex-wrap gap-2 justify-center mt-2">{[["aceptada", "Aceptada"], ["no_aceptada", "No aceptada"], ["en_espera", "En espera"], ["retirada", "Retirada"]].map(([k, l]) => <button key={k} onClick={() => resultado(k)} className="h-11 px-5 rounded-full border border-border font-medium">{l}</button>)}</div>
            </div>
          )}
          {po.resultado && <p className="mt-4 font-bold">Resultado autodeclarado: {po.resultado.replace("_", " ")}</p>}
        </>
      ) : (
        <>
          {prepReal.faltan.length > 0 ? <ul className="mt-3 text-left max-w-sm mx-auto list-disc pl-5 text-sm">{prepReal.faltan.map((f) => <li key={f}>{f}</li>)}</ul> : <p className="mt-3 text-[#1E9E5A] font-medium">¡Todo cubierto!</p>}
          {perfil?.es_menor && !po.tutor_aprobo && <button onClick={() => upd({ tutor_aprobo: true })} className="mt-4 h-11 px-5 rounded-full border-2 border-[#2B4BFF] text-[#2B4BFF] font-bold">Soy el tutor y apruebo esta postulación</button>}
          {!revisionHecha && <button onClick={revisar} className="mt-4 ml-2 h-11 px-5 rounded-full border border-border font-medium">Hice mi revisión final</button>}
          <div><button onClick={pasarListo} disabled={!prepReal.puedeEnviar} className="mt-4 h-12 px-8 rounded-full bg-primary text-white font-bold disabled:opacity-40">Marcar como lista para enviar</button></div>
        </>
      )}
    </div>
  );
}