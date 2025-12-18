import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { WINE_DREAMS, WineDream } from '../constants';
import { MoodTheme } from '../types';
import TarotCard from './TarotCard';

interface DreamSelectionProps {
  theme: MoodTheme;
  onBack: () => void;
  onDrink: (wine: WineDream) => void;
}

const DreamSelection: React.FC<DreamSelectionProps> = ({ theme, onBack, onDrink }) => {
  // Only render the original 8 items (no "infinite" duplication).
  const items = WINE_DREAMS;
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [revealedWine, setRevealedWine] = useState<WineDream | null>(null);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const firstCard = carousel.querySelector<HTMLElement>('[data-dream-card="0"]');
    if (!firstCard) return;

    // Centering the first snap item requires enough left/right padding.
    // We compute dynamic padding so the first/last item can sit in the center.
    // English comment required by user rule.
    const applyEdgePaddingAndCenterFirst = () => {
      const styles = window.getComputedStyle(carousel);
      const basePaddingLeft = Number.parseFloat(styles.paddingLeft || '0') || 0;
      const basePaddingRight = Number.parseFloat(styles.paddingRight || '0') || 0;

      const requiredEdgePadding = Math.max(
        0,
        (carousel.clientWidth - firstCard.clientWidth) / 2
      );

      const nextPaddingLeft = Math.max(basePaddingLeft, requiredEdgePadding);
      const nextPaddingRight = Math.max(basePaddingRight, requiredEdgePadding);

      carousel.style.paddingLeft = `${Math.round(nextPaddingLeft)}px`;
      carousel.style.paddingRight = `${Math.round(nextPaddingRight)}px`;

      // Snap/scroll to center the first card.
      firstCard.scrollIntoView({ behavior: 'auto', inline: 'center', block: 'nearest' });
    };

    // Wait a frame so layout (including font loading) has settled.
    const raf = requestAnimationFrame(applyEdgePaddingAndCenterFirst);
    window.addEventListener('resize', applyEdgePaddingAndCenterFirst);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', applyEdgePaddingAndCenterFirst);
    };
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
        ref={carouselRef}
        className="flex-1 flex items-center overflow-x-auto snap-x snap-mandatory gap-8 px-6 md:px-12 pt-12 pb-28 hide-scrollbar touch-pan-x"
        style={{ 
             // Hide native scrollbars for a cleaner look
             scrollbarWidth: 'none', 
             msOverflowStyle: 'none',
        }}
      >
        {items.map((dream, index) => (
            <motion.div 
                key={dream.id}
                data-dream-card={index}
                className="snap-center flex-shrink-0 flex flex-col items-center group/item"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                    // Stagger entrance slightly based on original index
                    delay: 0.1 + index * 0.05, 
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
                     <TarotCard
                        data={dream}
                        theme={theme}
                        index={index}
                        onReveal={(wine) => setRevealedWine(wine)}
                      />
                </div>
                
                {/* Name/Label Below */}
                <div className="mt-6 text-center transition-all duration-300 transform group-hover/item:translate-y-2">
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

      {/* Bottom CTA (appears after reveal) */}
      <motion.div
        initial={false}
        animate={{
          y: revealedWine ? 0 : 120,
          opacity: revealedWine ? 1 : 0,
        }}
        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
        className="fixed left-0 right-0 bottom-0 z-30 px-6 pb-6 pt-3 pointer-events-none"
      >
        <div className="mx-auto w-full max-w-sm pointer-events-auto">
          <motion.button
            type="button"
            disabled={!revealedWine}
            onClick={() => {
              if (!revealedWine) return;
              onDrink(revealedWine);
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 rounded-full text-white font-semibold text-lg shadow-xl transition-colors duration-300 disabled:opacity-60"
            style={{
              backgroundColor: theme.color,
              boxShadow: `0 10px 25px -5px ${theme.color}80`,
            }}
          >
            Drink with My Mood
          </motion.button>
        </div>
      </motion.div>

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