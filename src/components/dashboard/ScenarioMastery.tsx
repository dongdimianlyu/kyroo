import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ScenarioMastery } from '../../types/dashboard';

interface ScenarioMasteryProps {
  scenarios: ScenarioMastery[];
}

interface ProgressBarProps {
  scenario: ScenarioMastery;
  index: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ scenario, index }) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedProgress(scenario.progress);
    }, index * 100 + 500);

    return () => clearTimeout(timer);
  }, [scenario.progress, index]);

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string; gradient: string; ring: string }> = {
      purple: { bg: 'bg-purple-500', gradient: 'from-purple-400 to-purple-600', ring: 'ring-purple-200' },
      blue: { bg: 'bg-blue-500', gradient: 'from-blue-400 to-blue-600', ring: 'ring-blue-200' },
      green: { bg: 'bg-green-500', gradient: 'from-green-400 to-green-600', ring: 'ring-green-200' },
      orange: { bg: 'bg-orange-500', gradient: 'from-orange-400 to-orange-600', ring: 'ring-orange-200' },
      red: { bg: 'bg-red-500', gradient: 'from-red-400 to-red-600', ring: 'ring-red-200' },
      cyan: { bg: 'bg-cyan-500', gradient: 'from-cyan-400 to-cyan-600', ring: 'ring-cyan-200' },
      pink: { bg: 'bg-pink-500', gradient: 'from-pink-400 to-pink-600', ring: 'ring-pink-200' },
      emerald: { bg: 'bg-emerald-500', gradient: 'from-emerald-400 to-emerald-600', ring: 'ring-emerald-200' },
    };
    return colorMap[color] || colorMap.purple;
  };

  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case 'Expert': return 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white';
      case 'Advanced': return 'bg-gradient-to-r from-purple-500 to-purple-600 text-white';
      case 'Intermediate': return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white';
      default: return 'bg-gradient-to-r from-neutral-400 to-neutral-500 text-white';
    }
  };

  const colors = getColorClasses(scenario.color);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group"
    >
      <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/30 hover:bg-white/60 transition-all duration-300 hover:shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-white shadow-lg`}>
              <span className="text-lg">{scenario.icon}</span>
            </div>
            <div>
              <h4 className="font-semibold text-neutral-800 text-sm">{scenario.category}</h4>
              <p className="text-xs text-neutral-600">
                {scenario.completed_sessions}/{scenario.total_required} sessions
              </p>
            </div>
          </div>
          
          <div className={`px-3 py-1 rounded-full text-xs font-bold ${getLevelBadgeColor(scenario.level)} shadow-md`}>
            {scenario.level}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-neutral-600 font-medium">Progress</span>
            <span className="text-neutral-800 font-bold">{Math.round(animatedProgress)}%</span>
          </div>
          
          <div className="relative h-3 bg-neutral-200 rounded-full overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r ${colors.gradient} rounded-full relative overflow-hidden`}
              initial={{ width: 0 }}
              animate={{ width: `${animatedProgress}%` }}
              transition={{ delay: index * 0.1 + 0.5, duration: 1.5, ease: "easeOut" }}
            >
              {/* Shimmer Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ 
                  delay: index * 0.1 + 2, 
                  duration: 1.5, 
                  repeat: Infinity, 
                  repeatDelay: 3 
                }}
              />
            </motion.div>
          </div>
        </div>

        {/* Milestone Indicators */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-neutral-200/50">
          <div className="flex space-x-1">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i < scenario.completed_sessions 
                    ? `${colors.bg} ring-2 ${colors.ring}` 
                    : 'bg-neutral-300'
                }`}
              />
            ))}
          </div>
          
          {scenario.progress >= 80 && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: index * 0.1 + 2.5, type: "spring" }}
              className="text-yellow-500"
            >
              ⭐
            </motion.div>
          )}
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
      </div>
    </motion.div>
  );
};

const ScenarioMasteryComponent: React.FC<ScenarioMasteryProps> = ({ scenarios }) => {
  const completedScenarios = scenarios.filter(s => s.progress >= 80).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-neutral-800 mb-2">Scenario Mastery</h3>
          <p className="text-sm text-neutral-600">
            Your progress across different conversation types
          </p>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-purple-600">{completedScenarios}</div>
          <div className="text-xs text-neutral-600 font-medium">Mastered</div>
        </div>
      </div>

      {/* Progress Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {scenarios.map((scenario, index) => (
          <ProgressBar key={scenario.category} scenario={scenario} index={index} />
        ))}
      </div>

      {/* Overall Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm rounded-2xl p-6 border border-purple-200/30"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-lg">📈</span>
            </div>
            <div>
              <h4 className="font-semibold text-neutral-800">Overall Progress</h4>
              <p className="text-sm text-neutral-600">
                {Math.round(scenarios.reduce((sum, s) => sum + s.progress, 0) / scenarios.length)}% average across all scenarios
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-lg font-bold text-purple-600">
              {completedScenarios}/{scenarios.length}
            </div>
            <div className="text-xs text-neutral-600">Complete</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ScenarioMasteryComponent; 