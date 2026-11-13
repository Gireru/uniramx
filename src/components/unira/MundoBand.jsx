import { Link } from "@tanstack/react-router";
import { Globe2, Plane } from "lucide-react";
import { motion } from "framer-motion";

export default function MundoBand() {
  return (
    <section className="max-w-[1200px] mx-auto px-4 md:px-6 mt-10 md:mt-[72px]">
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-[28px] bg-[#E8ECFF] p-6 md:p-10 grid md:grid-cols-[1.3fr_1fr] gap-6 items-center relative overflow-hidden">
        <div>
          <span className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1.5 text-sm font-bold text-[#2B4BFF]"><Globe2 className="w-4 h-4" /> Para mexicanos en el extranjero y para estudiar fuera</span>
          <h2 className="font-serif-cond text-4xl md:text-5xl mt-4">Tu oportunidad también puede estar en otro país</h2>
          <p className="mt-3 text-[#33406B] max-w-xl">Becas, prácticas e intercambios internacionales. Filtra por "En el extranjero" y revisa siempre la convocatoria oficial: las fechas cambian por país.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/explorar" search={{ alcance: "internacional" }} className="h-12 px-6 rounded-full bg-[#2B4BFF] text-white font-bold inline-flex items-center gap-2"><Plane className="w-4 h-4" />Ver oportunidades internacionales</Link>
            <Link to="/explorar" search={{ tipo: "intercambio" }} className="h-12 px-6 rounded-full bg-white font-bold inline-flex items-center">Intercambios</Link>
          </div>
        </div>
        <div className="relative h-40 md:h-52">
          <div className="absolute inset-0 rounded-[24px] bg-white/70 animate-floaty" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 font-bold text-[#33406B]">
            <Globe2 className="w-16 h-16 text-[#2B4BFF]" strokeWidth={1.5} />
            <p className="text-center px-6">Empleo · Prácticas · Intercambio</p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}