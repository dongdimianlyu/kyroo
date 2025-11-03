import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfidenceScoreProps {
  score: number;
  weeklyChange: number;
  isLoading?: boolean;
}

const ConfidenceScore: React.FC<ConfidenceScoreProps> = ({ 
  score, 
  weeklyChange, 
  isLoading = false 
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
      if (score >= 80) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [score]);

  const circumference = 2 * Math.PI * 90; // radius = 90
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-[#00d4ff] to-[#3fa3ff]';
    if (score >= 60) return 'from-[#7b61ff] to-[#5b3bff]';
    if (score >= 40) return 'from-[#7b61ff] to-[#9b6bff]';
    return 'from-[#ff6b6b] to-[#f43f5e]';
  };

  const getScoreText = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Growing';
    return 'Starting';
  };

  return (
    <div className="relative">
      {/* Main Confidence Card */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold text-neutral-800 mb-2">
            Confidence Score
          </h3>
          <p className="text-sm text-neutral-600">
            Your overall social confidence level
          </p>
        </div>

        {/* Circular Progress Ring */}
        <div className="relative flex items-center justify-center mb-6">
          <div className="relative w-48 h-48">
            {/* Background Ring */}
            <svg
              className="w-full h-full transform -rotate-90"
              viewBox="0 0 200 200"
            >
              <circle
                cx="100"
                cy="100"
                r="90"
                stroke="rgb(229 231 235)" // neutral-200
                strokeWidth="8"
                fill="none"
                className="opacity-30"
              />
              
              {/* Progress Ring with Gradient */}
              <motion.circle
                cx="100"
                cy="100"
                r="90"
                stroke="url(#confidenceGradient)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={strokeDasharray}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 2, ease: "easeInOut" }}
                className="drop-shadow-lg"
              />
              
              {/* Gradient Definition */}
              <defs>
                <linearGradient id="confidenceGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#7b61ff" />
                  <stop offset="100%" stopColor="#5b3bff" />
                </linearGradient>
              </defs>
            </svg>

            {/* Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1, duration: 0.5, type: "spring" }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-neutral-800 mb-1">
                  {isLoading ? '--' : animatedScore}
                </div>
                <div className="text-sm font-medium text-neutral-600 mb-2">
                  {getScoreText(animatedScore)}
                </div>
                
                {/* Weekly Change Indicator */}
                <div className="flex items-center justify-center space-x-1">
                  <svg 
                    className={`w-3 h-3 ${weeklyChange >= 0 ? 'text-green-500' : 'text-red-500'}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d={weeklyChange >= 0 ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"} 
                    />
                  </svg>
                  <span className={`text-xs font-medium ${weeklyChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {weeklyChange >= 0 ? '+' : ''}{weeklyChange.toFixed(1)}%
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Score Breakdown */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-white/40 rounded-xl backdrop-blur-sm border border-white/30">
            <div className="text-2xl font-bold text-purple-600">
              {Math.floor(animatedScore * 0.85)}
            </div>
            <div className="text-xs text-neutral-600 font-medium">Voice</div>
          </div>
          <div className="p-3 bg-white/40 rounded-xl backdrop-blur-sm border border-white/30">
            <div className="text-2xl font-bold text-blue-600">
              {Math.floor(animatedScore * 0.92)}
            </div>
            <div className="text-xs text-neutral-600 font-medium">Clarity</div>
          </div>
          <div className="p-3 bg-white/40 rounded-xl backdrop-blur-sm border border-white/30">
            <div className="text-2xl font-bold text-green-600">
              {Math.floor(animatedScore * 0.78)}
            </div>
            <div className="text-xs text-neutral-600 font-medium">Flow</div>
          </div>
        </div>
      </div>

      {/* Celebration Animation */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            className="absolute -top-4 -right-4 bg-gradient-to-r from-[#00d4ff] to-[#5b3bff] text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg"
          >
            Excellent
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConfidenceScore; 