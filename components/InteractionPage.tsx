import React, { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MoodTheme } from '../types';
import { WineDream } from '../constants';

type InteractionPageProps = {
  theme: MoodTheme;
  moodValue: number;
  wine: WineDream;
  onBack: () => void;
};

type MoodKey = 'very_unpleasant' | 'unpleasant' | 'neutral' | 'pleasant' | 'very_pleasant';

function moodKeyFromValue(value: number): MoodKey {
  // Map continuous slider value to the same "nearest bracket" logic as getMoodTheme().
  // English comment required by user rule.
  const v = Math.max(0, Math.min(100, value));
  if (v < 12.5) return 'very_unpleasant';
  if (v < 37.5) return 'unpleasant';
  if (v < 62.5) return 'neutral';
  if (v < 87.5) return 'pleasant';
  return 'very_pleasant';
}

type Poem = {
  title: string;
  lines: string[]; // Display 4 lines on the page
  tags: string[];
};

const POEMS: Record<number, Record<MoodKey, Poem>> = {
  1: {
    very_unpleasant: {
      title: 'Even Sparks Go Dark',
      lines: [
        'Bubbles climb like tiny arguments, then fall back down.',
        'I hold my heart tight and let the cold do the talking.',
        'Green-apple sharpness cuts my gloom into shorter sentences.',
        'When the fizz fades, I stop asking for more.',
      ],
      tags: ['bubbles', 'cold', 'release'],
    },
    unpleasant: {
      title: 'A Way Back to Soft Light',
      lines: [
        'I chill the unhappy part of me so it won’t spill.',
        'Citrus and white flowers brush past—an unfinished apology.',
        'Brioche warmth fills in what I can’t say.',
        'One sip is enough to bring me back to myself.',
      ],
      tags: ['citrus', 'flowers', 'return'],
    },
    neutral: {
      title: 'The Middle of the Fizz',
      lines: [
        'Bubbles rise and break like a steady breath.',
        'I’m not rushing joy, not rushing sorrow.',
        'Almond and bread soften the edges of the room.',
        'This glass stands right at my center.',
      ],
      tags: ['rhythm', 'center', 'soft'],
    },
    pleasant: {
      title: 'The Second It Brightens',
      lines: [
        'The first sip clicks on—crisp acidity, a shaped smile.',
        'White flowers bloom in my throat, whispering: it’s okay.',
        'I forgive today halfway and hand the rest to bubbles.',
        'Offstage, where no one sees, I’m glowing.',
      ],
      tags: ['crisp', 'forgive', 'glow'],
    },
    very_pleasant: {
      title: 'Champagne-Level Joy',
      lines: [
        'I shake my happiness into fizz—silent fireworks.',
        'Citrus brightness turns night into morning.',
        'Every clink nudges me toward my bolder self.',
        'Don’t stop—let the world catch my heartbeat.',
      ],
      tags: ['fireworks', 'heartbeat', 'bold'],
    },
  },
  2: {
    very_unpleasant: {
      title: 'Clarity Can Sting',
      lines: [
        'Acidity is a mirror—too honest, too close.',
        'Green-apple chill pins my feelings to the table.',
        'I’m not hiding; I’m just not speaking yet.',
        'Let clarity walk first and clear the path.',
      ],
      tags: ['mirror', 'acid', 'path'],
    },
    unpleasant: {
      title: 'Rinse the Heart Clean',
      lines: [
        'A lime-bright sip polishes old thoughts.',
        'White peach follows, reminding me not to be cruel.',
        'I hand my irritation to my tongue and let it melt.',
        'This wine is direct, not merciless.',
      ],
      tags: ['lime', 'peach', 'melt'],
    },
    neutral: {
      title: 'Breathe in Neutral',
      lines: [
        'Clean lines pull me out of the noise.',
        'I sit between sour and sweet like a window seat.',
        'No explanation—flavor has already filed the day.',
        'Tonight I’m clean in a quiet way.',
      ],
      tags: ['clean', 'window', 'quiet'],
    },
    pleasant: {
      title: 'A Clear Good Mood',
      lines: [
        'Lime and sunlight share a frame; the world gains edges.',
        'My smile comes easy, like water over stone.',
        'This clarity makes tomorrow feel possible.',
        'Lift the glass—let me see farther.',
      ],
      tags: ['clear', 'far', 'possible'],
    },
    very_pleasant: {
      title: 'Pour a Sunny Day',
      lines: [
        'Acidity jumps—my joy jumps with it.',
        'Fruit and breeze blow away my hesitation.',
        'No restraint: I am today’s answer.',
        'Let this clarity become my loudest blessing.',
      ],
      tags: ['sunny', 'jump', 'blessing'],
    },
  },
  3: {
    very_unpleasant: {
      title: 'Perfume in the Dark',
      lines: [
        'Even roses have thorns; tonight they find me first.',
        'Lychee sweetness is memory—wrong-timed, too real.',
        'I hide my feelings inside the aroma and call it wind.',
        'Don’t come close—I’m still learning gentle.',
      ],
      tags: ['rose', 'lychee', 'guard'],
    },
    unpleasant: {
      title: 'Knead the Mess into Flowers',
      lines: [
        'Aroma is full—like a heart I haven’t tidied.',
        'Tropical notes circle once before they settle.',
        'I don’t need to be understood, only allowed.',
        'This glass makes my feelings look kinder.',
      ],
      tags: ['aroma', 'allowed', 'kind'],
    },
    neutral: {
      title: 'The Balance of Bloom',
      lines: [
        'Rose, spice, and sweetness share the stage without fighting.',
        'I practice the same: no proving, no arguing.',
        'Let the perfume say: exactly enough.',
        'In the middle, I finally exhale.',
      ],
      tags: ['balance', 'spice', 'enough'],
    },
    pleasant: {
      title: 'A Bright Greenhouse',
      lines: [
        'Roses bloom bold—like I finally speak up.',
        'Lychee sweetness lifts a smile to my mouth.',
        'A spicy finish is my tiny attitude toward life.',
        'I like me like this: fragrant, bright, light.',
      ],
      tags: ['greenhouse', 'bold', 'light'],
    },
    very_pleasant: {
      title: 'A Festival of Scent',
      lines: [
        'I roll out joy like petals—you glow just walking through.',
        'Every sip feels like a hug, sweet in the right way.',
        'Spice nods from the back: yes, like that.',
        'Tonight I don’t shrink—I bloom.',
      ],
      tags: ['festival', 'bloom', 'hug'],
    },
  },
  4: {
    very_unpleasant: {
      title: 'Even Breezes Turn Cold',
      lines: [
        'Grass and citrus cut sharp—don’t pretend you’re fine.',
        'I press the ache to the bottom like it’s only bitterness.',
        'The finish is so clean it makes me want to cry.',
        'When the wind arrives, I choose myself first.',
      ],
      tags: ['grass', 'clean', 'selfcare'],
    },
    unpleasant: {
      title: 'Leave the Acid for Night',
      lines: [
        'Lemon is a blunt truth—sharp in the right place.',
        'A pithy bite reminds me: don’t blame it all on you.',
        'I drink slowly and put my heart back where it belongs.',
        'By tomorrow, I’ll be lighter.',
      ],
      tags: ['truth', 'sharp', 'lighter'],
    },
    neutral: {
      title: 'Breeze, Measured',
      lines: [
        'Crisp lines move through like wind, tidying the room.',
        'Not sad, not glad—just awake.',
        'Herbal shadows keep watch, holding distance.',
        'A halftime sip—just enough to reboot.',
      ],
      tags: ['breeze', 'awake', 'reboot'],
    },
    pleasant: {
      title: 'Wind Reaches the Heart',
      lines: [
        'Citrus lights me up; grass lets me loosen.',
        'Suddenly I believe things can improve.',
        'The finish is crisp—laughter on glass.',
        'Take this sip as a start: lighter, forward.',
      ],
      tags: ['bright', 'crisp', 'start'],
    },
    very_pleasant: {
      title: 'A Beautiful Gust',
      lines: [
        'I hand my joy to freshness, brightness, wind.',
        'Acidity is music—I want to dance to it.',
        'Grass and fruit hug on my tongue; the world hugs back.',
        'No retreat tonight—only toward brighter.',
      ],
      tags: ['dance', 'brighter', 'hug'],
    },
  },
  5: {
    very_unpleasant: {
      title: 'The Horizon Feels Far',
      lines: [
        'Lemon and pear are so light they amplify the emptiness.',
        'I’m surrounded by airy things and still feel heavy.',
        'Clean acidity feels like refusal; it quiets me down.',
        'Before the wind arrives, I learn to wait.',
      ],
      tags: ['wait', 'light', 'heavy'],
    },
    unpleasant: {
      title: 'A Lighter Kind of Sad',
      lines: [
        'Pear and melon comfort without making noise.',
        'I set my worries aside and drink something clean.',
        'This glass doesn’t demand happiness; it escorts me through.',
        'Slowly—I’ll return to steady.',
      ],
      tags: ['comfort', 'through', 'steady'],
    },
    neutral: {
      title: 'Level the Heart',
      lines: [
        'Light body, clean acid, tidy finish—like a cleared desk.',
        'I don’t need a peak; I need order.',
        'Fruit notes whisper: mm, I know.',
        'This is my neutral: effortless.',
      ],
      tags: ['order', 'easy', 'tidy'],
    },
    pleasant: {
      title: 'Light on the Horizon',
      lines: [
        'Lemon gives direction; pear gives courage.',
        'I start trusting myself—and time.',
        'Lightness isn’t escape; it’s letting go.',
        'The horizon is there—I’m getting closer.',
      ],
      tags: ['direction', 'closer', 'letgo'],
    },
    very_pleasant: {
      title: 'Float Upward',
      lines: [
        'I tune my joy to a light body so it lasts.',
        'Fruit is a kite string pulling me up.',
        'Every sip is clean like a new day.',
        'I like this happiness: quiet, certain.',
      ],
      tags: ['certain', 'newday', 'float'],
    },
  },
  6: {
    very_unpleasant: {
      title: 'Even Princesses Get Tired',
      lines: [
        'Cherry red looks like an old bruise, gently uncovered.',
        'Tannin isn’t harsh, but it reminds me to guard.',
        'I hide my sadness behind fruit like under a hem.',
        'No bravado tonight—I just want steady.',
      ],
      tags: ['cherry', 'guard', 'steady'],
    },
    unpleasant: {
      title: 'Sand the Edges Down',
      lines: [
        'Raspberry sweet-sour is an apology—late, sincere.',
        'Light spice gathers my feelings so they don’t scatter.',
        'I drink slower; my heart slows too.',
        'No need for perfect—start with gentle.',
      ],
      tags: ['sincere', 'spice', 'gentle'],
    },
    neutral: {
      title: 'Soft Boundaries',
      lines: [
        'Red fruit and light spice look after each other like friends.',
        'I look after me too: no cruelty, no indulgence.',
        'Tannin keeps a gentle watch—hold one boundary.',
        'This glass smooths my heart flat.',
      ],
      tags: ['boundaries', 'calm', 'care'],
    },
    pleasant: {
      title: 'A Red-Fruit Hug',
      lines: [
        'Cherry and raspberry land like a small laugh.',
        'I loosen up and treat today as practice.',
        'A spicy finish applauds: you did well.',
        'Tonight, I crown myself.',
      ],
      tags: ['applause', 'loosen', 'crown'],
    },
    very_pleasant: {
      title: 'The Crown Glows',
      lines: [
        'Red fruit runs; my joy runs too.',
        'I pour confidence and drink it into certainty.',
        'Soft tannin vows: I will love me well.',
        'Let this brightness be my coronation.',
      ],
      tags: ['coronation', 'confidence', 'bright'],
    },
  },
  7: {
    very_unpleasant: {
      title: 'The Shadow of Passion',
      lines: [
        'Red fruit chased by black pepper—like my mood chasing me.',
        'I hold my anger in my mouth so it won’t hurt anyone.',
        'Dark fruit steadies the back end: don’t explode yet.',
        'One sip—pull yourself back.',
      ],
      tags: ['pepper', 'restraint', 'return'],
    },
    unpleasant: {
      title: 'Don’t Set the Heart on Fire',
      lines: [
        'Spice is a spark—no need to become flame.',
        'Red fruit stays sweet; so do I.',
        'I shrink my frustration so it’s easier to carry away.',
        'This glass teaches: passion can be gentle.',
      ],
      tags: ['spark', 'sweet', 'gentle'],
    },
    neutral: {
      title: 'Fruit and Fire, Balanced',
      lines: [
        'Red fruit, black pepper, dark finish—each in place.',
        'I’m in place too: no proving, no winning rush.',
        'It has power, but keeps manners.',
        'In the middle, I find my measure.',
      ],
      tags: ['measure', 'power', 'balance'],
    },
    pleasant: {
      title: 'Just-Right Passion',
      lines: [
        'Fruit laughs; pepper keeps the beat.',
        'I have courage and I have control.',
        'I say what I mean without bruising anyone.',
        'Passionate tonight, not lost.',
      ],
      tags: ['beat', 'courage', 'control'],
    },
    very_pleasant: {
      title: 'Light Up the Night',
      lines: [
        'I heat my joy to a boil—but it doesn’t spill.',
        'Pepper and fruit dance like flame’s shadow.',
        'I admit it: I want it. I deserve it.',
        'Let this heat light my way.',
      ],
      tags: ['boil', 'deserve', 'light'],
    },
  },
  8: {
    very_unpleasant: {
      title: 'Warmth Can Go Quiet',
      lines: [
        'Black cherry is night pressed to my chest.',
        'Cocoa and dried herbs roll like an old film.',
        'Tannin holds steady while I barely do.',
        'Don’t rush me better—I’m on my way.',
      ],
      tags: ['night', 'steady', 'onward'],
    },
    unpleasant: {
      title: 'Turn Bitter into Body',
      lines: [
        'Plum and cocoa press sadness into something grown.',
        'Herbs remind me: don’t forget to breathe.',
        'I stop fighting the low—I hold it gently.',
        'This wine has weight, and it holds me.',
      ],
      tags: ['body', 'breathe', 'hold'],
    },
    neutral: {
      title: 'Friendly Firmness',
      lines: [
        'Fruit runs deeper; the world goes quieter.',
        'Not happy, not sad—just grounded.',
        'Tannin is a palm steady at my back.',
        'In this neutral, I find backbone.',
      ],
      tags: ['grounded', 'backbone', 'quiet'],
    },
    pleasant: {
      title: 'Warm the Heart Through',
      lines: [
        'Black cherry and cocoa hold me—warm, just right.',
        'Herbal finish is evening wind, lifting fatigue.',
        'I start treating myself better.',
        'This glass says: warmth isn’t weakness.',
      ],
      tags: ['warmth', 'better', 'strong'],
    },
    very_pleasant: {
      title: 'Heat in a Winter Night',
      lines: [
        'I cook my happiness thick—an unextinguished lamp.',
        'Dark fruit glows brighter than laughter.',
        'Tannin says, firmly: be bolder.',
        'Tonight’s warmth will reach tomorrow.',
      ],
      tags: ['lamp', 'bold', 'tomorrow'],
    },
  },
};

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

  const content = useMemo(() => {
    // Use fixed poems (40 total: 8 wines × 5 mood keys).
    // English comment required by user rule.
    const moodKey = moodKeyFromValue(moodValue);
    const poem = POEMS[wine.id]?.[moodKey];
    if (poem) return poem;
    // Fallback to a minimal safe content if mapping is missing.
    return {
      title: wine.dreamTitle,
      lines: ['今晚先别急。', '把杯子握稳。', '让味道替你呼吸。', '明天会更清晰。'],
      tags: ['vibe', 'mood', 'wine'],
    } satisfies Poem;
  }, [wine.id, wine.dreamTitle, moodValue]);

  const letterLines = useMemo(() => {
    // Keep exactly 4 lines for consistent layout.
    // English comment required by user rule.
    return content.lines.slice(0, 4);
  }, [content.lines]);

  return (
    <div className="w-full min-h-screen relative overflow-hidden">
      {/* Dream image background + blur layers */}
      <div className="fixed inset-0 z-0">
        {/* Clear Base Layer */}
        <img
          src={wine.frontImageSrc}
          alt={wine.dreamTitle}
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />
        
        {/* Gaussian Blurred Top Layer with Gradient Mask (Top and Bottom edges only) */}
        <motion.div 
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <img
            src={wine.frontImageSrc}
            alt=""
            className="w-full h-full object-cover scale-105"
            style={{ 
              filter: 'blur(12px)',
              WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 15%, transparent 85%, black 100%)',
              maskImage: 'linear-gradient(to bottom, black 0%, transparent 15%, transparent 85%, black 100%)'
            }}
          />
        </motion.div>

        {/* Subtle color overlay to unify the theme */}
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 20% 25%, ${theme.color}25, transparent 55%), radial-gradient(circle at 80% 70%, ${theme.accentColor}20, transparent 60%)`,
            backgroundColor: 'rgba(255,255,255,0.15)',
            mixBlendMode: 'soft-light',
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
        <div className="w-full max-w-3xl mt-6 relative flex-1 flex flex-col justify-center">
          <div
            className="relative overflow-hidden"
            style={{
              // Fixed height to avoid "hug content" behavior.
              // English comment required by user rule.
              height: '560px',
              background:
                'linear-gradient(135deg, rgba(255,255,255,0.92) 0%, rgba(250,248,240,0.92) 40%, rgba(255,255,255,0.88) 100%)',
              boxShadow:
                '0 40px 90px -60px rgba(15,23,42,0.55), 0 20px 45px -35px rgba(15,23,42,0.35)',
              border: '1px solid rgba(15,23,42,0.10)',
              // Slightly irregular edge silhouette to feel like paper.
              // English comment required by user rule.
              clipPath:
                'polygon(0.5% 1.2%, 8% 0.4%, 16% 1.4%, 24% 0.7%, 33% 1.6%, 42% 0.6%, 52% 1.3%, 61% 0.5%, 71% 1.4%, 81% 0.6%, 91% 1.2%, 99.2% 0.8%, 99.5% 9%, 98.8% 18%, 99.6% 28%, 98.9% 38%, 99.5% 49%, 98.8% 60%, 99.6% 71%, 98.9% 82%, 99.4% 92%, 98.8% 99.1%, 91% 99.6%, 81% 98.7%, 71% 99.5%, 61% 98.8%, 52% 99.6%, 42% 98.7%, 33% 99.5%, 24% 98.8%, 16% 99.6%, 8% 98.7%, 1.1% 99.1%, 0.5% 92%, 1.2% 82%, 0.4% 71%, 1.1% 60%, 0.6% 49%, 1.2% 38%, 0.4% 28%, 1.1% 18%, 0.6% 9%)',
              // Handwriting font for the whole letter block.
              // English comment required by user rule.
              fontFamily: "'Kalam', 'Manrope', system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
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
            {/* Edge shading to simulate paper thickness */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                // English comment required by user rule.
                background:
                  'linear-gradient(to bottom, rgba(15,23,42,0.10), transparent 22px), linear-gradient(to top, rgba(15,23,42,0.09), transparent 22px), linear-gradient(to right, rgba(15,23,42,0.06), transparent 16px), linear-gradient(to left, rgba(15,23,42,0.06), transparent 16px)',
                opacity: 0.35,
                mixBlendMode: 'multiply',
              }}
            />

            <Stamp imageSrc={wine.imageSrc} theme={theme} label={wine.type.split(' ')[0]} />

            <div className="relative p-7 md:p-10 pr-7 md:pr-10 flex-1 flex flex-col justify-center">
              {/* Header */}
              <div className="pr-[130px]">
                <h1 className="text-2xl md:text-3xl text-slate-900 tracking-tight">
                  {content.title}
                </h1>
                <p className="mt-2 text-sm text-slate-700/80">
                  {wine.name} · {wine.region}
                </p>
              </div>

              {/* Divider */}
              <div className="mt-6 h-px w-full bg-slate-900/10" />

              {/* Lyrics (lighter + less dense) */}
              <div className="mt-0 text-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${wine.id}-${Math.round(moodValue)}`}
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
                          'text-slate-600 leading-relaxed text-center',
                          i === 0 ? 'text-lg md:text-xl' : 'text-lg',
                        ].join(' ')}
                      >
                        {line}
                      </motion.p>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Red wax seal (tags) at bottom-left */}
            <div className="absolute left-8 bottom-8 z-20 rotate-[-12deg]">
              <div
                className="relative flex items-center justify-center w-24 h-24"
                style={{
                  // Organic wax shape with irregular border radius
                  // English comment required by user rule.
                  borderRadius: '52% 48% 54% 46% / 48% 55% 45% 52%',
                  // Wax material: Deep red gradient with slight transparency
                  background:
                    'radial-gradient(circle at 35% 35%, #ef4444, #b91c1c, #7f1d1d)',
                  // 3D Lighting:
                  // 1. Inset white top-left (specular highlight)
                  // 2. Inset dark bottom-right (deep shadow inside wax)
                  // 3. Drop shadow (shadow on paper)
                  boxShadow: `
                    inset 3px 3px 6px rgba(255, 255, 255, 0.35),
                    inset -3px -3px 8px rgba(0, 0, 0, 0.45),
                    2px 4px 6px rgba(0, 0, 0, 0.25)
                  `,
                }}
              >
                {/* Inner Stamped Ring (debossed look) */}
                <div
                  className="absolute inset-2 rounded-full border-[2px]"
                  style={{
                    borderColor: 'rgba(69, 10, 10, 0.25)',
                    // Debossed ring effect: light bottom-right, dark top-left
                    boxShadow:
                      'inset 1px 1px 2px rgba(0,0,0,0.3), 1px 1px 2px rgba(255,255,255,0.15)',
                  }}
                />

                {/* Content (Tags) - "Pressed" into wax */}
                <div className="relative z-10 flex flex-col items-center gap-0.5 transform scale-90">
                  {content.tags.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="text-[10px] font-bold uppercase tracking-widest leading-tight"
                      style={{
                        // Deep dark red text
                        color: 'rgba(60, 5, 5, 0.85)',
                        // Text shadow: light below to look debossed (carved in)
                        textShadow: '0px 1px 0px rgba(255,255,255,0.2)',
                        fontFamily: 'Manrope', // Clean sans-serif for "Official Seal" look
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <p className="mt-4 text-xs text-slate-900/45 text-center">
            A small letter, paired to your mood.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InteractionPage;


