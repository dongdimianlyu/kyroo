import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useRouter } from 'next/router';
import ProtectedRoute from '../components/ProtectedRoute';
import { Award, Briefcase, Coffee, Crown, Gift, Mic2, Phone, ShoppingBag, Star, Train } from 'lucide-react';

// Minimal inline icons (non-AI) for neutral aesthetics
const BookIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M4 4v15.5A2.5 2.5 0 0 1 6.5 22H20V5a1 1 0 0 0-1-1H6a2 2 0 0 0-2 2z" />
  </svg>
);

const HeartIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l8.8 8.8 8.8-8.8a5.5 5.5 0 0 0 0-7.8z" />
  </svg>
);

const HandshakeIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5l-2 2-3-3-2 2 5 5 4-4" />
    <path d="M22 8l-6 6-4-4" />
    <path d="M2 12l6 6 4-4" />
  </svg>
);

const RoseIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C9 2 7 4 7 7s2 6 5 6 5-3 5-6-2-5-5-5z" />
    <path d="M12 13v9" />
    <path d="M8 17c1.5 0 2.5 1 4 1s2.5-1 4-1" />
  </svg>
);

// Dashboard Components
import ConfidenceScore from '../components/dashboard/ConfidenceScore';
import StatisticsCards from '../components/dashboard/StatisticsCards';
import ScenarioMasteryComponent from '../components/dashboard/ScenarioMastery';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import ConfidenceTrendChart from '../components/dashboard/ConfidenceTrendChart';

// Data and Types
import { UserProgress, ConfidenceTrend, ActivityItem } from '../types/dashboard';

const DashboardContent: React.FC = () => {
  const router = useRouter();
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showMilestoneConfetti, setShowMilestoneConfetti] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        // Ensure anonId exists
        let anonId = '';
        if (typeof window !== 'undefined') {
          anonId = localStorage.getItem('anonId') || crypto.randomUUID();
          localStorage.setItem('anonId', anonId);
        }

        const res = await fetch(`/api/dashboard?anonId=${encodeURIComponent(anonId)}`);
        if (!res.ok) throw new Error('Failed to load dashboard');
        const data = await res.json();

        // Parse dates for types
        const parsedTrend: ConfidenceTrend[] = (data.progress.confidence_trend || []).map((t: any) => ({
          ...t,
          date: new Date(t.date),
        }));

        const parsedAchievements = (data.progress.achievements || []).map((a: any) => ({
          ...a,
          unlocked_at: new Date(a.unlocked_at),
        }));

        const parsedActivities: ActivityItem[] = (data.recentActivities || []).map((a: any) => ({
          ...a,
          timestamp: new Date(a.timestamp),
        }));

        const progress: UserProgress = {
          ...data.progress,
          confidence_trend: parsedTrend,
          achievements: parsedAchievements,
        };

        setUserProgress(progress);
        setRecentActivities(parsedActivities);

        if (progress.overall_confidence >= 80 && !showMilestoneConfetti) {
          triggerConfetti();
          setShowMilestoneConfetti(true);
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        setUserProgress({
          overall_confidence: 0,
          current_streak: 0,
          total_sessions: 0,
          scenarios_mastered: [],
          confidence_trend: [],
          weekly_change: 0,
          average_session_time: 0,
          personal_best_score: 0,
          achievements: [],
        });
        setRecentActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const triggerConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 } as const;

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function () {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
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
    if (confidence >= 90) return 'Elite performance — keep it up.';
    if (confidence >= 80) return 'Excellent momentum — great work.';
    if (confidence >= 70) return 'Strong progress — stay consistent.';
    if (confidence >= 60) return 'Good trajectory — you’re improving.';
    if (confidence >= 40) return 'Steady gains — keep practicing.';
    return 'Every step forward counts.';
  };

  if (loading || !userProgress) {
    return (
      <div className="bg-white flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <motion.div
            className="w-10 h-10 bg-neutral-900 rounded-xl flex items-center justify-center mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v4" />
              <path d="M12 18v4" />
              <path d="M4.93 4.93l2.83 2.83" />
              <path d="M16.24 16.24l2.83 2.83" />
              <path d="M2 12h4" />
              <path d="M18 12h4" />
              <path d="M4.93 19.07l2.83-2.83" />
              <path d="M16.24 7.76l2.83-2.83" />
            </svg>
          </motion.div>
          <h2 className="text-lg font-semibold text-neutral-900 mb-1">Loading dashboard...</h2>
          <p className="text-[13px] text-neutral-500">Preparing your insights</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="bg-white">
      {/* Header */}
      <div className="border-b border-neutral-200/40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-neutral-900 mb-1">{getGreeting()}</h1>
                <p className="text-[15px] text-neutral-500">{getMilestoneMessage(userProgress.overall_confidence)}</p>
              </div>

              <button
                onClick={() => router.push('/app?view=practice')}
                className="px-5 py-2.5 bg-neutral-900 text-white text-[13px] font-medium rounded-xl hover:bg-neutral-800 active:scale-[0.98] transition-all duration-200 flex items-center gap-2"
              >
                <span>Start practice</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
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
              <ConfidenceScore score={userProgress.overall_confidence} weeklyChange={userProgress.weekly_change} isLoading={loading} />
            </div>
            <div className="lg:col-span-2">
              <StatisticsCards
                totalSessions={userProgress.total_sessions}
                currentStreak={userProgress.current_streak}
                scenariosMastered={userProgress.scenarios_mastered.filter((s) => s.progress >= 80).length}
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
            <ActivityFeed activities={recentActivities} onStartPractice={() => router.push('/app?view=practice')} />
          </div>

          {/* Achievement Badges */}
          {userProgress.achievements.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="bg-white rounded-2xl p-6 border border-neutral-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.04)]"
            >
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Recent achievements</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {userProgress.achievements.slice(0, 6).map((achievement, index) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.2 + index * 0.1, duration: 0.3 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className={`text-center p-3 rounded-xl border ${
                      achievement.rarity === 'legendary'
                        ? 'bg-amber-50 border-amber-200/60'
                        : achievement.rarity === 'epic'
                        ? 'bg-purple-50 border-purple-200/60'
                        : achievement.rarity === 'rare'
                        ? 'bg-blue-50 border-blue-200/60'
                        : 'bg-neutral-50 border-neutral-200/60'
                    }`}
                  >
                    <div className="mb-1.5 flex items-center justify-center">
                      {achievement.rarity === 'legendary' ? (
                        <Crown className="w-4 h-4 text-amber-600" />
                      ) : achievement.rarity === 'epic' ? (
                        <Star className="w-4 h-4 text-purple-600" />
                      ) : achievement.rarity === 'rare' ? (
                        <Award className="w-4 h-4 text-blue-600" />
                      ) : (
                        <Award className="w-4 h-4 text-neutral-500" />
                      )}
                    </div>
                    <div className="text-[11px] font-semibold text-neutral-800">{achievement.title}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Two-row marquee section */}
          <div className="rounded-2xl p-8 bg-neutral-950 relative overflow-hidden">
            <div className="absolute inset-0 grain-texture" />
            <div className="absolute inset-0 opacity-15">
              <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-purple-600 rounded-full blur-[120px]" />
              <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-indigo-500 rounded-full blur-[100px]" />
            </div>
            <div className="relative z-10">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">Practice for any situation</h3>
                <p className="text-[15px] text-neutral-400">Pick a scenario. Practice until it feels natural.</p>
              </div>
              <div className="space-y-3">
                <div className="marquee-container">
                  <div className="marquee-track">
                    <div className="marquee-duplicate">
                      {[
                        { title: 'Telling Stories', tag: 'Beginner', Icon: BookIcon },
                        { title: 'Flirting & Compliments', tag: 'Social', Icon: HeartIcon },
                        { title: 'Job Interview', tag: 'Work', Icon: Briefcase },
                        { title: 'Public Transport', tag: 'Travel', Icon: Train },
                        { title: 'Introductions', tag: 'Beginner', Icon: HandshakeIcon },
                      ].concat([
                        { title: 'Telling Stories', tag: 'Beginner', Icon: BookIcon },
                        { title: 'Flirting & Compliments', tag: 'Social', Icon: HeartIcon },
                        { title: 'Job Interview', tag: 'Work', Icon: Briefcase },
                        { title: 'Public Transport', tag: 'Travel', Icon: Train },
                        { title: 'Introductions', tag: 'Beginner', Icon: HandshakeIcon },
                      ]).map((item, i) => (
                        <div key={`db-r1-${i}-${item.title}`} className="shrink-0 px-5 py-4 bg-white/[0.06] border border-white/[0.08] rounded-2xl flex items-center gap-3">
                          <item.Icon className="w-4 h-4 text-neutral-400" />
                          <div className="leading-tight text-left">
                            <div className="text-white font-semibold text-[15px]">{item.title}</div>
                            <div className="text-neutral-500 text-xs">{item.tag}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="marquee-container">
                  <div className="marquee-track reverse">
                    <div className="marquee-duplicate">
                      {[
                        { title: 'Ordering Food', tag: 'Food', Icon: ShoppingBag },
                        { title: 'Phone Calls', tag: 'Social', Icon: Phone },
                        { title: 'Work Routine', tag: 'Work', Icon: Coffee },
                        { title: 'First Date', tag: 'Romance', Icon: RoseIcon },
                        { title: 'Presidential Debate', tag: 'Debate', Icon: Mic2 },
                        { title: 'Buying a Gift', tag: 'Shopping', Icon: Gift },
                      ].concat([
                        { title: 'Ordering Food', tag: 'Food', Icon: ShoppingBag },
                        { title: 'Phone Calls', tag: 'Social', Icon: Phone },
                        { title: 'Work Routine', tag: 'Work', Icon: Coffee },
                        { title: 'First Date', tag: 'Romance', Icon: RoseIcon },
                        { title: 'Presidential Debate', tag: 'Debate', Icon: Mic2 },
                        { title: 'Buying a Gift', tag: 'Shopping', Icon: Gift },
                      ]).map((item, i) => (
                        <div key={`db-r2-${i}-${item.title}`} className="shrink-0 px-5 py-4 bg-white/[0.06] border border-white/[0.08] rounded-2xl flex items-center gap-3">
                          <item.Icon className="w-4 h-4 text-neutral-400" />
                          <div className="leading-tight text-left">
                            <div className="text-white font-semibold text-[15px]">{item.title}</div>
                            <div className="text-neutral-500 text-xs">{item.tag}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="rounded-2xl p-6 bg-neutral-50 border border-neutral-200/40"
          >
            <div className="text-center">
              <h3 className="text-lg font-semibold text-neutral-900 mb-1">Ready for your next session?</h3>
              <p className="text-[13px] text-neutral-500 mb-5">Pick a scenario that matches your goals</p>

              <div className="flex flex-wrap gap-2 justify-center">
                {['Job Interview', 'Small Talk', 'Presentation', 'Networking'].map((scenario) => (
                  <button
                    key={scenario}
                    onClick={() => router.push('/app?view=practice')}
                    className="px-4 py-2 bg-white rounded-lg font-medium text-[13px] text-neutral-700 border border-neutral-200/60 hover:border-neutral-300 hover:bg-neutral-50 active:scale-[0.98] transition-all duration-200"
                  >
                    {scenario}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
};

const Dashboard: React.FC = () => {
  const router = useRouter();
  useEffect(() => {
    if (router.pathname === '/dashboard') {
      router.replace('/app');
    }
  }, [router.pathname]);
  if (router.pathname === '/dashboard') {
    return null;
  }
  return <DashboardContent />;
};

export default Dashboard; 