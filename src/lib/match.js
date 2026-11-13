// Matching determinista: filtros duros y luego afinidad (0 a 100). La IA solo redacta explicaciones.
const norm = (s) => String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const overlap = (a = [], b = []) => {
  const B = b.map(norm);
  return a.map(norm).filter((x) => B.some((y) => y.includes(x) || x.includes(y))).length;
};

export function calcularMatch(p, c) {
  const motivos = [];
  const ya = [];
  const falta = [];
  if (c.etapas_objetivo?.length && !c.etapas_objetivo.includes(p.etapa)) motivos.push("Tu nivel escolar no coincide");
  else ya.push("Tu nivel escolar coincide");
  if (c.estados_aplica?.length && !c.estados_aplica.includes(p.estado)) motivos.push("No aplica en tu estado");
  if (c.tipo_escuela_requerida && c.tipo_escuela_requerida !== "cualquiera" && p.tipo_escuela && c.tipo_escuela_requerida !== p.tipo_escuela)
    motivos.push("El tipo de escuela no coincide");
  let promedioCerca = false;
  if (c.promedio_minimo && p.promedio != null) {
    if (p.promedio < c.promedio_minimo) {
      if (c.promedio_minimo - p.promedio < 0.5) promedioCerca = true;
      else motivos.push("Tu promedio está por debajo del mínimo");
      falta.push(`Promedio mínimo ${c.promedio_minimo}`);
    } else ya.push(`Cumples el promedio mínimo (${c.promedio_minimo})`);
  }
  const abierta = ["vigente", "proxima", "permanente"].includes(c.vigencia) && !(c.fecha_limite && c.fecha_limite < new Date().toISOString().slice(0, 10));
  const elegible = motivos.length === 0;

  const tags = [...(c.etiquetas || []), ...(c.carreras || [])];
  const intereses = [...(p.intereses || []), p.carrera].filter(Boolean);
  let s = 25 * Math.min(1, overlap(intereses, tags) / 2);
  s += 15 * Math.min(1, overlap([...(p.habilidades || []), ...(p.logros || [])], [...tags, ...(c.perfil_ganador?.actividades_tipicas || [])]) / 2);
  s += 10 * Math.min(1, overlap(String(p.metas || "").split(/\s+/).filter((w) => w.length > 4), tags) / 1);
  const tip = c.perfil_ganador?.promedio_tipico;
  s += tip && p.promedio != null ? (p.promedio >= tip ? 20 : Math.max(0, 20 - (tip - p.promedio) * 20)) : 10;
  s += 5;
  s += !c.estados_aplica?.length || c.estados_aplica.includes(p.estado) ? 10 : 0;
  const pct = Math.min(100, Math.round((s / 90) * 100));

  const verificada = c.estado_verificacion === "verificada";
  const competitiva = tip ? (p.promedio ?? 0) >= tip - 0.3 : pct >= 80;
  const recomendada = elegible && abierta && verificada && pct >= 70 && competitiva;
  const paraCrecer = !recomendada && abierta && verificada && (promedioCerca || (elegible && pct >= 50));
  if (!ya.length) ya.push("Aún no hay datos para comparar");
  return { pct, elegible, abierta, verificada, recomendada, paraCrecer, motivos, ya_cumples: ya, te_falta: falta };
}

// Puntaje de preparación (no es probabilidad de aceptación).
export function calcularPreparacion({ tareas = [], borrador, etapa, esMenor, tutorAprobo, convocatoria }) {
  const total = tareas.length || 1;
  const hechas = tareas.filter((t) => t.estado === "completada").length;
  const tareasPts = Math.round(60 * (hechas / total));
  const cartaPide = convocatoria?.pide_ensayo;
  const cartaOk = !cartaPide || (borrador?.aprobado_por_usuario && !(borrador?.afirmaciones_sin_respaldo?.length));
  const cartaPts = cartaPide ? (cartaOk ? 30 : 0) : 30;
  const revision = ["revision_final", "lista_para_enviar", "enviada", "seguimiento", "resultado_registrado"].includes(etapa) ? 10 : 0;
  const indice = tareasPts + cartaPts + revision;
  const faltan = [];
  if (hechas < total) faltan.push(`Te faltan ${total - hechas} paso(s) del checklist`);
  if (!cartaOk) faltan.push("Aprueba tu carta sin afirmaciones pendientes");
  if (!revision) faltan.push("Haz tu revisión final");
  if (esMenor && !tutorAprobo) faltan.push("Falta la aprobación del tutor");
  if (indice < 85) faltan.push("Tu preparación debe ser de al menos 85");
  return { indice, faltan, puedeEnviar: indice >= 85 && faltan.length === 0 };
}