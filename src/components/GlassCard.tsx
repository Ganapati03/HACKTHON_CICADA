import { motion } from 'motion/react';
import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function GlassCard({ children, className = '', hover = true }: GlassCardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -5, scale: 1.02 } : {}}
      className={`bg-[#1e293b]/40 backdrop-blur-xl border border-[#6366f1]/20 rounded-2xl p-6 shadow-lg ${className}`}
    >
      {children}
    </motion.div>
  );
}
