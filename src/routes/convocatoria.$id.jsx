import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ExternalLink, CalendarDays, CheckCircle2, Flag } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import PublicHeader from "@/components/unira/PublicHeader";
import Footer from "@/components/unira/Footer";
import MiGuia from "@/components/unira/MiGuia";
import { Image } from "@/components/ui/image";
import { useAuth } from "@/lib/AuthContext";
import { TIPO, textoFecha, estaAbierta, fmt } from "@/lib/convocatorias";
import { obtenerPerfil, iniciarPostulacion } from "@/lib/postulaciones";

export const Route = createFileRoute("/convocatoria/$id")({
  head: () => ({ meta: [{ title: "Convocatoria | Unira" }] }),
  component: Detalle,
});

function Detalle() {
  const { id } = Route.useParams();
  const nav = useNavigate();
  const { isAuthenticated, navigateToLogin } = useAuth();
  const [c, setC] = useState(null);
  const [reqs, setReqs] = useState([]);
  const [po, setPo] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    base44.entities.Convocatoria.get(id).then(setC);
    base44.entities.RequisitoConvocatoria.filter({ convocatoria_id: id }, { sort: "orden", limit: 30 }).then((p) => setReqs(p.items));
  }, [id]);
  useEffect(() => {
    if (!isAuthenticated) return;
    base44.entities.Postulacion.filter({ convocatoria_id: id }, { limit: 1 }).then((p) => setPo(p.items[0] || null));
  }, [id, isAuthenticated]);

  if (!c) return <div className="min-h-screen"><PublicHeader /><div className="max-w-[1200px] mx-auto p-6"><div className="h-64 bg-white rounded-[28px] animate-pulse" /></div></div>;

  const empezar = async () => {
    if (!isAuthenticated) return navigateToLogin();
    setBusy(true);
    const perfil = await obtenerPerfil();
    if (!perfil) { setBusy(false); toast("Primero cuéntanos de ti con el quiz"); return nav({ to: "/quiz" }); }
    const nueva = await iniciarPostulacion(perfil, c);
    nav({ to: "/postulacion/$id", params: { id: nueva.id } });
  };
  const reportar = async () => {
    await base44.entities.ReporteDato.create({ convocatoria_id: c.id, motivo: "enlace_roto", detalle: "Reportado desde el detalle" });
    toast.success("Gracias, un curador lo revisará");
  };
  const abierta = estaAbierta(c);

  return (
    <div className="min-h-screen">
      <PublicHeader />
      <main className="max-w-[1200px] mx-auto px-4 md:px-6 pb-6">
        <section className="rounded-[28px] bg-gradient-to-r from-white to-[#FBF6EC] shadow-soft overflow-hidden grid md:grid-cols-[1.2fr_1fr]">
          <div className="p-8 md:p-12">
            <h1 className="font-serif-cond text-4xl md:text-[64px] md:leading-[66px]">{c.titulo}</h1>
            <div className="mt-5 inline-flex flex-wrap items-center gap-2 bg-white rounded-full shadow-soft px-3 py-2">
              <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">{TIPO[c.tipo]}</span>
              <span className="inline-flex items-center gap-1 text-sm bg-[#FBF6EC] px-3 py-1 rounded-full"><CalendarDays className="w-4 h-4" strokeWidth={1.75} /> {textoFecha(c)}</span>
              {c.demo && <span className="bg-[#FFC83D] text-xs font-bold px-3 py-1 rounded-full">Ejemplo</span>}
              {c.estado_verificacion === "por_revisar" && <span className="bg-[#ECEDF1] text-[#6B7084] text-xs px-3 py-1 rounded-full">Verificación pendiente</span>}
            </div>
            <p className="mt-4 text-[#5B6180]">{c.institucion_nombre}</p>
          </div>
          <div className="h-56 md:h-auto relative">{c.imagen_url && <Image src={c.imagen_url} alt={c.titulo} className="absolute inset-0 w-full h-full" />}</div>
        </section>

        <div className="mt-10 grid lg:grid-cols-[1fr_360px] gap-8">
          <div className="space-y-10">
            <section>
              <h2 className="font-serif-cond text-[28px] border-l-4 border-primary pl-3">Qué incluye</h2>
              <ul className="mt-4 space-y-3">
                {(c.beneficios?.length ? c.beneficios.map((b) => ({ t: b.titulo, d: b.detalle })) : [{ t: "Beneficio", d: c.monto_o_beneficio || "No lo sé, revisa la convocatoria oficial." }]).map((b) => (
                  <li key={b.t} className="flex gap-3 items-start"><CheckCircle2 className="w-9 h-9 p-1.5 rounded-full bg-[#FBF6EC] text-primary shrink-0" strokeWidth={1.75} /><div><div className="font-bold">{b.t}</div><div className="text-[#6B7084] text-sm">{b.d}</div></div></li>
                ))}
              </ul>
            </section>
            <section>
              <h2 className="font-serif-cond text-[28px] border-l-4 border-primary pl-3">Requisitos</h2>
              <ul className="mt-4 space-y-2">
                {reqs.map((r) => <li key={r.id} className="flex gap-3 items-center"><CheckCircle2 className="w-5 h-5 text-[#2B4BFF]" strokeWidth={1.75} /> {r.nombre}{r.borrador && <span className="text-xs text-[#6B7084]">(genérico, verifica en la oficial)</span>}</li>)}
              </ul>
            </section>
            <section className="bg-white rounded-[20px] shadow-soft p-5">
              <p className="text-sm text-[#5B6180]">Fuente oficial · Verificada el {fmt(c.fecha_verificacion) || "—"}</p>
              <a href={c.url_oficial} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[#2B4BFF] font-bold mt-1">Ver convocatoria oficial <ExternalLink className="w-4 h-4" /></a>
              <p className="text-sm mt-3">Unira no garantiza aceptación: la decide cada institución. Tú revisas y tú envías.</p>
              <button onClick={reportar} className="mt-3 text-xs underline text-[#5B6180] inline-flex items-center gap-1"><Flag className="w-3 h-3" /> Reportar enlace roto</button>
            </section>
          </div>
          <aside className="lg:sticky lg:top-6 self-start bg-white rounded-[20px] shadow-soft p-6">
            <h3 className="font-bold text-lg">{po ? "Tu avance" : "Empieza tu postulación"}</h3>
            <div className="mt-3 h-2 bg-[#E8ECFF] rounded-full overflow-hidden"><div className="h-full bg-[#2B4BFF]" style={{ width: `${po?.indice_preparacion || 0}%` }} /></div>
            <p className="text-[#2B4BFF] font-bold mt-1">{po?.indice_preparacion || 0}%</p>
            {abierta ? (
              po ? <Link to="/postulacion/$id" params={{ id: po.id }} className="mt-4 h-12 rounded-full bg-primary text-white font-bold flex items-center justify-center">Continuar con mi guía →</Link>
                 : <button disabled={busy} onClick={empezar} className="mt-4 w-full h-12 rounded-full bg-primary text-white font-bold disabled:opacity-60">{busy ? "Preparando…" : "Postular con mi guía"}</button>
            ) : (
              <button onClick={async () => { if (!isAuthenticated) return navigateToLogin(); await base44.entities.Guardado.create({ convocatoria_id: c.id, avisame_cuando_abra: true }); toast.success("Te avisaremos cuando abra"); }} className="mt-4 w-full h-12 rounded-full border-2 border-primary text-primary font-bold">Avísame cuando abra</button>
            )}
            <div className="mt-4 flex items-center gap-2"><MiGuia className="w-16 h-14" /><span className="text-sm bg-[#E8ECFF] rounded-xl px-3 py-2">{po ? "Sigue con tu checklist" : "Yo te acompaño paso a paso"}</span></div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}