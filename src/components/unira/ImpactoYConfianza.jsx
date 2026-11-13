import { useEffect, useState } from "react";
import { Bot, ShieldCheck, CalendarCheck, HandHeart, Ban } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Star } from "@/components/unira/Doodles";

const PASOS = [
  ["Cuéntanos de ti", "Un quiz corto de 3 a 5 minutos."],
  ["Descubre opciones", "Solo te recomendamos donde eres competitivo."],
  ["Prepárate con tu guía", "Documentos, carta con tu voz y más."],
  ["Postula tú", "Tú revisas y tú envías. Si eres menor, tu tutor aprueba."],
];
const CONFIANZA = [
  [ShieldCheck, "Fuentes oficiales"],
  [CalendarCheck, "Fecha de verificación visible"],
  [HandHeart, "Sin cobros"],
  [Ban, "Sin promesas de aceptación"],
];

export default function ImpactoYConfianza() {
  const [n, setN] = useState(null);
  useEffect(() => {
    base44.entities.Convocatoria.count({ activa: true, demo: false, estado_verificacion: "verificada" }).then(setN);
  }, []);
  return (
    <>
      <section className="max-w-[1200px] mx-auto px-4 md:px-6 mt-10 md:mt-[72px]">
        <div className="relative bg-white rounded-[28px] shadow-soft grid md:grid-cols-3 md:divide-x divide-border">
          <Star className="absolute left-3 top-3 w-8 h-8" />
          <div className="p-8 text-center">
            <div className="font-serif-cond text-6xl text-primary">{n === null ? "…" : `+${n}`}</div>
            <p className="font-medium mt-2">oportunidades verificadas</p>
          </div>
          <div className="p-8 text-center">
            <div className="font-serif-cond text-6xl text-primary flex items-center justify-center gap-2">24/7 <Bot className="w-10 h-10" strokeWidth={1.75} /></div>
            <p className="font-medium mt-2">guía con IA</p>
          </div>
          <div className="p-8 text-center">
            <div className="font-serif-cond text-5xl text-primary">Meta: +75%</div>
            <p className="font-medium mt-2">de aceptación entre quienes completan su postulación con la guía</p>
            <p className="text-sm text-[#5B6180] mt-1">Es una meta, no una garantía.</p>
          </div>
        </div>
      </section>
      <section className="max-w-[1200px] mx-auto px-4 md:px-6 mt-10 md:mt-[72px]">
        <h2 className="font-serif-cond text-4xl">Cómo funciona</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PASOS.map(([t, d], i) => (
            <div key={t} className="bg-white rounded-[20px] shadow-soft p-6">
              <div className="w-10 h-10 rounded-full bg-accent text-[#C8004F] font-bold flex items-center justify-center">{i + 1}</div>
              <h3 className="font-bold mt-3">{t}</h3>
              <p className="text-sm text-[#5B6180] mt-1">{d}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="max-w-[1200px] mx-auto px-4 md:px-6 mt-10 md:mt-[72px]">
        <h2 className="font-serif-cond text-4xl">Confianza</h2>
        <p className="text-[#5B6180] mt-2 max-w-2xl">Una iniciativa comunitaria para apoyar a jóvenes de todos los sectores, y a sus familias, a llegar a becas, apoyos, cursos y concursos.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CONFIANZA.map(([Icon, t]) => (
            <div key={t} className="bg-[#E8ECFF] rounded-[20px] p-5 flex items-center gap-3 font-medium">
              <Icon className="w-6 h-6 text-[#2B4BFF]" strokeWidth={1.75} /> {t}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}