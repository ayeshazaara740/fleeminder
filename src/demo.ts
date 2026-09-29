import type { Mission } from './data/types';
import { getState, getSettings, updateSettings, subscribe, patchRobot, resetAllData } from './data/store';
import { createMission, startMission, cancelMission, completeMission, saveExperienceToMemory, getActiveSim, resetSimulation, restoreActiveSimulations } from './services/simulation';
import { navigate } from './router';
import { toast } from './components/ui';

/* Demo Mode — guided walkthrough of the full memory loop:
   Mission → Experience → Memory → Recall → Decision → Improved Mission */

export interface DemoStepDef {
  n: number;
  label: string;
  title: string;
  desc: string;
  hint?: string;
}

export const DEMO_STEPS: DemoStepDef[] = [
  { n: 1, label: 'Mission', title: 'Assign R-01 to inspect Warehouse A', desc: 'Starting an Inspection mission for R-01 to Zone A2 in Warehouse A. Watch the mission workspace and map.', hint: 'The agent is planning the route. Notice there is no Corridor B warning yet on first runs.' },
  { n: 2, label: 'Experience', title: 'Robot encounters a Corridor B obstacle', desc: 'The simulation injects an obstacle. The agent detects it, searches previous experience, and reroutes via Corridor C.', hint: 'This obstacle is exactly the kind of event worth remembering.' },
  { n: 3, label: 'Memory', title: 'Mission completes; save the experience', desc: 'The mission finished using the alternate route. The post-mission summary proposes storing the learned experience in persistent memory.', hint: 'Saving creates a new memory in the local Memory Center.' },
  { n: 4, label: 'Recall', title: 'Start a second Warehouse A mission', desc: 'R-01 is staged at Dock Bay for a comparable repeat route. This time the agent searches persistent memory during planning.', hint: 'Watch the agent timeline for “relevant experience found”.' },
  { n: 5, label: 'Decision', title: 'Agent recommends Corridor C preemptively', desc: 'Before any obstacle appears, the agent flags Corridor B as a known risk and selects the Corridor C route up front.', hint: 'Compare the route with the first mission — no mid-mission surprise.' },
  { n: 6, label: 'Improved Mission', title: 'Mission completes using learned context', desc: 'The second mission runs on the learned route. The loop is closed: mission → experience → memory → recall → decision → improved mission.', hint: 'Check Analytics to see the memory-impact comparison.' }
];

const DEMO_PROGRESS = ['Mission', 'Experience', 'Memory', 'Recall', 'Decision', 'Improved Mission'];

interface DemoState {
  active: boolean;
  step: number; // 1..8 (granular), maps to progress index
  mission1Id: string | null;
  mission2Id: string | null;
  memory1Id: string | null;
  phase: 'idle' | 'running' | 'awaiting-m1-complete' | 'awaiting-save' | 'awaiting-m2-complete' | 'done';
  unsubscribe: (() => void) | null;
  simSpeedBefore: number;
}

interface PersistedDemoState {
  step: number;
  mission1Id: string | null;
  mission2Id: string | null;
  memory1Id: string | null;
  phase: DemoState['phase'];
  simSpeedBefore: number;
}

const DEMO_SESSION_KEY = 'fleetminder.demo.v1';

const st: DemoState = {
  active: false, step: 0, mission1Id: null, mission2Id: null, memory1Id: null,
  phase: 'idle', unsubscribe: null, simSpeedBefore: 1
};

let ui: { renderGuide: (s: DemoState) => void } | null = null;
const demoTimeouts = new Set<ReturnType<typeof setTimeout>>();
let boostTimer: ReturnType<typeof setInterval> | null = null;

function scheduleDemo(callback: () => void, delay: number) {
  const timer = setTimeout(() => {
    demoTimeouts.delete(timer);
    callback();
  }, delay);
  demoTimeouts.add(timer);
}

function clearDemoTimers() {
  demoTimeouts.forEach(clearTimeout);
  demoTimeouts.clear();
  if (boostTimer) clearInterval(boostTimer);
  boostTimer = null;
}

function persistDemoSession() {
  try {
    if (!st.active) {
      sessionStorage.removeItem(DEMO_SESSION_KEY);
      return;
    }
    const snapshot: PersistedDemoState = {
      step: st.step,
      mission1Id: st.mission1Id,
      mission2Id: st.mission2Id,
      memory1Id: st.memory1Id,
      phase: st.phase,
      simSpeedBefore: st.simSpeedBefore
    };
    sessionStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(snapshot));
  } catch { /* demo remains usable when session storage is unavailable */ }
}

export function setDemoUI(h: { renderGuide: (s: DemoState) => void }) { ui = h; }
export function getDemoState(): DemoState { return st; }
export function demoProgressLabels(): string[] { return DEMO_PROGRESS; }

export function startDemo() {
  if (st.active) return;
  st.active = true;
  st.step = 0;
  st.mission1Id = null;
  st.mission2Id = null;
  st.memory1Id = null;
  st.phase = 'running';
  st.simSpeedBefore = getSettings().simSpeed;
  updateSettings({ simSpeed: Math.max(1, getSettings().simSpeed) });
  persistDemoSession();

  st.unsubscribe = subscribe(() => {
    if (st.active) ui?.renderGuide(st);
  });

  navigate('mission');
  toast('info', 'Demo Mode started', 'Step 1 — assigning R-01 to inspect Warehouse A.');
  scheduleDemo(step1, 700);
}

function step1() {
  if (!st.active) return;
  const occupied = getState().missions.find(m => m.robotId === 'R-01' && (m.status === 'active' || m.status === 'paused'));
  if (occupied) {
    toast('warning', 'R-01 is unavailable', `${occupied.code} must finish before the guided demo can use R-01.`);
    stopDemo('user');
    return;
  }
  st.step = 1;
  const m = createMission({
    robotId: 'R-01',
    type: 'Inspection',
    envId: 'wh-a',
    destinationNode: 'zone-a2',
    destinationName: 'Zone A2',
    priority: 'Normal',
    mode: 'autonomous',
    instructions: 'Demo: inspect all checkpoints and report anomalies.',
    scenarioId: 'obstacle'
  });
  st.mission1Id = m.id;
  st.phase = 'awaiting-m1-complete';
  persistDemoSession();
  startMission(m, 'obstacle');
  navigate(`mission/${m.id}`);
  ui?.renderGuide(st);
}

export function onMissionCompleted(mission: Mission) {
  if (!st.active) return;
  if (st.phase === 'awaiting-m1-complete' && mission.id === st.mission1Id) {
    st.step = 3;
    st.phase = 'awaiting-save';
    persistDemoSession();
    navigate(`missions/${mission.id}`);
    ui?.renderGuide(st);
  } else if (st.phase === 'awaiting-m2-complete' && mission.id === st.mission2Id) {
    st.step = 6;
    st.phase = 'done';
    persistDemoSession();
    navigate(`missions/${mission.id}`);
    ui?.renderGuide(st);
    toast('success', 'Demo complete', 'The full learning loop has run end to end.');
  }
}

export function onExperienceSaved(memoryId: string) {
  if (!st.active || st.phase !== 'awaiting-save') return;
  st.memory1Id = memoryId;
  st.step = 4;
  st.phase = 'running';
  persistDemoSession();
  ui?.renderGuide(st);
  toast('info', 'Demo step 4', 'Memory stored. Starting a second Warehouse A mission.');
  scheduleDemo(step4, 900);
}

function step4() {
  if (!st.active) return;
  st.step = 4;
  patchRobot('R-01', { location: 'Dock Bay' });
  const m = createMission({
    robotId: 'R-01',
    type: 'Inspection',
    envId: 'wh-a',
    destinationNode: 'zone-a2',
    destinationName: 'Zone A2',
    priority: 'Normal',
    mode: 'autonomous',
    instructions: 'Demo: repeat inspection with learned context available.',
    scenarioId: 'clean'
  });
  st.mission2Id = m.id;
  st.phase = 'awaiting-m2-complete';
  persistDemoSession();
  startMission(m, 'clean');
  navigate(`mission/${m.id}`);
  ui?.renderGuide(st);
}

export function demoNextHint(): string {
  switch (st.phase) {
    case 'awaiting-m1-complete': return 'Watch the mission workspace until it completes.';
    case 'awaiting-save': return 'Save the learned experience to long-term memory.';
    case 'awaiting-m2-complete': return 'Watch the second mission complete with learned routing.';
    case 'done': return 'Demo finished — explore Analytics → Memory Impact.';
    default: return '';
  }
}

export function stopDemo(reason: 'user' | 'done' | 'reset' = 'user') {
  const wasActive = st.active;
  st.active = false;
  st.phase = 'idle';
  clearDemoTimers();
  if (st.unsubscribe) { st.unsubscribe(); st.unsubscribe = null; }
  persistDemoSession();
  if (wasActive) {
    updateSettings({ simSpeed: st.simSpeedBefore });
    [st.mission1Id, st.mission2Id].forEach(id => {
      if (!id) return;
      const m = getState().missions.find(x => x.id === id);
      if (m && (m.status === 'active' || m.status === 'paused')) cancelMission(id);
    });
  }
  if (reason === 'user' && wasActive) toast('info', 'Demo Mode exited', 'You can restart it anytime from the sidebar.');
  ui?.renderGuide(st);
}

export function resetDemo() {
  stopDemo('reset');
  resetSimulation();
  resetAllData();
  restoreActiveSimulations();
  st.step = 0;
  st.mission1Id = null;
  st.mission2Id = null;
  st.memory1Id = null;
  st.phase = 'idle';
  persistDemoSession();
  navigate('dashboard');
  ui?.renderGuide(st);
  toast('success', 'Demo reset', 'The initial FleetMinder dataset has been restored.');
}

export function skipToNextPhase() {
  /* Used by the guide's "advance" button when user wants to move faster. */
  if (st.phase === 'awaiting-m1-complete' || st.phase === 'awaiting-m2-complete') {
    const id = st.phase === 'awaiting-m1-complete' ? st.mission1Id : st.mission2Id;
    if (id) {
      const sim = getActiveSim(id);
      if (sim && !sim.finished) {
        /* fast-forward: bump progress so scenario logic fires, then complete */
        simulateBoost(id);
      }
    }
  } else if (st.phase === 'awaiting-save') {
    const m = st.mission1Id ? getState().missions.find(x => x.id === st.mission1Id) : null;
    if (m) {
      const mem = saveExperienceToMemory(m);
      onExperienceSaved(mem.id);
    }
  }
}

function simulateBoost(id: string) {
  if (boostTimer) clearInterval(boostTimer);
  boostTimer = setInterval(() => {
    const m = getState().missions.find(x => x.id === id);
    if (!m || m.status !== 'active') { if (boostTimer) clearInterval(boostTimer); boostTimer = null; return; }
    m.progress = Math.min(99, m.progress + 8);
    const sim = getActiveSim(id);
    if (sim) sim.segProgress = Math.min(99, sim.segProgress + 8);
    if (m.progress >= 99) {
      if (boostTimer) clearInterval(boostTimer); boostTimer = null;
      completeMission(id);
    }
  }, 350);
}

export function isDemoActive(): boolean { return st.active; }

/* Wire completion notifications for demo mode */
export function initDemoHooks() {
  subscribe(() => {
    if (!st.active) return;
    const missions = getState().missions;
    const first = missions.find(m => m.id === st.mission1Id);
    const second = missions.find(m => m.id === st.mission2Id);
    if (st.phase === 'awaiting-m1-complete' && st.step < 2 && first?.events.some(event => event.title === 'Obstacle detected')) {
      st.step = 2;
      persistDemoSession();
      ui?.renderGuide(st);
    }
    if (st.phase === 'awaiting-m2-complete' && st.step < 5 && second?.events.some(event => event.kind === 'decision' && event.title.startsWith('Preemptive route selected'))) {
      st.step = 5;
      persistDemoSession();
      ui?.renderGuide(st);
    }
    if (st.phase === 'awaiting-m1-complete' && first?.status === 'completed') onMissionCompleted(first);
    if (st.phase === 'awaiting-m2-complete' && second?.status === 'completed') onMissionCompleted(second);
  });
  restoreDemoSession();
}

function restoreDemoSession() {
  let saved: PersistedDemoState | null = null;
  try {
    const raw = sessionStorage.getItem(DEMO_SESSION_KEY);
    if (raw) saved = JSON.parse(raw) as PersistedDemoState;
  } catch { /* ignore unavailable or malformed session state */ }
  if (!saved || !['running', 'awaiting-m1-complete', 'awaiting-save', 'awaiting-m2-complete', 'done'].includes(saved.phase)) return;

  st.active = true;
  st.step = saved.step;
  st.mission1Id = saved.mission1Id;
  st.mission2Id = saved.mission2Id;
  st.memory1Id = saved.memory1Id;
  st.phase = saved.phase;
  st.simSpeedBefore = saved.simSpeedBefore;
  st.unsubscribe = subscribe(() => { if (st.active) ui?.renderGuide(st); });
  updateSettings({ simSpeed: Math.max(1, getSettings().simSpeed) });

  const mission1 = st.mission1Id ? getState().missions.find(m => m.id === st.mission1Id) : undefined;
  const mission2 = st.mission2Id ? getState().missions.find(m => m.id === st.mission2Id) : undefined;
  if ((st.mission1Id && !mission1) || (st.mission2Id && !mission2)) {
    stopDemo('reset');
    return;
  }

  if (st.phase === 'awaiting-m1-complete' && mission1) {
    if (mission1.status === 'completed') onMissionCompleted(mission1);
    else navigate(`mission/${mission1.id}`);
  } else if (st.phase === 'awaiting-save' && mission1) {
    navigate(`missions/${mission1.id}`);
  } else if (st.phase === 'awaiting-m2-complete' && mission2) {
    if (mission2.status === 'completed') onMissionCompleted(mission2);
    else navigate(`mission/${mission2.id}`);
  } else if (st.phase === 'done' && mission2) {
    navigate(`missions/${mission2.id}`);
  } else if (st.phase === 'running') {
    if (!mission1) scheduleDemo(step1, 0);
    else if (st.memory1Id && !mission2) scheduleDemo(step4, 0);
    else navigate(`mission/${mission1.id}`);
  }
}
