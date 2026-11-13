import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Clock, Send, CheckCircle2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import MiGuia from "@/components/unira/MiGuia";
import PostulacionRow from "@/components/unira/PostulacionRow";
import { obtenerPerfil } from "@/lib/postulaciones";

export const Route = createFileRoute("/_authed/inicio")({
  head: () => ({ meta: [{ title: "Inicio | Unira" }] }),
  component: Inicio,
});

function Stat({ n, label, Icon }) {
  return (
    <div className="bg-white rounded-[20px] shadow-soft p-5 flex items-center justify-between">
      <div><div className="font-serif-cond text-6xl text-primary">{n ?? "…"}</div><div className="text-sm text-[#5B6180]">{label}</div></div>
      <div className="w-12 h-12 rounded-full bg-[#FDE8F0] flex items-center justify-center"><Icon className="w-6 h-6 text-primary" strokeWidth={1.75} /></div>
    </div>
  );
}

function Inicio() {
  const [perfil, setPerfil] = useState(undefined);
  const [lista, setLista] = useState(null);
  const [c, setC] = useState({});

  useEffect(() => {
    obtenerPerfil().then(setPerfil);
    base44.entities.Postulacion.list("-updated_date", 5).then((p) => setLista(p.items));
    Promise.all([
      base44.entities.Postulacion.count({ etapa: { $in: ["descubierta", "elegibilidad_confirmada", "plan_listo", "reuniendo_documentos", "redactando", "revision_final", "lista_para_enviar"] } }),
      base44.entities.Postulacion.count({ etapa: { $in: ["enviada", "seguimiento", "resultado_registrado"] } }),
      base44.entities.Postulacion.count({ resultado: "aceptada" }),
    ]).then(([a, b, d]) => setC({ a, b, d }));
  }, []);

  const sig = lista?.[0]?.siguiente_accion;
  return (
    <div className="p-4 md:p-10 grid xl:grid-cols-[1fr_320px] gap-8">
      <div>
        <h1 className="font-serif-cond text-4xl md:text-[72px] md:leading-[72px]">Hola, {perfil?.nombre_preferido || ""},</h1>
        <p className="text-[#5B6180] mt-2">Aquí tienes el estado de tus postulaciones.</p>
        <div className="grid sm:grid-cols-3 gap-4 mt-6">
          <Stat n={c.a} label="En curso" Icon={Clock} /><Stat n={c.b} label="Enviadas" Icon={Send} /><Stat n={c.d} label="Aceptadas" Icon={CheckCircle2} />
        </div>
        <div className="flex justify-between items-end mt-10"><h2 className="font-serif-cond text-3xl">Mis postulaciones</h2><Link to="/postulaciones" className="text-[#2B4BFF] font-bold">Ver todas &gt;</Link></div>
        <div className="mt-4 space-y-3">
          {lista === null && <div className="h-24 bg-white rounded-[20px] animate-pulse" />}
          {lista?.map((p) => <PostulacionRow key={p.id} p={p} />)}
          {lista?.length === 0 && (
            <div className="bg-white rounded-[20px] shadow-soft p-8 text-center">
              <MiGuia estado="durmiendo" className="w-24 h-20 mx-auto" />
              <p className="mt-2">Aún no tienes postulaciones.</p>
              <Link to={perfil ? "/para-ti" : "/quiz"} className="mt-4 inline-flex h-12 px-6 items-center rounded-full bg-primary text-white font-bold">{perfil ? "Ver recomendaciones" : "Haz el quiz"}</Link>
            </div>
          )}
        </div>
      </div>
      <aside className="bg-white rounded-[20px] shadow-soft p-6 self-start text-center">
        <h3 className="font-bold">Tu guía</h3>
        <MiGuia className="w-32 h-28 mx-auto" />
        <p className="bg-[#E8ECFF] rounded-xl p-3 text-sm mt-2">{sig || "Cuéntame de ti y te recomiendo oportunidades."}</p>
        <Link to="/guia" className="mt-4 h-12 rounded-full bg-primary text-white font-bold flex items-center justify-center">Hablar con Mi guía</Link>
      </aside>
    </div>
  );
}