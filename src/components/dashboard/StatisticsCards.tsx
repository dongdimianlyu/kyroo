import React from 'react';
import { BarChart3, Flame, BadgeCheck, Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatisticsCardsProps {
  totalSessions: number;
  currentStreak: number;
  scenariosMastered: number;
  averageSessionTime: number;
  personalBest: number;
}

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  gradient: string;
  change?: number;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  icon, 
  gradient, 
  change, 
  delay = 0 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="group"
    >
      <div className={`bg-gradient-to-br ${gradient} p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 backdrop-blur-sm`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm text-white">
            {icon}
          </div>
          {change !== undefined && (
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
              change >= 0 ? 'bg-green-500/20 text-green-100' : 'bg-red-500/20 text-red-100'
            }`}>
              <svg 
                className={`w-3 h-3 ${change >= 0 ? 'text-green-300' : 'text-red-300'}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d={change >= 0 ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"} 
                />
              </svg>
              <span>{change >= 0 ? '+' : ''}{change}</span>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="space-y-2">
          <motion.div 
            className="text-3xl font-bold text-white"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.2, duration: 0.3 }}
          >
            {value}
          </motion.div>
          <div className="text-white/90 font-medium text-sm">
            {title}
          </div>
          <div className="text-white/70 text-xs">
            {subtitle}
          </div>
        </div>

        {/* Animated Accent Bar */}
        <motion.div
          className="mt-4 h-1 bg-white/20 rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.4 }}
        >
          <motion.div
            className="h-full bg-white/40 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ delay: delay + 0.6, duration: 1.5, ease: "easeOut" }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

const StatisticsCards: React.FC<StatisticsCardsProps> = ({
  totalSessions,
  currentStreak,
  scenariosMastered,
  averageSessionTime,
  personalBest
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Practice Sessions"
        value={totalSessions}
        subtitle="Total completed"
        icon={<BarChart3 className="w-5 h-5" />}
        gradient="from-[#7061ff] to-[#5b3bff]"
        change={12}
        delay={0}
      />
      
      <StatCard
        title="Current Streak"
        value={`${currentStreak} days`}
        subtitle="Keep it going!"
        icon={<Flame className="w-5 h-5" />}
        gradient="from-[#5965ff] to-[#7b61ff]"
        change={currentStreak > 0 ? 1 : 0}
        delay={0.1}
      />
      
      <StatCard
        title="Scenarios Mastered"
        value={scenariosMastered}
        subtitle="Different types"
        icon={<BadgeCheck className="w-5 h-5" />}
        gradient="from-[#3fa3ff] to-[#00c2ff]"
        change={2}
        delay={0.2}
      />
      
      <StatCard
        title="Personal Best"
        value={`${personalBest}%`}
        subtitle={`Avg: ${averageSessionTime}m per session`}
        icon={<Star className="w-5 h-5" />}
        gradient="from-[#7b61ff] to-[#9b6bff]"
        delay={0.3}
      />
    </div>
  );
};

export default StatisticsCards; 