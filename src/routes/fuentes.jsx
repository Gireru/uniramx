import { createFileRoute } from "@tanstack/react-router";
import StaticPage from "@/components/unira/StaticPage";

export const Route = createFileRoute("/fuentes")({
  head: () => ({ meta: [{ title: "Fuentes | Unira" }] }),
  component: () => (
    <StaticPage titulo="Fuentes y verificación">
      <p>Unira es una iniciativa comunitaria que apoya a jóvenes de todos los sectores a encontrar oportunidades. El catálogo se arma con fuentes oficiales: Coordinación Nacional de Becas Bienestar, SEP, Secihti, STPS, Santander Universidades, Tecnológico de Monterrey, UANL, Gobierno de Nuevo León, fundaciones y más.</p>
      <p>No hay una API pública de convocatorias en esas fuentes, por eso un curador carga cada ficha con su enlace oficial y la fecha de verificación. Lo que no está verificado se marca "Verificación pendiente" y nunca se recomienda.</p>
      <p>Si tu institución publica un feed o API, Unira lo puede conectar.</p>
    </StaticPage>
  ),
});