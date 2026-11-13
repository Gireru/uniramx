import { createFileRoute, Link } from "@tanstack/react-router";
import StaticPage from "@/components/unira/StaticPage";
import ContactForm from "@/components/unira/ContactForm";

export const Route = createFileRoute("/contacto")({
  head: () => ({
    meta: [
      { title: "Contacto | Unira" },
      { name: "description", content: "Escríbenos para reportar una convocatoria desactualizada, sumar una institución o contarnos un problema en la plataforma Unira." },
    ],
  }),
  component: Contacto,
});

function Contacto() {
  return (
    <StaticPage titulo="Contacto">
      <p>
        Escríbenos para reportar una convocatoria que ya venció o tiene datos incorrectos, para
        pedir que sumemos una institución, para avisarnos de un problema en la plataforma o para
        contarnos cómo te fue en tu postulación. Si nos dejas tu correo, te respondemos ahí.
      </p>
      <div className="pt-2">
        <ContactForm />
      </div>
      <p className="text-sm text-[#5B6180]">
        Si tu institución publica convocatorias, también puedes escribirnos por este medio para
        sumarlas al catálogo. Antes de escribir, revisa{" "}
        <Link to="/ayuda-contra-fraudes" className="text-[#2B4BFF] font-medium underline">Ayuda contra fraudes</Link>{" "}
        y{" "}
        <Link to="/privacidad" className="text-[#2B4BFF] font-medium underline">Privacidad</Link>.
      </p>
    </StaticPage>
  );
}