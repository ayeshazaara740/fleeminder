import type {
  Robot, Mission, MissionEvent, Memory, Alert, MaintenanceRecord, TelemetrySample, EnvId,
  MissionStatus, MemoryCategory, MissionType, Priority, MemoryEvolutionEntry
} from './types';
import { ENVIRONMENTS, envById } from './environments';

/* Deterministic PRNG so every app load produces the same demo dataset. */
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

let rnd = mulberry32(20260929);
const pick = <T>(arr: T[]): T => arr[Math.floor(rnd() * arr.length)];
const ri = (min: number, max: number) => Math.floor(min + rnd() * (max - min + 1));

const MISSION_TYPES: MissionType[] = ['Inspection', 'Delivery', 'Patrol', 'Mapping', 'Environmental Monitoring', 'Search', 'Infrastructure Check'];
const DEST: Record<EnvId, { node: string; name: string }[]> = {
  'wh-a': [
    { node: 'zone-a1', name: 'Zone A1' }, { node: 'zone-a2', name: 'Zone A2' },
    { node: 'junction-d', name: 'Junction D' }, { node: 'corridor-b', name: 'Corridor B' }
  ],
  'industrial': [
    { node: 'press-bay', name: 'Press Bay' }, { node: 'qa-cell', name: 'QA Cell' },
    { node: 'chem-store', name: 'Chemical Store' }, { node: 'assembly', name: 'Assembly Line' }
  ],
  'outdoor': [
    { node: 'substation', name: 'Substation' }, { node: 'gate-e', name: 'East Gate' },
    { node: 'tank-farm', name: 'Tank Farm' }, { node: 'perim-n', name: 'North Perimeter' }
  ]
};

/* Shortest path (BFS) — edges are unweighted; used for planned routes. */
export function bfsPath(envId: EnvId, from: string, to: string): string[] {
  const env = envById(envId);
  const adj = new Map<string, string[]>();
  env.edges.forEach(e => {
    if (!adj.has(e.a)) adj.set(e.a, []);
    if (!adj.has(e.b)) adj.set(e.b, []);
    adj.get(e.a)!.push(e.b);
    adj.get(e.b)!.push(e.a);
  });
  const prev = new Map<string, string | null>([[from, null]]);
  const q = [from];
  while (q.length) {
    const cur = q.shift()!;
    if (cur === to) break;
    for (const nb of adj.get(cur) ?? []) {
      if (!prev.has(nb)) { prev.set(nb, cur); q.push(nb); }
    }
  }
  if (!prev.has(to)) return [from];
  const path: string[] = [];
  let cur: string | null = to;
  while (cur) { path.unshift(cur); cur = prev.get(cur) ?? null; }
  return path;
}

export function altRouteAvoiding(envId: EnvId, from: string, to: string, avoid: string): string[] {
  const env = envById(envId);
  const adj = new Map<string, string[]>();
  env.edges.forEach(e => {
    if (e.a === avoid || e.b === avoid) return;
    if (!adj.has(e.a)) adj.set(e.a, []);
    if (!adj.has(e.b)) adj.set(e.b, []);
    adj.get(e.a)!.push(e.b);
    adj.get(e.b)!.push(e.a);
  });
  const prev = new Map<string, string | null>([[from, null]]);
  const q = [from];
  while (q.length) {
    const cur = q.shift()!;
    if (cur === to) break;
    for (const nb of adj.get(cur) ?? []) {
      if (!prev.has(nb)) { prev.set(nb, cur); q.push(nb); }
    }
  }
  if (!prev.has(to)) return bfsPath(envId, from, to);
  const path: string[] = [];
  let cur: string | null = to;
  while (cur) { path.unshift(cur); cur = prev.get(cur) ?? null; }
  return path;
}

export function nodeXY(envId: EnvId, nodeId: string): { x: number; y: number } {
  const env = envById(envId);
  const n = env.nodes.find(n => n.id === nodeId);
  if (!n) return { x: 50, y: 50 };
  return { x: n.x, y: n.y };
}

export function routeDistance(envId: EnvId, path: string[]): number {
  let d = 0;
  for (let i = 1; i < path.length; i++) {
    const a = nodeXY(envId, path[i - 1]);
    const b = nodeXY(envId, path[i]);
    d += Math.hypot(a.x - b.x, a.y - b.y);
  }
  return d;
}

/* ---------------- Robots ---------------- */

function makeRobots(): Robot[] {
  const defs: Array<[string, string, EnvId, string]> = [
    ['R-01', 'Atlas', 'wh-a', 'Corridor A'],
    ['R-02', 'Nova', 'wh-a', 'Zone A2'],
    ['R-03', 'Scout', 'industrial', 'QA Cell'],
    ['R-04', 'Echo', 'industrial', 'South Hall'],
    ['R-05', 'Rover', 'outdoor', 'Base Station']
  ];
  const statuses: Robot['status'][] = ['idle', 'idle', 'charging', 'idle', 'online'];
  return defs.map((d, i) => {
    const [id, name, envId, loc] = d;
    const missionCount = [142, 118, 96, 87, 64][i];
    const succ = [136, 111, 89, 78, 55][i];
    const xy = nodeXY(envId, loc === 'Corridor A' ? 'corridor-a' : loc === 'Zone A2' ? 'zone-a2' : loc === 'QA Cell' ? 'qa-cell' : loc === 'South Hall' ? 'hall-s' : 'base');
    return {
      id, name, model: ['MX-7 Quadruped', 'MX-7 Quadruped', 'TR-4 Wheeled', 'TR-4 Wheeled', 'AO-9 Tracked'][i],
      status: statuses[i],
      battery: [78, 92, 24, 61, 85][i],
      location: loc,
      envId,
      signal: [96, 99, 58, 88, 91][i],
      temperature: [38, 35, 44, 41, 36][i],
      speed: 0,
      missionCount,
      successCount: succ,
      lastMaintenance: new Date(Date.now() - [9, 21, 4, 35, 15][i] * 86400000).toISOString(),
      healthScore: [96, 98, 74, 90, 93][i],
      lastActivity: new Date(Date.now() - ri(1, 40) * 60000).toISOString(),
      currentMissionId: null,
      knownStrengths: [],
      knownIssues: [],
      learnedPreferences: [],
      x: xy.x, y: xy.y
    };
  });
}

/* ---------------- Missions ---------------- */

let missionSeq = 1;
let eventSeq = 1;

function makeEvent(missionId: string, minsAfterStart: number, kind: MissionEvent['kind'], severity: MissionEvent['severity'], title: string, detail?: string, atNode?: string): MissionEvent {
  return { id: `ev-${eventSeq++}`, missionId, ts: 0, kind, severity, title, detail, atNode };
}

function seedMemories(): Memory[] {
  const now = Date.now();
  const day = 86400000;
  const memories: Memory[] = [];

  const add = (
    id: string, robotId: string, missionCode: string, category: MemoryCategory, text: string,
    confidence: number, relevance: number, createdDays: number, retrievedDays: number | null,
    retCount: number, envId: EnvId, tags: string[],
    evolution?: MemoryEvolutionEntry[]
  ) => {
    memories.push({
      id, robotId, missionId: 'seed', missionCode, category, text, confidence, relevance,
      createdAt: now - createdDays * day,
      lastRetrievedAt: retrievedDays === null ? null : now - retrievedDays * day,
      retrievalCount: retCount, envId, tags, origin: 'simulated', supersededBy: null, evolution
    });
  };

  add('M-012', 'R-01', 'MS-007', 'Obstacles',
    'Pallet left across Corridor B during early-morning shift change. Required manual abort until cleared by staff.',
    0.72, 0.66, 58, 6, 11, 'wh-a', ['corridor-b', 'obstacle', 'shift-change'],
    [
      { label: 'First sighting', ts: now - 58 * day, text: 'Corridor B occasionally blocked.', confidence: 0.55 },
      { label: 'Pattern detected', ts: now - 31 * day, text: 'Corridor B frequently blocked during afternoon operations.', confidence: 0.74 },
      { label: 'Current policy', ts: now - 12 * day, text: 'Prefer Corridor C for Warehouse A missions after 13:00.', confidence: 0.88 }
    ]);

  add('M-031', 'R-01', 'MS-019', 'Successful Strategies',
    'Rerouted from Corridor B to Corridor C via Junction D; completed Warehouse A inspection without delay.',
    0.93, 0.81, 44, 2, 18, 'wh-a', ['corridor-c', 'reroute', 'warehouse-a']);

  add('M-087', 'R-01', 'MS-033', 'Navigation',
    'Corridor C provides a clear alternative route between Dock Bay and Zone A2 when Corridor B is obstructed.',
    0.9, 0.87, 29, 1, 22, 'wh-a', ['corridor-c', 'alternate-route', 'warehouse-a']);

  add('M-058', 'R-02', 'MS-024', 'Battery',
    'R-02 battery drain increases ~18% when Mapping missions exceed 40 minutes; schedule charge before long mapping tasks.',
    0.81, 0.7, 37, 3, 9, 'wh-a', ['battery', 'mapping']);

  add('M-064', 'R-03', 'MS-026', 'Environment',
    'Coolant spill near South Hall junction causes wheel slip; slow to 0.6 m/s and route via North Hall when possible.',
    0.85, 0.76, 33, 2, 14, 'industrial', ['coolant', 'south-hall', 'slip-hazard']);

  add('M-093', 'R-04', 'MS-036', 'Failures',
    'Delivery to Chemical Store failed when Assembly Line conveyor blocked the only planned approach; mission aborted at 70%.',
    0.88, 0.63, 26, 8, 6, 'industrial', ['assembly', 'blocked', 'delivery-failure']);

  add('M-101', 'R-05', 'MS-038', 'Navigation',
    'West Perimeter debris after storms; debris field forces 2-3 minute detour via Tank Farm.',
    0.79, 0.58, 22, 5, 7, 'outdoor', ['debris', 'perimeter', 'weather']);

  add('M-104', 'R-01', 'MS-041', 'Obstacles',
    'Obstacle detected in Corridor B (pallet stack). Corridor C used as alternative; no further issues.',
    0.94, 0.92, 18, 0, 26, 'wh-a', ['corridor-b', 'obstacle', 'corridor-c', 'reroute']);

  add('M-118', 'R-01', 'MS-044', 'Mission Strategy',
    'For Warehouse A full inspections, start at Zone A1 then Zone A2 via Junction D to minimise backtracking.',
    0.86, 0.68, 14, 4, 8, 'wh-a', ['inspection-order', 'efficiency']);

  add('M-127', 'R-03', 'MS-047', 'Safety',
    'Press Bay safety interlock triggers robot pause; wait for operator reset rather than rerouting mid-mission.',
    0.91, 0.6, 11, 9, 5, 'industrial', ['press-bay', 'interlock', 'safety']);

  add('M-133', 'R-02', 'MS-049', 'Operator Preferences',
    'Operator prefers progress pings at each checkpoint instead of continuous streaming during night shifts.',
    0.75, 0.42, 9, null, 2, 'wh-a', ['notifications', 'night-shift']);

  add('M-140', 'R-05', 'MS-052', 'Environment',
    'Mud patch near Tank Farm after rain reduces traction; approach substation via North Perimeter in wet conditions.',
    0.82, 0.66, 6, 1, 9, 'outdoor', ['mud', 'traction', 'rain']);

  add('M-146', 'R-04', 'MS-055', 'Battery',
    'R-04 completed Delivery at critical battery (11%); dock at Charge Station before accepting new missions under 15%.',
    0.77, 0.55, 4, 2, 4, 'industrial', ['battery', 'charging']);

  add('M-151', 'R-01', 'MS-057', 'Obstacles',
    'Corridor C was blocked by a conveyor unit during Mission 21; reroute was required back through Corridor B.',
    0.83, 0.71, 2, null, 1, 'wh-a', ['corridor-c', 'blocked', 'conflict-candidate']);

  add('M-155', 'R-02', 'MS-059', 'Navigation',
    'Rack Row 2 aisle too narrow during restock hours; pass behind Junction D instead.',
    0.8, 0.61, 1, null, 1, 'wh-a', ['racks', 'restock']);

  return memories;
}

function seedMissions(robots: Robot[], memories: Memory[]): Mission[] {
  const missions: Mission[] = [];
  const now = Date.now();
  const hour = 3600000;

  for (let i = 0; i < 24; i++) {
    const robot = robots[i === 0 ? robots.length - 1 : i % robots.length];
    const envId = robot.envId;
    const env = envById(envId);
    const type = pick(MISSION_TYPES);
    const dest = pick(DEST[envId]);
    const startAgo = (24 - i) * (2 + rnd() * 5) * hour;
    const startedAt = now - startAgo;
    const status: MissionStatus = i === 0 ? 'active' : i === 3 ? 'failed' : i === 7 ? 'failed' : i === 11 ? 'cancelled' : 'completed';
    const nodes = env.nodes.map(n => n.id);
    const from = robot.envId === 'wh-a' ? 'dock' : robot.envId === 'industrial' ? 'gate' : 'base';
    const planned = bfsPath(envId, from, dest.node);
    const durMin = 18 + Math.floor(rnd() * 40);
    const outcome = status === 'completed' ? (rnd() > 0.12 ? 'success' : 'partial') : status === 'failed' ? 'failed' : undefined;
    const evs: MissionEvent[] = [
      makeEvent(`m-${missionSeq}`, 0, 'system', 'info', 'Mission created', `Planned ${type.toLowerCase()} route to ${dest.name}`)
    ];
    if (status !== 'cancelled') {
      evs.push(makeEvent(`m-${missionSeq}`, 0.5, 'agent', 'info', 'Route planned', `${planned.length - 1} legs via ${planned.slice(1, -1).map(n => env.nodes.find(nn => nn.id === n)?.name ?? n).join(', ') || 'direct path'}`));
      evs.push(makeEvent(`m-${missionSeq}`, 1, 'sim', 'info', 'Mission started', `Robot departed ${env.nodes.find(n => n.id === from)?.name}`));
    }
    if (status === 'completed' || status === 'failed') {
      evs.push(makeEvent(`m-${missionSeq}`, durMin * 0.4, 'sim', rnd() > 0.5 ? 'warning' : 'info', pick(['Checkpoint reached', 'Speed reduced near obstacle', 'Temporary signal drop', 'Temperature elevated during transit'])));
      if (status === 'failed') {
        evs.push(makeEvent(`m-${missionSeq}`, durMin * 0.7, 'sim', 'critical', pick(['Obstacle blocked planned route', 'Battery below critical threshold', 'Communication lost for 4 minutes']), outcome === 'failed' ? 'Mission could not continue safely' : undefined));
        evs.push(makeEvent(`m-${missionSeq}`, durMin * 0.8, 'agent', 'warning', 'Abort recommended', 'No safe alternative available within mission constraints'));
      }
      evs.push(makeEvent(`m-${missionSeq}`, durMin, status === 'completed' ? 'system' : 'system', status === 'completed' ? 'success' : 'critical', status === 'completed' ? 'Mission completed' : 'Mission failed'));
    }
    evs.forEach(e => { e.ts = startedAt + e.id.length * 0; });

    const memR = memories.filter(m => m.robotId === robot.id && m.envId === envId);
    const memRet = memR.slice(0, Math.min(2, memR.length)).map(m => m.id);
    const problems = status === 'failed' ? [evs[evs.length - 2]?.title ?? 'Route blocked'] : rnd() > 0.6 ? ['Minor delay — temporary signal drop'] : [];

    missions.push({
      id: `m-${missionSeq}`,
      code: `MS-${String(missionSeq).padStart(3, '0')}`,
      robotId: robot.id,
      type,
      envId,
      destinationNode: dest.node,
      destinationName: dest.name,
      priority: pick(['Low', 'Normal', 'Normal', 'High', 'Critical'] as Priority[]),
      mode: rnd() > 0.2 ? 'autonomous' : 'manual',
      instructions: pick([
        'Inspect all checkpoints and report anomalies with photos.',
        'Deliver spare parts crate to destination, confirm handover scan.',
        'Patrol the full route twice, log any open doors or leaks.',
        'Build a fresh occupancy map of the destination area.',
        'Record temperature and humidity at each waypoint.'
      ]),
      status,
      outcome,
      progress: status === 'completed' ? 100 : status === 'active' ? 42 : status === 'failed' ? ri(55, 80) : 0,
      createdAt: startedAt - 8 * 60000,
      startedAt,
      endedAt: status === 'completed' || status === 'failed' ? startedAt + durMin * 60000 : null,
      durationSec: durMin * 60,
      events: evs,
      route: { envId, planned, current: planned, pointIndex: planned.length - 1 },
      decisions: [],
      memoryIdsRetrieved: memRet,
      memoryIdsCreated: status === 'completed' && rnd() > 0.45 ? [`M-${100 + i}`] : [],
      problems,
      distanceM: Math.round(routeDistance(envId, planned) * 1.6),
      plannedVsActualNote: undefined
    });
    missionSeq++;
    void nodes;
  }

  /* Give recent key missions explicit memory linkups for demo coherence */
  const m104 = missions.find(x => x.code === 'MS-019');
  if (m104) {
    if (!m104.memoryIdsRetrieved.includes('M-012')) m104.memoryIdsRetrieved.push('M-012');
    if (!m104.memoryIdsCreated.includes('M-031')) m104.memoryIdsCreated.push('M-031');
  }
  const mRecent = missions[missions.length - 6];
  if (mRecent) {
    if (!mRecent.memoryIdsRetrieved.includes('M-087')) mRecent.memoryIdsRetrieved.push('M-087');
    if (!mRecent.memoryIdsCreated.includes('M-104')) mRecent.memoryIdsCreated.push('M-104');
  }
  return missions;
}

function seedAlerts(): Alert[] {
  const now = Date.now();
  const mk = (minsAgo: number, severity: Alert['severity'], title: string, detail: string, robotId: string | undefined, source: Alert['source']): Alert => ({
    id: `al-${minsAgo}-${title.replace(/\W+/g, '').slice(0, 12)}`,
    ts: now - minsAgo * 60000, severity, title, detail, robotId, source, reviewed: minsAgo > 300
  });
  return [
    mk(4, 'warning', 'Low battery — R-03', 'Battery at 24%, below the 30% operating threshold. Charging recommended.', 'R-03', 'telemetry'),
    mk(12, 'info', 'Memory retrieved', 'Memory M-104 (Corridor B obstacle) recalled for Warehouse A mission planning.', 'R-01', 'memory'),
    mk(26, 'success', 'Mission completed — MS-059', 'R-02 finished Rack Row restock navigation.', 'R-02', 'mission'),
    mk(47, 'critical', 'Obstacle detected — Corridor B', 'R-01 detected a pallet blocking Corridor B during inspection.', 'R-01', 'mission'),
    mk(58, 'warning', 'Communication warning — R-05', 'Signal strength dropped to 41% near the drainage basin.', 'R-05', 'telemetry'),
    mk(95, 'info', 'Route changed', 'R-01 rerouted via Corridor C after memory-assisted evaluation.', 'R-01', 'mission'),
    mk(140, 'warning', 'Memory conflict detected', 'M-087 (Corridor C preferred) conflicts with M-151 (Corridor C blocked during Mission 21).', undefined, 'memory'),
    mk(220, 'critical', 'Robot offline — R-05', 'Lost contact for 6 minutes during storm cells; reconnected automatically.', 'R-05', 'system'),
    mk(300, 'success', 'Mission completed — MS-055', 'R-04 delivered parts to Chemical Store via Assembly Line.', 'R-04', 'mission'),
    mk(430, 'warning', 'Maintenance required — R-03', 'Left wheel encoder noise above baseline; inspect within 5 missions.', 'R-03', 'system')
  ];
}

function seedMaintenance(): MaintenanceRecord[] {
  const now = Date.now();
  const recs: MaintenanceRecord[] = [];
  const defs: Array<[string, number, string, string]> = [
    ['R-01', 9, 'Scheduled service', 'Full diagnostics, wheel alignment, sensor calibration.'],
    ['R-02', 21, 'Firmware update', 'Upgraded navigation stack to v4.2.1.'],
    ['R-03', 4, 'Battery replacement', 'Installed new 52Ah pack after capacity test at 71%.'],
    ['R-04', 35, 'Scheduled service', 'Lidar window cleaned; encoder noise within limits.'],
    ['R-05', 15, 'Track inspection', 'Replaced left track tensioner after outdoor missions.']
  ];
  defs.forEach((d, i) => recs.push({ id: `pm-${i + 1}`, robotId: d[0], ts: now - d[1] * 86400000, kind: d[2], notes: d[3] }));
  return recs;
}

function seedTelemetry(robots: Robot[]): Record<string, TelemetrySample[]> {
  const out: Record<string, TelemetrySample[]> = {};
  robots.forEach(r => {
    const samples: TelemetrySample[] = [];
    let batt = Math.max(12, r.battery - 6);
    for (let i = 24; i >= 0; i--) {
      batt = Math.min(100, batt + (r.status === 'charging' ? 0.6 : -0.15) + rnd() * 0.2);
      samples.push({
        ts: Date.now() - i * 10 * 60000,
        battery: Math.round(batt * 10) / 10,
        speed: r.status === 'executing' ? 0.6 + rnd() * 0.6 : 0,
        temperature: r.temperature - 2 + rnd() * 4,
        signal: Math.max(20, Math.min(99, r.signal - 8 + rnd() * 16)),
        obstacleDistance: r.status === 'executing' ? 0.4 + rnd() * 3 : null,
        x: r.x, y: r.y
      });
    }
    out[r.id] = samples;
  });
  return out;
}

export function buildSeedData() {
  rnd = mulberry32(20260929);
  missionSeq = 1;
  eventSeq = 1;
  const robots = makeRobots();
  const memories = seedMemories();
  const missions = seedMissions(robots, memories);
  const alerts = seedAlerts();
  const maintenance = seedMaintenance();
  const telemetry = seedTelemetry(robots);

  /* Attach the active mission to its robot */
  const active = missions.find(m => m.status === 'active');
  if (active) {
    const r = robots.find(x => x.id === active.robotId);
    if (r) { r.status = 'executing'; r.currentMissionId = active.id; }
  }

  /* Derived robot profiles from historical data */
  robots.forEach(r => {
    const ms = missions.filter(m => m.robotId === r.id);
    r.missionCount = Math.max(r.missionCount, ms.length + 40);
    if (r.id === 'R-01') {
      r.knownStrengths = ['Warehouse inspection', 'Long-distance navigation', 'Obstacle rerouting'];
      r.knownIssues = ['Battery degradation on missions > 60 min', 'Occasional lidar sensor warning'];
      r.learnedPreferences = ['Corridor C preferred for Warehouse A', 'Charging recommended below 20%'];
    } else if (r.id === 'R-03') {
      r.knownStrengths = ['Industrial patrols', 'Low-light inspection'];
      r.knownIssues = ['Wheel slip near coolant spills', 'Battery drains quickly on long routes'];
      r.learnedPreferences = ['Slow to 0.6 m/s near South Hall spill zone'];
    } else if (r.id === 'R-02') {
      r.knownStrengths = ['Mapping missions', 'Stable telemetry reporting'];
      r.knownIssues = ['Higher battery drain on Mapping > 40 min'];
      r.learnedPreferences = ['Checkpoint pings instead of continuous streaming at night'];
    } else if (r.id === 'R-04') {
      r.knownStrengths = ['Delivery handling', 'Assembly Line navigation'];
      r.knownIssues = ['Arrives at low battery on long deliveries'];
      r.learnedPreferences = ['Dock to charge before accepting missions under 15% battery'];
    } else {
      r.knownStrengths = ['Outdoor perimeter patrols', 'All-weather tracking'];
      r.knownIssues = ['Signal drops near drainage basin'];
      r.learnedPreferences = ['Use North Perimeter route in wet conditions'];
    }
  });

  return { robots, missions, memories, alerts, maintenance, telemetry, seq: { mission: missionSeq, memory: 200 } };
}
