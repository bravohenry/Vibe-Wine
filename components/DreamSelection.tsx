import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WINE_DREAMS, WineDream } from '../constants';
import { MoodTheme } from '../types';
import TarotCard from './TarotCard';

interface DreamSelectionProps {
  theme: MoodTheme;
  onBack: () => void;
  onDrink: (wine: WineDream) => void;
}

const DreamSelection: React.FC<DreamSelectionProps> = ({ theme, onBack, onDrink }) => {
  const items = WINE_DREAMS;
  const carouselRef = useRef<HTMLDivElement | null>(null);
  const [revealedWine, setRevealedWine] = useState<WineDream | null>(null);
  
  // Start with "dealing" state (cards stacked).
  // English comment required by user rule.
  const [isDealing, setIsDealing] = useState(true);

  useEffect(() => {
    // Trigger the "spread" animation after a short delay.
    const timer = setTimeout(() => {
      setIsDealing(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Re-run the centering logic after the deal animation is roughly done
    // so that the first card (or the scroll position) is correct.
    if (!isDealing) {
        const timer = setTimeout(() => {
            const carousel = carouselRef.current;
            if (carousel) {
                const firstCard = carousel.querySelector<HTMLElement>('[data-dream-card="0"]');
                if (firstCard) {
                     // Recalculate padding logic from original code
                     const styles = window.getComputedStyle(carousel);
                     const basePaddingLeft = Number.parseFloat(styles.paddingLeft || '0') || 0;
                     const basePaddingRight = Number.parseFloat(styles.paddingRight || '0') || 0;
                     const requiredEdgePadding = Math.max(0, (carousel.clientWidth - firstCard.clientWidth) / 2);
                     
                     // Only apply if we haven't already (simple check) or just force it
                     carousel.style.paddingLeft = `${Math.round(Math.max(basePaddingLeft, requiredEdgePadding))}px`;
                     carousel.style.paddingRight = `${Math.round(Math.max(basePaddingRight, requiredEdgePadding))}px`;
                     
                     // Scroll to start or center? Let's scroll to start (first card)
                     firstCard.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                }
            }
        }, 600); // Wait for layout transition
        return () => clearTimeout(timer);
    }
  }, [isDealing]);

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
                backgroundColor: 'rgba(0, 0, 0, 1)',
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

          <div className="opacity-0 pointer-events-none select-none">
            <button className="text-sm font-semibold text-white px-4 py-2">
              Back
            </button>
          </div>
        </div>
      </motion.div>

      {/* 
        Container for Cards. 
        Switches from a centered flex container (stack) to a scrollable container (carousel).
      */}
      <motion.div 
        ref={carouselRef}
        layout
        className={`
            flex-1 flex items-center 
            ${isDealing ? 'justify-center overflow-hidden' : 'overflow-x-auto snap-x snap-mandatory gap-6 sm:gap-8 px-4 sm:px-6 md:px-12 pt-8 sm:pt-12 pb-28 hide-scrollbar touch-pan-x'}
        `}
        style={!isDealing ? { 
             scrollbarWidth: 'none', 
             msOverflowStyle: 'none',
        } : {}}
      >
        {items.map((dream, index) => {
            const isSelected = revealedWine?.id === dream.id;
            const isOther = revealedWine && !isSelected;

            return (
                <motion.div 
                    layout
                    key={dream.id}
                    data-dream-card={index}
                    className={`
                        flex-shrink-0 flex flex-col items-center group/item
                        ${isDealing ? 'absolute' : 'snap-center relative'}
                    `}
                    style={{
                        zIndex: isSelected ? 50 : (isDealing ? index : 1),
                    }}
                    initial={{ 
                        rotate: index * 2 - 7, // Initial slight fanning in stack
                        x: 0, 
                        y: 100, // Come from bottom
                        opacity: 0 
                    }}
                    animate={{ 
                        rotate: isDealing ? (index * 2 - 7) : 0,
                        x: 0,
                        y: 0,
                        opacity: isOther ? 0 : 1, // Hide others if one is selected
                        scale: isOther ? 0.8 : (isDealing ? 1 : 1),
                        pointerEvents: isOther ? 'none' : 'auto',
                        filter: isOther ? 'blur(4px) grayscale(50%)' : 'blur(0px) grayscale(0%)',
                    }}
                    transition={{
                        type: 'spring',
                        stiffness: 120,
                        damping: 20,
                        delay: isDealing ? index * 0.05 : 0 // Stagger entrance
                    }}
                    whileHover={!isDealing && !revealedWine ? { 
                        scale: 1.05, 
                        y: -10,
                        zIndex: 10,
                        transition: { duration: 0.3 }
                    } : {}}
                >
                    {/* Card Container */}
                    <div className="w-72 md:w-80 lg:w-[320px] aspect-[2/3] perspective-1000 relative">
                         <TarotCard
                            data={dream}
                            theme={theme}
                            index={index}
                            onReveal={(wine) => {
                                // If we are in "dealing" mode, ignore clicks? Or better, force spread.
                                if (isDealing) return;
                                setRevealedWine(wine);
                            }}
                          />
                    </div>
                    
                    {/* Name/Label Below - Hide when stacked or when another is selected */}
                    <motion.div 
                        className="mt-6 text-center"
                        animate={{ opacity: (isDealing || isOther) ? 0 : 1 }}
                    >
                        <div className="flex items-center justify-center gap-2 mt-2 opacity-60">
                            <span className="w-1 h-1 rounded-full bg-slate-400" />
                            <p className="text-xs text-slate-600 font-medium uppercase tracking-wider">
                                {dream.region}
                            </p>
                            <span className="w-1 h-1 rounded-full bg-slate-400" />
                        </div>
                    </motion.div>
                </motion.div>
            );
        })}
      </motion.div>
      
      {/* Edge Fade Masks - Only show when NOT dealing */}
      {!isDealing && (
        <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white/20 to-transparent pointer-events-none z-10 backdrop-blur-[1px]" />
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white/20 to-transparent pointer-events-none z-10 backdrop-blur-[1px]" />
        </>
      )}

      {/* Bottom CTA */}
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

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default DreamSelection;