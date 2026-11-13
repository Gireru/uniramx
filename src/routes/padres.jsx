import { createFileRoute, Link } from "@tanstack/react-router";
import StaticPage from "@/components/unira/StaticPage";

export const Route = createFileRoute("/padres")({
  head: () => ({ meta: [{ title: "Para padres y tutores | Unira" }] }),
  component: () => (
    <StaticPage titulo="Para padres y tutores">
      <p>Tú acompañas, tu hija o hijo decide. Con menores de 18 años, el perfil vive en tu cuenta y nada queda listo para enviar sin tu aprobación.</p>
      <h2 className="font-serif-cond text-2xl pt-2">Documentos típicos</h2>
      <p>CURP, identificación del tutor, comprobante de domicilio, constancia de estudios y boleta o kárdex.</p>
      <h2 className="font-serif-cond text-2xl pt-2">Becas de primaria y secundaria</h2>
      <p>Mira las opciones del catálogo; si no hay una abierta, te avisamos cuando abra.</p>
      <Link to="/explorar" search={{ nivel: "primaria" }} className="inline-flex h-12 px-6 items-center rounded-full bg-primary text-white font-bold">Ver becas de primaria</Link>
      <p className="text-sm text-[#5B6180]">Cuidado con fraudes: nunca pagues por una beca gratuita. <Link to="/ayuda-contra-fraudes" className="underline text-[#2B4BFF]">Más información</Link>.</p>
    </StaticPage>
  ),
});