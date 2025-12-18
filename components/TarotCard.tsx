import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { WineDream } from '../constants';
import { MoodTheme } from '../types';

// Using direct paths instead of imports to avoid module resolution issues
// in environments that don't support importing image files directly.
const wineImages: Record<number, string> = {
  1: '/components/wine/1.jpg',
  2: '/components/wine/2.jpg',
  3: '/components/wine/3.jpg',
  4: '/components/wine/4.jpg',
  5: '/components/wine/5.jpg',
  6: '/components/wine/6.jpg',
  7: '/components/wine/7.jpg',
  8: '/components/wine/8.jpg',
};

interface TarotCardProps {
  data: WineDream;
  theme: MoodTheme;
  index: number;
}

const TarotCard: React.FC<TarotCardProps> = ({ data, theme, index }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Use the image path, fallback to placeholder if not found
  const imageSrc = wineImages[data.id] || `https://placehold.co/600x900/${data.isRed ? '4a1d1d' : 'e8f4f8'}/${data.isRed ? 'e8f4f8' : '2d2d2d'}?text=${encodeURIComponent(data.name)}`;

  return (
    <div 
        className="w-full h-full relative group cursor-pointer" 
        onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="w-full h-full relative preserve-3d"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.7, type: "spring", stiffness: 60, damping: 12 }} 
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* --- FRONT (The Dream / Tarot Back) --- */}
        <div 
            className="absolute inset-0 w-full h-full backface-hidden rounded-3xl overflow-hidden border border-white/40 shadow-xl"
            style={{ 
                // Glassy look with dynamic mood tint
                background: `linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.2) 100%)`,
                backdropFilter: 'blur(20px)',
                boxShadow: `0 20px 40px -10px ${theme.color}40, inset 0 0 0 1px rgba(255,255,255,0.4)`
            }}
        >
            {/* Decorative ambient gradients */}
            <div 
                className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] opacity-40 mix-blend-overlay"
                style={{ 
                    background: `radial-gradient(circle at 50% 30%, ${theme.color}, transparent 70%)` 
                }}
            />
            <div 
                className="absolute bottom-[-10%] right-[-10%] w-[80%] h-[80%] opacity-30 mix-blend-multiply"
                style={{ 
                    background: `radial-gradient(circle, ${theme.accentColor}, transparent 70%)` 
                }}
            />
            
            {/* Card Content */}
            <div className="absolute inset-4 border border-white/30 rounded-2xl flex flex-col items-center justify-center p-4 text-center">
                 {/* Abstract geometric symbol */}
                 <div 
                    className="w-20 h-20 rounded-full blur-xl mb-8 opacity-70"
                    style={{ backgroundColor: theme.accentColor }} 
                 />
                 <h3 className="text-2xl font-bold text-slate-700 tracking-widest uppercase mb-3" style={{ fontFamily: 'Manrope' }}>
                     {data.dreamTitle}
                 </h3>
                 <span className="text-xs text-slate-500 font-medium tracking-wide uppercase opacity-70">
                    Tap to reveal
                 </span>
            </div>
        </div>

        {/* --- BACK (The Wine Info) --- */}
        <div 
            className="absolute inset-0 w-full h-full backface-hidden rounded-3xl overflow-hidden shadow-2xl bg-white flex flex-col"
            style={{ 
                transform: 'rotateY(180deg)',
                boxShadow: `0 20px 50px -12px ${theme.color}60`
            }}
        >
             {/* 
                IMAGE SECTION - Top 70% (Increased for vertical photos)
             */}
             <div className="relative h-[70%] w-full bg-slate-100 overflow-hidden group-hover:h-[72%] transition-all duration-500">
                <img 
                    src={imageSrc} 
                    alt={data.name} 
                    className="w-full h-full object-cover object-center transition-transform duration-1000 group-hover:scale-105"
                />
                
                {/* Gradient Gradient for Text Readability - slightly taller to accommodate white text on varied backgrounds */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-100" />
                
                {/* Overlay Header Info */}
                <div className="absolute bottom-0 left-0 w-full p-5 text-white pb-6">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-white/80 block mb-1">
                        {data.region}
                    </span>
                    <h3 className="text-xl font-bold leading-tight font-serif text-white drop-shadow-md pr-2">
                        {data.name}
                    </h3>
                </div>

                {/* Badge (Type) */}
                <div className="absolute top-4 right-4 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-bold tracking-wider text-white border border-white/30 shadow-sm">
                    {data.type.split(' ')[0]}
                </div>
             </div>

             {/* 
                DETAILS SECTION - Bottom 30%
                Compact info area
             */}
             <div className="h-[30%] flex flex-col justify-between p-4 px-5 bg-white">
                <div>
                    <div className="flex flex-wrap gap-2 mb-2">
                         <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide bg-slate-50 text-slate-500 border border-slate-200">
                             {data.grapes}
                         </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 italic">
                        "{data.profile}"
                    </p>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium pt-2 border-t border-slate-100">
                     <span>Serve at</span>
                     <span className="text-slate-800 font-bold">
                        {data.serve}
                     </span>
                </div>
             </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TarotCard;