import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import MiGuia from "@/components/unira/MiGuia";
import { guiaChat } from "@/lib/server-fns";

export const Route = createFileRoute("/_authed/guia")({
  validateSearch: (s) => ({ postulacion: s.postulacion }),
  head: () => ({ meta: [{ title: "Mi guía | Unira" }] }),
  component: Guia,
});

function Guia() {
  const { postulacion } = Route.useSearch();
  const chat = useServerFn(guiaChat);
  const [msgs, setMsgs] = useState([{
    rol: "guia",
    texto: postulacion
      ? "Hola, soy tu guía. Te acompaño en toda esta postulación. Tú revisas y tú envías. ¿En qué te ayudo?"
      : "Hola, soy tu guía. Puedo buscarte becas, cursos, empleos, prácticas o intercambios, y ayudarte a preparar una postulación. ¿Qué te gustaría encontrar?",
  }]);
  const [t, setT] = useState("");
  const [cargando, setCargando] = useState(false);

  const enviar = async (e) => {
    e.preventDefault();
    if (!t.trim() || cargando) return;
    const nuevo = [...msgs, { rol: "persona", texto: t }];
    setMsgs(nuevo);
    setT("");
    setCargando(true);
    const r = await chat({ data: { mensaje: t, postulacion_id: postulacion, historial: nuevo.slice(-8).map((m) => ({ rol: m.rol, texto: m.texto })) } });
    setMsgs([...nuevo, { rol: "guia", texto: r.respuesta, accion: r.accion_sugerida, url: r.url_oficial }]);
    setCargando(false);
  };

  return (
    <div className="p-4 md:p-10 max-w-2xl mx-auto flex flex-col min-h-[calc(100vh-6rem)]">
      <div className="text-center"><MiGuia estado={cargando ? "escribiendo" : "reposo"} className="w-32 h-28 mx-auto" /></div>
      <div className="flex-1 space-y-3 mt-4" aria-live="polite">
        {msgs.map((m, i) => (
          <div key={i} className={`max-w-[85%] rounded-2xl px-4 py-3 ${m.rol === "guia" ? "bg-white shadow-soft" : "bg-primary text-white ml-auto"}`}>
            {m.texto}
            {m.accion === "mejorar_carta" && postulacion && <Link to="/postulacion/$id" params={{ id: postulacion }} className="block mt-2 text-sm font-bold underline">Mejorar carta</Link>}
            {m.url && m.texto?.startsWith("No lo sé") && <a href={m.url} target="_blank" rel="noreferrer" className="block mt-2 text-sm underline text-[#2B4BFF]">Convocatoria oficial</a>}
          </div>
        ))}
        {cargando && <div className="bg-white shadow-soft rounded-2xl px-4 py-3 w-fit animate-pulse">Escribiendo…</div>}
      </div>
      <form onSubmit={enviar} className="mt-4 flex gap-2">
        <input value={t} onChange={(e) => setT(e.target.value)} placeholder="Escribe tu pregunta" aria-label="Mensaje" className="flex-1 h-12 rounded-full border border-border bg-white px-5" />
        <button disabled={cargando} className="h-12 px-6 rounded-full bg-primary text-white font-bold disabled:opacity-60">Enviar</button>
      </form>
    </div>
  );
}