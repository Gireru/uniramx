import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Home, Search, Sparkles, ClipboardList, User, FileText, Star } from "lucide-react";
import { motion } from "framer-motion";
import Logo from "@/components/unira/Logo";
import { useAuth } from "@/lib/AuthContext";

const MOVIL = [
  { to: "/inicio", label: "Inicio", Icon: Home },
  { to: "/explorar", label: "Explorar", Icon: Search },
  { to: "/guia", label: "Mi guía", Icon: Sparkles },
  { to: "/postulaciones", label: "Postulaciones", Icon: ClipboardList },
  { to: "/perfil", label: "Perfil", Icon: User },
];
const LATERAL = [
  { to: "/inicio", label: "Inicio", Icon: Home },
  { to: "/postulaciones", label: "Mis postulaciones", Icon: ClipboardList },
  { to: "/para-ti", label: "Para ti", Icon: Star },
  { to: "/guia", label: "Mi guía", Icon: Sparkles },
  { to: "/perfil", label: "Perfil", Icon: User },
];

export default function AppShell() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { logout } = useAuth();
  const activo = (to) => path === to || path.startsWith(to + "/");
  return (
    <div className="min-h-screen md:flex">
      <aside className="hidden md:flex w-[216px] shrink-0 flex-col border-r border-border bg-white p-4 sticky top-0 h-screen">
        <Logo className="mb-8 px-2" />
        <nav className="flex flex-col gap-1">
          {LATERAL.map(({ to, label, Icon }) => (
            <Link key={to} to={to} className={`min-h-[44px] px-3 rounded-xl flex items-center gap-3 font-medium ${activo(to) ? "bg-[#FDE8F0] text-[#C8004F]" : "hover:bg-muted"}`}>
              <Icon className="w-5 h-5" strokeWidth={1.75} /> {label}
            </Link>
          ))}
          <Link to="/explorar" className="min-h-[44px] px-3 rounded-xl flex items-center gap-3 font-medium hover:bg-muted"><Search className="w-5 h-5" strokeWidth={1.75} /> Explorar</Link>
        </nav>
        <div className="mt-auto bg-[#FDE8F0] rounded-2xl p-4 text-sm">
          <Star className="w-5 h-5 text-primary mb-1" strokeWidth={1.75} />
          <p className="font-bold text-[#C8004F]">Postula más, llega más lejos.</p>
          <button onClick={() => logout()} className="mt-3 underline text-[#5B6180]">Cerrar sesión</button>
        </div>
      </aside>
      <main className="flex-1 min-w-0 pb-24 md:pb-10">
        <Outlet />
        <p className="text-xs text-[#5B6180] text-center mt-10 px-4">Unira no garantiza aceptación: la decide cada institución. Tú revisas y tú envías.</p>
      </main>
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-border grid grid-cols-5 z-30" aria-label="Principal">
        {MOVIL.map(({ to, label, Icon }) => (
          <Link key={to} to={to} className={`relative min-h-[56px] flex flex-col items-center justify-center text-[11px] gap-0.5 ${activo(to) ? "text-primary font-bold" : "text-[#5B6180]"}`}>
            {activo(to) && <motion.span layoutId="ind" className="absolute top-0 h-0.5 w-8 bg-primary rounded-full" />}
            <Icon className="w-5 h-5" strokeWidth={1.75} /> {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}