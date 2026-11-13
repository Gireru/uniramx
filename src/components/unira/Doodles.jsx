import { motion, useReducedMotion } from "framer-motion";

function Draw({ d, className, delay = 0 }) {
  const reduce = useReducedMotion();
  return (
    <svg viewBox="0 0 80 80" className={className} aria-hidden="true">
      <motion.path
        d={d}
        fill="none"
        stroke="#2B4BFF"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduce ? false : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay }}
      />
    </svg>
  );
}

export const Star = ({ className }) => (
  <Draw className={className} d="M40 8l7 22 23 1-18 14 7 23-19-13-19 13 7-23L10 31l23-1Z" />
);
export const Curl = ({ className }) => (
  <Draw className={className} delay={0.15} d="M8 60c20-40 50-40 40-14-8 18-26 4-14-8 10-10 30 0 36 18" />
);
export const Arrow = ({ className }) => (
  <Draw className={className} delay={0.3} d="M6 14c14 0 40 4 50 28M56 42l-12-2M56 42l4-12" />
);