import type {
  Robot, Mission, Memory, Alert, AppNotification, MaintenanceRecord, TelemetrySample,
  FleetSettings, EventSeverity, MissionEvent, AgentDecision, MemoryConflict
} from './types';
import { buildSeedData, mulberry32 } from './seed';
import { ENVIRONMENTS } from './environments';

/* Central reactive store with localStorage persistence. */

export type Listener = () => void;

const LS_KEY = 'fleetminder.state.v1';
const LS_SETTINGS = 'fleetminder.settings.v1';

export interface AppState {
  robots: Robot[];
  missions: Mission[];
  memories: Memory[];
  alerts: Alert[];
  notifications: AppNotification[];
  maintenance: MaintenanceRecord[];
  telemetry: Record<string, TelemetrySample[]>;
  events: MissionEvent[];
  conflicts: MemoryConflict[];
  seqMission: number;
  seqMemory: number;
  seqEvent: number;
  seqDecision: number;
  bootedAt: number;
  memRetrievedToday: { day: string; count: number };
}

let state: AppState;
let settings: FleetSettings;
const listeners = new Set<Listener>();
const rnd = mulberry32(777);

export const DEFAULT_SETTINGS: FleetSettings = {
  autoAssign: true,
  lowBatteryThreshold: 30,
  criticalBatteryThreshold: 15,
  signalWarning: 50,
  maxConcurrentMissions: 3,
  memoryRecallEnabled: true,
  memoryAutoSave: true,
  memoryMinRelevance: 0.45,
  memoryConflictDetection: true,
  memoryRetentionDays: 180,
  memoryBackend: 'internal',
  agentPlanningVerbose: true,
  agentAutoReroute: true,
  agentConfidenceThreshold: 0.6,
  simSpeed: 1,
  simEventFrequency: 'normal',
  notificationsMission: true,
  notificationsMemory: true,
  notificationsBattery: true,
  notificationsCritical: true,
  operatorName: 'K. Ferreira',
  operatorRole: 'Fleet Supervisor',
  requireReviewForCritical: true,
  sessionTimeoutMin: 30,
  telemetryIntervalSec: 10
};

function makeState(): AppState {
  const seed = buildSeedData();
  return {
    robots: seed.robots,
    missions: seed.missions,
    memories: seed.memories,
    alerts: seed.alerts,
    notifications: [],
    maintenance: seed.maintenance,
    telemetry: seed.telemetry,
    events: [],
    conflicts: [
      {
        id: 'cf-1',
        memoryAId: 'M-087',
        memoryBId: 'M-151',
        topic: 'Corridor C usability (Warehouse A)',
        status: 'open',
        detectedAt: Date.now() - 140 * 60000
      }
    ],
    seqMission: seed.seq.mission,
    seqMemory: seed.seq.memory,
    seqEvent: 5000,
    seqDecision: 100,
    bootedAt: Date.now(),
    memRetrievedToday: { day: new Date().toDateString(), count: 7 }
  };
}

export function getState(): AppState {
  if (!state) load();
  return state;
}

export function getSettings(): FleetSettings {
  if (!settings) load();
  return settings;
}

function persist() {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
    localStorage.setItem(LS_SETTINGS, JSON.stringify(settings));
  } catch { /* storage unavailable — session-only mode */ }
}

function load() {
  settings = { ...DEFAULT_SETTINGS };
  try {
    const s = localStorage.getItem(LS_SETTINGS);
    if (s) settings = { ...DEFAULT_SETTINGS, ...JSON.parse(s) };
  } catch { /* defaults */ }
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as AppState;
      if (parsed && Array.isArray(parsed.robots) && parsed.robots.length) {
        state = parsed;
        state.memories = (state.memories ?? []).map(memory => ({ ...memory, origin: 'simulated' }));
        state.notifications = state.notifications ?? [];
        state.events = state.events ?? [];
        state.conflicts = state.conflicts ?? [];
        /* fresh day -> reset retrieval counter */
        const today = new Date().toDateString();
        if (state.memRetrievedToday?.day !== today) state.memRetrievedToday = { day: today, count: 0 };
        return;
      }
    }
  } catch { /* corrupted state — reseed */ }
  state = makeState();
  persist();
}

export function subscribe(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

let persistTimer: ReturnType<typeof setTimeout> | null = null;
function schedulePersist() {
  if (persistTimer) return;
  persistTimer = setTimeout(() => { persistTimer = null; persist(); }, 400);
}

export function flushPersistence() {
  if (persistTimer) {
    clearTimeout(persistTimer);
    persistTimer = null;
  }
  persist();
}

/** Apply mutations then notify subscribers (batched per tick). */
export function mutate(fn: (s: AppState) => void): void {
  const s = getState();
  fn(s);
  schedulePersist();
  listeners.forEach(l => { try { l(); } catch { /* listener error */ } });
}

export function updateSettings(patch: Partial<FleetSettings>) {
  if (!settings) load();
  settings = { ...settings, ...patch };
  schedulePersist();
  listeners.forEach(l => { try { l(); } catch { /* listener error */ } });
}

export function resetAllData() {
  try {
    localStorage.removeItem(LS_KEY);
    localStorage.removeItem(LS_SETTINGS);
  } catch { /* ignore */ }
  state = makeState();
  settings = { ...DEFAULT_SETTINGS };
  persist();
  listeners.forEach(l => { try { l(); } catch { /* listener error */ } });
}

/* ---------------- ID helpers ---------------- */

export function nextMissionCode(): string {
  const s = getState();
  return `MS-${String(s.seqMission).padStart(3, '0')}`;
}
export function bumpMissionSeq() { mutate(s => { s.seqMission++; }); }
export function nextMemoryId(): string {
  const s = getState();
  return `M-${s.seqMemory++}`;
}

/* ---------------- Robot helpers ---------------- */

export function getRobot(id: string): Robot | undefined {
  return getState().robots.find(r => r.id === id);
}
export function getRobots(): Robot[] { return getState().robots; }

export function patchRobot(id: string, patch: Partial<Robot>) {
  mutate(s => {
    const r = s.robots.find(r => r.id === id);
    if (r) Object.assign(r, patch);
  });
}

/* ---------------- Mission helpers ---------------- */

export function getMission(id: string): Mission | undefined {
  return getState().missions.find(m => m.id === id);
}
export function getMissions(): Mission[] { return getState().missions; }
export function getActiveMissions(): Mission[] {
  return getState().missions.filter(m => m.status === 'active' || m.status === 'paused');
}

export function pushMissionEvent(missionId: string, ev: Omit<MissionEvent, 'id' | 'missionId'>): MissionEvent {
  const s = getState();
  const full: MissionEvent = { ...ev, id: `ev-${s.seqEvent++}`, missionId };
  mutate(st => {
    st.events.push(full);
    const m = st.missions.find(m => m.id === missionId);
    if (m) m.events.push(full);
  });
  return full;
}

export function addDecision(d: Omit<AgentDecision, 'id'>): AgentDecision {
  const s = getState();
  const full: AgentDecision = { ...d, id: `ad-${s.seqDecision++}` };
  mutate(st => {
    st.seqDecision = st.seqDecision;
    const m = st.missions.find(m => m.id === d.missionId);
    if (m) m.decisions.push(full);
  });
  return full;
}

export function addTelemetrySample(robotId: string, sample: TelemetrySample) {
  mutate(s => {
    const arr = s.telemetry[robotId] ?? (s.telemetry[robotId] = []);
    arr.push(sample);
    if (arr.length > 120) arr.splice(0, arr.length - 120);
  });
}

/* ---------------- Memory helpers ---------------- */

export function getMemories(): Memory[] { return getState().memories; }
export function getMemory(id: string): Memory | undefined {
  return getState().memories.find(m => m.id === id);
}

export function upsertMemory(mem: Memory) {
  mutate(s => {
    const i = s.memories.findIndex(m => m.id === mem.id);
    if (i >= 0) s.memories[i] = mem;
    else s.memories.unshift(mem);
  });
}

export function recordMemoryRetrieval(ids: string[], todayCountDelta = 0) {
  if (!ids.length) return;
  const now = Date.now();
  mutate(s => {
    ids.forEach(id => {
      const m = s.memories.find(m => m.id === id);
      if (m) { m.lastRetrievedAt = now; m.retrievalCount++; }
    });
    s.memRetrievedToday.count += todayCountDelta || ids.length;
  });
}

export function getConflicts(): MemoryConflict[] { return getState().conflicts; }

export function addConflict(c: Omit<MemoryConflict, 'id'>): MemoryConflict {
  const s = getState();
  const full: MemoryConflict = { ...c, id: `cf-${s.conflicts.length + 1}-${Math.floor(rnd() * 999)}` };
  mutate(st => { st.conflicts.unshift(full); });
  return full;
}

export function resolveConflict(id: string, strategy: MemoryConflict['resolvedStrategy'], resolution: string) {
  mutate(s => {
    const c = s.conflicts.find(c => c.id === id);
    if (c) { c.status = 'resolved'; c.resolvedStrategy = strategy; c.resolution = resolution; }
    if (strategy === 'retire-old') {
      const c2 = s.conflicts.find(c => c.id === id);
      if (c2) {
        const m = s.memories.find(m => m.id === c2.memoryAId);
        if (m) m.supersededBy = c2.memoryBId;
      }
    }
  });
}

/* ---------------- Alerts & notifications ---------------- */

export function addAlert(a: Omit<Alert, 'id' | 'ts' | 'reviewed'>): Alert {
  const s = getState();
  const full: Alert = { ...a, id: `al-${Date.now()}-${Math.floor(rnd() * 9999)}`, ts: Date.now(), reviewed: false };
  mutate(st => { st.alerts.unshift(full); if (st.alerts.length > 120) st.alerts.pop(); });
  return full;
}

export function markAlertReviewed(id: string) {
  mutate(s => { const a = s.alerts.find(a => a.id === id); if (a) a.reviewed = true; });
}

export function markAllAlertsReviewed() {
  mutate(s => { s.alerts.forEach(a => { a.reviewed = true; }); });
}

export function addNotification(n: Omit<AppNotification, 'id' | 'ts' | 'read'>): AppNotification {
  const s = getState();
  const full: AppNotification = { ...n, id: `nt-${Date.now()}-${Math.floor(rnd() * 9999)}`, ts: Date.now(), read: false };
  mutate(st => {
    st.notifications.unshift(full);
    if (st.notifications.length > 60) st.notifications.pop();
  });
  return full;
}

export function markNotificationRead(id: string) {
  mutate(s => { const n = s.notifications.find(n => n.id === id); if (n) n.read = true; });
}

export function markAllNotificationsRead() {
  mutate(s => { s.notifications.forEach(n => { n.read = true; }); });
}

export function clearNotifications() {
  mutate(s => { s.notifications = []; });
}

/* ---------------- Derived stats ---------------- */

export function fleetStats() {
  const s = getState();
  const robots = s.robots;
  const online = robots.filter(r => r.status !== 'offline').length;
  const activeMissions = s.missions.filter(m => m.status === 'active').length;
  const completed = s.missions.filter(m => m.status === 'completed').length;
  const attention = robots.filter(r => r.status === 'warning' || r.battery <= getSettings().criticalBatteryThreshold || r.status === 'offline').length;
  const avgBattery = Math.round(robots.reduce((a, r) => a + r.battery, 0) / Math.max(1, robots.length));
  const finished = s.missions.filter(m => m.status === 'completed' || m.status === 'failed');
  const successRate = finished.length ? Math.round((finished.filter(m => m.outcome === 'success').length / finished.length) * 100) : 100;
  return {
    total: robots.length, online, activeMissions, completed, attention, avgBattery, successRate,
    memoriesToday: s.memRetrievedToday.count,
    paused: s.missions.filter(m => m.status === 'paused').length
  };
}

export function envList() { return ENVIRONMENTS; }
