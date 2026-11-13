import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Star, Curl, Arrow } from "@/components/unira/Doodles";
import MiGuia from "@/components/unira/MiGuia";

export default function Hero() {
  return (
    <section className="max-w-[1200px] mx-auto px-4 md:px-6">
      <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-[#FBF6EC] to-white shadow-soft grid md:grid-cols-2 items-center">
        <div className="relative p-8 md:p-14 z-10">
          <Star className="absolute right-6 top-4 w-12 h-12 hidden md:block" />
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="font-serif-cond text-[36px] leading-[40px] md:text-[64px] md:leading-[68px] text-foreground"
          >
            Hay muchas oportunidades para crecer, encuentra la tuya
          </motion.h1>
          <p className="mt-5 text-lg text-muted-foreground">Gratis. Tu guía con IA te acompaña en toda la postulación.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/quiz" className="h-12 px-8 rounded-full bg-primary text-primary-foreground font-bold inline-flex items-center gap-2 hover:scale-[1.03] transition-transform shadow-[0_8px_20px_rgba(230,0,92,.25)]">
              Haz el quiz <span aria-hidden>→</span>
            </Link>
            <Link to="/explorar" className="h-12 px-8 rounded-full border-2 border-[#2B4BFF] text-[#2B4BFF] font-bold inline-flex items-center hover:bg-[#E8ECFF]">
              Ver becas
            </Link>
          </div>
          <Arrow className="absolute left-[55%] bottom-4 w-16 h-16 hidden md:block" />
        </div>
        <div className="relative h-64 md:h-[460px]">
          <img
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80"
            alt="Jóvenes estudiantes sonriendo juntos en un campus"
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/30 to-transparent hidden md:block" />
          <div className="absolute bottom-4 right-4 bg-white rounded-2xl shadow-soft px-3 py-2 flex items-center gap-2">
            <MiGuia className="w-14 h-12" />
            <span className="text-sm font-medium">Soy tu guía</span>
          </div>
          <Curl className="absolute top-4 right-4 w-14 h-14 hidden md:block" />
        </div>
      </div>
    </section>
  );
}