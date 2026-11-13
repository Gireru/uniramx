import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { base44 } from "@/api/base44Client";
import PublicHeader from "@/components/unira/PublicHeader";
import Footer from "@/components/unira/Footer";
import ConvCard from "@/components/unira/ConvCard";
import useDemo from "@/hooks/useDemo";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/explorar")({
  validateSearch: (s) => ({ tipo: s.tipo, nivel: s.nivel, alcance: s.alcance }),
  head: () => ({ meta: [{ title: "Explorar becas, apoyos, cursos y concursos | Unira" }] }),
  component: Explorar,
});

const sel = "h-11 rounded-full bg-white border border-border px-4 text-sm";

function Explorar() {
  const search = Route.useSearch();
  const [demo, setDemo] = useDemo();
  const [tipo, setTipo] = useState(search.tipo || "");
  const [nivel, setNivel] = useState(search.nivel || "");
  const [alcance, setAlcance] = useState(search.alcance || "");
  const [estado, setEstado] = useState("");
  const [abiertas, setAbiertas] = useState(false);
  const [q, setQ] = useState("");
  const [items, setItems] = useState(null);

  useEffect(() => {
    setItems(null);
    const f = { activa: true };
    if (!demo) f.demo = false;
    if (tipo) f.tipo = tipo;
    if (nivel) f.etapas_objetivo = nivel;
    if (estado) f.vigencia = estado;
    if (alcance) f.alcance = alcance;
    if (abiertas) f.vigencia = { $in: ["vigente", "permanente"] };
    if (q.trim()) f.titulo = { $regex: q.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" };
    const t = setTimeout(() => base44.entities.Convocatoria.filter(f, { sort: "-created_date", limit: 60 }).then((p) => setItems(p.items)), 250);
    return () => clearTimeout(t);
  }, [tipo, nivel, estado, alcance, abiertas, q, demo]);

  return (
    <div className="min-h-screen">
      <PublicHeader />
      <main className="max-w-[1200px] mx-auto px-4 md:px-6 py-6">
        <h1 className="font-serif-cond text-4xl md:text-[56px] md:leading-[60px]">Explorar oportunidades</h1>
        <div className="mt-6 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-5 h-5 absolute left-4 top-3 text-[#5B6180]" strokeWidth={1.75} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar" aria-label="Buscar" className={`${sel} w-full pl-11`} />
          </div>
          <select aria-label="Tipo" className={sel} value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="">Todos los tipos</option><option value="beca">Becas</option><option value="apoyo">Apoyos</option><option value="curso">Cursos</option><option value="concurso">Concursos</option><option value="empleo">Empleo</option><option value="practica">Prácticas</option><option value="intercambio">Intercambios</option>
          </select>
          <select aria-label="Lugar" className={sel} value={alcance} onChange={(e) => setAlcance(e.target.value)}>
            <option value="">En México y el extranjero</option><option value="mexico">En México</option><option value="internacional">En el extranjero</option>
          </select>
          <select aria-label="Nivel" className={sel} value={nivel} onChange={(e) => setNivel(e.target.value)}>
            <option value="">Todos los niveles</option><option value="primaria">Primaria</option><option value="secundaria">Secundaria</option><option value="prepa">Prepa</option><option value="universidad">Universidad</option><option value="posgrado">Posgrado</option><option value="adulto">Adulto</option>
          </select>
          <select aria-label="Estado" className={sel} value={estado} onChange={(e) => { setEstado(e.target.value); setAbiertas(false); }}>
            <option value="">Cualquier estado</option><option value="vigente">Vigente</option><option value="proxima">Próxima</option><option value="cerrada">Cerrada</option><option value="por_confirmar">Por confirmar</option>
          </select>
          <label className="flex items-center gap-2 text-sm font-medium"><Switch checked={abiertas} onCheckedChange={(v) => { setAbiertas(v); setEstado(""); }} /> Abiertas ahora</label>
          <label className="flex items-center gap-2 text-sm"><Switch checked={demo} onCheckedChange={setDemo} /> Ver ejemplos</label>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items === null && Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-72 rounded-[20px] bg-white animate-pulse" />)}
          {items?.map((c) => <ConvCard key={c.id} c={c} />)}
        </div>
        {items?.length === 0 && <p className="mt-8 text-[#5B6180]">No encontramos resultados con esos filtros.</p>}
      </main>
      <Footer />
    </div>
  );
}