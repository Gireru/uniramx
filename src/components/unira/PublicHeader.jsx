import { Link } from "@tanstack/react-router";
import Logo from "@/components/unira/Logo";

export default function PublicHeader() {
  const links = [
    { label: "Becas", tipo: "beca" },
    { label: "Cursos", tipo: "curso" },
    { label: "Concursos", tipo: "concurso" },
  ];
  return (
    <header className="max-w-[1200px] mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
      <Logo />
      <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium text-foreground">
        {links.map((l) => (
          <Link key={l.tipo} to="/explorar" search={{ tipo: l.tipo }} className="hover:text-primary">{l.label}</Link>
        ))}
        <Link to="/guia" className="hover:text-primary">Mi guía</Link>
      </nav>
      <Link
        to="/quiz"
        className="h-12 px-6 rounded-full bg-primary text-primary-foreground font-bold inline-flex items-center hover:scale-[1.03] transition-transform"
      >
        Empieza gratis
      </Link>
    </header>
  );
}