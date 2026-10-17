import { motion } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";

interface ScrollSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function ScrollSection({ children, className = "", id }: ScrollSectionProps) {
  const ref = useRef(null);
  // Setting once: true drastically improves performance by not re-animating heavy components on every scroll
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.section
      ref={ref}
      id={id}
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
      transition={{
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99] as const,
      }}
    >
      {children}
    </motion.section>
  );
}

