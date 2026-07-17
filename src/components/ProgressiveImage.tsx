import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderColor?: string;
  loading?: 'lazy' | 'eager';
  fallbackSrc?: string;
  imageClassName?: string;
  // Custom motion/styling adjustments for the loaded image
  customAnimate?: any;
  customInitial?: any;
  customTransition?: any;
}

export default function ProgressiveImage({
  src,
  alt,
  className = '',
  placeholderColor = 'bg-neutral-100',
  loading = 'lazy',
  fallbackSrc,
  imageClassName = '',
  customAnimate,
  customInitial,
  customTransition,
}: ProgressiveImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  // Sync when src changes
  useEffect(() => {
    setCurrentSrc(src);
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    if (fallbackSrc && !hasError) {
      setHasError(true);
      setCurrentSrc(fallbackSrc);
    } else {
      setIsLoaded(true); // Stop spinner if both fail
    }
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Premium Blur-up/Shimmer Placeholder */}
      <AnimatePresence mode="popLayout">
        {!isLoaded && (
          <motion.div
            key="placeholder"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className={`absolute inset-0 w-full h-full ${placeholderColor} flex items-center justify-center z-10`}
          >
            {/* Subtle shimmering overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--color-primary-blue)]/5 to-transparent w-full h-full animate-pulse" />
            {/* Soft pulse animation */}
            <div className="w-12 h-12 rounded-full border-2 border-[var(--color-primary-blue)]/20 border-t-[var(--color-primary-blue)] animate-spin opacity-40" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Image, fades in gracefully */}
      <motion.img
        src={currentSrc}
        alt={alt}
        className={`${imageClassName} w-full h-full`}
        loading={loading}
        referrerPolicy="no-referrer"
        onLoad={handleLoad}
        onError={handleError}
        initial={customInitial || { opacity: 0, filter: 'blur(10px)' }}
        animate={isLoaded ? (customAnimate || { opacity: 1, filter: 'blur(0px)' }) : (customInitial || { opacity: 0, filter: 'blur(10px)' })}
        transition={customTransition || { duration: 0.6, ease: 'easeOut' }}
      />
    </div>
  );
}
