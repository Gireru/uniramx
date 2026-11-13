import { Link } from "@tanstack/react-router";
import Logo from "@/components/unira/Logo";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-border bg-white">
      <div className="max-w-[1200px] mx-auto px-4 md:px-6 py-10 grid gap-6 md:grid-cols-2">
        <div>
          <Logo />
          <p className="mt-3 text-sm text-muted-foreground max-w-sm">
            Unira no garantiza aceptación: la decide cada institución. Tú revisas y tú envías.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium md:justify-end items-start">
          <Link to="/acerca-de-unira" className="hover:text-primary">Acerca de Unira</Link>
          <Link to="/contacto" className="hover:text-primary">Contacto</Link>
          <Link to="/fuentes" className="hover:text-primary">Fuentes</Link>
          <Link to="/privacidad" className="hover:text-primary">Privacidad</Link>
          <Link to="/ayuda-contra-fraudes" className="hover:text-primary">Ayuda contra fraudes</Link>
          <Link to="/padres" className="hover:text-primary">Para padres</Link>
          <a href="https://www.instagram.com" target="_blank" rel="noreferrer" className="hover:text-primary">Instagram</a>
          <a href="https://www.facebook.com" target="_blank" rel="noreferrer" className="hover:text-primary">Facebook</a>
          <a href="https://www.tiktok.com" target="_blank" rel="noreferrer" className="hover:text-primary">TikTok</a>
        </div>
      </div>
    </footer>
  );
}