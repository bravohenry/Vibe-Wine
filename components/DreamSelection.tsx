import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { WINE_DREAMS, WineDream } from '../constants';
import { MoodTheme } from '../types';
import TarotCard from './TarotCard';

// Fisher-Yates shuffle algorithm for randomizing array order
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

interface DreamSelectionProps {
  theme: MoodTheme;
  onBack: () => void;
  onDrink: (wine: WineDream) => void;
}

const DreamSelection: React.FC<DreamSelectionProps> = ({ theme, onBack, onDrink }) => {
  // Shuffle wine dreams on each mount so the order is randomized every time.
  const items = useMemo(() => shuffleArray(WINE_DREAMS), []);
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [revealedWine, setRevealedWine] = useState<WineDream | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const hasMovedRef = useRef(false);

  // Scroll the clicked card to the center of the carousel
  const scrollCardToCenter = (index: number) => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const cardElement = carousel.querySelector<HTMLElement>(`[data-dream-card="${index}"]`);
    if (cardElement) {
      cardElement.scrollIntoView({ 
        behavior: 'smooth', 
        inline: 'center', 
        block: 'nearest' 
      });
    }
  };

  // Mouse drag handlers for carousel
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    
    setIsDragging(true);
    hasMovedRef.current = false;
    setStartX(e.pageX - carousel.offsetLeft);
    setScrollLeft(carousel.scrollLeft);
    carousel.style.cursor = 'grabbing';
    carousel.style.userSelect = 'none';
    // Disable snap during drag for smoother experience
    carousel.style.scrollSnapType = 'none';
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const carousel = carouselRef.current;
    if (!carousel || !isDragging) return;
    
    e.preventDefault();
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - startX) * 1.5; // Scroll speed multiplier
    
    // Check if user has moved enough to consider it a drag
    if (Math.abs(walk) > 5) {
      hasMovedRef.current = true;
    }
    
    carousel.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    
    // Small delay to allow card click handler to check hasMovedRef
    setTimeout(() => {
      setIsDragging(false);
      hasMovedRef.current = false;
    }, 10);
    
    carousel.style.cursor = 'grab';
    carousel.style.userSelect = 'auto';
    // Re-enable snap after drag
    carousel.style.scrollSnapType = 'x mandatory';
  };

  const handleMouseLeave = () => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    
    setIsDragging(false);
    hasMovedRef.current = false;
    carousel.style.cursor = 'grab';
    carousel.style.userSelect = 'auto';
    // Re-enable snap after drag
    carousel.style.scrollSnapType = 'x mandatory';
  };

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
        className="w-full pt-8 sm:pt-12 pb-3 sm:pb-4 flex-shrink-0 relative z-20 px-4 sm:px-6 md:px-10"
      >
        <div className="w-full max-w-3xl mx-auto flex items-center justify-between">
          <button 
              onClick={onBack}
              className="text-sm font-semibold text-white hover:text-white/90 transition-all duration-300 ease-out flex items-center gap-1 px-4 py-2 rounded-full border-[0.5px] border-transparent hover:border-transparent hover:scale-[1.02] active:scale-[0.98]"
              style={{
                // Back button: solid black background, no gradient.
                // English comment required by user rule.
                backgroundColor: 'rgba(0, 0, 0, 1)',
                backgroundImage: 'none',
                background: 'none',
                borderColor: 'rgba(0, 0, 0, 0)',
                borderImage: 'none',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                boxShadow: `
                  inset 0 1px 1px rgba(255,255,255,0.8),
                  inset 0 -1px 1px rgba(255,255,255,0.2),
                  0 2px 8px rgba(0,0,0,0.04),
                  0 4px 16px rgba(0,0,0,0.04)
                `,
              }}
          >
              <span className="text-base leading-none mr-1">&lt;</span> Back
          </button>

          <h2 className="text-xl md:text-2xl font-bold text-slate-800 drop-shadow-sm text-center">
              Choose a Dream
          </h2>

          {/* Mirror the back button width so the title stays centered */}
          <div className="opacity-0 pointer-events-none select-none">
            <button
              className="text-sm font-semibold text-white flex items-center gap-1 px-4 py-2 rounded-full border-[0.5px] border-transparent"
              style={{ background: 'none' }}
              tabIndex={-1}
              aria-hidden="true"
            >
              <span className="text-base leading-none mr-1">&lt;</span> Back
            </button>
          </div>
        </div>
      </motion.div>

      {/* Horizontal Carousel Container */}
      <div 
        ref={carouselRef}
        className="flex-1 flex items-center overflow-x-auto snap-x snap-mandatory gap-6 sm:gap-8 px-4 sm:px-6 md:px-12 pt-8 sm:pt-12 pb-28 hide-scrollbar touch-pan-x"
        style={{ 
             // Hide native scrollbars for a cleaner look
             scrollbarWidth: 'none', 
             msOverflowStyle: 'none',
             cursor: isDragging ? 'grabbing' : 'grab',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
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
                        onReveal={(wine) => {
                          // Only reveal if user didn't drag
                          if (!hasMovedRef.current) {
                            setRevealedWine(wine);
                            scrollCardToCenter(index);
                          }
                        }}
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
        className="fixed left-0 right-0 bottom-0 z-30 px-4 sm:px-6 pb-6 pt-3 pointer-events-none"
      >
        <div className="mx-auto w-full max-w-sm pointer-events-auto safe-bottom">
          <motion.button
            type="button"
            disabled={!revealedWine}
            onClick={() => {
              if (!revealedWine) return;
              onDrink(revealedWine);
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 rounded-full text-white font-semibold text-lg transition-all duration-300 disabled:opacity-60 border border-white/30"
            style={{
              background: `linear-gradient(to bottom, ${theme.color}, ${theme.color}dd)`,
              backdropFilter: 'blur(12px) saturate(150%)',
              WebkitBackdropFilter: 'blur(12px) saturate(150%)',
              boxShadow: `
                inset 0 1px 1px rgba(255,255,255,0.35),
                inset 0 -1px 2px rgba(0,0,0,0.1),
                0 8px 24px -4px ${theme.color}60,
                0 4px 12px -2px ${theme.color}40
              `,
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