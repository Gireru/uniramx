import { Link } from "@tanstack/react-router";

export function PlaneIcon({ className = "w-7 h-7" }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path d="M2 14 30 3 22 29 15 19 2 14Z" fill="#E6005C" />
      <path d="M15 19 30 3 12 17Z" fill="#C8004F" />
    </svg>
  );
}

export default function Logo({ className = "" }) {
  return (
    <Link to="/" className={`inline-flex items-center gap-2 ${className}`} aria-label="Unira, inicio">
      <PlaneIcon />
      <span className="font-serif-cond text-2xl text-primary leading-none">Unira</span>
    </Link>
  );
}