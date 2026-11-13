import { createFileRoute, Link } from "@tanstack/react-router";
import StaticPage from "@/components/unira/StaticPage";

export const Route = createFileRoute("/acerca-de-unira")({
  head: () => ({
    meta: [
      { title: "Acerca de Unira: becas, cursos y empleo para jóvenes en México" },
      { name: "description", content: "Unira es una plataforma gratuita que reúne becas, apoyos, cursos, concursos, empleos, prácticas e intercambios para jóvenes en México y en el extranjero, con enlace oficial y fecha de verificación." },
    ],
  }),
  component: AcercaDeUnira,
});

function AcercaDeUnira() {
  return (
    <StaticPage titulo="Acerca de Unira">
      <p>
        Unira es una plataforma gratuita que reúne becas, apoyos, cursos, concursos, empleos,
        prácticas e intercambios en un solo lugar, y acompaña a cada persona paso a paso hasta
        enviar su postulación.
      </p>
      <p>
        Hoy encontrar una convocatoria confiable implica revisar decenas de sitios, grupos y
        publicaciones que a veces ya vencieron o no explican los requisitos. En Unira cada
        oportunidad se publica con su enlace oficial, su fecha límite y la fecha en que se
        verificó. Lo que no está verificado no se recomienda.
      </p>
      <p>
        Además del catálogo, Unira tiene herramientas para la parte que más cuesta: el cuestionario
        inicial que arma tu perfil, “Mi guía”, el asistente que te explica qué te falta, la carta de
        motivación que se escribe solo con tus propios hechos, el currículum que puedes llenar
        hablando o con el abecedario manual de LSM y descargar en PDF, y la lista de verificación
        de documentos de cada convocatoria.
      </p>
      <h2 className="font-serif-cond text-2xl md:text-3xl pt-2">¿Para quién es?</h2>
      <p>
        Para jóvenes de México, desde secundaria hasta posgrado, y para personas egresadas que
        buscan su primer empleo, una práctica profesional o un intercambio. También para familias y
        tutores que acompañan a alguien menor de edad, y para quienes buscan oportunidades fuera
        del país.
      </p>
      <h2 className="font-serif-cond text-2xl md:text-3xl pt-2">¿Quién lo construye?</h2>
      <p>
        Unira es un proyecto independiente, hecho en México y mantenido por un equipo pequeño que
        vivió de cerca lo difícil que es encontrar una beca y ganarla sin apoyo. No vendemos datos
        personales y no cobramos por postular.
      </p>
      <h2 className="font-serif-cond text-2xl md:text-3xl pt-2">Nuestro principio</h2>
      <p>
        La institución decide, tú revisas y tú envías. Unira te acompaña, nunca postula por ti ni
        promete una aceptación. Puedes conocer cómo usamos la información en{" "}
        <Link to="/privacidad" className="text-[#2B4BFF] font-medium underline">Privacidad</Link> y
        de dónde sale cada convocatoria en{" "}
        <Link to="/fuentes" className="text-[#2B4BFF] font-medium underline">Fuentes</Link>.
        ¿Quieres decirnos algo? Escríbenos en{" "}
        <Link to="/contacto" className="text-[#2B4BFF] font-medium underline">Contacto</Link>.
      </p>
    </StaticPage>
  );
}