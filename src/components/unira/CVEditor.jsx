import { useEffect, useState } from "react";
import { Plus, Trash2, Download, Save } from "lucide-react";
import { toast } from "sonner";
import { base44 } from "@/api/base44Client";
import Campo from "@/components/unira/Campo";
import { descargarCV } from "@/lib/cvPdf";
import { obtenerPerfil } from "@/lib/postulaciones";

const VACIO = { nombre: "", correo: "", telefono: "", ciudad: "", enlace: "", resumen: "", educacion: [], experiencia: [], habilidades: [], idiomas: [], certificaciones: [], referencias: [] };

function Seccion({ titulo, children, accion }) {
  return (
    <section className="bg-white rounded-[20px] shadow-soft p-5">
      <div className="flex items-center justify-between mb-3"><h2 className="font-serif-cond text-2xl">{titulo}</h2>{accion}</div>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

export default function CVEditor() {
  const [cv, setCv] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const set = (k, v) => setCv((x) => ({ ...x, [k]: v }));
  const lista = (k, v) => set(k, String(v).split(",").map((s) => s.trim()).filter(Boolean));

  useEffect(() => {
    (async () => {
      const [perfil, existentes] = await Promise.all([obtenerPerfil(), base44.entities.CV.list("-created_date", 1)]);
      const guardado = existentes.items?.[0] || existentes[0];
      setCv({ ...VACIO, nombre: perfil?.nombre_preferido || "", educacion: [], experiencia: [], ...guardado });
    })();
  }, []);

  if (!cv) return <div className="h-64 bg-white rounded-[20px] animate-pulse" />;

  const fila = (k, i, campos) => (
    <div key={i} className="border border-border rounded-2xl p-3 space-y-2">
      <div className="flex justify-between items-center"><span className="text-sm font-medium text-[#5B6180]">#{i + 1}</span>
        <button onClick={() => set(k, cv[k].filter((_, j) => j !== i))} aria-label="Quitar" className="w-8 h-8 rounded-full bg-[#FDE8F0] text-[#C8004F] flex items-center justify-center"><Trash2 className="w-4 h-4" /></button>
      </div>
      {campos.map(([campo, ph]) => (
        <Campo key={campo} value={cv[k][i]?.[campo] || ""} placeholder={ph} onChange={(v) => set(k, cv[k].map((x, j) => (j === i ? { ...x, [campo]: v } : x)))} />
      ))}
    </div>
  );

  const guardar = async (descargar) => {
    setGuardando(true);
    const existentes = await base44.entities.CV.list("-created_date", 1);
    const previo = existentes.items?.[0] || existentes[0];
    const datos = { ...cv };
    delete datos.id; delete datos.created_by_id;
    const r = previo ? await base44.entities.CV.update(previo.id, datos) : await base44.entities.CV.create(datos);
    setGuardando(false);
    if (descargar) { descargarCV(cv); toast.success("CV descargado"); } else toast.success("CV guardado");
    return r;
  };

  return (
    <div className="space-y-4">
      <Seccion titulo="Datos de contacto">
        <div className="grid sm:grid-cols-2 gap-3">
          <Campo label="Nombre completo" value={cv.nombre} onChange={(v) => set("nombre", v)} placeholder="Tu nombre" />
          <Campo label="Correo" value={cv.correo} onChange={(v) => set("correo", v)} placeholder="tucorreo@ejemplo.com" type="email" />
          <Campo label="Teléfono" value={cv.telefono} onChange={(v) => set("telefono", v)} placeholder="10 dígitos" />
          <Campo label="Ciudad y estado" value={cv.ciudad} onChange={(v) => set("ciudad", v)} placeholder="Monterrey, Nuevo León" />
          <Campo label="Enlace (portafolio o LinkedIn)" value={cv.enlace} onChange={(v) => set("enlace", v)} placeholder="https://" className="sm:col-span-2" />
        </div>
        <Campo label="Perfil en 3 o 4 líneas" multiline value={cv.resumen} onChange={(v) => set("resumen", v)} placeholder="Quién eres y qué buscas" />
      </Seccion>

      <Seccion titulo="Formación" accion={<button onClick={() => set("educacion", [...cv.educacion, {}])} className="h-9 px-4 rounded-full bg-[#E8ECFF] text-[#2B4BFF] font-bold text-sm inline-flex items-center gap-1"><Plus className="w-4 h-4" />Agregar</button>}>
        {cv.educacion.length === 0 && <p className="text-sm text-[#5B6180]">Agrega tu escuela, grado y periodo.</p>}
        {cv.educacion.map((_, i) => fila("educacion", i, [["grado", "Grado o carrera"], ["institucion", "Institución"], ["periodo", "Periodo (2022 - 2025)"], ["detalle", "Logros o promedio"]]))}
      </Seccion>

      <Seccion titulo="Experiencia, prácticas o voluntariado" accion={<button onClick={() => set("experiencia", [...cv.experiencia, {}])} className="h-9 px-4 rounded-full bg-[#E8ECFF] text-[#2B4BFF] font-bold text-sm inline-flex items-center gap-1"><Plus className="w-4 h-4" />Agregar</button>}>
        {cv.experiencia.length === 0 && <p className="text-sm text-[#5B6180]">Puede ser un proyecto escolar, un trabajo de medio tiempo o voluntariado.</p>}
        {cv.experiencia.map((_, i) => fila("experiencia", i, [["puesto", "Puesto o rol"], ["lugar", "Lugar"], ["periodo", "Periodo"], ["detalle", "Qué hiciste y qué lograste"]]))}
      </Seccion>

      <Seccion titulo="Habilidades e idiomas">
        <Campo label="Habilidades (separadas por coma)" value={(cv.habilidades || []).join(", ")} onChange={(v) => lista("habilidades", v)} placeholder="Excel, diseño, trabajo en equipo" />
        <Campo label="Idiomas" value={(cv.idiomas || []).join(", ")} onChange={(v) => lista("idiomas", v)} placeholder="Español nativo, inglés B2" />
        <Campo label="Cursos y certificaciones" value={(cv.certificaciones || []).join(", ")} onChange={(v) => lista("certificaciones", v)} placeholder="Curso de primeros auxilios, 2025" />
      </Seccion>

      <Seccion titulo="Referencias" accion={<button onClick={() => set("referencias", [...cv.referencias, {}])} className="h-9 px-4 rounded-full bg-[#E8ECFF] text-[#2B4BFF] font-bold text-sm inline-flex items-center gap-1"><Plus className="w-4 h-4" />Agregar</button>}>
        {cv.referencias.length === 0 && <p className="text-sm text-[#5B6180]">Opcional. Pide permiso antes de compartir datos de alguien más.</p>}
        {cv.referencias.map((_, i) => fila("referencias", i, [["nombre", "Nombre y relación"], ["contacto", "Correo o teléfono"]]))}
      </Seccion>

      <div className="flex flex-wrap gap-3 sticky bottom-20 md:bottom-4 bg-background/90 backdrop-blur p-3 rounded-[20px]">
        <button disabled={guardando} onClick={() => guardar(false)} className="h-12 px-6 rounded-full bg-white border border-border font-bold inline-flex items-center gap-2 disabled:opacity-50"><Save className="w-4 h-4" />{guardando ? "Guardando…" : "Guardar"}</button>
        <button disabled={guardando} onClick={() => guardar(true)} className="h-12 px-6 rounded-full bg-primary text-white font-bold inline-flex items-center gap-2 disabled:opacity-50"><Download className="w-4 h-4" />Descargar PDF</button>
      </div>
    </div>
  );
}