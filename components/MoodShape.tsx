import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { MoodTheme } from '../types';

interface MoodShapeProps {
  theme: MoodTheme;
}

const MoodShape: React.FC<MoodShapeProps> = ({ theme }) => {
  const { shapeParams, color, accentColor } = theme;
  const shouldReduceMotion = useReducedMotion();

  // Generate SVG path data.
  // Using a cleaner harmonic formula to match the "perfect" geometric look of the reference.
  const generatePath = (
    baseRadius: number,
    params: typeof shapeParams,
    rotationAngle: number 
  ) => {
    const { points, spikiness } = params;
    
    const RES = 360; 
    const center = 200; 
    
    let d = "";
    const pathPoints: { x: number; y: number }[] = [];

    for (let i = 0; i <= RES; i++) {
        const geoAngle = (i / RES) * Math.PI * 2;
        const waveAngle = geoAngle + rotationAngle; 
        
        // Flower petal logic:
        // Use Math.cos(points * angle)
        // To get broad petals and slightly sharper valleys, we can shape the wave.
        let wave = Math.cos(waveAngle * points);
        
        // Optional: Sharpen valleys slightly for that "Apple" look if spikiness is high
        // but keep it smooth (no abs/sharp points)
        
        const amplitude = baseRadius * spikiness * 0.4; 
        
        // No random noise (distortion) effectively to keep it clean like the reference
        const r = baseRadius + (wave * amplitude);
        
        const x = center + Math.cos(geoAngle + rotationAngle) * r;
        const y = center + Math.sin(geoAngle + rotationAngle) * r;
        
        pathPoints.push({ x, y });
    }
    
    d += `M ${pathPoints[0].x} ${pathPoints[0].y} `;
    for (let i = 1; i < pathPoints.length; i++) {
        d += `L ${pathPoints[i].x} ${pathPoints[i].y} `;
    }
    d += "Z";
    
    return d;
  };

  // Precompute static paths. We intentionally remove rotation (user requested no rotation).
  // English comment required by user rule.
  const paths = useMemo(() => {
    return {
      // Define layers based on the reference image proportions
      // 1. Large Outer Glass
      path1: generatePath(160, shapeParams, 0),
      // 2. Middle Glass
      path2: generatePath(125, shapeParams, 0),
      // 3. Inner Glass
      path3: generatePath(90, shapeParams, 0),
      // 4. Center Opaque Core
      path4: generatePath(55, shapeParams, 0),
      // 5. Tiny Center Dot
      path5: generatePath(10, shapeParams, 0),
    };
  }, [shapeParams]);

  // Layered breathing: inner leads, outer follows. Scale only (no translate, no rotation).
  // English comment required by user rule.
  const breathDuration = 5.2;
  const centerOrigin = {
    // SVG transform origin needs explicit settings.
    // English comment required by user rule.
    transformBox: 'fill-box' as const,
    transformOrigin: 'center',
    willChange: 'transform',
  };

  return (
    <div className="relative w-[400px] h-[400px] flex items-center justify-center">
      <svg 
        viewBox="0 0 400 400" 
        className="w-full h-full transition-all duration-700 ease-out"
        style={{ 
            // Softer drop shadow to match the airy feel
            filter: `drop-shadow(0px 30px 60px ${color}40)` 
        }}
      >
        <defs>
          {/* 
             1. Main Glass Gradient (Outer Layers)
             Transparent white with a hint of color, very subtle.
          */}
          <linearGradient id="glassBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.6" />
            <stop offset="50%" stopColor="white" stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0.1" />
          </linearGradient>

          {/* 
             2. Rim Light Gradient (The Gold Edge) 
             Sharp transition from white to gold/accent to transparent
          */}
          <linearGradient id="rimLight" x1="0%" y1="0%" x2="0%" y2="100%">
             <stop offset="0%" stopColor="white" stopOpacity="0.9" />
             <stop offset="30%" stopColor="#FFF" stopOpacity="0.8" />
             <stop offset="50%" stopColor={accentColor} stopOpacity="0.6" />
             <stop offset="100%" stopColor={color} stopOpacity="0.3" />
          </linearGradient>

          {/* 
             3. Center Core Gradient (Opaque)
             Glowing from center outward: White -> Bright Color -> Darker Color
          */}
          <radialGradient id="coreGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="30%" stopColor={accentColor} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="1" />
          </radialGradient>
          
           {/* 
             4. Surface Sheen (Top-down light)
             Used for overlay to give that convex look
          */}
          <linearGradient id="surfaceSheen" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.5" />
            <stop offset="40%" stopColor="white" stopOpacity="0.1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>

          {/* 
             Lighting Filter
             High specular exponent for 'polished plastic/glass' look.
             Light positioned top-left.
          */}
          <filter id="glossFilter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur" />
            <feSpecularLighting in="blur" surfaceScale="5" specularConstant="0.8" specularExponent="50" lightingColor="white" result="specOut">
                <fePointLight x="100" y="50" z="200" />
            </feSpecularLighting>
            <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut" />
            <feMerge>
                <feMergeNode in="SourceGraphic" />
                <feMergeNode in="specOut" />
            </feMerge>
          </filter>
        </defs>

        {/* --- Layer 1 (Outer) --- */}
        <motion.path
          d={paths.path1}
          fill="url(#glassBody)"
          stroke="url(#rimLight)"
          strokeWidth="2" // Thicker rim for definition
          className="backdrop-blur-[2px]"
          animate={
            shouldReduceMotion
              ? undefined
              : { scale: [1, 1.012, 1] }
          }
          transition={
            shouldReduceMotion
              ? undefined
              : { duration: breathDuration, ease: 'easeInOut', repeat: Infinity, times: [0, 0.70, 1] }
          }
          style={{ filter: 'url(#glossFilter)', ...centerOrigin }}
        />
        {/* Inner shadow/inset effect simulation via overlay stroke */}
        <motion.path 
            d={paths.path1} 
            fill="none" 
            stroke="white" 
            strokeWidth="1" 
            strokeOpacity="0.5"
            className="pointer-events-none"
            animate={
              shouldReduceMotion
                ? undefined
                : { scale: [1, 1.012, 1] }
            }
            transition={
              shouldReduceMotion
                ? undefined
                : { duration: breathDuration, ease: 'easeInOut', repeat: Infinity, times: [0, 0.70, 1] }
            }
            style={centerOrigin}
        />

        {/* --- Layer 2 (Middle) --- */}
        <motion.path
          d={paths.path2}
          fill="url(#glassBody)"
          stroke="url(#rimLight)"
          strokeWidth="2"
          className="backdrop-blur-[4px]"
          animate={
            shouldReduceMotion
              ? undefined
              : { scale: [1, 1.03, 1] }
          }
          transition={
            shouldReduceMotion
              ? undefined
              : { duration: breathDuration, ease: 'easeInOut', repeat: Infinity, times: [0, 0.55, 1] }
          }
          style={{ filter: 'url(#glossFilter)', ...centerOrigin }}
        />

        {/* --- Layer 3 (Inner) --- */}
        <motion.path
          d={paths.path3}
          fill="url(#glassBody)"
          stroke="url(#rimLight)"
          strokeWidth="1.5"
          className="backdrop-blur-[8px]"
          animate={
            shouldReduceMotion
              ? undefined
              : { scale: [1, 1.06, 1] }
          }
          transition={
            shouldReduceMotion
              ? undefined
              : { duration: breathDuration, ease: 'easeInOut', repeat: Infinity, times: [0, 0.40, 1] }
          }
          style={{ filter: 'url(#glossFilter)', ...centerOrigin }}
        />

        {/* --- Layer 4 (Core) --- */}
        <motion.path
          d={paths.path4}
          fill="url(#coreGradient)"
          // The core in the image has a soft glow, no heavy stroke
          stroke="white" 
          strokeWidth="0.5"
          strokeOpacity="0.8"
          className="drop-shadow-lg"
          animate={
            shouldReduceMotion
              ? undefined
              : { scale: [1, 1.085, 1] }
          }
          transition={
            shouldReduceMotion
              ? undefined
              : { duration: breathDuration, ease: 'easeInOut', repeat: Infinity, times: [0, 0.32, 1] }
          }
          style={centerOrigin}
        />
        
        {/* --- Layer 5 (Center Dot) --- */}
        {/* The tiny white star in the center */}
         <motion.path
          d={paths.path5}
          fill="white"
          className="blur-[1px]"
          animate={
            shouldReduceMotion
              ? undefined
              : { scale: [1, 1.1, 1] }
          }
          transition={
            shouldReduceMotion
              ? undefined
              : { duration: breathDuration, ease: 'easeInOut', repeat: Infinity, times: [0, 0.28, 1] }
          }
          style={centerOrigin}
        />

      </svg>
    </div>
  );
};

export default MoodShape;