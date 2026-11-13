import { base44 } from "@/api/base44Client";

export const TIPO = { beca: "Beca", apoyo: "Apoyo", curso: "Curso", concurso: "Concurso" };
export const NIVELES = [
  { id: "primaria", label: "Primaria" },
  { id: "secundaria", label: "Secundaria" },
  { id: "prepa", label: "Prepa" },
  { id: "universidad", label: "Universidad" },
  { id: "padres", label: "Para padres" },
];

export const fmt = (d) => (d ? d.split("-").reverse().join("/") : "");

export function textoFecha(c) {
  if (c.vigencia === "cerrada") return c.fecha_limite ? `Cerrada el ${fmt(c.fecha_limite)}` : "Cerrada";
  if (c.fecha_limite) return `Abierta hasta ${fmt(c.fecha_limite)}`;
  if (c.vigencia === "permanente") return "Abierta · trámite permanente";
  return "Abierta · fecha: verificar";
}

export const estaAbierta = (c) => ["vigente", "permanente"].includes(c.vigencia);

export async function listarConvocatorias(demo, limit = 100) {
  const q = demo ? { activa: true } : { activa: true, demo: false };
  const page = await base44.entities.Convocatoria.filter(q, { sort: "-created_date", limit });
  return page.items;
}