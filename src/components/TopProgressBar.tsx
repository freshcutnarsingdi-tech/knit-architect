import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export default function TopProgressBar() {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Whenever the pathname changes, trigger the top-loading progress bar simulation
    setVisible(true);
    setProgress(20);

    // Rapidly advance to 55%
    const t1 = setTimeout(() => {
      setProgress(55);
    }, 80);

    // Creep to 80%
    const t2 = setTimeout(() => {
      setProgress(80);
    }, 250);

    // Creep to 92% to simulate final loading stretch
    const t3 = setTimeout(() => {
      setProgress(92);
    }, 500);

    // Finish at 100%
    const t4 = setTimeout(() => {
      setProgress(100);
    }, 800);

    // Gracefully fade out and reset
    const t5 = setTimeout(() => {
      setVisible(false);
    }, 1100);

    const t6 = setTimeout(() => {
      setProgress(0);
    }, 1400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      clearTimeout(t6);
    };
  }, [location.pathname]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          id="top-loading-bar-container"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeInOut' }}
          className="fixed top-0 left-0 right-0 h-[3px] bg-transparent z-[9999] pointer-events-none"
        >
          <motion.div
            id="top-loading-bar-fill"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{
              width: { type: 'tween', ease: 'easeOut', duration: 0.35 },
            }}
            className="h-full bg-gradient-to-r from-[var(--color-primary-blue)] to-[#3b82f6] shadow-[0_0_8px_rgba(30,82,183,0.6),0_0_4px_rgba(59,130,246,0.4)]"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
