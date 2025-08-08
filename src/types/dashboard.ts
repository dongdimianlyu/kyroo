export interface PracticeSession {
  id: string;
  scenario_type: string;
  confidence_score: number;
  voice_metrics: {
    clarity: number;
    pace: number;
    volume_consistency: number;
  };
  completion_rate: number;
  session_duration: number; // in minutes
  self_assessment: number;
  timestamp: Date;
  key_improvements: string[];
  struggles: string[];
}

export interface ScenarioMastery {
  category: string;
  icon: string;
  progress: number; // 0-100
  completed_sessions: number;
  total_required: number;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  color: string;
}

export interface ConfidenceTrend {
  date: Date;
  score: number;
  sessions_count: number;
}

export interface UserProgress {
  overall_confidence: number;
  current_streak: number;
  total_sessions: number;
  scenarios_mastered: ScenarioMastery[];
  confidence_trend: ConfidenceTrend[];
  weekly_change: number; // percentage change from last week
  average_session_time: number; // in minutes
  personal_best_score: number;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked_at: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  progress?: number; // for progressive achievements
  max_progress?: number;
}

export interface ActivityItem {
  id: string;
  scenario_type: string;
  smoothness_score: number;
  key_improvement: string;
  timestamp: Date;
  duration: number;
  confidence_gained: number;
} 