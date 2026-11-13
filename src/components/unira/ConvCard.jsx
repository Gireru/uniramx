import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Image } from "@/components/ui/image";
import { TIPO, textoFecha, estaAbierta } from "@/lib/convocatorias";

export default function ConvCard({ c, extra }) {
  const abierta = estaAbierta(c);
  return (
    <motion.div whileHover={{ y: -6, rotate: -0.4 }} transition={{ type: "spring", stiffness: 300, damping: 20 }} className="bg-white rounded-[20px] shadow-soft hover:shadow-lift overflow-hidden flex flex-col h-full">
      <Link to="/convocatoria/$id" params={{ id: c.id }} className="block">
        <div className="h-[120px] bg-gradient-to-br from-secondary via-[#FFF3F8] to-[#E8ECFF] relative">
          {c.imagen_url ? (
            <Image src={c.imagen_url} alt={c.titulo} className="w-full h-full" />
          ) : (
            <span className="absolute inset-0 grid place-items-center font-serif-cond text-2xl text-foreground/25">{TIPO[c.tipo]}</span>
          )}
          {c.demo && <span className="absolute top-2 right-2 bg-[#FFC83D] text-foreground text-xs font-bold px-2 py-1 rounded-full">Ejemplo</span>}
        </div>
      </Link>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex gap-2 items-center flex-wrap">
          <span className="self-start bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">{TIPO[c.tipo]}</span>
          {c.estado_verificacion === "por_revisar" && <span className="text-xs bg-[#ECEDF1] text-[#6B7084] px-2 py-1 rounded-full">Verificación pendiente</span>}
        </div>
        <h3 className="font-bold leading-snug">{c.titulo}</h3>
        <p className="text-sm text-[#6B7084]">{textoFecha(c)}</p>
        {extra}
        <Link to="/convocatoria/$id" params={{ id: c.id }} className="mt-auto text-[#2B4BFF] font-bold text-sm pt-2 inline-block">
          {abierta ? "Postular con mi guía →" : "Avísame cuando abra →"}
        </Link>
      </div>
    </motion.div>
  );
}