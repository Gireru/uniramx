import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import ConvCard from "@/components/unira/ConvCard";
import MiGuia from "@/components/unira/MiGuia";
import useDemo from "@/hooks/useDemo";
import { listarConvocatorias } from "@/lib/convocatorias";
import { calcularMatch } from "@/lib/match";
import { obtenerPerfil } from "@/lib/postulaciones";
import { explicarMatch } from "@/lib/server-fns";
import { base44 } from "@/api/base44Client";

export const Route = createFileRoute("/_authed/para-ti")({
  head: () => ({ meta: [{ title: "Para ti | Unira" }] }),
  component: ParaTi,
});

function Detalle({ m, ex }) {
  return (
    <details className="mt-2 text-sm">
      <summary className="cursor-pointer font-medium text-[#2B4BFF]">¿Por qué te conviene?</summary>
      <ul className="list-disc pl-5 mt-2 space-y-1">{(ex?.por_que_te_conviene || ["Pulsa de nuevo en unos segundos para ver la explicación."]).map((x) => <li key={x}>{x}</li>)}</ul>
      <p className="text-[#1E9E5A] mt-2 font-medium">Ya cumples: {m.ya_cumples.join("; ")}</p>
      {m.te_falta.length > 0 && <p className="text-[#B54708] mt-1 font-medium">Te falta: {m.te_falta.join("; ")}</p>}
    </details>
  );
}

function ParaTi() {
  const [demo] = useDemo();
  const [perfil, setPerfil] = useState(undefined);
  const [res, setRes] = useState(null);
  const [expl, setExpl] = useState({});
  const explicar = useServerFn(explicarMatch);

  useEffect(() => {
    (async () => {
      const p = await obtenerPerfil();
      setPerfil(p);
      if (!p) return;
      const cs = await listarConvocatorias(demo);
      const calc = cs.map((c) => ({ c, m: calcularMatch(p, c) }));
      setRes(calc);
      const top = calc.filter((x) => x.m.recomendada).sort((a, b) => b.m.pct - a.m.pct).slice(0, 5);
      if (top.length) {
        const r = await explicar({ data: { perfil: p, items: top.map(({ c, m }) => ({ convocatoria_id: c.id, titulo: c.titulo, resumen: c.resumen_sencillo, requisitos: [], ya_cumples: m.ya_cumples, te_falta: m.te_falta })) } });
        setExpl(Object.fromEntries((r.items || []).map((i) => [i.convocatoria_id, i])));
      }
    })();
  }, [demo]);

  if (perfil === null) return <div className="p-10 text-center"><MiGuia className="w-28 h-24 mx-auto" /><p className="mt-3">Primero cuéntanos de ti.</p><Link to="/quiz" className="mt-4 inline-flex h-12 px-6 items-center rounded-full bg-primary text-white font-bold">Haz el quiz</Link></div>;
  const rec = (res || []).filter((x) => x.m.recomendada).sort((a, b) => b.m.pct - a.m.pct);
  const crecer = (res || []).filter((x) => x.m.paraCrecer);
  const cerradas = (res || []).filter((x) => x.m.elegible && !x.m.abierta && x.c.estado_verificacion === "verificada" && x.c.vigencia === "cerrada");

  const avisar = (c) => base44.entities.Guardado.create({ convocatoria_id: c.id, perfil_id: perfil.id, avisame_cuando_abra: true });

  return (
    <div className="p-4 md:p-10">
      <h1 className="font-serif-cond text-3xl md:text-6xl">Para ti</h1>
      <h2 className="font-serif-cond text-2xl md:text-3xl mt-7 md:mt-8">Recomendadas para ti</h2>
      {res === null && <div className="mt-4 grid gap-4 md:gap-5 sm:grid-cols-2 xl:grid-cols-3">{[0, 1, 2].map((i) => <div key={i} className="h-72 bg-white rounded-[20px] animate-pulse" />)}</div>}
      <div className="mt-4 grid gap-4 md:gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {rec.map(({ c, m }) => (
          <ConvCard key={c.id} c={c} extra={<><span className="self-start bg-[#2B4BFF] text-white text-xs font-bold px-3 py-1 rounded-full">{m.pct}% match</span><p className="text-xs text-[#5B6180]">Afinidad con tus datos; no es la probabilidad de ser aceptado.</p><Detalle m={m} ex={expl[c.id]} /></>} />
        ))}
      </div>
      {res && rec.length === 0 && <p className="mt-4 bg-white rounded-[20px] p-6 shadow-soft">Hoy no hay convocatorias abiertas donde seas competitivo; te aviso cuando abra una.</p>}
      {crecer.length > 0 && <>
        <h2 className="font-serif-cond text-2xl md:text-3xl mt-8 md:mt-10">Para crecer</h2>
        <div className="mt-4 grid gap-4 md:gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {crecer.map(({ c, m }) => <ConvCard key={c.id} c={c} extra={<p className="text-sm text-[#B54708]">Plan: {m.te_falta.length ? m.te_falta.join("; ") : "Fortalece tu perfil con actividades afines"}.</p>} />)}
        </div></>}
      {cerradas.length > 0 && (
        <details className="mt-10"><summary className="font-serif-cond text-3xl cursor-pointer">Cerradas: avísame cuando abran</summary>
          <div className="mt-4 grid gap-4 md:gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {cerradas.map(({ c }) => <ConvCard key={c.id} c={c} extra={<button onClick={() => avisar(c)} className="text-sm text-primary font-bold text-left">Avísame cuando abra</button>} />)}
          </div></details>
      )}
    </div>
  );
}