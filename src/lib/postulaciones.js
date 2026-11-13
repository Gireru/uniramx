import { api } from "@/api/client";
import { calcularMatch } from "@/lib/match";

export async function obtenerPerfil() {
  const page = await api.entities.Perfil.list("-created_date", 1);
  return page.items?.[0] || page[0] || null;
}

// iniciarPostulacion: crea la Postulacion en "descubierta", copia la fecha límite, calcula match y crea el checklist.
export async function iniciarPostulacion(perfil, c) {
  const reqs = (await api.entities.RequisitoConvocatoria.filter({ convocatoria_id: c.id }, { sort: "orden", limit: 30 })).items;
  const m = calcularMatch(perfil, c);
  const po = await api.entities.Postulacion.create({
    perfil_id: perfil.id,
    convocatoria_id: c.id,
    convocatoria_titulo: c.titulo,
    institucion_nombre: c.institucion_nombre,
    imagen_url: c.imagen_url,
    etapa: "descubierta",
    indice_preparacion: 0,
    match_pct: m.pct,
    razones_match: { ya_cumples: m.ya_cumples, te_falta: m.te_falta },
    fecha_limite_copiada: c.fecha_limite || "",
    siguiente_accion: "Confirma que cumples los requisitos",
    demo: !!c.demo,
  });
  const tareas = [
    { titulo: "Confirmar que cumples los requisitos", tipo: "elegibilidad", responsable: "persona" },
    ...reqs.map((r) => ({ titulo: r.nombre, tipo: r.tipo, responsable: "persona", descripcion: r.descripcion })),
    ...(c.pide_ensayo ? [{ titulo: "Redactar y aprobar tu carta", tipo: "escrito", responsable: "guia" }] : []),
  ].map((t, i) => ({ ...t, postulacion_id: po.id, orden: i, estado: "pendiente", fecha_sugerida: c.fecha_limite || "" }));
  await api.entities.TareaGuia.bulkCreate(tareas);
  return po;
}

const RANGO = ["descubierta", "elegibilidad_confirmada", "plan_listo", "reuniendo_documentos", "redactando", "revision_final", "lista_para_enviar", "enviada", "seguimiento", "resultado_registrado"];
export const etapaIndex = (e) => RANGO.indexOf(e);

export const ETAPA_PILL = {
  enviada: { t: "Enviada", cls: "bg-[#ECEDF1] text-[#6B7084]", bar: "bg-[#6B7084]" },
  seguimiento: { t: "Enviada", cls: "bg-[#ECEDF1] text-[#6B7084]", bar: "bg-[#6B7084]" },
  aceptada: { t: "Aceptada", cls: "bg-[#E3F5EA] text-[#1E9E5A]", bar: "bg-[#1E9E5A]" },
  prep: { t: "En preparación", cls: "bg-[#2B4BFF] text-white", bar: "bg-[#2B4BFF]" },
};
export function pillDe(po) {
  if (po.resultado === "aceptada") return ETAPA_PILL.aceptada;
  if (["enviada", "seguimiento", "resultado_registrado"].includes(po.etapa)) return ETAPA_PILL.enviada;
  return ETAPA_PILL.prep;
}