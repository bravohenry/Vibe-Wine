import React, { useState, useEffect } from 'react';
import { getMoodTheme } from './constants';
import MoodShape from './components/MoodShape';
import MoodSlider from './components/MoodSlider';
import DreamSelection from './components/DreamSelection';
import { motion, AnimatePresence } from 'framer-motion';
import InteractionPage from './components/InteractionPage';
import { WineDream } from './constants';

const App: React.FC = () => {
  // 65 maps to 'Pleasant'
  const [moodValue, setMoodValue] = useState(65);
  const [step, setStep] = useState<'mood' | 'dreams' | 'interaction'>('mood');
  const [selectedWine, setSelectedWine] = useState<WineDream | null>(null);
  
  const theme = getMoodTheme(moodValue);

  // Update body background color smoothly
  useEffect(() => {
    document.body.style.backgroundColor = theme.backgroundColor;
    document.body.style.transition = 'background-color 0.8s ease';
  }, [theme.backgroundColor]);

  return (
    <div className="min-h-screen w-full flex flex-col relative transition-colors duration-700">
      
      {/* Background Ambient Glows (Persistent) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <motion.div 
            className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full blur-[100px] opacity-60"
            animate={{ backgroundColor: theme.color }}
            transition={{ duration: 1 }}
          />
          <motion.div 
            className="absolute bottom-[-10%] right-[-10%] w-[70vw] h-[70vw] rounded-full blur-[120px] opacity-50"
            animate={{ backgroundColor: theme.accentColor }}
            transition={{ duration: 1 }}
          />
      </div>

      <AnimatePresence mode="wait">
        {step === 'mood' ? (
            <motion.div 
                key="mood-screen"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
                transition={{ duration: 0.5 }}
                className="flex-1 flex flex-col items-center justify-between py-12 px-4 h-full"
            >
                 {/* Header */}
                <header className="relative z-10 text-center space-y-2 mt-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">
                    Choose how you're feeling <br /> right now
                    </h1>
                </header>

                {/* Centerpiece: The Mood Shape */}
                <main className="relative z-10 flex-1 flex flex-col items-center justify-center w-full">
                    <div className="scale-75 sm:scale-100 md:scale-125 transition-transform duration-500">
                        <MoodShape theme={theme} />
                    </div>

                    {/* Dynamic Label */}
                    <div className="mt-8 h-12 flex items-center justify-center">
                        <AnimatePresence mode="wait">
                            <motion.h2
                                key={theme.label}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="text-4xl font-bold text-slate-800"
                                style={{ color: '#4b4b4b' }}
                            >
                                {theme.label}
                            </motion.h2>
                        </AnimatePresence>
                    </div>
                </main>

                {/* Controls */}
                <footer className="relative z-10 w-full max-w-2xl mx-auto space-y-12 mb-8">
                    <MoodSlider 
                        value={moodValue} 
                        onChange={setMoodValue} 
                        theme={theme}
                    />
                    <div className="flex justify-center w-full">
                        <motion.button
                            onClick={() => setStep('dreams')}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full max-w-sm py-4 rounded-full text-white font-semibold text-lg shadow-xl transition-colors duration-300"
                            style={{ 
                                backgroundColor: theme.color,
                                boxShadow: `0 10px 25px -5px ${theme.color}80` 
                            }}
                        >
                            Next
                        </motion.button>
                    </div>
                </footer>
            </motion.div>
        ) : step === 'dreams' ? (
            <motion.div
                key="dreams-screen"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
                className="flex-1 w-full py-8"
            >
                <DreamSelection
                  theme={theme}
                  onBack={() => setStep('mood')}
                  onDrink={(wine) => {
                    setSelectedWine(wine);
                    setStep('interaction');
                  }}
                />
            </motion.div>
        ) : (
            <motion.div
                key="interaction-screen"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
                transition={{ duration: 0.5 }}
                className="flex-1 w-full py-6"
            >
                {selectedWine ? (
                  <InteractionPage
                    theme={theme}
                    moodValue={moodValue}
                    wine={selectedWine}
                    onBack={() => setStep('dreams')}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <button
                      onClick={() => setStep('dreams')}
                      className="text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors bg-white/40 backdrop-blur-md px-5 py-3 rounded-full shadow-sm hover:bg-white/60"
                    >
                      Back
                    </button>
                  </div>
                )}
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;