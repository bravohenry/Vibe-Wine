import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MoodTheme } from '../types';
import { WineDream } from '../constants';

type InteractionPageProps = {
  theme: MoodTheme;
  moodValue: number;
  wine: WineDream;
  onBack: () => void;
};

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function mulberry32(seed: number) {
  // Simple deterministic PRNG for repeatable "AI-like" reshuffles.
  // English comment required by user rule.
  return function () {
    let t = (seed += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickOne<T>(rng: () => number, list: T[]): T {
  const idx = Math.floor(rng() * list.length);
  return list[Math.max(0, Math.min(list.length - 1, idx))];
}

function moodDescriptor(moodValue: number) {
  const v = clamp(moodValue, 0, 100);
  if (v < 20) return { energy: 'low', tone: 'heavy', word: 'slow-breathing' };
  if (v < 40) return { energy: 'soft', tone: 'cool', word: 'quiet' };
  if (v < 60) return { energy: 'steady', tone: 'clear', word: 'balanced' };
  if (v < 80) return { energy: 'bright', tone: 'warm', word: 'glowing' };
  return { energy: 'spark', tone: 'bold', word: 'electric' };
}

function extractTastingNotes(profile: string) {
  // Keep it simple and robust: split by commas and trim.
  // English comment required by user rule.
  return profile
    .replace(/[."]/g, '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 5);
}

function buildLyrics(params: {
  rng: () => number;
  moodLabel: string;
  moodValue: number;
  wine: WineDream;
}) {
  const { rng, moodLabel, moodValue, wine } = params;
  const md = moodDescriptor(moodValue);
  const notes = extractTastingNotes(wine.profile);

  const openers = [
    `Tonight, ${moodLabel.toLowerCase()} feels like a room with soft corners.`,
    `I pour a little ${wine.type.split(' ')[0].toLowerCase()} and the air changes.`,
    `My mood is ${md.word}; your glass is a small lighthouse.`,
    `Some nights are a color. This one is ${moodLabel.toLowerCase()}.`,
  ];

  const bridges = [
    `On the first sip: ${pickOne(rng, notes) || 'a clean note'} — then a pause.`,
    `I catch ${pickOne(rng, notes) || 'a bright edge'} and let it dissolve on my tongue.`,
    `We keep it ${md.energy}, we keep it ${md.tone}, we keep it honest.`,
    `The bottle says "${wine.dreamTitle}". My heart agrees.`,
  ];

  const refrains = [
    `Drink with my mood — slow, then sudden.`,
    `Drink with my mood — let the day unclench.`,
    `Drink with my mood — and make it feel like music.`,
    `Drink with my mood — like a secret chorus.`,
  ];

  const closers = [
    `Serve it at ${wine.serve}, and let the world soften.`,
    `Somewhere between ${pickOne(rng, notes) || 'fruit'} and silence, I find my name again.`,
    `If you listen, the glass is singing in lowercase.`,
    `I don't need answers—just this pour, and this moment.`,
  ];

  const title = pickOne(rng, [
    `${wine.dreamTitle} (Vibe Draft)`,
    `Drink with My Mood (AI Lyrics)`,
    `Mood Pairing: ${wine.dreamTitle}`,
  ]);

  const lines = [
    pickOne(rng, openers),
    `Wine: ${wine.name}`,
    pickOne(rng, bridges),
    pickOne(rng, refrains),
    pickOne(rng, bridges),
    pickOne(rng, closers),
  ];

  return { title, lines, tags: notes.slice(0, 3) };
}

function Stamp({
  imageSrc,
  theme,
  label,
}: {
  imageSrc: string;
  theme: MoodTheme;
  label: string;
}) {
  // Create scalloped stamp edges via CSS mask gradients.
  // English comment required by user rule.
  const scallopSize = 10;
  const mask = `radial-gradient(${scallopSize}px ${scallopSize}px at ${scallopSize}px ${scallopSize}px, #000 98%, transparent 100%)`;

  return (
    <div className="absolute right-6 top-6 z-20">
      <div
        className="relative w-[110px] h-[140px] rotate-[-6deg]"
        style={{
          WebkitMaskImage: `${mask}, ${mask}, linear-gradient(#000,#000)`,
          WebkitMaskPosition: `0 0, ${scallopSize}px ${scallopSize}px, 0 0`,
          WebkitMaskSize: `${scallopSize * 2}px ${scallopSize * 2}px, ${scallopSize * 2}px ${scallopSize * 2}px, 100% 100%`,
          WebkitMaskRepeat: 'repeat, repeat, no-repeat',
          maskImage: `${mask}, ${mask}, linear-gradient(#000,#000)`,
          maskPosition: `0 0, ${scallopSize}px ${scallopSize}px, 0 0`,
          maskSize: `${scallopSize * 2}px ${scallopSize * 2}px, ${scallopSize * 2}px ${scallopSize * 2}px, 100% 100%`,
          maskRepeat: 'repeat, repeat, no-repeat',
          background: 'rgba(255,255,255,0.9)',
          border: '1px solid rgba(0,0,0,0.08)',
          boxShadow: `0 16px 28px -16px ${theme.color}70`,
        }}
      >
        <div className="absolute inset-[10px] rounded-sm overflow-hidden bg-white">
          <img src={imageSrc} alt={label} className="w-full h-full object-contain" />
        </div>

        {/* Tiny caption strip */}
        <div
          className="absolute left-[10px] right-[10px] bottom-[10px] rounded-sm px-2 py-1"
          style={{
            background: 'rgba(255,255,255,0.92)',
            border: '1px solid rgba(0,0,0,0.06)',
          }}
        >
          <p className="text-[9px] font-bold tracking-widest uppercase text-slate-700 truncate">
            {label}
          </p>
        </div>
      </div>

      {/* Postmark overlay */}
      <div className="absolute right-[40px] top-[46px] rotate-[8deg] opacity-35 pointer-events-none">
        <div
          className="w-[78px] h-[78px] rounded-full"
          style={{
            border: '2px solid rgba(15,23,42,0.45)',
          }}
        />
        <div
          className="absolute inset-0 w-[78px] h-[78px] rounded-full"
          style={{
            border: '1px dashed rgba(15,23,42,0.45)',
            transform: 'scale(0.82)',
          }}
        />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <span className="text-[9px] font-bold tracking-widest text-slate-800/80">
            VIBE
          </span>
        </div>
      </div>
    </div>
  );
}

const InteractionPage: React.FC<InteractionPageProps> = ({ theme, moodValue, wine, onBack }) => {
  // Use theme label as the mood text on this page.
  // English comment required by user rule.
  const moodLabel = theme.label;
  const [seed, setSeed] = useState(() => Date.now() % 1_000_000);

  const content = useMemo(() => {
    const rng = mulberry32(seed + wine.id * 101);
    return buildLyrics({ rng, moodLabel, moodValue, wine });
  }, [seed, wine, moodLabel, moodValue]);

  const letterLines = useMemo(() => {
    // Reduce density: remove the explicit "Wine:" line and keep fewer lines.
    // English comment required by user rule.
    const filtered = content.lines.filter((l) => !l.startsWith('Wine:'));
    return filtered.slice(0, 4);
  }, [content.lines]);

  return (
    <div className="w-full min-h-screen relative overflow-hidden">
      {/* Dream image background + blur layers */}
      <div className="fixed inset-0 z-0">
        <img
          src={wine.frontImageSrc}
          alt={wine.dreamTitle}
          className="w-full h-full object-cover scale-105"
        />
        <div
          className="absolute inset-0"
          style={{
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.40) 0%, rgba(255,255,255,0.18) 55%, rgba(255,255,255,0.30) 100%)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 20% 25%, ${theme.color}40, transparent 55%), radial-gradient(circle at 80% 70%, ${theme.accentColor}35, transparent 60%)`,
            mixBlendMode: 'multiply',
            opacity: 0.85,
          }}
        />
      </div>

      <div className="relative z-10 w-full min-h-screen px-6 md:px-10 py-8 flex flex-col items-center">
        {/* Discreet top actions */}
        <div className="w-full max-w-3xl flex items-center justify-between gap-3">
          <button
            onClick={onBack}
            className="text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors bg-white/40 backdrop-blur-md px-4 py-2 rounded-full shadow-sm hover:bg-white/60"
          >
            ← Back
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold tracking-widest uppercase text-slate-700/80 bg-white/40 backdrop-blur-md px-3 py-2 rounded-full border border-white/30">
              {theme.label}
            </span>
            <span className="text-[11px] font-bold tracking-widest uppercase text-slate-700/80 bg-white/40 backdrop-blur-md px-3 py-2 rounded-full border border-white/30">
              {wine.type.split(' ')[0]}
            </span>
          </div>
        </div>

        {/* Letter */}
        <div className="w-full max-w-3xl mt-6 relative">
          <div
            className="relative rounded-[28px] overflow-hidden"
            style={{
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(250,248,240,0.92) 40%, rgba(255,255,255,0.88) 100%)',
              boxShadow:
                '0 40px 90px -60px rgba(15,23,42,0.55), 0 20px 45px -35px rgba(15,23,42,0.35)',
              border: '1px solid rgba(15,23,42,0.08)',
            }}
          >
            {/* Paper texture */}
            <div
              className="absolute inset-0 pointer-events-none opacity-40"
              style={{
                background:
                  'repeating-linear-gradient(0deg, rgba(15,23,42,0.03) 0px, rgba(15,23,42,0.03) 1px, transparent 1px, transparent 18px)',
              }}
            />
            <div
              className="absolute inset-0 pointer-events-none opacity-25"
              style={{
                background:
                  'radial-gradient(circle at 30% 25%, rgba(15,23,42,0.05), transparent 60%), radial-gradient(circle at 70% 80%, rgba(15,23,42,0.04), transparent 55%)',
              }}
            />

            <Stamp imageSrc={wine.imageSrc} theme={theme} label={wine.type.split(' ')[0]} />

            <div className="relative p-7 md:p-10 pr-7 md:pr-10">
              {/* Header */}
              <div className="pr-[130px]">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                  {content.title}
                </h1>
                <p className="mt-2 text-sm text-slate-700/80">
                  {wine.name} · {wine.region}
                </p>
              </div>

              {/* Divider */}
              <div className="mt-6 h-px w-full bg-slate-900/10" />

              {/* Lyrics (lighter + less dense) */}
              <div className="mt-6">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[12px] font-bold tracking-widest uppercase text-slate-600/70">
                    A note to myself
                  </p>
                  <motion.button
                    type="button"
                    onClick={() => setSeed((s) => s + 1)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 rounded-full text-sm font-semibold text-white shadow-md"
                    style={{
                      backgroundColor: theme.color,
                      boxShadow: `0 14px 28px -18px ${theme.color}CC`,
                    }}
                  >
                    Reshuffle
                  </motion.button>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${wine.id}-${seed}`}
                    initial={{ opacity: 0, y: 8, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -6, filter: 'blur(8px)' }}
                    transition={{ duration: 0.35 }}
                    className="mt-4 space-y-4"
                  >
                    {letterLines.map((line, i) => (
                      <motion.p
                        key={`${i}-${line}`}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.04 + i * 0.06, duration: 0.32 }}
                        className={[
                          'text-slate-800 leading-relaxed',
                          i === 0 ? 'text-lg md:text-xl font-semibold' : 'text-base md:text-lg',
                          line.startsWith('Drink with my mood') ? 'font-semibold' : '',
                        ].join(' ')}
                        style={{ fontFamily: 'Manrope' }}
                      >
                        {line}
                      </motion.p>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Tags (subtle) */}
              <div className="mt-7 flex flex-wrap gap-2">
                {content.tags.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide bg-slate-900/5 text-slate-700 border border-slate-900/10"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-900/45 text-center">
            Tap Reshuffle to rewrite this letter in a new vibe.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InteractionPage;


