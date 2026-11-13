import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import Logo from "@/components/unira/Logo";
import MiGuia from "@/components/unira/MiGuia";
import Campo from "@/components/unira/Campo";
import { useAuth } from "@/lib/AuthContext";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/quiz")({
  head: () => ({ meta: [{ title: "Quiz: cuéntanos de ti | Unira" }] }),
  component: Quiz,
});

const NIVELES = [["primaria", "Primaria"], ["secundaria", "Secundaria"], ["prepa", "Prepa"], ["universidad", "Universidad"], ["posgrado", "Posgrado"], ["egresado", "Ya egresé"], ["adulto", "Adulto en transición"]];
const BUSCA = [["beca", "Beca"], ["apoyo", "Apoyo"], ["curso", "Curso"], ["concurso", "Concurso"], ["empleo", "Empleo"], ["practica", "Práctica"], ["intercambio", "Intercambio"]];
const inp = "w-full h-12 rounded-full border border-border bg-white px-5";
const lista = (s) => String(s || "").split(",").map((x) => x.trim()).filter(Boolean);

function Opciones({ opciones, valor, onChange, multi }) {
  const on = (k) => (multi ? (valor || []).includes(k) : valor === k);
  const click = (k) => onChange(multi ? (on(k) ? valor.filter((x) => x !== k) : [...(valor || []), k]) : k);
  return (
    <div className="grid gap-3 mt-6">
      {opciones.map(([k, l]) => (
        <button key={k} onClick={() => click(k)} aria-pressed={on(k)} className={`min-h-[52px] rounded-full px-6 font-medium border ${on(k) ? "bg-primary text-white border-primary" : "bg-white border-border"}`}>{l}</button>
      ))}
    </div>
  );
}

function Quiz() {
  const nav = useNavigate();
  const { isAuthenticated, navigateToLogin } = useAuth();
  const [paso, setPaso] = useState(0);
  const [r, setR] = useState({});
  const [guardando, setGuardando] = useState(false);
  const set = (k, v) => setR((x) => { const n = { ...x, [k]: v }; localStorage.setItem("unira_quiz", JSON.stringify(n)); return n; });

  useEffect(() => {
    const s = localStorage.getItem("unira_quiz");
    if (s) setR(JSON.parse(s));
  }, []);

  const pasos = [
    { t: "¿Para quién es?", ok: !!r.para, c: <Opciones valor={r.para} onChange={(v) => set("para", v)} opciones={[["yo", "Para mí"], ["menor", "Para mi hijo o hija menor"], ["adulto_mayor", "Para un familiar adulto mayor"]]} /> },
    { t: "¿En qué nivel estás?", ok: !!r.etapa, c: <><Opciones valor={r.etapa} onChange={(v) => set("etapa", v)} opciones={NIVELES} /><Campo className="mt-4" placeholder="Grado o semestre" value={r.grado || ""} onChange={(v) => set("grado", v)} /></> },
    { t: "¿Dónde estudias?", ok: !!r.estado, c: <div className="grid gap-3 mt-6"><Campo placeholder="Estado (ej. Nuevo León)" value={r.estado || ""} onChange={(v) => set("estado", v)} /><Campo placeholder="Municipio" value={r.municipio || ""} onChange={(v) => set("municipio", v)} /><Opciones valor={r.tipo_escuela} onChange={(v) => set("tipo_escuela", v)} opciones={[["publica", "Escuela pública"], ["privada", "Escuela privada"]]} /></div> },
    { t: "Cuéntanos de tus estudios", ok: r.promedio !== undefined && r.promedio !== "", c: <div className="grid gap-3 mt-6"><input className={inp} type="number" min="0" max="10" step="0.1" placeholder="Promedio (0 a 10)" value={r.promedio ?? ""} onChange={(e) => set("promedio", e.target.value)} /><Campo placeholder="Carrera o área" value={r.carrera || ""} onChange={(v) => set("carrera", v)} /><Campo placeholder="Intereses, separados por coma" value={r.intereses || ""} onChange={(v) => set("intereses", v)} /><Campo placeholder="Habilidades, separadas por coma" value={r.habilidades || ""} onChange={(v) => set("habilidades", v)} /><Campo placeholder="Logros, separados por coma" value={r.logros || ""} onChange={(v) => set("logros", v)} /></div> },
    { t: "¿Qué buscas?", ok: (r.busca || []).length > 0, c: <><Opciones multi valor={r.busca} onChange={(v) => set("busca", v)} opciones={BUSCA} /><Campo className="mt-4" placeholder="Tu meta a 3 años" value={r.metas || ""} onChange={(v) => set("metas", v)} /></> },
    { t: "Escribe 3 o 4 oraciones sobre ti, como se las contarías a un amigo", ok: true, c: <Campo className="mt-6" multiline placeholder="Escribe o dicta 3 o 4 oraciones" value={r.voz || ""} onChange={(v) => set("voz", v)} /> },
    { t: "Tu privacidad", ok: !!r.c_datos, c: <div className="mt-6 space-y-4 text-left">{[["c_datos", "Acepto el uso de mis datos para recomendarme oportunidades (obligatorio)"], ["c_alertas", "Quiero alertas por correo"], ["c_analitica", "Acepto analítica anónima"]].map(([k, l]) => <label key={k} className="flex gap-3 items-start"><Checkbox checked={!!r[k]} onCheckedChange={(v) => set(k, !!v)} /><span>{l}</span></label>)}{r.para === "menor" && <p className="text-sm text-[#5B6180]">Al ser un perfil de menor, aceptas tú como tutor.</p>}</div> },
  ];
  const p = pasos[paso];

  const terminar = async () => {
    if (!isAuthenticated) return navigateToLogin();
    setGuardando(true);
    await base44.entities.Perfil.create({
      tipo_cuenta: r.para === "yo" ? "estudiante" : r.para === "menor" ? "tutor" : "adulto",
      nombre_preferido: r.nombre || "Estudiante",
      es_menor: r.para === "menor",
      etapa: r.etapa, grado_o_semestre: r.grado, estado: r.estado, municipio: r.municipio, tipo_escuela: r.tipo_escuela,
      carrera: r.carrera, promedio: r.promedio ? Number(r.promedio) : undefined,
      intereses: lista(r.intereses), habilidades: lista(r.habilidades), logros: lista(r.logros), metas: r.metas, busca: r.busca,
      muestra_de_voz: r.voz, consentimiento_datos: true, consentimiento_alertas: !!r.c_alertas, consentimiento_analitica: !!r.c_analitica, onboarding_completo: true,
    });
    localStorage.removeItem("unira_quiz");
    nav({ to: "/para-ti" });
  };

  return (
    <div className="min-h-screen max-w-[560px] mx-auto px-4 py-6 flex flex-col">
      <Logo />
      <div className="mt-6 flex gap-1" aria-label={`Paso ${paso + 1} de ${pasos.length}`}>
        {pasos.map((_, i) => <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= paso ? "bg-primary" : "bg-[#ECEDF1]"}`} />)}
      </div>
      <p className="text-sm text-[#5B6180] mt-2">{paso + 1}/{pasos.length}</p>
      <AnimatePresence mode="wait">
        <motion.div key={paso} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }} className="flex-1 pb-28">
          <h1 className="font-serif-cond text-3xl text-center mt-8">{p.t}</h1>
          {paso === 0 && <Campo className="mt-6" placeholder="¿Cómo te llamamos?" value={r.nombre || ""} onChange={(v) => set("nombre", v)} />}
          {p.c}
        </motion.div>
      </AnimatePresence>
      <div className="fixed bottom-0 inset-x-0 bg-gradient-to-t from-background via-background to-transparent p-4">
        <div className="max-w-[560px] mx-auto flex gap-3 items-center">
          {paso > 0 && <button onClick={() => setPaso(paso - 1)} className="h-12 px-6 rounded-full border border-border bg-white font-medium">Atrás</button>}
          <button disabled={!p.ok || guardando} onClick={() => (paso < pasos.length - 1 ? setPaso(paso + 1) : terminar())} className="flex-1 h-12 rounded-full bg-primary text-white font-bold disabled:opacity-50">
            {paso < pasos.length - 1 ? "Siguiente" : isAuthenticated ? (guardando ? "Guardando…" : "Terminar") : "Crear cuenta para guardar"}
          </button>
          <MiGuia className="w-12 h-10 hidden sm:block" estado={paso === pasos.length - 1 ? "celebrando" : "reposo"} />
        </div>
      </div>
    </div>
  );
}