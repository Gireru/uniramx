import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/api/client";
import { obtenerPerfil } from "@/lib/postulaciones";
import { useAuth } from "@/lib/AuthContext";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/_authed/perfil")({
  head: () => ({ meta: [{ title: "Perfil | Unira" }] }),
  component: Perfil,
});

function Fila({ l, children }) { return <div className="flex justify-between gap-4 py-2 border-b border-border text-sm"><span className="text-[#5B6180]">{l}</span><span className="font-medium text-right">{children || "—"}</span></div>; }

function Perfil() {
  const { logout } = useAuth();
  const [p, setP] = useState(undefined);
  useEffect(() => { obtenerPerfil().then(setP); }, []);

  const exportar = async () => {
    const [po, g] = await Promise.all([api.entities.Postulacion.list("-created_date", 200), api.entities.Guardado.list("-created_date", 200)]);
    const blob = new Blob([JSON.stringify({ perfil: p, postulaciones: po.items, guardados: g.items }, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "mis-datos-unira.json";
    a.click();
  };
  const borrar = async () => {
    if (!window.confirm("Se borrarán tu perfil y tus postulaciones. ¿Continuar?")) return;
    const [po, g] = await Promise.all([api.entities.Postulacion.list("-created_date", 200), api.entities.Guardado.list("-created_date", 200)]);
    for (const x of po.items) {
      const ts = await api.entities.TareaGuia.filter({ postulacion_id: x.id }, { limit: 100 });
      for (const t of ts.items) await api.entities.TareaGuia.delete(t.id);
      const bs = await api.entities.Borrador.filter({ postulacion_id: x.id }, { limit: 20 });
      for (const b of bs.items) await api.entities.Borrador.delete(b.id);
      await api.entities.Postulacion.delete(x.id);
    }
    for (const x of g.items) await api.entities.Guardado.delete(x.id);
    if (p) await api.entities.Perfil.delete(p.id);
    toast.success("Tus datos fueron borrados");
    setP(null);
  };
  const alertas = async (v) => { await api.entities.Perfil.update(p.id, { consentimiento_alertas: v }); setP({ ...p, consentimiento_alertas: v }); };

  if (p === undefined) return <div className="p-10"><div className="h-40 bg-white rounded-[20px] animate-pulse" /></div>;
  if (p === null) return <div className="p-10"><p>Aún no tienes perfil.</p><Link to="/quiz" className="mt-4 inline-flex h-12 px-6 items-center rounded-full bg-primary text-white font-bold">Haz el quiz</Link></div>;
  return (
    <div className="p-4 md:p-10 max-w-2xl">
      <h1 className="font-serif-cond text-3xl md:text-6xl">Perfil</h1>
      <div className="bg-white rounded-[20px] shadow-soft p-5 md:p-6 mt-5 md:mt-6">
        <Fila l="Nombre">{p.nombre_preferido}</Fila><Fila l="Nivel">{p.etapa}</Fila><Fila l="Estado">{p.estado}</Fila><Fila l="Escuela">{p.tipo_escuela}</Fila>
        <Fila l="Promedio">{p.promedio}</Fila><Fila l="Intereses">{p.intereses?.join(", ")}</Fila><Fila l="Metas">{p.metas}</Fila>
        <label className="flex items-center justify-between py-3 text-sm"><span>Alertas por correo</span><Switch checked={!!p.consentimiento_alertas} onCheckedChange={alertas} /></label>
      </div>
      <div className="mt-6 flex flex-col sm:flex-row sm:flex-wrap gap-3">
        <Link to="/mi-curriculum" className="h-12 px-6 rounded-full bg-[#2B4BFF] text-white font-bold flex items-center justify-center w-full sm:w-auto">Mi CV</Link>
        <Link to="/quiz" className="h-12 px-6 rounded-full border-2 border-[#2B4BFF] text-[#2B4BFF] font-bold flex items-center justify-center w-full sm:w-auto">Rehacer quiz</Link>
        <button onClick={exportar} className="h-12 px-6 rounded-full bg-white border border-border font-medium w-full sm:w-auto">Exportar mis datos</button>
        <button onClick={borrar} className="h-12 px-6 rounded-full bg-white border border-[#B42318] text-[#B42318] font-medium w-full sm:w-auto">Borrar mi cuenta y datos</button>
        <button onClick={() => logout()} className="h-12 px-6 rounded-full font-medium underline w-full sm:w-auto">Cerrar sesión</button>
      </div>
    </div>
  );
}