import { createFileRoute } from "@tanstack/react-router";
import StaticPage from "@/components/unira/StaticPage";

export const Route = createFileRoute("/ayuda-contra-fraudes")({
  head: () => ({ meta: [{ title: "Ayuda contra fraudes | Unira" }] }),
  component: () => (
    <StaticPage titulo="Ayuda contra fraudes">
      <ul className="list-disc pl-5 space-y-2">
        <li>Nunca pagues por una beca gratuita. Unira no cobra y ninguna convocatoria que listamos pide dinero por postular.</li>
        <li>Verifica el dominio oficial: cada convocatoria muestra su enlace oficial y la fecha en que lo verificamos.</li>
        <li>No compartas contraseñas, códigos ni datos bancarios con nadie, tampoco con Mi guía.</li>
        <li>Si ves un enlace roto o algo sospechoso, usa "Reportar" en la convocatoria.</li>
      </ul>
    </StaticPage>
  ),
});