import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { GraduationCap, School, BookOpen, Backpack, Users } from "lucide-react";
import ConvCard from "@/components/unira/ConvCard";
import useDemo from "@/hooks/useDemo";
import { NIVELES, listarConvocatorias, estaAbierta } from "@/lib/convocatorias";

const ICONOS = { primaria: Backpack, secundaria: School, prepa: BookOpen, universidad: GraduationCap, padres: Users };

export default function AbiertasAhora() {
  const [demo] = useDemo();
  const [nivel, setNivel] = useState(null);
  const [items, setItems] = useState(null);

  useEffect(() => {
    setItems(null);
    listarConvocatorias(demo).then(setItems);
  }, [demo]);

  const abiertas = (items || []).filter(estaAbierta).filter((c) => !nivel || nivel === "padres" || c.etapas_objetivo?.includes(nivel));
  const visibles = abiertas.slice(0, 4);

  return (
    <section className="max-w-[1200px] mx-auto px-4 md:px-6 mt-10 md:mt-[72px]">
      <div className="flex flex-wrap justify-center gap-2 md:gap-3">
        {NIVELES.map((n) => {
          const Icon = ICONOS[n.id];
          const on = nivel === n.id;
          return (
            <button
              key={n.id}
              onClick={() => (n.id === "padres" ? (window.location.href = "/padres") : setNivel(on ? null : n.id))}
              aria-pressed={on}
              className={`min-h-[44px] px-5 rounded-full border-2 inline-flex items-center gap-2 font-medium transition-colors ${on ? "bg-accent border-primary text-[#C8004F]" : "bg-white border-transparent shadow-soft"}`}
            >
              <Icon className="w-5 h-5" strokeWidth={1.75} /> {n.label}
            </button>
          );
        })}
      </div>
      <div className="mt-10 flex items-end justify-between flex-wrap gap-2">
        <h2 className="font-serif-cond text-4xl">Abiertas ahora</h2>
        <Link to="/explorar" className="text-[#2B4BFF] font-bold">Ver todas las oportunidades →</Link>
      </div>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items === null && Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-72 rounded-[20px] bg-white animate-pulse" />)}
        {visibles.map((c, i) => (
          <motion.div key={c.id} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
            <ConvCard c={c} />
          </motion.div>
        ))}
      </div>
      {items && visibles.length === 0 && (
        <p className="mt-6 bg-white rounded-[20px] p-6 shadow-soft text-[#5B6180]">
          Hoy no hay convocatorias reales abiertas para este nivel. Explora todas y pide que te avisemos cuando abran.
        </p>
      )}
    </section>
  );
}