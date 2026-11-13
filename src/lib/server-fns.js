import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireUser } from "@/lib/auth-middleware";

const NO_SABE = "No lo sé, revisa la convocatoria oficial.";

// Explicaciones de match: una llamada por lote de máximo 5. Solo redacta; el cálculo es en código.
export const explicarMatch = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(z.object({ perfil: z.record(z.any()), items: z.array(z.object({ convocatoria_id: z.string().max(60), titulo: z.string().max(300), resumen: z.string().max(1500).optional(), requisitos: z.array(z.string().max(200)).max(15), ya_cumples: z.array(z.string().max(200)).max(10), te_falta: z.array(z.string().max(200)).max(10) })).max(5) }))
  .handler(async ({ data, context }) => {
    const db = context.getBase44().asServiceRole;
    const p = data.perfil;
    const resumenPerfil = { etapa: p.etapa, estado: p.estado, promedio: p.promedio, intereses: p.intereses, habilidades: p.habilidades, logros: p.logros, metas: p.metas };
    return await db.integrations.Core.InvokeLLM({
      prompt: `Eres Mi guía de Unira. Para cada convocatoria escribe 3 viñetas cortas en español de México (tú) de por qué le conviene a la persona, usando SOLO los datos del perfil y de la convocatoria. Prohibido inventar requisitos, montos o fechas. Si falta un dato no lo menciones. Perfil: ${JSON.stringify(resumenPerfil)}. Convocatorias: ${JSON.stringify(data.items)}. En "riesgo" di en una frase qué podría complicar la postulación, o "Ninguno evidente".`,
      response_json_schema: { type: "object", properties: { items: { type: "array", items: { type: "object", properties: { convocatoria_id: { type: "string" }, por_que_te_conviene: { type: "array", items: { type: "string" } }, riesgo: { type: "string" } } } } } },
    });
  });

// Palabras clave para saber qué tipo de oportunidad busca la persona.
const TIPO_KEYS = [
  [/beca/, "beca"],
  [/apoyo|apoyos|economic/, "apoyo"],
  [/curso|taller|capacita|clase/, "curso"],
  [/concurso|premio|competencia|hackaton/, "concurso"],
  [/empleo|trabajo|vacante|bolsa de/, "empleo"],
  [/pr[aá]ctica/, "practica"],
  [/intercambio|movilidad|semestre fuera/, "intercambio"],
];

// Catálogo real de oportunidades, filtrado por lo que pide la persona.
async function catalogoParaGuia(db, mensaje) {
  const texto = mensaje.toLowerCase();
  const tipo = (TIPO_KEYS.find(([re]) => re.test(texto)) || [])[1];
  const res = await db.entities.Convocatoria.filter({ activa: true }, { limit: 80 });
  const lista = res.items
    .filter((c) => c.vigencia !== "cerrada" && (!tipo || c.tipo === tipo))
    .sort((a, b) => (b.destacada ? 1 : 0) - (a.destacada ? 1 : 0))
    .slice(0, 10)
    .map((c) => ({ titulo: c.titulo, tipo: c.tipo, alcance: c.alcance, institucion: c.institucion_nombre, beneficio: c.monto_o_beneficio, fecha_limite: c.fecha_limite || c.fecha_limite_texto || null }));
  return { tipo_buscado: tipo || null, oportunidades: lista };
}

// Chat de Mi guía: el contexto se arma en código; una sola llamada con esquema.
export const guiaChat = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(z.object({ mensaje: z.string().min(1).max(1500), postulacion_id: z.string().max(60).optional(), historial: z.array(z.object({ rol: z.string().max(20), texto: z.string().max(2000) })).max(8) }))
  .handler(async ({ data, context }) => {
    const db = context.getBase44();
    let ficha = null;
    if (data.postulacion_id) {
      const po = await db.entities.Postulacion.get(data.postulacion_id);
      const cv = await db.entities.Convocatoria.get(po.convocatoria_id);
      const reqs = await db.entities.RequisitoConvocatoria.filter({ convocatoria_id: cv.id }, { limit: 30 });
      const tareas = await db.entities.TareaGuia.filter({ postulacion_id: po.id }, { limit: 30 });
      ficha = { titulo: cv.titulo, institucion: cv.institucion_nombre, beneficio: cv.monto_o_beneficio, fecha_limite: cv.fecha_limite || cv.fecha_limite_texto, url_oficial: cv.url_oficial, requisitos: reqs.items.map((r) => r.nombre), tareas: tareas.items.map((t) => `${t.titulo}: ${t.estado}`), etapa: po.etapa };
    }
    const perfiles = await db.entities.Perfil.filter({ created_by_id: context.user.id }, { limit: 1 });
    const p = perfiles.items[0] || {};
    const perfil = { etapa: p.etapa, estado: p.estado, promedio: p.promedio, intereses: p.intereses, busca: p.busca };
    const catalogo = await catalogoParaGuia(db, data.mensaje);
    const r = await db.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `Eres "Mi guía", el acompañante de Unira (México): ayuda a jóvenes a encontrar y ganar becas, apoyos, cursos, concursos, empleos, prácticas e intercambios. Habla de tú, cálido, claro y muy breve (máximo 110 palabras, sin listas numeradas largas).
Reglas:
- Sí puedes conversar, orientar y recomendar oportunidades del catálogo que te doy: menciona 2 o 3 por su título real y por qué le pueden servir según su perfil.
- Si no hay catálogo para lo que pide, ayúdale con un consejo práctico y dile que puede buscar en Explorar con otras palabras.
- Datos concretos (montos, fechas, requisitos, trámites) SOLO si vienen en el catálogo o la ficha; si te piden uno que no está, responde exactamente "${NO_SABE}" y nada más.
- Nunca envíes solicitudes, nunca pidas contraseñas, CURP, datos bancarios ni dinero; nunca prometas aceptación: siempre recuérdale "Tú revisas y tú envías".
Perfil de la persona: ${JSON.stringify(perfil)}.
Ficha de la postulación en curso: ${JSON.stringify(ficha)}.
Catálogo de oportunidades abiertas${catalogo.tipo_buscado ? ` de tipo ${catalogo.tipo_buscado}` : ""}: ${JSON.stringify(catalogo.oportunidades)}.
Historial: ${JSON.stringify(data.historial)}.
Mensaje de la persona: ${data.mensaje}`,
      response_json_schema: { type: "object", properties: { respuesta: { type: "string" }, accion_sugerida: { type: "string", enum: ["mejorar_carta", "subir_documento", "ver_requisito", "ninguna"] }, nivel_confianza: { type: "string", enum: ["alto", "medio", "bajo"] } } },
    });
    return { ...r, url_oficial: ficha?.url_oficial || null };
  });

// Carta o ensayo: usa SOLO los hechos aportados por la persona.
export const generarBorrador = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(z.object({ borrador_id: z.string().max(60) }))
  .handler(async ({ data, context }) => {
    const db = context.getBase44();
    const bor = await db.entities.Borrador.get(data.borrador_id);
    const po = await db.entities.Postulacion.get(bor.postulacion_id);
    const cv = await db.entities.Convocatoria.get(po.convocatoria_id);
    const perfiles = await db.entities.Perfil.filter({ id: po.perfil_id }, { limit: 1 });
    const perfil = perfiles.items[0] || {};
    const r = await db.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `Redacta una carta de motivación en español de México, en primera persona, para "${cv.titulo}" (${cv.institucion_nombre}). Usa SOLO estos hechos aportados por la persona: ${JSON.stringify(bor.hechos_aportados)}. Imita el tono de esta muestra de voz: "${perfil.muestra_de_voz || "sencillo y cercano"}" y el nivel escolar ${perfil.etapa || ""}. Máximo 250 palabras. Evita frases genéricas. Jamás inventes logros, cifras o instituciones. Lista en "afirmaciones_sin_respaldo" cualquier afirmación del texto que no salga de los hechos (idealmente ninguna). Evalúa 3 criterios: claridad, motivación y evidencia.`,
      response_json_schema: { type: "object", properties: { texto: { type: "string" }, afirmaciones_sin_respaldo: { type: "array", items: { type: "string" } }, criterios: { type: "array", items: { type: "object", properties: { criterio: { type: "string" }, cumple: { type: "boolean" }, sugerencia: { type: "string" } } } } } },
    });
    await db.entities.Borrador.update(bor.id, { texto: r.texto, afirmaciones_sin_respaldo: r.afirmaciones_sin_respaldo || [], criterios: r.criterios || [], version: (bor.version || 0) + 1, estado: "en_revision", aprobado_por_usuario: false });
    return { ok: true };
  });