import { Link } from "@tanstack/react-router";
import { Image } from "@/components/ui/image";
import { pillDe } from "@/lib/postulaciones";

export default function PostulacionRow({ p }) {
  const pill = pillDe(p);
  const n = p.indice_preparacion || 0;
  return (
    <Link to="/postulacion/$id" params={{ id: p.id }} className="bg-white rounded-[20px] shadow-soft p-3 flex items-center gap-4 hover:-translate-y-0.5 transition-transform">
      <div className="w-20 h-20 rounded-2xl overflow-hidden bg-muted shrink-0">{p.imagen_url && <Image src={p.imagen_url} alt="" className="w-full h-full" />}</div>
      <div className="flex-1 min-w-0">
        <div className="font-bold truncate">{p.convocatoria_titulo}</div>
        <div className="text-sm text-[#5B6180] truncate">{p.institucion_nombre}</div>
        <div className="mt-2 flex items-center gap-2"><div className="flex-1 h-2 bg-[#ECEDF1] rounded-full overflow-hidden"><div className={`h-full ${pill.bar}`} style={{ width: `${n}%` }} /></div><span className="text-xs font-bold">{n}%</span></div>
      </div>
      <span className={`text-xs font-bold px-3 py-1 rounded-full ${pill.cls}`}>{pill.t}</span>
    </Link>
  );
}