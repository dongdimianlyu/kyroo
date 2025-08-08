import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

// Dashboard Components
import ConfidenceScore from '../components/dashboard/ConfidenceScore';
import StatisticsCards from '../components/dashboard/StatisticsCards';
import ScenarioMasteryComponent from '../components/dashboard/ScenarioMastery';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import ConfidenceTrendChart from '../components/dashboard/ConfidenceTrendChart';

// Data and Types
import { 
  loadPracticeData, 
  calculateUserProgress, 
  generateRecentActivity 
} from '../utils/mockData';
import { UserProgress, PracticeSession } from '../types/dashboard';

const Dashboard: React.FC = () => {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [practiceData, setPracticeData] = useState<PracticeSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMilestoneConfetti, setShowMilestoneConfetti] = useState(false);

  useEffect(() => {
    // Simulate loading and initialize data
    const initializeData = async () => {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      try {
        const sessions = loadPracticeData();
        const progress = calculateUserProgress(sessions);
        
        setPracticeData(sessions);
        setUserProgress(progress);
        
        // Check for milestone achievements and trigger confetti
        if (progress.overall_confidence >= 80 && !showMilestoneConfetti) {
          triggerConfetti();
          setShowMilestoneConfetti(true);
        }
        
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, []);

  const triggerConfetti = () => {
    // Trigger multiple confetti bursts
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      // Create confetti from two different origins
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getMilestoneMessage = (confidence: number) => {
    if (confidence >= 90) return "🌟 You're a confidence champion!";
    if (confidence >= 80) return "🎉 Amazing confidence level!";
    if (confidence >= 70) return "✨ Great progress!";
    if (confidence >= 60) return "🚀 You're building momentum!";
    if (confidence >= 40) return "💪 Keep going strong!";
    return "🎯 Every step counts!";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <span className="text-white text-2xl">🎯</span>
          </motion.div>
          <h2 className="text-xl font-bold text-neutral-800 mb-2">Loading your dashboard...</h2>
          <p className="text-neutral-600">Preparing your confidence insights</p>
        </div>
      </div>
    );
  }

  if (!userProgress) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-neutral-800 mb-2">Unable to load dashboard</h2>
          <p className="text-neutral-600">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  const recentActivities = generateRecentActivity();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/40 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-neutral-900 mb-2">
                  {getGreeting()}! 👋
                </h1>
                <p className="text-lg text-neutral-600">
                  {getMilestoneMessage(userProgress.overall_confidence)}
                </p>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {/* Navigate to practice */}}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2"
              >
                <span>Start Practice</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {/* Top Row - Confidence Score and Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <ConfidenceScore 
                score={userProgress.overall_confidence}
                weeklyChange={userProgress.weekly_change}
                isLoading={loading}
              />
            </div>
            <div className="lg:col-span-2">
              <StatisticsCards
                totalSessions={userProgress.total_sessions}
                currentStreak={userProgress.current_streak}
                scenariosMastered={userProgress.scenarios_mastered.filter(s => s.progress >= 80).length}
                averageSessionTime={userProgress.average_session_time}
                personalBest={userProgress.personal_best_score}
              />
            </div>
          </div>

          {/* Confidence Trend Chart */}
          <ConfidenceTrendChart data={userProgress.confidence_trend} />

          {/* Bottom Row - Scenario Mastery and Activity Feed */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <ScenarioMasteryComponent scenarios={userProgress.scenarios_mastered} />
            <ActivityFeed activities={recentActivities} />
          </div>

          {/* Achievement Badges */}
          {userProgress.achievements.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white/20 shadow-2xl"
            >
              <h3 className="text-xl font-bold text-neutral-800 mb-4">Recent Achievements</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {userProgress.achievements.slice(0, 6).map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2 + index * 0.1, duration: 0.3 }}
                    whileHover={{ scale: 1.1, y: -4 }}
                    className={`text-center p-4 rounded-2xl border-2 ${
                      achievement.rarity === 'legendary' ? 'bg-gradient-to-br from-yellow-100 to-orange-100 border-yellow-300' :
                      achievement.rarity === 'epic' ? 'bg-gradient-to-br from-purple-100 to-purple-200 border-purple-300' :
                      achievement.rarity === 'rare' ? 'bg-gradient-to-br from-blue-100 to-blue-200 border-blue-300' :
                      'bg-gradient-to-br from-neutral-100 to-neutral-200 border-neutral-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">{achievement.icon}</div>
                    <div className="text-xs font-bold text-neutral-800">{achievement.title}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 backdrop-blur-sm rounded-3xl p-6 border border-purple-200/30"
          >
            <div className="text-center">
              <h3 className="text-lg font-bold text-neutral-800 mb-2">Ready for your next challenge?</h3>
              <p className="text-neutral-600 mb-6">Choose a practice scenario that matches your current confidence level</p>
              
              <div className="flex flex-wrap gap-4 justify-center">
                {['Job Interview', 'Small Talk', 'Presentation', 'Networking'].map((scenario, index) => (
                  <motion.button
                    key={scenario}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-white/80 backdrop-blur-sm rounded-2xl font-medium text-neutral-800 border border-white/50 hover:bg-white/90 hover:shadow-lg transition-all duration-300"
                  >
                    {scenario}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 