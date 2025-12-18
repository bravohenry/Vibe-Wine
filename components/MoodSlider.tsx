import React, { useRef, useEffect, useState } from 'react';
import { SliderProps } from '../types';
import { motion, useMotionValue, useTransform } from 'framer-motion';

const MoodSlider: React.FC<SliderProps> = ({ value, onChange, min = 0, max = 100, theme }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  
  // Thumb width is 48px (w-12), so center offset is 24px
  const thumbRadius = 24;

  // We use useMotionValue for the visual thumb position
  const x = useMotionValue(0);
  const [containerWidth, setContainerWidth] = useState(0);

  // Sync motion value and container width
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        setContainerWidth(width);
        const initialX = ((value - min) / (max - min)) * width;
        x.set(initialX);
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []); // Only on mount/unmount

  // Sync motion value with prop value when it changes from outside
  useEffect(() => {
    if (containerWidth > 0) {
      const targetX = ((value - min) / (max - min)) * containerWidth;
      // Only set if not already close (avoids jitter during drag)
      if (Math.abs(x.get() - targetX) > 1) {
        x.set(targetX);
      }
    }
  }, [value, min, max, containerWidth]);

  // Update parent state on drag
  const handleDrag = () => {
    if (containerWidth > 0) {
      const currentX = x.get();
      const newPercent = Math.max(0, Math.min(1, currentX / containerWidth));
      const newValue = Math.round(min + newPercent * (max - min));
      if (newValue !== value) {
        onChange(newValue);
      }
    }
  };

  // Handle track click or tap
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    
    // If clicking directly on the thumb, let Framer Motion handle it
    if (e.target === thumbRef.current || thumbRef.current?.contains(e.target as Node)) {
      return;
    }

    const rect = containerRef.current.getBoundingClientRect();
    const offsetX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const newPercent = offsetX / rect.width;
    const newValue = Math.round(min + newPercent * (max - min));
    
    // Set position and trigger change
    x.set(offsetX);
    onChange(newValue);
  };

  // Fill width derived from x
  const fillWidth = useTransform(x, [0, containerWidth || 1], ["0%", "100%"]);

  return (
    <div className="w-full max-w-md mx-auto relative px-4 select-none touch-none">
      
      {/* Labels */}
      <div className="flex justify-between text-[10px] sm:text-xs font-bold tracking-widest text-slate-500 mb-6 uppercase opacity-60">
        <span>Very Unpleasant</span>
        <span>Very Pleasant</span>
      </div>

      {/* Track Container */}
      <div 
        ref={containerRef}
        onPointerDown={handlePointerDown}
        className="relative h-14 w-full rounded-full cursor-pointer flex items-center group touch-none"
        style={{
             background: `linear-gradient(to right, rgba(255,255,255,0.4), rgba(255,255,255,0.4))`,
             backdropFilter: 'blur(10px)',
             boxShadow: 'inset 0 2px 5px rgba(0,0,0,0.05)'
        }}
      >
          {/* Active Fill */}
          <motion.div 
            className="absolute left-0 top-0 bottom-0 rounded-full opacity-20"
            style={{ width: fillWidth, backgroundColor: theme.color }}
          />

          {/* Thumb */}
          <motion.div
            ref={thumbRef}
            drag="x"
            dragConstraints={{ left: 0, right: containerWidth }}
            dragElastic={0}
            dragMomentum={false}
            onDrag={handleDrag}
            style={{ x, left: -thumbRadius }}
            className="absolute w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center z-10"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 600, damping: 40 }}
          >
              <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
          </motion.div>
      </div>

      {/* Hidden Native Input for Accessibility */}
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute top-0 left-0 w-full h-full opacity-0 pointer-events-none"
        aria-label="Mood Selector"
      />
    </div>
  );
};

export default MoodSlider;