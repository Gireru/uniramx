import { Link } from "@tanstack/react-router";

const LOGO = "https://base44.app/api/apps/6af698de4c0b756f280116ba/files/mp/public/6af698de4c0b756f280116ba/c29fd17b5_unira-logo.png";

export default function Logo({ className = "", compact = false }) {
  return (
    <Link to="/" className={`inline-flex items-center ${className}`} aria-label="Unira, inicio. Te unimos con tu oportunidad">
      <img src={LOGO} alt="Unira: te unimos con tu oportunidad" className={compact ? "h-10 w-auto" : "h-14 w-auto"} width="196" height="56" />
    </Link>
  );
}