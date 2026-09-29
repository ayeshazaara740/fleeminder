import type { Memory, MemoryCategory, EnvId, MemoryEvolutionEntry } from '../data/types';
import {
  getMemories, getSettings, mutate, upsertMemory, nextMemoryId, addNotification,
  addConflict, getConflicts, recordMemoryRetrieval
} from '../data/store';

/* Memory Service — the integration boundary for mission memory.
  This prototype currently uses its local simulated store. A real Hindsight
  provider requires a server-side adapter; no external requests are made here. */

export interface RecallQuery {
  robotId?: string;
  envId?: EnvId;
  destinationNode?: string;
  missionType?: string;
  category?: MemoryCategory;
  text?: string;
  limit?: number;
  minRelevance?: number;
}

export interface RecallHit {
  memory: Memory;
  score: number;
  reasons: string[];
}

export interface RecallResult {
  backend: 'internal';
  hits: RecallHit[];
  searchedAt: number;
}

function tokenOverlap(a: string, b: string): number {
  const sw = new Set(['the', 'a', 'an', 'is', 'was', 'and', 'or', 'of', 'to', 'in', 'on', 'during', 'when', 'for', 'with', 'at', 'by']);
  const ta = a.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w && !sw.has(w));
  const tb = b.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w && !sw.has(w));
  if (!ta.length || !tb.length) return 0;
  const setB = new Set(tb);
  let hit = 0;
  ta.forEach(w => { if (setB.has(w)) hit++; });
  return hit / Math.sqrt(ta.length * tb.length);
}

/** Score memories against the current mission context. */
export function recall(q: RecallQuery): RecallResult {
  const settings = getSettings();
  const now = Date.now();
  const retentionMs = settings.memoryRetentionDays * 86400000;
  const memories = getMemories().filter(m => !m.supersededBy && now - m.createdAt <= retentionMs);
  const minRel = q.minRelevance ?? settings.memoryMinRelevance;
  const hits: RecallHit[] = [];

  memories.forEach(m => {
    let score = m.relevance * 0.5 + m.confidence * 0.2;
    const reasons: string[] = [];

    if (q.envId && m.envId === q.envId) { score += 0.18; reasons.push(`Same environment (${m.envId})`); }
    if (q.robotId && m.robotId === q.robotId) { score += 0.14; reasons.push(`Direct experience of ${q.robotId}`); }
    else if (q.robotId) score -= 0.08;
    if (q.destinationNode && m.tags.some(t => q.destinationNode!.replace(/-/g, '').includes(t.replace(/-/g, '')))) {
      score += 0.1; reasons.push('Destination mentioned');
    }
    if (q.text) {
      const ov = tokenOverlap(q.text, m.text);
      if (ov > 0.15) { score += ov * 0.35; reasons.push(`Content overlap ${(ov * 100).toFixed(0)}%`); }
    }
    if (q.missionType && m.category === 'Mission Strategy' && q.missionType === 'Inspection') score += 0.04;

    /* recency bonus */
    const ageDays = (now - m.createdAt) / 86400000;
    score += Math.max(0, 0.08 - ageDays * 0.002);

    if (score >= minRel) hits.push({ memory: m, score: Math.min(1, score), reasons: reasons.slice(0, 2) });
  });

  hits.sort((a, b) => b.score - a.score);
  return {
    backend: 'internal',
    hits: hits.slice(0, q.limit ?? 4),
    searchedAt: Date.now()
  };
}

export function createMemory(input: {
  robotId: string;
  missionId: string;
  missionCode?: string;
  category: MemoryCategory;
  text: string;
  envId: EnvId;
  tags: string[];
  confidence?: number;
  relevance?: number;
}): Memory {
  const mem: Memory = {
    id: nextMemoryId(),
    robotId: input.robotId,
    missionId: input.missionId,
    missionCode: input.missionCode,
    category: input.category,
    text: input.text,
    confidence: input.confidence ?? 0.85,
    relevance: input.relevance ?? 0.7,
    createdAt: Date.now(),
    lastRetrievedAt: null,
    retrievalCount: 0,
    envId: input.envId,
    tags: input.tags,
    origin: 'simulated',
    supersededBy: null
  };
  upsertMemory(mem);

  const s = getSettings();
  if (s.notificationsMemory) {
    addNotification({
      severity: 'success',
      title: 'New memory created',
      body: `${mem.id} — ${mem.text.slice(0, 90)}${mem.text.length > 90 ? '…' : ''}`,
      route: { view: 'memory', id: mem.id }
    });
  }

  detectConflictAgainst(mem);
  return mem;
}

/** Append a new observation to a memory, evolving its content over time. */
export function evolveMemory(id: string, entry: Omit<MemoryEvolutionEntry, 'ts'>) {
  const mem = getMemories().find(m => m.id === id);
  if (!mem) return;
  const updated: Memory = {
    ...mem,
    text: entry.text,
    confidence: entry.confidence,
    relevance: Math.min(1, mem.relevance + 0.03),
    evolution: [...(mem.evolution ?? []), { ...entry, ts: Date.now() }]
  };
  upsertMemory(updated);
  void mutate; // mutation happens inside upsertMemory
}

export function getEvolution(memoryId: string): MemoryEvolutionEntry[] {
  const m = getMemories().find(m => m.id === memoryId);
  return m?.evolution ?? [];
}

const NEGATIVE_PAIRS: Array<[string, string]> = [
  ['blocked', 'clear'],
  ['preferred', 'blocked'],
  ['successful', 'failed'],
  ['passable', 'closed'],
  ['alternative', 'only route']
];

/** Detect contradictions between a new memory and older memories sharing tags. */
export function detectConflictAgainst(newMem: Memory): void {
  const settings = getSettings();
  if (!settings.memoryConflictDetection) return;
  const others = getMemories().filter(m => m.id !== newMem.id && m.robotId === newMem.robotId && !m.supersededBy);
  others.forEach(o => {
    const sharedTags = o.tags.filter(t => newMem.tags.includes(t));
    if (sharedTags.length < 1) return;
    const lo = o.text.toLowerCase();
    const ln = newMem.text.toLowerCase();
    const contradictory = NEGATIVE_PAIRS.some(([a, b]) =>
      (lo.includes(a) && ln.includes(b)) || (lo.includes(b) && ln.includes(a))
    );
    if (!contradictory) return;
    const alreadyOpen = getConflicts().some(c =>
      c.status === 'open' &&
      ((c.memoryAId === o.id && c.memoryBId === newMem.id) || (c.memoryAId === newMem.id && c.memoryBId === o.id))
    );
    if (alreadyOpen) return;
    addConflict({
      memoryAId: o.id,
      memoryBId: newMem.id,
      topic: `${sharedTags[0].replace(/-/g, ' ')} (${o.envId})`,
      status: 'open',
      detectedAt: Date.now()
    });
  });
}

export function markRetrieved(ids: string[]) {
  recordMemoryRetrieval(ids, 1);
}
