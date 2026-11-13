import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Star, Curl, Arrow } from "@/components/unira/Doodles";
import MiGuia from "@/components/unira/MiGuia";
import { Image } from "@/components/ui/image";

const sube = { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 } };

export default function Hero() {
  return (
    <section className="max-w-[1200px] mx-auto px-4 md:px-6">
      <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-[#FBF6EC] via-white to-[#FFF3F8] shadow-soft grid md:grid-cols-2 items-center">
        <div className="absolute -left-10 -top-10 w-48 h-48 rounded-full bg-[#FDE8F0] blur-2xl md:animate-floaty" aria-hidden="true" />
        <div className="relative p-6 sm:p-8 md:p-14 z-10">
          <Star className="absolute right-6 top-4 w-12 h-12 hidden md:block" />
          <motion.span {...sube} transition={{ duration: 0.4 }} className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1.5 text-sm font-bold text-primary shadow-soft">
            Gratis · para jóvenes de todos los sectores
          </motion.span>
          <motion.h1 {...sube} transition={{ duration: 0.5, delay: 0.08, ease: [0.22, 1, 0.36, 1] }} className="font-serif-cond text-[34px] leading-[38px] sm:text-[44px] sm:leading-[46px] md:text-[64px] md:leading-[66px] text-foreground mt-4">
            Hay muchas oportunidades para crecer, encuentra <span className="text-gradient">la tuya</span>
          </motion.h1>
          <motion.p {...sube} transition={{ duration: 0.5, delay: 0.16 }} className="mt-4 text-base sm:text-lg text-muted-foreground">
            Becas, cursos, concursos, empleo, prácticas e intercambios. Tu guía con IA te acompaña en toda la postulación.
          </motion.p>
          <motion.div {...sube} transition={{ duration: 0.5, delay: 0.24 }} className="mt-7 flex flex-wrap gap-3">
            <Link to="/quiz" className="h-12 px-7 rounded-full bg-primary text-primary-foreground font-bold inline-flex items-center gap-2 hover:scale-[1.04] active:scale-95 transition-transform shadow-[0_10px_24px_rgba(230,0,92,.28)]">
              Haz el quiz <span aria-hidden>→</span>
            </Link>
            <Link to="/explorar" className="h-12 px-7 rounded-full border-2 border-[#2B4BFF] text-[#2B4BFF] font-bold inline-flex items-center hover:bg-[#E8ECFF] transition-colors">
              Ver oportunidades
            </Link>
          </motion.div>
          <p className="mt-4 text-xs text-[#5B6180]">Tú revisas y tú envías. Unira no garantiza aceptación.</p>
          <Arrow className="absolute left-[55%] bottom-3 w-16 h-16 hidden md:block" />
        </div>
        <div className="relative h-56 sm:h-72 md:h-[460px]">
          <Image src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80" alt="Jóvenes estudiantes sonriendo juntos en un campus" className="absolute inset-0 w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/30 to-transparent hidden md:block" />
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="absolute bottom-4 right-4 bg-white rounded-2xl shadow-soft px-3 py-2 flex items-center gap-2 md:animate-floaty">
            <MiGuia className="w-14 h-12" />
            <span className="text-sm font-medium">Soy tu guía</span>
          </motion.div>
          <Curl className="absolute top-4 right-4 w-14 h-14 hidden md:block" />
        </div>
      </div>
    </section>
  );
}