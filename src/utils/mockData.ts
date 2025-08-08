import { 
  PracticeSession, 
  UserProgress, 
  ScenarioMastery, 
  ConfidenceTrend, 
  Achievement, 
  ActivityItem 
} from '../types/dashboard';

// Generate realistic mock data
export function generateMockSessions(count: number = 50): PracticeSession[] {
  const scenarios = [
    'Job Interview', 'Small Talk', 'Networking Event', 'Presentation', 
    'Conflict Resolution', 'Customer Service', 'Phone Call', 'Team Meeting',
    'Dating Conversation', 'Family Discussion', 'Asking for Help', 'Giving Feedback'
  ];

  const improvements = [
    'Better eye contact', 'Clearer articulation', 'More confident tone',
    'Improved pacing', 'Stronger opening', 'Better listening skills',
    'More assertive responses', 'Reduced filler words', 'Better transitions',
    'More engaging questions', 'Improved body language', 'Stronger closing'
  ];

  const struggles = [
    'Spoke too quickly', 'Lost track of thought', 'Nervous pauses',
    'Unclear pronunciation', 'Too quiet', 'Rambling responses',
    'Avoided eye contact', 'Fidgeting', 'Weak handshake',
    'Interrupting others', 'Not asking questions', 'Abrupt ending'
  ];

  const sessions: PracticeSession[] = [];
  
  for (let i = 0; i < count; i++) {
    const baseScore = 40 + (i / count) * 40; // Progressive improvement
    const randomVariation = (Math.random() - 0.5) * 20;
    const confidence_score = Math.max(10, Math.min(95, baseScore + randomVariation));
    
    sessions.push({
      id: `session_${i + 1}`,
      scenario_type: scenarios[Math.floor(Math.random() * scenarios.length)],
      confidence_score,
      voice_metrics: {
        clarity: Math.max(30, Math.min(95, confidence_score + (Math.random() - 0.5) * 15)),
        pace: Math.max(30, Math.min(95, confidence_score + (Math.random() - 0.5) * 10)),
        volume_consistency: Math.max(30, Math.min(95, confidence_score + (Math.random() - 0.5) * 12))
      },
      completion_rate: Math.max(0.6, Math.min(1.0, 0.7 + (i / count) * 0.3 + (Math.random() - 0.5) * 0.2)),
      session_duration: Math.max(3, Math.min(25, 8 + Math.random() * 12)),
      self_assessment: Math.max(1, Math.min(10, Math.round(confidence_score / 10))),
      timestamp: new Date(Date.now() - (count - i) * 24 * 60 * 60 * 1000 + Math.random() * 12 * 60 * 60 * 1000),
      key_improvements: improvements.sort(() => 0.5 - Math.random()).slice(0, Math.max(1, Math.floor(Math.random() * 3) + 1)),
      struggles: Math.random() > 0.3 ? struggles.sort(() => 0.5 - Math.random()).slice(0, Math.max(1, Math.floor(Math.random() * 2) + 1)) : []
    });
  }

  return sessions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

export function generateScenarioMastery(): ScenarioMastery[] {
  const scenarios = [
    { category: 'Job Interviews', icon: '💼', color: 'purple' },
    { category: 'Social Events', icon: '🎉', color: 'blue' },
    { category: 'Professional Networking', icon: '🤝', color: 'green' },
    { category: 'Presentations', icon: '📊', color: 'orange' },
    { category: 'Conflict Resolution', icon: '⚖️', color: 'red' },
    { category: 'Customer Service', icon: '📞', color: 'cyan' },
    { category: 'Dating & Romance', icon: '💕', color: 'pink' },
    { category: 'Family Discussions', icon: '👨‍👩‍👧‍👦', color: 'emerald' }
  ];

  return scenarios.map((scenario, index) => {
    const progress = Math.max(15, Math.min(92, 20 + index * 12 + Math.random() * 25));
    const completed = Math.floor(progress / 20);
    
    return {
      category: scenario.category,
      icon: scenario.icon,
      progress,
      completed_sessions: completed,
      total_required: 5,
      level: progress < 25 ? 'Beginner' : progress < 50 ? 'Intermediate' : progress < 75 ? 'Advanced' : 'Expert',
      color: scenario.color
    };
  });
}

export function generateConfidenceTrend(): ConfidenceTrend[] {
  const trend: ConfidenceTrend[] = [];
  const days = 30;
  let baseScore = 45;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Add some realistic ups and downs
    const dailyChange = (Math.random() - 0.45) * 8; // Slight upward bias
    baseScore = Math.max(25, Math.min(85, baseScore + dailyChange));
    
    const sessions_count = Math.random() > 0.3 ? Math.floor(Math.random() * 4) + 1 : 0;
    
    trend.push({
      date,
      score: Math.round(baseScore),
      sessions_count
    });
  }
  
  return trend;
}

export function generateAchievements(): Achievement[] {
  const achievements = [
    { id: 'first_session', title: 'First Steps', description: 'Complete your first practice session', icon: '🎯', rarity: 'common' as const },
    { id: 'week_streak', title: 'Week Warrior', description: 'Practice for 7 days in a row', icon: '🔥', rarity: 'rare' as const },
    { id: 'confident_speaker', title: 'Confident Speaker', description: 'Achieve 80+ confidence score', icon: '🎤', rarity: 'epic' as const },
    { id: 'scenario_master', title: 'Scenario Master', description: 'Master 3 different scenario types', icon: '👑', rarity: 'legendary' as const },
    { id: 'improvement_champion', title: 'Growth Mindset', description: 'Show consistent improvement over 2 weeks', icon: '📈', rarity: 'rare' as const },
    { id: 'perfect_session', title: 'Flawless Performance', description: 'Complete a session with 95+ confidence', icon: '⭐', rarity: 'epic' as const }
  ];

  return achievements.map((achievement, index) => ({
    ...achievement,
    unlocked_at: new Date(Date.now() - (achievements.length - index) * 7 * 24 * 60 * 60 * 1000)
  }));
}

export function generateRecentActivity(): ActivityItem[] {
  const scenarios = ['Job Interview', 'Small Talk', 'Networking Event', 'Presentation', 'Team Meeting'];
  const improvements = [
    'Maintained better eye contact throughout',
    'Spoke with more confidence and clarity',
    'Asked more engaging follow-up questions',
    'Reduced nervous fidgeting significantly',
    'Delivered key points more concisely',
    'Showed genuine active listening skills',
    'Handled difficult questions with poise',
    'Ended conversation more naturally'
  ];

  const activities: ActivityItem[] = [];
  
  for (let i = 0; i < 5; i++) {
    activities.push({
      id: `activity_${i + 1}`,
      scenario_type: scenarios[Math.floor(Math.random() * scenarios.length)],
      smoothness_score: Math.floor(Math.random() * 40) + 60, // 60-100 range
      key_improvement: improvements[Math.floor(Math.random() * improvements.length)],
      timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000 - Math.random() * 12 * 60 * 60 * 1000),
      duration: Math.floor(Math.random() * 15) + 5, // 5-20 minutes
      confidence_gained: Math.floor(Math.random() * 8) + 2 // 2-10 points
    });
  }

  return activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

export function calculateUserProgress(sessions: PracticeSession[]): UserProgress {
  if (sessions.length === 0) {
    return {
      overall_confidence: 0,
      current_streak: 0,
      total_sessions: 0,
      scenarios_mastered: generateScenarioMastery(),
      confidence_trend: generateConfidenceTrend(),
      weekly_change: 0,
      average_session_time: 0,
      personal_best_score: 0,
      achievements: generateAchievements()
    };
  }

  // Calculate overall confidence (weighted average of recent sessions)
  const recentSessions = sessions.slice(0, 10);
  const overall_confidence = Math.round(
    recentSessions.reduce((sum, session, index) => {
      const weight = Math.pow(0.9, index); // More weight to recent sessions
      return sum + session.confidence_score * weight;
    }, 0) / recentSessions.reduce((sum, _, index) => sum + Math.pow(0.9, index), 0)
  );

  // Calculate current streak
  let current_streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < sessions.length; i++) {
    const sessionDate = new Date(sessions[i].timestamp);
    sessionDate.setHours(0, 0, 0, 0);
    const daysDiff = Math.floor((today.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === current_streak) {
      current_streak++;
    } else {
      break;
    }
  }

  // Calculate weekly change
  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const thisWeekSessions = sessions.filter(s => s.timestamp >= oneWeekAgo);
  const lastWeekSessions = sessions.filter(s => 
    s.timestamp < oneWeekAgo && s.timestamp >= new Date(oneWeekAgo.getTime() - 7 * 24 * 60 * 60 * 1000)
  );
  
  const thisWeekAvg = thisWeekSessions.length > 0 
    ? thisWeekSessions.reduce((sum, s) => sum + s.confidence_score, 0) / thisWeekSessions.length 
    : overall_confidence;
  const lastWeekAvg = lastWeekSessions.length > 0 
    ? lastWeekSessions.reduce((sum, s) => sum + s.confidence_score, 0) / lastWeekSessions.length 
    : overall_confidence;
  
  const weekly_change = lastWeekAvg > 0 ? ((thisWeekAvg - lastWeekAvg) / lastWeekAvg) * 100 : 0;

  return {
    overall_confidence,
    current_streak,
    total_sessions: sessions.length,
    scenarios_mastered: generateScenarioMastery(),
    confidence_trend: generateConfidenceTrend(),
    weekly_change: Math.round(weekly_change * 10) / 10,
    average_session_time: Math.round(sessions.reduce((sum, s) => sum + s.session_duration, 0) / sessions.length * 10) / 10,
    personal_best_score: Math.max(...sessions.map(s => s.confidence_score)),
    achievements: generateAchievements()
  };
}

// LocalStorage helpers
export function savePracticeData(sessions: PracticeSession[]): void {
  try {
    localStorage.setItem('kairoo_practice_sessions', JSON.stringify(sessions, (key, value) => {
      if (key === 'timestamp') return value instanceof Date ? value.toISOString() : value;
      return value;
    }));
  } catch (error) {
    console.error('Failed to save practice data:', error);
  }
}

export function loadPracticeData(): PracticeSession[] {
  try {
    const stored = localStorage.getItem('kairoo_practice_sessions');
    if (!stored) return generateMockSessions(25); // Start with some mock data
    
    const parsed = JSON.parse(stored);
    return parsed.map((session: any) => ({
      ...session,
      timestamp: new Date(session.timestamp)
    }));
  } catch (error) {
    console.error('Failed to load practice data:', error);
    return generateMockSessions(25);
  }
}

export function addPracticeSession(session: Omit<PracticeSession, 'id'>): void {
  const sessions = loadPracticeData();
  const newSession: PracticeSession = {
    ...session,
    id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  };
  
  sessions.unshift(newSession); // Add to beginning
  savePracticeData(sessions.slice(0, 100)); // Keep only latest 100 sessions
} 