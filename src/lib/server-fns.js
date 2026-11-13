import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireUser } from "@/lib/auth-middleware";

const NO_SABE = "No lo sé, revisa la convocatoria oficial.";

// Explicaciones de match: una llamada por lote de máximo 5. Solo redacta; el cálculo es en código.
export const explicarMatch = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(z.object({ perfil: z.record(z.any()), items: z.array(z.object({ convocatoria_id: z.string().max(60), titulo: z.string().max(300), resumen: z.string().max(1500).optional(), requisitos: z.array(z.string().max(200)).max(15), ya_cumples: z.array(z.string().max(200)).max(10), te_falta: z.array(z.string().max(200)).max(10) })).max(5) }))
  .handler(async ({ data, context }) => {
    const b44 = context.getBase44().asServiceRole;
    const p = data.perfil;
    const resumenPerfil = { etapa: p.etapa, estado: p.estado, promedio: p.promedio, intereses: p.intereses, habilidades: p.habilidades, logros: p.logros, metas: p.metas };
    return await b44.integrations.Core.InvokeLLM({
      prompt: `Eres Mi guía de Unira. Para cada convocatoria escribe 3 viñetas cortas en español de México (tú) de por qué le conviene a la persona, usando SOLO los datos del perfil y de la convocatoria. Prohibido inventar requisitos, montos o fechas. Si falta un dato no lo menciones. Perfil: ${JSON.stringify(resumenPerfil)}. Convocatorias: ${JSON.stringify(data.items)}. En "riesgo" di en una frase qué podría complicar la postulación, o "Ninguno evidente".`,
      response_json_schema: { type: "object", properties: { items: { type: "array", items: { type: "object", properties: { convocatoria_id: { type: "string" }, por_que_te_conviene: { type: "array", items: { type: "string" } }, riesgo: { type: "string" } } } } } },
    });
  });

// Chat de Mi guía: el contexto se arma en código; una sola llamada con esquema.
export const guiaChat = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(z.object({ mensaje: z.string().min(1).max(1500), postulacion_id: z.string().max(60).optional(), historial: z.array(z.object({ rol: z.string().max(20), texto: z.string().max(2000) })).max(8) }))
  .handler(async ({ data, context }) => {
    const b44 = context.getBase44();
    let ficha = null;
    if (data.postulacion_id) {
      const po = await b44.entities.Postulacion.get(data.postulacion_id);
      const cv = await b44.entities.Convocatoria.get(po.convocatoria_id);
      const reqs = await b44.entities.RequisitoConvocatoria.filter({ convocatoria_id: cv.id }, { limit: 30 });
      const tareas = await b44.entities.TareaGuia.filter({ postulacion_id: po.id }, { limit: 30 });
      ficha = { titulo: cv.titulo, institucion: cv.institucion_nombre, beneficio: cv.monto_o_beneficio, fecha_limite: cv.fecha_limite || cv.fecha_limite_texto, url_oficial: cv.url_oficial, requisitos: reqs.items.map((r) => r.nombre), tareas: tareas.items.map((t) => `${t.titulo}: ${t.estado}`), etapa: po.etapa };
    }
    const r = await b44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `Eres "Mi guía" de Unira, que acompaña postulaciones a becas, apoyos, cursos y concursos en México. Habla de tú, en español claro y breve. Reglas: nunca envías solicitudes ni pides contraseñas o datos bancarios; nunca prometes aceptación (siempre: "Tú revisas y tú envías"); solo usa la ficha dada, y si el dato no está responde exactamente "${NO_SABE}". Ficha: ${JSON.stringify(ficha)}. Historial: ${JSON.stringify(data.historial)}. Mensaje de la persona: ${data.mensaje}`,
      response_json_schema: { type: "object", properties: { respuesta: { type: "string" }, accion_sugerida: { type: "string", enum: ["mejorar_carta", "subir_documento", "ver_requisito", "ninguna"] }, nivel_confianza: { type: "string", enum: ["alto", "medio", "bajo"] } } },
    });
    return { ...r, url_oficial: ficha?.url_oficial || null };
  });

// Carta o ensayo: usa SOLO los hechos aportados por la persona.
export const generarBorrador = createServerFn({ method: "POST" })
  .middleware([requireUser])
  .validator(z.object({ borrador_id: z.string().max(60) }))
  .handler(async ({ data, context }) => {
    const b44 = context.getBase44();
    const bor = await b44.entities.Borrador.get(data.borrador_id);
    const po = await b44.entities.Postulacion.get(bor.postulacion_id);
    const cv = await b44.entities.Convocatoria.get(po.convocatoria_id);
    const perfiles = await b44.entities.Perfil.filter({ id: po.perfil_id }, { limit: 1 });
    const perfil = perfiles.items[0] || {};
    const r = await b44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `Redacta una carta de motivación en español de México, en primera persona, para "${cv.titulo}" (${cv.institucion_nombre}). Usa SOLO estos hechos aportados por la persona: ${JSON.stringify(bor.hechos_aportados)}. Imita el tono de esta muestra de voz: "${perfil.muestra_de_voz || "sencillo y cercano"}" y el nivel escolar ${perfil.etapa || ""}. Máximo 250 palabras. Evita frases genéricas. Jamás inventes logros, cifras o instituciones. Lista en "afirmaciones_sin_respaldo" cualquier afirmación del texto que no salga de los hechos (idealmente ninguna). Evalúa 3 criterios: claridad, motivación y evidencia.`,
      response_json_schema: { type: "object", properties: { texto: { type: "string" }, afirmaciones_sin_respaldo: { type: "array", items: { type: "string" } }, criterios: { type: "array", items: { type: "object", properties: { criterio: { type: "string" }, cumple: { type: "boolean" }, sugerencia: { type: "string" } } } } } },
    });
    await b44.entities.Borrador.update(bor.id, { texto: r.texto, afirmaciones_sin_respaldo: r.afirmaciones_sin_respaldo || [], criterios: r.criterios || [], version: (bor.version || 0) + 1, estado: "en_revision", aprobado_por_usuario: false });
    return { ok: true };
  });