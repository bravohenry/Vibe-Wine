import React, { useRef, useEffect } from 'react';
import { SliderProps } from '../types';
import { motion, useMotionValue, animate } from 'framer-motion';

const MoodSlider: React.FC<SliderProps> = ({ value, onChange, min = 0, max = 100, theme }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // We use useMotionValue for the visual thumb position to ensure 60fps updates
  // without triggering React renders on every pixel moved during drag.
  // However, since `value` is passed in from parent, we need to sync them.
  const motionValue = useMotionValue(value);

  useEffect(() => {
    animate(motionValue, value, { duration: 0.1 });
  }, [value, motionValue]);

  // Calculate value from X coordinate
  const getValueFromX = (clientX: number) => {
    if (!containerRef.current) return min;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const offsetX = clientX - rect.left;
    
    // Clamp between 0 and 1
    let percent = offsetX / width;
    percent = Math.max(0, Math.min(1, percent));
    
    return Math.round(min + percent * (max - min));
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Prevent default browser behavior (text selection, scrolling on touch)
    e.preventDefault();
    
    // Calculate initial value on click/tap
    const newValue = getValueFromX(e.clientX);
    onChange(newValue);

    // Setup global listeners to track movement outside the container
    const handlePointerMove = (moveEvent: PointerEvent) => {
      const val = getValueFromX(moveEvent.clientX);
      onChange(val);
    };

    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  // Convert current value to percentage for CSS positioning
  const percent = ((value - min) / (max - min)) * 100;

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
          <div 
            className="absolute left-0 top-0 bottom-0 rounded-full opacity-20 transition-all duration-100 ease-linear"
            style={{ width: `${percent}%`, backgroundColor: theme.color }}
          />

          {/* Thumb */}
          {/* We remove Framer Motion's 'drag' prop to avoid conflict. 
              We position it absolutely based on the value. */}
          <motion.div
            className="absolute w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center z-10 pointer-events-none"
            style={{ 
                left: `calc(${percent}% - 24px)`, // Center thumb (width/2)
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
            whileHover={{ scale: 1.1 }}
            // We use a small layout animation for smooth snapping if clicked, 
            // but short enough to feel responsive during drag.
            transition={{ type: "tween", duration: 0.05 }}
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