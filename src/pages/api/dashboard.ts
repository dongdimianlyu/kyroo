import type { NextApiRequest, NextApiResponse } from 'next';
import { listSessions, SessionRecord } from '../../server/storage';
import { Achievement, ConfidenceTrend, ScenarioMastery, UserProgress } from '../../types/dashboard';

const CATEGORY_META: Record<string, { icon: string; color: string }> = {
  'Job Interview': { icon: '💼', color: 'purple' },
  'Social Events': { icon: '🎉', color: 'blue' },
  'Professional Networking': { icon: '🤝', color: 'green' },
  'Presentations': { icon: '📊', color: 'orange' },
  'Conflict Resolution': { icon: '⚖️', color: 'red' },
  'Customer Service': { icon: '📞', color: 'cyan' },
  'Dating & Romance': { icon: '💕', color: 'pink' },
  'Family Discussions': { icon: '👨‍👩‍👧‍👦', color: 'emerald' },
  'Phone Call': { icon: '📞', color: 'cyan' },
  'Team Meeting': { icon: '👥', color: 'blue' },
  'Presentation': { icon: '📊', color: 'orange' },
  'Networking Event': { icon: '🤝', color: 'green' },
  'Small Talk': { icon: '💬', color: 'blue' },
  'General': { icon: '💭', color: 'purple' },
};

function toDateOnly(date: Date): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

function calculateCurrentStreak(records: SessionRecord[]): number {
  if (records.length === 0) return 0;
  const daysSet = new Set(records.map((r) => toDateOnly(new Date(r.timestamp))));
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString();
    if (daysSet.has(key)) streak++;
    else break;
  }
  return streak;
}

function buildAchievements(records: SessionRecord[], scenariosMastered: ScenarioMastery[], streak: number): Achievement[] {
  const achievements: Achievement[] = [];
  const totalSessions = records.length;
  const bestScore = records.reduce((m, r) => Math.max(m, r.smoothnessScore), 0);
  const masteredCount = scenariosMastered.filter((s) => s.progress >= 80).length;

  if (totalSessions >= 1) achievements.push({ id: 'first_session', title: 'First Steps', description: 'Complete your first practice session', icon: '🎯', rarity: 'common', unlocked_at: new Date() });
  if (streak >= 7) achievements.push({ id: 'week_streak', title: 'Week Warrior', description: 'Practice for 7 days in a row', icon: '🔥', rarity: 'rare', unlocked_at: new Date() });
  if (bestScore >= 80) achievements.push({ id: 'confident_speaker', title: 'Confident Speaker', description: 'Achieve 80+ confidence score', icon: '🎤', rarity: 'epic', unlocked_at: new Date() });
  if (masteredCount >= 3) achievements.push({ id: 'scenario_master', title: 'Scenario Master', description: 'Master 3 different scenario types', icon: '👑', rarity: 'legendary', unlocked_at: new Date() });

  return achievements.sort((a, b) => b.unlocked_at.getTime() - a.unlocked_at.getTime());
}

function aggregateScenarios(records: SessionRecord[]): ScenarioMastery[] {
  const byCategory = new Map<string, SessionRecord[]>();
  for (const r of records) {
    const cat = r.scenarioType;
    if (!byCategory.has(cat)) byCategory.set(cat, []);
    byCategory.get(cat)!.push(r);
  }

  const result: ScenarioMastery[] = [];
  for (const [category, recs] of byCategory.entries()) {
    const meta = CATEGORY_META[category] || CATEGORY_META['General'];
    const recent = recs.slice(0, 5);
    const avg = Math.round(recent.reduce((s, r) => s + r.smoothnessScore, 0) / Math.max(1, recent.length));
    const completed = Math.min(5, recs.length);
    const level = avg < 25 ? 'Beginner' : avg < 50 ? 'Intermediate' : avg < 75 ? 'Advanced' : 'Expert';
    result.push({
      category,
      icon: meta.icon,
      progress: avg,
      completed_sessions: completed,
      total_required: 5,
      level: level,
      color: meta.color,
    });
  }

  // Ensure a stable set of categories by adding defaults if missing
  const ensureCats = ['Job Interview', 'Small Talk', 'Networking Event', 'Presentation', 'Conflict Resolution'];
  for (const cat of ensureCats) {
    if (!result.find((r) => r.category === cat)) {
      const meta = CATEGORY_META[cat];
      result.push({
        category: cat,
        icon: meta.icon,
        progress: 0,
        completed_sessions: 0,
        total_required: 5,
        level: 'Beginner',
        color: meta.color,
      });
    }
  }

  return result.sort((a, b) => b.progress - a.progress);
}

function buildTrend(records: SessionRecord[]): ConfidenceTrend[] {
  const days = 30;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const byDay = new Map<string, SessionRecord[]>();
  for (const r of records) {
    const key = toDateOnly(new Date(r.timestamp));
    if (!byDay.has(key)) byDay.set(key, []);
    byDay.get(key)!.push(r);
  }

  const trend: ConfidenceTrend[] = [];
  for (let i = days; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString();
    const recs = byDay.get(key) || [];
    const score = recs.length
      ? Math.round(recs.reduce((s, r) => s + r.smoothnessScore, 0) / recs.length)
      : trend.length > 0
        ? trend[trend.length - 1].score // carry forward last known for smoother chart
        : 50;
    trend.push({ date: d, score, sessions_count: recs.length });
  }
  return trend;
}

function buildActivity(records: SessionRecord[], n = 5) {
  return records.slice(0, n).map((r) => ({
    id: r.id,
    scenario_type: r.scenarioType,
    smoothness_score: r.smoothnessScore,
    key_improvement: r.keyImprovement,
    timestamp: new Date(r.timestamp),
    duration: r.durationMinutes,
    confidence_gained: Math.max(0, r.smoothnessScore - 50),
  }));
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

    const { anonId } = req.query;
    if (!anonId || typeof anonId !== 'string') return res.status(400).json({ error: 'anonId is required' });

    const records = await listSessions(anonId, 200);
    // Sort newest first by timestamp
    records.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    const total_sessions = records.length;
    const overall_confidence = total_sessions
      ? Math.round(records.slice(0, 10).reduce((s, r, i) => s + r.smoothnessScore * Math.pow(0.9, i), 0) /
          records.slice(0, 10).reduce((s, _, i) => s + Math.pow(0.9, i), 0))
      : 0;

    const confidence_trend = buildTrend(records);
    const scenarios_mastered = aggregateScenarios(records);
    const current_streak = calculateCurrentStreak(records);
    const average_session_time = total_sessions
      ? Math.round((records.reduce((s, r) => s + r.durationMinutes, 0) / total_sessions) * 10) / 10
      : 0;
    const personal_best_score = records.reduce((m, r) => Math.max(m, r.smoothnessScore), 0);

    // Weekly change
    const oneWeekMs = 7 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    const thisWeek = records.filter((r) => new Date(r.timestamp).getTime() >= now - oneWeekMs);
    const lastWeek = records.filter((r) => {
      const t = new Date(r.timestamp).getTime();
      return t < now - oneWeekMs && t >= now - 2 * oneWeekMs;
    });
    const avgThis = thisWeek.length ? thisWeek.reduce((s, r) => s + r.smoothnessScore, 0) / thisWeek.length : overall_confidence;
    const avgLast = lastWeek.length ? lastWeek.reduce((s, r) => s + r.smoothnessScore, 0) / lastWeek.length : overall_confidence;
    const weekly_change = avgLast > 0 ? Math.round(((avgThis - avgLast) / avgLast) * 1000) / 10 : 0;

    const progress: UserProgress = {
      overall_confidence,
      current_streak,
      total_sessions,
      scenarios_mastered,
      confidence_trend,
      weekly_change,
      average_session_time,
      personal_best_score,
      achievements: [], // fill below
    };

    progress.achievements = buildAchievements(records, scenarios_mastered, current_streak);

    const recentActivities = buildActivity(records, 5);

    return res.status(200).json({ progress, recentActivities });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 