import { createFileRoute } from "@tanstack/react-router";
import CVEditor from "@/components/unira/CVEditor";

export const Route = createFileRoute("/_authed/mi-curriculum")({
  head: () => ({ meta: [{ title: "Mi currículum | Unira" }, { name: "description", content: "Arma tu currículum hablando o con el abecedario manual de LSM y descárgalo en PDF para postular a becas, prácticas y empleos." }] }),
  component: MiCurriculum,
});

function MiCurriculum() {
  return (
    <div className="p-4 md:p-10 max-w-2xl">
      <h1 className="font-serif-cond text-3xl md:text-6xl">Mi currículum</h1>
      <p className="text-[#5B6180] mt-2">Llénalo hablando o con el teclado de señas. Descárgalo en PDF cuando quieras y úsalo en convocatorias, prácticas y empleos.</p>
      <div className="mt-6"><CVEditor /></div>
    </div>
  );
}