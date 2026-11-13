import { createFileRoute } from "@tanstack/react-router";
import StaticPage from "@/components/unira/StaticPage";

export const Route = createFileRoute("/privacidad")({
  head: () => ({ meta: [{ title: "Privacidad | Unira" }] }),
  component: () => (
    <StaticPage titulo="Privacidad">
      <p>Pedimos solo lo mínimo para recomendarte oportunidades: nivel escolar, estado, promedio, intereses y metas. Los datos económicos son voluntarios y nunca se comparten.</p>
      <p>Tu perfil y tus postulaciones son privados: solo tú puedes verlos. Nunca te pediremos contraseñas ni datos bancarios.</p>
      <p>Si eres menor de 18 años, tu mamá, papá o tutor administra tu perfil y aprueba antes de que algo quede listo para enviar.</p>
      <p>Puedes editar tus datos y consentimientos, exportarlos y borrar tu cuenta y tus datos desde tu perfil.</p>
      <p>Unira no garantiza aceptación: la decide cada institución. Tú revisas y tú envías.</p>
    </StaticPage>
  ),
});