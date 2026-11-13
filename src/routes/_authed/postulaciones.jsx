import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import PostulacionRow from "@/components/unira/PostulacionRow";

export const Route = createFileRoute("/_authed/postulaciones")({
  head: () => ({ meta: [{ title: "Mis postulaciones | Unira" }] }),
  component: Postulaciones,
});

function Postulaciones() {
  const [lista, setLista] = useState(null);
  useEffect(() => { base44.entities.Postulacion.list("-updated_date", 50).then((p) => setLista(p.items)); }, []);
  return (
    <div className="p-4 md:p-10 max-w-3xl">
      <h1 className="font-serif-cond text-4xl md:text-6xl">Mis postulaciones</h1>
      <div className="mt-6 space-y-3">
        {lista === null && [0, 1, 2].map((i) => <div key={i} className="h-24 bg-white rounded-[20px] animate-pulse" />)}
        {lista?.map((p) => <PostulacionRow key={p.id} p={p} />)}
        {lista?.length === 0 && <p className="text-[#5B6180]">Todavía no has iniciado ninguna postulación. Explora oportunidades y pulsa "Postular con mi guía".</p>}
      </div>
    </div>
  );
}