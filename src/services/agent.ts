import type { Mission, Robot, Memory, AgentDecision } from '../data/types';
import { getMissions, getRobot, getMemories, getSettings } from '../data/store';
import { recall } from './memory';

/* Agent Service — explainable planning narrative + operations assistant Q&A.
   All answers are derived from real application state (missions, memories,
   telemetry) — never invented. Sources are labeled per claim. */

export interface AgentStep {
  title: string;
  detail?: string;
  kind: 'agent' | 'memory' | 'decision' | 'system' | 'sim';
}

export function planningNarrative(mission: Mission, robot: Robot, memHits: Memory[]): AgentStep[] {
  const envName = mission.envId === 'wh-a' ? 'Warehouse A' : mission.envId === 'industrial' ? 'Industrial Facility' : 'Outdoor Inspection Zone';
  const steps: AgentStep[] = [
    { title: 'Mission received', detail: `${mission.type} to ${mission.destinationName} (${envName})`, kind: 'system' },
    { title: `Robot ${robot.id} ${robot.name} selected`, detail: `Status ${robot.status}, battery ${robot.battery}%, health ${robot.healthScore}/100.`, kind: 'agent' },
    { title: 'Destination analyzed', detail: `${envName} → ${mission.destinationName}. Distance ${mission.distanceM} m.`, kind: 'agent' },
    { title: 'Previous mission experiences searched', detail: 'Persistent memory queried with robot, environment, destination and mission-type context.', kind: 'agent' }
  ];
  if (memHits.length) {
    steps.push({ title: `${memHits.length} relevant experience${memHits.length > 1 ? 's' : ''} found`, detail: memHits.map(m => m.id).join(', '), kind: 'memory' });
    const risk = memHits.find(m => /blocked|obstacle|spill|debris|slip/i.test(m.text));
    if (risk) {
      steps.push({ title: 'Previous risk identified in plan', detail: `${risk.id}: ${risk.text}`, kind: 'memory' });
      steps.push({ title: 'Alternative route evaluated', detail: 'Candidate paths compared against topology and prior outcomes.', kind: 'agent' });
      steps.push({ title: 'Safer route selected', detail: 'Plan updated before departure — obstacle avoided proactively.', kind: 'decision' });
    }
  } else {
    steps.push({ title: 'No strongly relevant memories found', detail: 'Fresh experience will be captured during execution.', kind: 'memory' });
  }
  steps.push({ title: 'Mission execution started', detail: 'Telemetry streaming; agent monitors execution and will adapt to conditions.', kind: 'sim' });
  return steps;
}

/* ---------------- Operations assistant ---------------- */

export interface AssistantSource {
  label: string;
  cls: 'src-live' | 'src-state' | 'src-history' | 'src-memory' | 'src-sim';
}
export interface AssistantReply {
  text: string;
  sources: AssistantSource[];
  links?: Array<{ label: string; route: string }>;
}

function findRobotMentions(q: string): Robot[] {
  const robots = getRobotsAll();
  const ids = robots.map(r => r.id.toLowerCase());
  const names = robots.map(r => r.name.toLowerCase());
  const found: Robot[] = [];
  robots.forEach((r, i) => {
    if (q.includes(ids[i]) || q.includes(names[i])) found.push(r);
  });
  return found;
}
function getRobotsAll(): Robot[] {
  // small local import indirection to avoid cycles at module init
  const { getRobots } = requireStore();
  return getRobots();
}
import * as store from '../data/store';
function requireStore(): typeof store { return store; }

export function answerQuestion(rawQ: string): AssistantReply {
  const q = rawQ.toLowerCase();
  const missions = getMissions();
  const memories = getMemories();
  const settings = getSettings();

  /* Route / corridor questions */
  if (/why.*(corridor|route|choose|chose|reroute)/.test(q) || /corridor c/.test(q)) {
    const robotMentions = findRobotMentions(q);
    const rid = robotMentions[0]?.id ?? 'R-01';
    const mems = memories.filter(m => m.robotId === rid && /corridor/i.test(m.text));
    const decMissions = missions.filter(m => m.robotId === rid && m.decisions.some(d => /route|reroute/i.test(d.decision)));
    if (mems.length || decMissions.length) {
      const top = mems.sort((a, b) => b.relevance - a.relevance)[0];
      const m = decMissions[0];
      const dec = m?.decisions.find(d => /route|reroute/i.test(d.decision));
      const lines: string[] = [];
      if (top) lines.push(`**Persistent memory (local simulation)** — ${top.id}: “${top.text}” (simulated relevance ${(top.relevance * 100).toFixed(0)}%, recalled ${top.retrievalCount}×).`);
      if (dec && m) lines.push(`**Historical mission data** — during ${m.code} the agent recorded: “${dec.decision}”. Rationale: ${dec.rationale}`);
      lines.push(`**Current mission state** — memory-assisted routing is ${settings.memoryRecallEnabled ? 'enabled' : 'disabled'} and applied during mission planning and whenever an obstacle is detected.`);
      return {
        text: lines.join('\n\n'),
        sources: [
          { label: 'Persistent memory', cls: 'src-memory' },
          { label: 'Historical mission data', cls: 'src-history' },
          { label: 'Current mission state', cls: 'src-state' }
        ],
        links: top ? [{ label: `Open ${top.id}`, route: `memory/${top.id}` }] : []
      };
    }
  }

  /* Previous mission at a destination */
  if (/previous|last|during.*(mission|warehouse|zone)/.test(q)) {
    const robotMentions = findRobotMentions(q);
    const destMatch = missions.find(m => /warehouse a/i.test(q) && m.destinationName.includes('Zone') === false && m.envId === 'wh-a');
    const target = destMatch ?? missions.find(m => !robotMentions.length || m.robotId === robotMentions[0].id);
    const m = missions.filter(x => x.status === 'completed').find(x => target && x.robotId === (target.robotId));
    if (m) {
      const probs = m.problems.length ? m.problems.join('; ') : 'no significant problems';
      return {
        text: `**Historical mission data** — ${m.code} (${m.type} to ${m.destinationName}, ${m.robotId}) completed ${timeAgo(m.endedAt ?? m.startedAt ?? m.createdAt)} in ${Math.round(m.durationSec / 60)} min. Outcome: ${m.outcome}. Problems: ${probs}. Memories retrieved: ${m.memoryIdsRetrieved.join(', ') || 'none'}. New memories created: ${m.memoryIdsCreated.join(', ') || 'none'}.`,
        sources: [{ label: 'Historical mission data', cls: 'src-history' }],
        links: [{ label: `Open ${m.code}`, route: `missions/${m.id}` }]
      };
    }
  }

  /* Battery problems */
  if (/battery|charging|charge/.test(q)) {
    const evs = missions.filter(m => m.problems.some(p => /battery/i.test(p)) || /battery/i.test(m.events.map(e => e.title).join(' ')));
    const mems = memories.filter(m => m.category === 'Battery');
    const robotsLow = getRobotsAll().filter(r => r.battery < 40);
    const parts: string[] = [];
    if (robotsLow.length) parts.push(`**Current state** — ${robotsLow.map(r => `${r.id} at ${r.battery}%`).join(', ')}.`);
    if (evs.length) parts.push(`**Historical mission data** — ${evs.length} mission(s) recorded battery problems: ${evs.slice(0, 3).map(m => m.code).join(', ')}.`);
    if (mems.length) parts.push(`**Persistent memory** — ${mems.slice(0, 3).map(m => `${m.id}: ${m.text}`).join(' | ')}`);
    if (parts.length) return { text: parts.join('\n\n'), sources: [{ label: 'Simulated telemetry', cls: 'src-sim' }, { label: 'Historical mission data', cls: 'src-history' }, { label: 'Persistent memory', cls: 'src-memory' }] };
  }

  /* What does robot X remember about Y */
  if (/what does.*(remember|know)|remember about|know about/.test(q)) {
    const robotMentions = findRobotMentions(q);
    const rid = robotMentions[0]?.id;
    if (rid) {
      const zoneWords = ['zone', 'corridor', 'hall', 'perimeter', 'dock', 'gate', 'bay', 'cell', 'store', 'substation', 'tank', 'assembly', 'press'];
      const zone = zoneWords.find(w => q.includes(w));
      let mems = memories.filter(m => m.robotId === rid);
      if (zone) mems = mems.filter(m => m.text.toLowerCase().includes(zone));
      if (mems.length) {
        return {
          text: `**Persistent memory** — ${rid} holds ${mems.length} relevant experience(s):\n\n${mems.slice(0, 4).map(m => `• ${m.id} (${m.category}, ${(m.confidence * 100).toFixed(0)}% confidence): ${m.text}`).join('\n')}`,
          sources: [{ label: 'Persistent memory', cls: 'src-memory' }],
          links: mems.slice(0, 2).map(m => ({ label: `Open ${m.id}`, route: `memory/${m.id}` }))
        };
      }
      return { text: `**Persistent memory** — ${rid} has no memories mentioning ${zone ?? 'that topic'} in the current memory store.`, sources: [{ label: 'Persistent memory', cls: 'src-memory' }] };
    }
  }

  /* Missions where obstacles caused rerouting */
  if (/obstacle.*rerout|rerout|obstacle/.test(q)) {
    const rerouted = missions.filter(m => m.decisions.some(d => /reroute/i.test(d.decision)) || m.problems.some(p => /obstacle/i.test(p)));
    if (rerouted.length) {
      return {
        text: `**Historical mission data** — ${rerouted.length} mission(s) involved obstacles and rerouting:\n\n${rerouted.slice(0, 5).map(m => `• ${m.code} — ${m.robotId}, ${m.type} to ${m.destinationName} (${m.outcome ?? m.status})`).join('\n')}`,
        sources: [{ label: 'Historical mission data', cls: 'src-history' }],
        links: rerouted.slice(0, 3).map(m => ({ label: `Open ${m.code}`, route: `missions/${m.id}` }))
      };
    }
  }

  /* Which experience is relevant to this mission */
  if (/relevant.*(mission|experience)|which experience/.test(q)) {
    const activeMission = missions.find(m => m.status === 'active' || m.status === 'paused');
    if (activeMission) {
      const res = recall({
        robotId: activeMission.robotId, envId: activeMission.envId,
        destinationNode: activeMission.destinationNode,
        text: `${activeMission.type} ${activeMission.destinationName}`,
        limit: 3
      });
      if (res.hits.length) {
        return {
          text: `**Current mission state + Persistent memory** — for ${activeMission.code} (${activeMission.robotId} → ${activeMission.destinationName}), the most relevant experiences are:\n\n${res.hits.map(h => `• ${h.memory.id} — ${(h.score * 100).toFixed(0)}% match: ${h.memory.text}`).join('\n')}`,
          sources: [{ label: 'Current mission state', cls: 'src-state' }, { label: 'Persistent memory', cls: 'src-memory' }],
          links: [{ label: `Open ${activeMission.code}`, route: `missions/${activeMission.id}` }]
        };
      }
    }
  }

  /* Fleet overview */
  if (/fleet|status|overview|how many|robots/.test(q)) {
    const robots = getRobotsAll();
    const online = robots.filter(r => r.status !== 'offline').length;
    const activeCount = missions.filter(m => m.status === 'active').length;
    return {
      text: `**Current mission state** — the fleet has ${robots.length} robots, ${online} reachable, ${activeCount} active mission(s), and ${memories.length} memories stored (${memories.filter(m => m.retrievalCount > 0).length} retrieved at least once). Memory recall is ${settings.memoryRecallEnabled ? 'enabled' : 'disabled'}.`,
      sources: [{ label: 'Current mission state', cls: 'src-state' }]
    };
  }

  /* Memory store questions */
  if (/memor/.test(q)) {
    const byCat = new Map<string, number>();
    memories.forEach(m => byCat.set(m.category, (byCat.get(m.category) ?? 0) + 1));
    const top = [...byCat.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3);
    return {
      text: `**Persistent memory** — the store holds ${memories.length} memories. Largest categories: ${top.map(([c, n]) => `${c} (${n})`).join(', ')}. ${getConflictsCount()} open conflict(s) flagged for review.`,
      sources: [{ label: 'Persistent memory', cls: 'src-memory' }]
    };
  }

  /* Fallback */
  return {
    text: `I can answer from live fleet state, historical missions, and persistent memory. Try:\n\n• “Why did R-01 choose Corridor C?”\n• “What happened during the previous Warehouse A mission?”\n• “Which robots have experienced battery problems?”\n• “What does R-03 remember about the South Hall?”\n• “Show missions where obstacles caused rerouting.”\n• “Which previous experience is relevant to this mission?”`,
    sources: []
  };
}

function getConflictsCount(): number {
  const { getConflicts } = requireStore();
  return getConflicts().filter(c => c.status === 'open').length;
}

export function timeAgo(ts: number | null | undefined): string {
  if (!ts) return '—';
  const diff = Date.now() - ts;
  const mins = Math.round(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} h ago`;
  const days = Math.round(hrs / 24);
  return `${days} d ago`;
}

export type { AgentDecision };
