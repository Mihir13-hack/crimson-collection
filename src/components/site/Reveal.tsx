import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={fadeUp}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({ eyebrow, title, center }: { eyebrow?: string; title: string; center?: boolean }) {
  return (
    <Reveal className={center ? "text-center" : ""}>
      {eyebrow && (
        <p className="text-[10px] uppercase tracking-[0.3em] text-gold mb-3">{eyebrow}</p>
      )}
      <h2 className="font-serif text-4xl md:text-5xl text-foreground">{title}</h2>
      <div className={`mt-4 h-px w-20 bg-gradient-gold ${center ? "mx-auto" : ""}`} />
    </Reveal>
  );
}
