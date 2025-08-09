import type { NextApiRequest, NextApiResponse } from 'next';
import { listSessions, saveSession, SessionRecord } from '../../server/storage';

function classifyScenario(raw: string): { type: string } {
  const text = raw.toLowerCase();
  if (/interview|job|offer|resume|cv|hiring/.test(text)) return { type: 'Job Interview' };
  if (/network|linkedin|meetup|event/.test(text)) return { type: 'Networking Event' };
  if (/present|presentation|pitch|talk|speech/.test(text)) return { type: 'Presentation' };
  if (/conflict|argue|argument|fight|disagree|disagreement|resolution/.test(text)) return { type: 'Conflict Resolution' };
  if (/customer|support|service|client/.test(text)) return { type: 'Customer Service' };
  if (/phone|call|cold call/.test(text)) return { type: 'Phone Call' };
  if (/team|meeting|standup|coworker|colleague/.test(text)) return { type: 'Team Meeting' };
  if (/date|dating|romance|crush|partner|girlfriend|boyfriend/.test(text)) return { type: 'Dating Conversation' };
  if (/family|parent|mom|dad|sibling|brother|sister/.test(text)) return { type: 'Family Discussion' };
  if (/small talk|coffee|lunch|party|social/.test(text)) return { type: 'Small Talk' };
  return { type: 'General' };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      const { anonId, limit } = req.query;
      if (!anonId || typeof anonId !== 'string') {
        return res.status(400).json({ error: 'anonId is required' });
      }
      const n = typeof limit === 'string' ? Math.max(1, Math.min(200, parseInt(limit, 10) || 100)) : 100;
      const sessions = await listSessions(anonId, n);
      return res.status(200).json({ sessions });
    }

    if (req.method === 'POST') {
      const {
        anonId,
        scenario,
        smoothnessScore,
        whatWentWell,
        improvementAreas,
        durationMinutes,
        startedAt,
        endedAt,
        difficulty,
        feeling,
      } = req.body || {};

      if (!anonId || typeof anonId !== 'string') {
        return res.status(400).json({ error: 'anonId is required' });
      }
      if (!scenario || typeof scenario !== 'string' || scenario.trim().length === 0) {
        return res.status(400).json({ error: 'scenario is required' });
      }
      const score = Number.parseFloat(smoothnessScore);
      if (!Number.isFinite(score) || score < 0 || score > 100) {
        return res.status(400).json({ error: 'smoothnessScore must be 0-100' });
      }

      const started = startedAt ? new Date(startedAt) : null;
      const ended = endedAt ? new Date(endedAt) : new Date();
      let duration = Number(durationMinutes);
      if (!Number.isFinite(duration) || duration <= 0) {
        if (started && ended && ended > started) {
          duration = Math.max(1, Math.round((ended.getTime() - started.getTime()) / 60000));
        } else {
          duration = 10; // sensible default
        }
      }

      const { type } = classifyScenario(scenario);
      const record: SessionRecord = {
        id: `sess_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        anonId,
        scenarioRaw: scenario.trim(),
        scenarioType: type,
        smoothnessScore: Math.round(score),
        keyImprovement: Array.isArray(improvementAreas) && improvementAreas.length > 0
          ? String(improvementAreas[0])
          : (typeof whatWentWell === 'string' ? whatWentWell.slice(0, 120) : 'Showed engagement'),
        durationMinutes: Math.round(duration),
        timestamp: ended.toISOString(),
        difficulty: difficulty,
        feeling: feeling,
      };

      await saveSession(record);
      return res.status(200).json({ success: true, session: record });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Sessions API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 