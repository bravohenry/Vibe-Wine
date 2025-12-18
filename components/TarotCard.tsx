import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { WineDream } from '../constants';
import { MoodTheme } from '../types';

interface TarotCardProps {
  data: WineDream;
  theme: MoodTheme;
  index: number;
  onReveal: (wine: WineDream) => void;
}

const TarotCard: React.FC<TarotCardProps> = ({ data, theme, index, onReveal }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Use the dream front image (1-8). This is the "tarot" face the user selects.
  const frontImageSrc = data.frontImageSrc || `https://placehold.co/600x900/ffffff/2d2d2d?text=${encodeURIComponent(data.dreamTitle)}`;

  // Use the image URL provided by the data source.
  // Fallback to placeholder if somehow missing.
  const imageSrc =
    data.imageSrc ||
    `https://placehold.co/600x900/${data.isRed ? '4a1d1d' : 'e8f4f8'}/${data.isRed ? 'e8f4f8' : '2d2d2d'}?text=${encodeURIComponent(data.name)}`;

  return (
    <div 
        className="w-full h-full relative group cursor-pointer" 
        onClick={() => {
          setIsFlipped((prev) => {
            const next = !prev;
            if (next) onReveal(data);
            return next;
          });
        }}
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
            className="absolute inset-0 w-full h-full backface-hidden rounded-3xl overflow-hidden border border-white/40 shadow-xl bg-white"
        >
            {/* 1. Base Image (Clear) */}
            <img
                src={frontImageSrc}
                alt={data.dreamTitle}
                className="absolute inset-0 w-full h-full object-cover object-center"
            />

            {/* 2. Gaussian Blur Layer with Gradient Mask (Top and Bottom edges only) */}
            <div 
                className="absolute inset-0 z-10"
                style={{ 
                    WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 12%, transparent 88%, black 100%)',
                    maskImage: 'linear-gradient(to bottom, black 0%, transparent 12%, transparent 88%, black 100%)',
                }}
            >
                <img
                    src={frontImageSrc}
                    alt=""
                    className="w-full h-full object-cover object-center"
                    style={{ filter: 'blur(10px)' }}
                />
                {/* Glass tint overlay on the blurred parts */}
                <div 
                    className="absolute inset-0" 
                    style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.05) 0%, transparent 15%, transparent 85%, rgba(255,255,255,0.05) 100%)' }}
                />
            </div>

            {/* Decorative ambient gradients */}
            <div 
                className="absolute inset-0 z-20 opacity-40 mix-blend-overlay pointer-events-none"
                style={{ 
                    background: `radial-gradient(circle at 50% 30%, ${theme.color}, transparent 70%)` 
                }}
            />
            
            {/* Inner Border / Glow */}
            <div className="absolute inset-0 z-30 rounded-3xl shadow-[inset_0_0_0_1px_rgba(255,255,255,0.4)] pointer-events-none" />

            {/* Content Container */}
            <div className="absolute inset-0 z-40 p-4 flex items-center justify-center">
                {/* Title + hint */}
                <div className="absolute bottom-8 left-8 right-8 text-center">
                    <h3 className="text-2xl font-bold text-white tracking-widest uppercase mb-2 drop-shadow-md" style={{ fontFamily: 'Manrope' }}>
                        {data.dreamTitle}
                    </h3>
                    <span className="text-xs text-white/80 font-medium tracking-wide uppercase">
                        Tap to reveal
                    </span>
                </div>
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
             <div className="relative h-[70%] w-full bg-white overflow-hidden group-hover:h-[72%] transition-all duration-500 p-4 flex items-center justify-center">
                <img 
                    src={imageSrc} 
                    alt={data.name} 
                    className="w-full h-full object-contain object-center transition-transform duration-500 bg-white"
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
                <div className="absolute top-4 right-4 px-3 py-1 bg-[#333]/20 backdrop-blur-md rounded-full text-[10px] font-bold tracking-wider text-white shadow-sm">
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