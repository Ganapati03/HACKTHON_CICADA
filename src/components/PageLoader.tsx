import { motion } from 'motion/react';
import { Brain } from 'lucide-react';

export default function PageLoader() {
  return (
    <div className="fixed inset-0 bg-[#0f172a] flex items-center justify-center z-50">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="inline-block mb-4"
        >
          <Brain className="w-16 h-16 text-[#6366f1]" />
        </motion.div>
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-[#f1f5f9]"
        >
          Analyzing data...
        </motion.p>
      </div>
    </div>
  );
}
