import { Link } from "@tanstack/react-router";
import Logo from "@/components/unira/Logo";
import { useAuth } from "@/lib/AuthContext";

export default function PublicHeader() {
  const { isAuthenticated, navigateToLogin } = useAuth();
  const links = [
    { label: "Becas", to: "/explorar", search: { tipo: "beca" } },
    { label: "Cursos", to: "/explorar", search: { tipo: "curso" } },
    { label: "Concursos", to: "/explorar", search: { tipo: "concurso" } },
    { label: "Empleo", to: "/explorar", search: { tipo: "empleo" } },
    { label: "Extranjero", to: "/explorar", search: { alcance: "internacional" } },
  ];
  return (
    <header className="max-w-[1200px] mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-3">
      <Logo compact />
      <nav className="hidden lg:flex items-center gap-7 text-[15px] font-medium text-foreground">
        {links.map((l) => (
          <Link key={l.label} to={l.to} search={l.search} className="hover:text-primary transition-colors">{l.label}</Link>
        ))}
        <Link to="/guia" className="hover:text-primary">Mi guía</Link>
      </nav>
      <button onClick={() => (isAuthenticated ? (window.location.href = "/inicio") : navigateToLogin())} className="h-11 md:h-12 px-5 md:px-6 rounded-full bg-primary text-primary-foreground font-bold hover:scale-[1.03] transition-transform">
        {isAuthenticated ? "Mi panel" : "Empieza gratis"}
      </button>
    </header>
  );
}