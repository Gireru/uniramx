import { Link } from "@tanstack/react-router";

const LOGO = "https://base44.app/api/apps/6af698de4c0b756f280116ba/files/mp/public/6af698de4c0b756f280116ba/8617e4fb1_unira-logo-transparente.png";

export default function Logo({ className = "", compact = false }) {
  return (
    <Link to="/" className={`inline-flex items-center ${className}`} aria-label="Unira, inicio. Te unimos con tu oportunidad">
      <img
        src={LOGO}
        alt="Unira: te unimos con tu oportunidad"
        className={compact ? "h-9 w-auto md:h-10" : "h-12 w-auto md:h-14"}
        width="900"
        height="287"
      />
    </Link>
  );
}