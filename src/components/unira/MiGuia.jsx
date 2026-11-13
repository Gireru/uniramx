import { motion, useReducedMotion } from "framer-motion";

const anim = {
  reposo: { y: [0, -6, 0], rotate: [-2, 2, -2] },
  escribiendo: { rotate: [-6, 6, -6] },
  celebrando: { y: [0, -18, 0], rotate: [0, 360], scale: 1.1 },
  escuchando: { y: 0 },
  durmiendo: { y: [0, -3, 0] },
};
const dur = { reposo: 3, escribiendo: 1.2, celebrando: 0.8, escuchando: 1, durmiendo: 4 };

export default function MiGuia({ estado = "reposo", className = "w-28 h-24" }) {
  const reduce = useReducedMotion();
  return (
    <motion.svg
      viewBox="0 0 120 100"
      className={className}
      role="img"
      aria-label="Mi guía, avioncito de papel"
      animate={reduce ? undefined : anim[estado]}
      transition={{ duration: dur[estado], repeat: estado === "celebrando" ? 0 : Infinity, ease: "easeInOut" }}
    >
      {estado === "escuchando" && <circle cx="60" cy="50" r="40" fill="none" stroke="#2B4BFF" strokeWidth="2" opacity="0.4" />}
      <path d="M8 46 112 8 84 90 58 66 8 46Z" fill="#fff" stroke="#14193F" strokeWidth="3" strokeLinejoin="round" />
      <path d="M58 66 112 8 50 56Z" fill="#FF4D8D" stroke="#14193F" strokeWidth="3" strokeLinejoin="round" />
      <circle cx="58" cy="40" r="2.6" fill="#14193F" />
      <circle cx="72" cy="36" r="2.6" fill="#14193F" />
      <circle cx="54" cy="47" r="4" fill="#FF4D8D" opacity="0.5" />
      <circle cx="77" cy="42" r="4" fill="#FF4D8D" opacity="0.5" />
      <path d="M62 46q4 4 8 0" stroke="#14193F" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M14 18l2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" fill="#FF4D8D" />
    </motion.svg>
  );
}