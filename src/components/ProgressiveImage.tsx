import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

// Global cache of successfully loaded image URLs to bypass future transition flashes
const loadedUrls = new Set<string>();

interface ProgressiveImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholderColor?: string;
  loading?: 'lazy' | 'eager';
  fallbackSrc?: string;
  imageClassName?: string;
  showSpinner?: boolean;
  // Custom motion/styling adjustments for the loaded image
  customAnimate?: any;
  customInitial?: any;
  customTransition?: any;
}

export default function ProgressiveImage({
  src,
  alt,
  className = '',
  placeholderColor = 'bg-transparent',
  loading = 'lazy',
  fallbackSrc,
  imageClassName = '',
  showSpinner = false,
  customAnimate,
  customInitial,
  customTransition,
}: ProgressiveImageProps) {
  // Check if already cached/loaded to avoid any animation delay or placeholder flash
  const isInitiallyLoaded = typeof window !== 'undefined' && (loadedUrls.has(src) || (() => {
    const img = new Image();
    img.src = src;
    return img.complete;
  })());

  const [isLoaded, setIsLoaded] = useState(isInitiallyLoaded);
  const [currentSrc, setCurrentSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const isFirstMount = useRef(true);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      if (isInitiallyLoaded) {
        loadedUrls.add(src);
        return;
      }
    }

    // If source changed
    if (loadedUrls.has(src)) {
      setIsLoaded(true);
      setCurrentSrc(src);
      return;
    }

    const img = new Image();
    img.src = src;
    img.referrerPolicy = 'no-referrer';
    
    if (img.complete) {
      loadedUrls.add(src);
      setIsLoaded(true);
      setCurrentSrc(src);
      return;
    }

    setIsLoaded(false);
    setCurrentSrc(src);
    setHasError(false);

    img.onload = () => {
      loadedUrls.add(src);
      setIsLoaded(true);
    };

    img.onerror = () => {
      if (fallbackSrc && !hasError) {
        setHasError(true);
        setCurrentSrc(fallbackSrc);
      } else {
        setIsLoaded(true);
      }
    };
  }, [src, fallbackSrc]);

  const handleLoad = () => {
    loadedUrls.add(currentSrc);
    setIsLoaded(true);
  };

  const handleError = () => {
    if (fallbackSrc && !hasError) {
      setHasError(true);
      setCurrentSrc(fallbackSrc);
    } else {
      setIsLoaded(true);
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
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className={`absolute inset-0 w-full h-full ${placeholderColor} flex items-center justify-center z-10`}
          >
            {/* Subtle shimmering overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--color-primary-blue)]/5 to-transparent w-full h-full animate-pulse" />
            {showSpinner && (
              /* Small, safe spinner that fits in any container */
              <div className="w-4 h-4 rounded-full border-2 border-[var(--color-primary-blue)]/20 border-t-[var(--color-primary-blue)] animate-spin opacity-40" />
            )}
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
        initial={isInitiallyLoaded ? { opacity: 1, filter: 'blur(0px)' } : (customInitial || { opacity: 0, filter: 'blur(4px)' })}
        animate={isLoaded ? (customAnimate || { opacity: 1, filter: 'blur(0px)' }) : (customInitial || { opacity: 0, filter: 'blur(4px)' })}
        transition={isInitiallyLoaded ? { duration: 0 } : (customTransition || { duration: 0.3, ease: 'easeOut' })}
      />
    </div>
  );
}

