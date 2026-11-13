import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import Logo from "@/components/unira/Logo";
import { useAuth } from "@/lib/AuthContext";

const links = [
  { label: "Becas", search: { tipo: "beca" } },
  { label: "Cursos", search: { tipo: "curso" } },
  { label: "Concursos", search: { tipo: "concurso" } },
  { label: "Empleo", search: { tipo: "empleo" } },
  { label: "Extranjero", search: { alcance: "internacional" } },
];

export default function PublicHeader() {
  const { isAuthenticated, navigateToLogin } = useAuth();
  const [open, setOpen] = useState(false);

  const irAMiGuia = () => (isAuthenticated ? (window.location.href = "/guia") : navigateToLogin());
  const irAlPanel = () => (isAuthenticated ? (window.location.href = "/inicio") : navigateToLogin());

  return (
    <header className="max-w-[1200px] mx-auto px-4 md:px-6 py-3 md:py-4">
      <div className="flex items-center justify-between gap-3">
        <Logo compact />

        <nav className="hidden md:flex items-center gap-5 lg:gap-7 text-[15px] font-medium text-foreground">
          {links.map((l) => (
            <Link key={l.label} to="/explorar" search={l.search} className="hover:text-primary transition-colors">
              {l.label}
            </Link>
          ))}
          <button type="button" onClick={irAMiGuia} className="hover:text-primary transition-colors">Mi guía</button>
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={irAlPanel}
            className="h-11 px-4 md:h-12 md:px-6 rounded-full bg-primary text-primary-foreground font-bold text-sm md:text-base hover:scale-[1.03] transition-transform"
          >
            {isAuthenticated ? "Mi panel" : <><span className="md:hidden">Empezar</span><span className="hidden md:inline">Empieza gratis</span></>}
          </button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            className="md:hidden h-11 w-11 rounded-full bg-white border border-border grid place-items-center text-foreground"
          >
            {open ? <X className="w-5 h-5" strokeWidth={2} /> : <Menu className="w-5 h-5" strokeWidth={2} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="md:hidden mt-3 grid gap-0.5 bg-white rounded-2xl p-2.5 shadow-soft border border-border">
          {links.map((l) => (
            <Link
              key={l.label}
              to="/explorar"
              search={l.search}
              onClick={() => setOpen(false)}
              className="px-3 py-3 rounded-xl font-medium hover:bg-secondary"
            >
              {l.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={() => { setOpen(false); irAMiGuia(); }}
            className="px-3 py-3 rounded-xl font-medium text-left hover:bg-secondary"
          >
            Mi guía
          </button>
        </nav>
      )}
    </header>
  );
}