export type MoodTheme = {
  color: string;
  accentColor: string;
  backgroundColor: string;
  label: string;
  shapeParams: {
    points: number;
    spikiness: number; // 0 (round) to 1 (sharp)
    smoothness: number; // Bezier handle strength
    distortion: number; // Random offset for jaggedness
  };
};

export interface SliderProps {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  theme: MoodTheme;
}
