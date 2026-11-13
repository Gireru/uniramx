import { createFileRoute } from "@tanstack/react-router";
import PublicHeader from "@/components/unira/PublicHeader";
import Hero from "@/components/unira/Hero";
import AbiertasAhora from "@/components/unira/AbiertasAhora";
import ImpactoYConfianza from "@/components/unira/ImpactoYConfianza";
import Footer from "@/components/unira/Footer";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Unira: encuentra tu beca, curso o concurso" }] }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen">
      <PublicHeader />
      <Hero />
      <AbiertasAhora />
      <ImpactoYConfianza />
      <Footer />
    </div>
  );
}