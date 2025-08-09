import { kv } from '@vercel/kv';

// Simple in-memory fallback for local development only
const memoryStore: Record<string, string[]> = {};

function isKVConfigured(): boolean {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

export interface SessionRecord {
  id: string;
  anonId: string;
  scenarioRaw: string;
  scenarioType: string;
  smoothnessScore: number; // 0-100
  keyImprovement: string;
  durationMinutes: number; // integer minutes
  timestamp: string; // ISO string
  difficulty?: 'easy' | 'medium' | 'hard';
  feeling?: 'confident' | 'okay' | 'anxious' | 'rough';
}

const sessionsKey = (anonId: string) => `kairoo:sessions:${anonId}`;

export async function saveSession(record: SessionRecord): Promise<void> {
  const key = sessionsKey(record.anonId);
  const serialized = JSON.stringify(record);

  if (isKVConfigured()) {
    // Prepend newest
    await kv.lpush(key, serialized);
    // Keep only the latest 200 sessions
    await kv.ltrim(key, 0, 199);
  } else {
    if (!memoryStore[key]) memoryStore[key] = [];
    memoryStore[key].unshift(serialized);
    memoryStore[key] = memoryStore[key].slice(0, 200);
  }
}

export async function listSessions(anonId: string, limit = 100): Promise<SessionRecord[]> {
  const key = sessionsKey(anonId);
  let items: string[] = [];

  if (isKVConfigured()) {
    items = (await kv.lrange<string>(key, 0, limit - 1)) || [];
  } else {
    items = (memoryStore[key] || []).slice(0, limit);
  }

  return items
    .map((s) => {
      try {
        return JSON.parse(s) as SessionRecord;
      } catch {
        return null;
      }
    })
    .filter((x): x is SessionRecord => Boolean(x));
}

export function getKVStatus(): { configured: boolean } {
  return { configured: isKVConfigured() };
} 