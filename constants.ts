import { MoodTheme } from './types';

// We define 5 key mood states. The app will interpolate between these.
export const MOOD_STATES: Record<string, MoodTheme> = {
  very_unpleasant: {
    label: "Very Unpleasant",
    color: "#7E57C2", // Deep Purple
    accentColor: "#B39DDB",
    backgroundColor: "#F3E5F5", 
    shapeParams: {
      points: 6, // Unify negative side to 6 points
      spikiness: 0.6, 
      smoothness: 0.2, 
      distortion: 0.4,
    }
  },
  unpleasant: {
    label: "Unpleasant",
    color: "#42A5F5", // Blue
    accentColor: "#90CAF9",
    backgroundColor: "#E3F2FD",
    shapeParams: {
      points: 6, // Unify negative side to 6 points
      spikiness: 0.4,
      smoothness: 0.5,
      distortion: 0.2,
    }
  },
  neutral: {
    label: "Neutral",
    color: "#26A69A", // Teal
    accentColor: "#80CBC4",
    backgroundColor: "#E0F2F1",
    shapeParams: {
      points: 5, // Placeholder, will be overridden dynamically
      spikiness: 0, // Perfect circle
      smoothness: 1, 
      distortion: 0,
    }
  },
  pleasant: {
    label: "Pleasant",
    color: "#FFA726", // Orange/Gold
    accentColor: "#FFCC80",
    backgroundColor: "#FFF3E0", 
    shapeParams: {
      points: 5, // Unify positive side to 5 points (Flower)
      spikiness: 0.3, 
      smoothness: 0.9, 
      distortion: 0, 
    }
  },
  very_pleasant: {
    label: "Very Pleasant",
    color: "#FF7043", // Deep Orange/Coral
    accentColor: "#FFAB91",
    backgroundColor: "#FBE9E7", 
    shapeParams: {
      points: 5, // Unify positive side to 5 points
      spikiness: 0.5, // Bloom larger
      smoothness: 1.0, 
      distortion: 0,
    }
  }
};

// Helper to interpolate colors linearly
const lerpColor = (a: string, b: string, amount: number) => { 
    const ah = parseInt(a.replace(/#/g, ''), 16),
          ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff,
          bh = parseInt(b.replace(/#/g, ''), 16),
          br = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff,
          rr = ar + amount * (br - ar),
          rg = ag + amount * (bg - ag),
          rb = ab + amount * (bb - ab);

    return '#' + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1);
}

// Helper to interpolate numbers
const lerp = (start: number, end: number, t: number) => {
  return start * (1 - t) + end * t;
}

export const getMoodTheme = (value: number): MoodTheme => {
  // Value is 0 to 100
  let t = 0;
  let startState: MoodTheme;
  let endState: MoodTheme;

  if (value < 25) {
    t = value / 25;
    startState = MOOD_STATES.very_unpleasant;
    endState = MOOD_STATES.unpleasant;
  } else if (value < 50) {
    t = (value - 25) / 25;
    startState = MOOD_STATES.unpleasant;
    endState = MOOD_STATES.neutral;
  } else if (value < 75) {
    t = (value - 50) / 25;
    startState = MOOD_STATES.neutral;
    endState = MOOD_STATES.pleasant;
  } else {
    t = (value - 75) / 25;
    startState = MOOD_STATES.pleasant;
    endState = MOOD_STATES.very_pleasant;
  }

  // Determine label based on nearest bracket
  let label = startState.label;
  if (t > 0.5) label = endState.label;

  // SMART INTERPOLATION for Points
  let startPoints = startState.shapeParams.points;
  let endPoints = endState.shapeParams.points;

  if (endState.label === "Neutral") {
      endPoints = startPoints;
  }
  
  if (startState.label === "Neutral") {
      startPoints = endPoints;
  }

  return {
    label,
    color: lerpColor(startState.color, endState.color, t),
    accentColor: lerpColor(startState.accentColor, endState.accentColor, t),
    backgroundColor: lerpColor(startState.backgroundColor, endState.backgroundColor, t),
    shapeParams: {
      points: Math.round(lerp(startPoints, endPoints, t)),
      spikiness: lerp(startState.shapeParams.spikiness, endState.shapeParams.spikiness, t),
      smoothness: lerp(startState.shapeParams.smoothness, endState.shapeParams.smoothness, t),
      distortion: lerp(startState.shapeParams.distortion, endState.shapeParams.distortion, t),
    }
  };
};

export interface WineDream {
  id: number;
  dreamTitle: string; // The "Tarot" name
  name: string;
  type: string;
  region: string;
  grapes: string;
  profile: string;
  serve: string;
  frontImageSrc: string; // Dream card front image (1-8)
  imageSrc: string;
  isRed?: boolean; // For styling hints
}

export const WINE_DREAMS: WineDream[] = [
  {
    id: 1,
    dreamTitle: "The Spark",
    name: "Veuve Ambal – Méthode Traditionnelle Blanc de Blancs",
    type: "Sparkling Wine (Brut)",
    region: "France (Burgundy)",
    grapes: "Chardonnay (Blanc de Blancs)",
    profile: "Green apple, citrus, white flowers, toasted brioche/almond.",
    serve: "6–8°C (43–46°F)",
    frontImageSrc: "/dream/1.png",
    imageSrc: "/wine/1.webp"
  },
  {
    id: 2,
    dreamTitle: "The Clarity",
    name: "FRITZ – Riesling",
    type: "Still White Wine",
    region: "Unknown",
    grapes: "Riesling",
    profile: "Lime, green apple, white peach, high acidity.",
    serve: "7–10°C (45–50°F)",
    frontImageSrc: "/dream/2.png",
    imageSrc: "/wine/2.webp"
  },
  {
    id: 3,
    dreamTitle: "The Aroma",
    name: "Puiatti – Traminer",
    type: "Still White Wine (Aromatic)",
    region: "Italy (Friuli Venezia Giulia)",
    grapes: "Traminer / Gewürztraminer",
    profile: "Lychee, rose petal, tropical fruit, spice; very aromatic.",
    serve: "8–10°C (46–50°F)",
    frontImageSrc: "/dream/3.png",
    imageSrc: "/wine/3.webp"
  },
  {
    id: 4,
    dreamTitle: "The Breeze",
    name: "C’est La Vie! – Chardonnay–Sauvignon (2023)",
    type: "Still White Wine",
    region: "France (Vin de Pays)",
    grapes: "Chardonnay + Sauvignon Blanc",
    profile: "Citrus, stone fruit, grassy/gooseberry notes, crisp finish.",
    serve: "7–10°C (45–50°F)",
    frontImageSrc: "/dream/4.png",
    imageSrc: "/wine/4.webp"
  },
  {
    id: 5,
    dreamTitle: "The Horizon",
    name: "Hayes Ranch – Pinot Grigio",
    type: "Still White Wine",
    region: "USA (California)",
    grapes: "Pinot Grigio",
    profile: "Lemon, pear, melon; light body, clean acidity.",
    serve: "7–10°C (45–50°F)",
    frontImageSrc: "/dream/5.png",
    imageSrc: "/wine/5.webp"
  },
  {
    id: 6,
    dreamTitle: "The Princess",
    name: "Labouré-Roi – Coteaux Bourguignons (2023)",
    type: "Still Red Wine",
    region: "France (Burgundy)",
    grapes: "Pinot Noir / Gamay",
    profile: "Red cherry, raspberry, light spice, softer tannin.",
    serve: "14–16°C (57–61°F)",
    frontImageSrc: "/dream/6.png",
    imageSrc: "/wine/6.webp",
    isRed: true
  },
  {
    id: 7,
    dreamTitle: "The Passion",
    name: "C’est La Vie! – Pinot Noir–Syrah (2023)",
    type: "Still Red Wine",
    region: "France (Vin de Pays)",
    grapes: "Pinot Noir + Syrah",
    profile: "Red fruit mixed with pepper & darker fruit notes.",
    serve: "14–16°C (57–61°F)",
    frontImageSrc: "/dream/7.png",
    imageSrc: "/wine/7.webp",
    isRed: true
  },
  {
    id: 8,
    dreamTitle: "The Warmth",
    name: "Masciarelli – Montepulciano d’Abruzzo (2022)",
    type: "Still Red Wine",
    region: "Italy (Abruzzo)",
    grapes: "Montepulciano",
    profile: "Black cherry, plum, cocoa, dried herbs; firm but friendly.",
    serve: "16–18°C (61–64°F)",
    frontImageSrc: "/dream/8.png",
    imageSrc: "/wine/8.webp",
    isRed: true
  }
];