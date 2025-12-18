import React, { useRef, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';
import { WINE_DREAMS } from '../constants';
import { MoodTheme } from '../types';
import TarotCard from './TarotCard';

interface DreamSelectionProps {
  theme: MoodTheme;
  onBack: () => void;
}

const DreamSelection: React.FC<DreamSelectionProps> = ({ theme, onBack }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Create 5 copies of the data to simulate "infinite" scrolling.
  // This gives the user plenty of room to scroll left/right before hitting an edge.
  const items = [...WINE_DREAMS, ...WINE_DREAMS, ...WINE_DREAMS, ...WINE_DREAMS, ...WINE_DREAMS];

  useLayoutEffect(() => {
    if (scrollRef.current) {
        const scrollContainer = scrollRef.current;
        const scrollWidth = scrollContainer.scrollWidth;
        const clientWidth = scrollContainer.clientWidth;
        
        // Center the scroll view initially on the middle set of cards
        // This makes the list feel infinite immediately on load.
        scrollContainer.scrollLeft = (scrollWidth / 2) - (clientWidth / 2);
    }
  }, []);

  return (
    <div className="w-full h-full flex flex-col relative z-10 overflow-hidden">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-between px-6 py-4 flex-shrink-0 relative z-20"
      >
        <button 
            onClick={onBack}
            className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1 bg-white/30 backdrop-blur-md px-4 py-2 rounded-full shadow-sm hover:bg-white/50"
        >
            ← Back
        </button>
        <h2 className="text-xl md:text-2xl font-bold text-slate-800 drop-shadow-sm">
            Choose a Dream
        </h2>
        <div className="w-20" /> {/* Spacer to balance the back button */}
      </motion.div>

      {/* Horizontal Carousel Container */}
      <div 
        ref={scrollRef}
        className="flex-1 flex items-center overflow-x-auto snap-x snap-mandatory gap-8 px-[50vw] py-12 hide-scrollbar touch-pan-x"
        style={{ 
             // Hide native scrollbars for a cleaner look
             scrollbarWidth: 'none', 
             msOverflowStyle: 'none',
        }}
      >
        {items.map((dream, index) => (
            <motion.div 
                key={`${dream.id}-${index}`}
                className="snap-center flex-shrink-0 flex flex-col items-center group/item"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                    // Stagger entrance slightly based on original index
                    delay: 0.1 + (index % WINE_DREAMS.length) * 0.05, 
                    duration: 0.5 
                }}
                whileHover={{ 
                    scale: 1.05, 
                    y: -10,
                    zIndex: 10,
                    transition: { duration: 0.3 }
                }}
            >
                {/* Card Container - Holds dimensions and perspective */}
                <div className="w-72 md:w-80 lg:w-[320px] aspect-[2/3] perspective-1000 relative">
                     <TarotCard data={dream} theme={theme} index={index} />
                </div>
                
                {/* Name/Label Below */}
                <div className="mt-6 text-center transition-all duration-300 transform group-hover/item:translate-y-2">
                    <h3 className="text-lg font-bold text-slate-800 tracking-widest uppercase font-serif drop-shadow-sm" style={{ fontFamily: 'Manrope' }}>
                        {dream.dreamTitle}
                    </h3>
                    <div className="flex items-center justify-center gap-2 mt-2 opacity-60">
                        <span className="w-1 h-1 rounded-full bg-slate-400" />
                        <p className="text-xs text-slate-600 font-medium uppercase tracking-wider">
                            {dream.region}
                        </p>
                        <span className="w-1 h-1 rounded-full bg-slate-400" />
                    </div>
                </div>
            </motion.div>
        ))}
      </div>
      
      {/* Edge Fade Masks */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white/20 to-transparent pointer-events-none z-10 backdrop-blur-[1px]" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white/20 to-transparent pointer-events-none z-10 backdrop-blur-[1px]" />

      {/* Global Style for hiding scrollbar */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default DreamSelection;