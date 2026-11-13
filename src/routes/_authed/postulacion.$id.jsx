import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Check, Circle, ExternalLink } from "lucide-react";
import { base44 } from "@/api/base44Client";
import MiGuia from "@/components/unira/MiGuia";
import CartaTab from "@/components/unira/CartaTab";
import ListoTab from "@/components/unira/ListoTab";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const Route = createFileRoute("/_authed/postulacion/$id")({
  head: () => ({ meta: [{ title: "Postulación | Unira" }] }),
  component: Postulacion,
});

function Postulacion() {
  const { id } = Route.useParams();
  const [po, setPo] = useState(null);
  const [c, setC] = useState(null);
  const [tareas, setTareas] = useState([]);

  const cargar = useCallback(async () => {
    const p = await base44.entities.Postulacion.get(id);
    setPo(p);
    setC(await base44.entities.Convocatoria.get(p.convocatoria_id));
    setTareas((await base44.entities.TareaGuia.filter({ postulacion_id: id }, { sort: "orden", limit: 50 })).items);
  }, [id]);
  useEffect(() => { cargar(); }, [cargar]);

  if (!po || !c) return <div className="p-10"><div className="h-60 bg-white rounded-[20px] animate-pulse" /></div>;

  const toggle = async (t) => {
    const nuevo = t.estado === "completada" ? "pendiente" : "completada";
    await base44.entities.TareaGuia.update(t.id, { estado: nuevo });
    const etapa = po.etapa === "descubierta" ? "elegibilidad_confirmada" : po.etapa === "elegibilidad_confirmada" ? "reuniendo_documentos" : po.etapa;
    await base44.entities.Postulacion.update(po.id, { etapa });
    cargar();
  };
  const hechas = tareas.filter((t) => t.estado === "completada").length;

  return (
    <div className="p-4 md:p-10 max-w-3xl">
      <Link to="/postulaciones" className="text-sm text-[#2B4BFF]">← Mis postulaciones</Link>
      <h1 className="font-serif-cond text-3xl md:text-5xl mt-2">{c.titulo}</h1>
      <p className="text-[#5B6180]">{c.institucion_nombre}{c.demo && " · Ejemplo"}</p>
      <div className="mt-4 h-2 bg-[#E8ECFF] rounded-full overflow-hidden"><div className="h-full bg-[#2B4BFF] transition-all" style={{ width: `${po.indice_preparacion || 0}%` }} /></div>
      <Tabs defaultValue="resumen" className="mt-6">
        <TabsList className="flex-wrap h-auto"><TabsTrigger value="resumen">Resumen</TabsTrigger><TabsTrigger value="checklist">Checklist</TabsTrigger><TabsTrigger value="carta">Carta</TabsTrigger><TabsTrigger value="listo">Listo para enviar</TabsTrigger></TabsList>
        <TabsContent value="resumen">
          <div className="bg-white rounded-[20px] shadow-soft p-6 space-y-3">
            <div className="flex items-center gap-3"><MiGuia className="w-16 h-14" /><p className="bg-[#E8ECFF] rounded-xl px-3 py-2 text-sm">{po.siguiente_accion || "Sigue tu checklist"}</p></div>
            <p><b>Afinidad (match):</b> {po.match_pct}% <span className="text-xs text-[#5B6180]">No es la probabilidad de ser aceptado.</span></p>
            <p><b>Fecha límite:</b> {c.fecha_limite ? c.fecha_limite.split("-").reverse().join("/") : c.fecha_limite_texto || "verificar"}</p>
            <a href={c.url_oficial} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[#2B4BFF] font-bold">Convocatoria oficial <ExternalLink className="w-4 h-4" /></a>
            <p className="text-sm">Unira no garantiza aceptación: la decide cada institución. Tú revisas y tú envías.</p>
          </div>
        </TabsContent>
        <TabsContent value="checklist">
          <div className="bg-white rounded-[20px] shadow-soft p-4">
            <p className="text-sm text-[#5B6180] mb-2">{hechas} de {tareas.length} pasos. Sube solo lo que pide esta convocatoria; nunca te pediremos contraseñas ni datos bancarios.</p>
            <ul className="divide-y divide-border">
              {tareas.map((t) => (
                <li key={t.id}><button onClick={() => toggle(t)} className="w-full min-h-[52px] flex items-center gap-3 text-left py-2">
                  {t.estado === "completada" ? <Check className="w-6 h-6 p-1 rounded-full bg-[#1E9E5A] text-white" /> : <Circle className="w-6 h-6 text-[#2B4BFF]" strokeWidth={1.75} />}
                  <span className="flex-1"><span className={t.estado === "completada" ? "line-through text-[#6B7084]" : "font-medium"}>{t.titulo}</span><span className="block text-xs text-[#5B6180]">Responsable: {t.responsable}{t.fecha_sugerida ? ` · antes del ${t.fecha_sugerida.split("-").reverse().join("/")}` : ""}</span></span>
                </button></li>
              ))}
            </ul>
          </div>
        </TabsContent>
        <TabsContent value="carta"><CartaTab po={po} onChange={cargar} /></TabsContent>
        <TabsContent value="listo"><ListoTab po={po} c={c} tareas={tareas} onChange={cargar} /></TabsContent>
      </Tabs>
    </div>
  );
}