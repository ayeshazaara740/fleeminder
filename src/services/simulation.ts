import type { Mission, MissionEvent, Robot, TelemetrySample, EnvId, Priority, MissionType } from '../data/types';
import {
  getState, getMission, getRobot, mutate, patchRobot, pushMissionEvent, addDecision, addAlert, flushPersistence,
  addTelemetrySample, getSettings, addNotification, bumpMissionSeq, nextMissionCode
} from '../data/store';
import { envById } from '../data/environments';
import { bfsPath, altRouteAvoiding, nodeXY, routeDistance, mulberry32 } from '../data/seed';
import { recall, createMemory, markRetrieved } from './memory';

/* Simulation Engine — advances active missions on a fixed tick.
   Deterministic scenario logic + controlled randomness for ambience. */

export interface SimScenario {
  id: string;
  name: string;
  desc: string;
}

export const SCENARIOS: SimScenario[] = [
  { id: 'clean', name: 'Scenario 1 — Clean run', desc: 'Successful mission with no disruptions. Baseline behavior.' },
  { id: 'obstacle', name: 'Scenario 2 — Obstacle + memory reroute', desc: 'Obstacle appears mid-route. Memory-assisted rerouting is demonstrated.' },
  { id: 'battery', name: 'Scenario 3 — Low battery', desc: 'Battery drains faster; low-battery warnings and conservative speed.' },
  { id: 'comms', name: 'Scenario 4 — Communication warning', desc: 'Signal degrades mid-route; connectivity events and delayed reporting.' },
  { id: 'conflict', name: 'Scenario 5 — Conflicting history', desc: 'Historical memories disagree; the agent explains how it resolves them.' }
];

export interface ActiveSim {
  missionId: string;
  scenarioId: string;
  /** route node ids remaining (including current position node) */
  path: string[];
  segIndex: number;
  segProgress: number;
  speedFactor: number;
  obstacleFired: boolean;
  batteryFired: boolean;
  commsFired: boolean;
  conflictHandled: boolean;
  rerouted: boolean;
  memoryUsed: boolean;
  tickCount: number;
  paused: boolean;
  finished: boolean;
  envId: EnvId;
  robotId: string;
  plannedPath: string[];
  problemLog: string[];
}

const active = new Map<string, ActiveSim>();
let timer: ReturnType<typeof setInterval> | null = null;
const rndAmbient = mulberry32(4242);

export function getActiveSim(missionId: string): ActiveSim | undefined {
  return active.get(missionId);
}

export function isSimulating(missionId: string): boolean {
  const s = active.get(missionId);
  return !!s && !s.finished;
}

export function listActiveSims(): ActiveSim[] {
  return Array.from(active.values());
}

export function resetSimulation() {
  if (timer) clearInterval(timer);
  timer = null;
  active.clear();
}

export function restoreActiveSimulations() {
  const missions = getState().missions.filter(m => m.status === 'active' || m.status === 'paused');
  missions.forEach(mission => {
    if (active.has(mission.id)) return;
    const path = mission.route?.current ?? [];
    if (!path.length) return;
    const segmentCount = Math.max(1, path.length - 1);
    const events = mission.events;
    active.set(mission.id, {
      missionId: mission.id,
      scenarioId: mission.scenarioId ?? 'clean',
      path: [...path],
      plannedPath: [...(mission.route?.planned ?? path)],
      segIndex: Math.min(segmentCount - 1, Math.floor((mission.progress / 100) * segmentCount)),
      segProgress: Math.min(99.4, mission.progress),
      speedFactor: events.some(event => event.title === 'Battery drain above forecast') ? 0.8 : 1,
      obstacleFired: events.some(event => event.title === 'Obstacle detected'),
      batteryFired: events.some(event => event.title === 'Battery drain above forecast'),
      commsFired: events.some(event => event.title === 'Signal degradation'),
      conflictHandled: events.some(event => event.title === 'Conflicting historical experiences detected'),
      rerouted: path.join('|') !== (mission.route?.planned ?? path).join('|'),
      memoryUsed: mission.memoryIdsRetrieved.length > 0,
      tickCount: 0,
      paused: mission.status === 'paused',
      finished: false,
      envId: mission.envId,
      robotId: mission.robotId,
      problemLog: [...mission.problems]
    });
  });
  if (active.size) ensureTimer();
}

function ensureTimer() {
  if (timer) return;
  timer = setInterval(tick, 900);
}

function stopTimerIfIdle() {
  if (active.size === 0 && timer) {
    clearInterval(timer);
    timer = null;
  }
}

/* ---------------- Mission creation ---------------- */

export function createMission(input: {
  robotId: string;
  type: MissionType;
  envId: EnvId;
  destinationNode: string;
  destinationName: string;
  priority: Priority;
  mode: 'autonomous' | 'manual';
  instructions: string;
  scenarioId: string;
}): Mission {
  const robot = getRobot(input.robotId);
  if (!robot) throw new Error('Robot not found');
  const code = nextMissionCode();
  const mission: Mission = {
    id: `m-${code.toLowerCase()}-${Date.now() % 100000}`,
    code,
    robotId: input.robotId,
    type: input.type,
    envId: input.envId,
    destinationNode: input.destinationNode,
    destinationName: input.destinationName,
    priority: input.priority,
    mode: input.mode,
    instructions: input.instructions,
    status: 'queued',
    progress: 0,
    createdAt: Date.now(),
    startedAt: null,
    endedAt: null,
    durationSec: 0,
    events: [],
    route: null,
    decisions: [],
    memoryIdsRetrieved: [],
    memoryIdsCreated: [],
    problems: [],
    distanceM: 0,
    scenarioId: input.scenarioId
  };
  mutate(s => {
    s.missions.unshift(mission);
    s.seqMission++;
  });
  return mission;
}

/* ---------------- Planning phase (agent) ---------------- */

export function planMission(mission: Mission): string[] {
  const env = envById(mission.envId);
  const from = robotHomeNode(mission.robotId, mission.envId);
  const planned = bfsPath(mission.envId, from, mission.destinationNode);
  const settings = getSettings();
  const sim = active.get(mission.id);

  pushMissionEvent(mission.id, {
    ts: Date.now(), kind: 'system', severity: 'info',
    title: 'Mission received',
    detail: `${mission.type} to ${mission.destinationName} • Priority: ${mission.priority} • Mode: ${mission.mode}`
  });
  pushMissionEvent(mission.id, {
    ts: Date.now() + 1, kind: 'agent', severity: 'info',
    title: `Robot ${mission.robotId} selected`,
    detail: 'Mission parameters validated against fleet availability.'
  });
  pushMissionEvent(mission.id, {
    ts: Date.now() + 2, kind: 'agent', severity: 'info',
    title: 'Destination analyzed',
    detail: `${env.name} → ${env.nodes.find(n => n.id === mission.destinationNode)?.name ?? mission.destinationNode}. Planned distance ${Math.round(routeDistance(mission.envId, planned) * 1.6)} m.`
  });

  /* --- memory recall during planning --- */
  if (settings.memoryRecallEnabled) {
    pushMissionEvent(mission.id, {
      ts: Date.now() + 3, kind: 'agent', severity: 'info',
      title: 'Searching previous mission experiences…'
    });
    const res = recall({
      robotId: mission.robotId,
      envId: mission.envId,
      destinationNode: mission.destinationNode,
      missionType: mission.type,
      text: `${mission.type} ${mission.destinationName} ${env.name}`,
      limit: 4
    });
    markRetrieved(res.hits.map(h => h.memory.id));

    if (res.hits.length) {
      pushMissionEvent(mission.id, {
        ts: Date.now() + 4, kind: 'memory', severity: 'info',
        title: `${res.hits.length} relevant experience${res.hits.length > 1 ? 's' : ''} found`,
        detail: res.hits.map(h => `${h.memory.id} · ${(h.score * 100).toFixed(0)}% relevance — ${h.memory.text}`).join('\n'),
        memoryIds: res.hits.map(h => h.memory.id)
      });
      mission.memoryIdsRetrieved.push(...res.hits.filter(h => !mission.memoryIdsRetrieved.includes(h.memory.id)).map(h => h.memory.id));

      /* Associate a hazard with the nearby node name, not every node in a route description. */
      const riskTerms = /blocked|obstruct(?:ed|ion)?|obstacle|slip|debris|spill|pallet|hazard/g;
      const riskForMemory = (text: string) => {
        const sentences = text.toLowerCase().split(/[.!?;\n]+/);
        return planned.find(nodeId => {
          const name = (env.nodes.find(node => node.id === nodeId)?.name ?? nodeId).toLowerCase();
          return sentences.some(sentence => {
            const nameIndex = sentence.indexOf(name);
            return nameIndex >= 0 && Array.from(sentence.matchAll(riskTerms))
              .some(match => Math.abs(nameIndex - (match.index ?? 0)) <= 40);
          });
        });
      };
      const riskyMatch = res.hits
        .map(hit => ({ hit, blockedNode: riskForMemory(hit.memory.text) }))
        .find(match => match.blockedNode);
      const risky = riskyMatch?.hit;

      /* Scenario note: the 'obstacle' scenario intentionally keeps the original plan
         so the reactive obstacle→memory→reroute arc can be demonstrated live. */
      if (risky && settings.agentAutoReroute && mission.scenarioId !== 'obstacle') {
        if (risky.score < settings.agentConfidenceThreshold) {
          pushMissionEvent(mission.id, {
            ts: Date.now() + 5, kind: 'agent', severity: 'warning',
            title: 'Memory confidence below route threshold',
            detail: `${risky.memory.id} scored ${(risky.score * 100).toFixed(0)}% simulated relevance, below the configured ${(settings.agentConfidenceThreshold * 100).toFixed(0)}% threshold. The agent will verify conditions before rerouting.`,
            memoryIds: [risky.memory.id]
          });
        }
      }

      if (risky && settings.agentAutoReroute && mission.scenarioId !== 'obstacle' && risky.score >= settings.agentConfidenceThreshold) {
        /* find the risky node on our path and reroute around it */
        const blockedNode = riskyMatch?.blockedNode;
        if (blockedNode && blockedNode !== mission.destinationNode && blockedNode !== from) {
          const alt = altRouteAvoiding(mission.envId, from, mission.destinationNode, blockedNode);
          const altNames = alt.map(id => env.nodes.find(n => n.id === id)?.name ?? id);
          const plannedNames = planned.map(id => env.nodes.find(n => n.id === id)?.name ?? id);
          const avoided = plannedNames.filter(n => !altNames.includes(n));
          if (avoided.length) {
            pushMissionEvent(mission.id, {
              ts: Date.now() + 5, kind: 'agent', severity: 'warning',
              title: `${env.nodes.find(n => n.id === blockedNode)?.name ?? blockedNode} identified as previous risk`,
              detail: `Memory ${risky.memory.id}: “${risky.memory.text}”`,
              memoryIds: [risky.memory.id]
            });
            pushMissionEvent(mission.id, {
              ts: Date.now() + 6, kind: 'decision', severity: 'success',
              title: `Preemptive route selected: ${altNames.filter(n => !plannedNames.includes(n)).join(', ') || 'alternative path'}`,
              detail: `Agent is using previous experience to avoid ${avoided.join(', ')} before the obstacle is encountered.`
            });
            addDecision({
              missionId: mission.id, ts: Date.now(), phase: 'planning',
              decision: `Route via ${altNames.join(' → ')} avoiding ${avoided.join(', ')}`,
              rationale: `Memory ${risky.memory.id} reports a prior obstruction on the originally planned path. Confidence ${(risky.score * 100).toFixed(0)}%.`,
              sourceMemories: [risky.memory.id],
              confidence: risky.score,
              outcome: 'Applied during planning'
            });
            planned.length = 0;
            planned.push(...alt);
            if (sim) { sim.rerouted = true; sim.memoryUsed = true; sim.path = [...alt]; }
          }
        }
      }
    } else {
      pushMissionEvent(mission.id, {
        ts: Date.now() + 4, kind: 'memory', severity: 'info',
        title: 'No strongly relevant experiences found',
        detail: 'The agent will build fresh experience during this mission.'
      });
    }
  } else {
    pushMissionEvent(mission.id, {
      ts: Date.now() + 3, kind: 'system', severity: 'info',
      title: 'Memory recall disabled in settings',
      detail: 'Planning without historical context.'
    });
  }

  pushMissionEvent(mission.id, {
    ts: Date.now() + 7, kind: 'agent', severity: 'info',
    title: 'Mission execution ready',
    detail: `Route: ${planned.map(id => env.nodes.find(n => n.id === id)?.name ?? id).join(' → ')}`
  });

  return planned;
}

export function robotHomeNode(robotId: string, envId: EnvId): string {
  const env = envById(envId);
  const r = getRobot(robotId);
  if (r && r.envId === envId) {
    const exact = env.nodes.find(n => n.name === r.location);
    if (exact) return exact.id;
  }
  return env.nodes.find(n => n.kind === 'dock')?.id ?? env.nodes[0].id;
}

/* ---------------- Mission start / control ---------------- */

export function startMission(mission: Mission, scenarioId?: string, operatorApproved = false) {
  if (mission.status === 'active' || mission.status === 'paused') return;
  const robot = getRobot(mission.robotId);
  if (!robot) throw new Error('Robot not found');
  if (robot.status === 'offline' || robot.status === 'charging' || robot.status === 'executing' || robot.currentMissionId) {
    throw new Error(`${robot.id} is not available for another mission.`);
  }
  const settings = getSettings();
  const activeCount = getState().missions.filter(m => m.status === 'active' || m.status === 'paused').length;
  if (activeCount >= Math.max(1, settings.maxConcurrentMissions)) {
    throw new Error(`Maximum ${settings.maxConcurrentMissions} concurrent missions reached.`);
  }
  if (mission.priority === 'Critical' && settings.requireReviewForCritical && !operatorApproved) {
    throw new Error('Operator review is required before starting a Critical-priority mission.');
  }
  const sid = scenarioId ?? mission.scenarioId ?? 'clean';
  const planned = planMission(mission);

  mutate(s => {
    const m = s.missions.find(m => m.id === mission.id);
    const r = s.robots.find(r => r.id === mission.robotId);
    if (m) {
      m.status = 'active';
      m.startedAt = Date.now();
      m.progress = 0;
      m.route = { envId: m.envId, planned, current: [...planned], pointIndex: 0 };
      m.distanceM = Math.round(routeDistance(m.envId, planned) * 1.6);
      m.scenarioId = sid;
    }
    if (r) {
      r.status = 'executing';
      r.currentMissionId = mission.id;
      r.location = envById(mission.envId).nodes.find(n => n.id === planned[0])?.name ?? r.location;
    }
  });

  const first = nodeXY(mission.envId, planned[0]);
  patchRobot(mission.robotId, { x: first.x, y: first.y });

  active.set(mission.id, {
    missionId: mission.id,
    scenarioId: sid,
    path: [...planned],
    plannedPath: [...planned],
    segIndex: 0,
    segProgress: 0,
    speedFactor: 1,
    obstacleFired: false,
    batteryFired: false,
    commsFired: false,
    conflictHandled: false,
    rerouted: false,
    memoryUsed: false,
    tickCount: 0,
    paused: false,
    finished: false,
    envId: mission.envId,
    robotId: mission.robotId,
    problemLog: []
  });

  pushMissionEvent(mission.id, {
    ts: Date.now(), kind: 'sim', severity: 'success',
    title: 'Mission started',
    detail: `${mission.robotId} departed ${envById(mission.envId).nodes.find(n => n.id === planned[0])?.name}.`
  });
  ensureTimer();
  flushPersistence();
}

export function pauseMission(missionId: string) {
  const sim = active.get(missionId);
  if (!sim || sim.finished) return;
  sim.paused = true;
  pushMissionEvent(missionId, { ts: Date.now(), kind: 'system', severity: 'warning', title: 'Mission paused by operator' });
  mutate(s => { const m = s.missions.find(m => m.id === missionId); if (m) m.status = 'paused'; });
  patchRobot(sim.robotId, { status: 'idle' });
  flushPersistence();
}

export function resumeMission(missionId: string) {
  const sim = active.get(missionId);
  if (!sim || sim.finished) return;
  sim.paused = false;
  pushMissionEvent(missionId, { ts: Date.now(), kind: 'system', severity: 'info', title: 'Mission resumed' });
  mutate(s => { const m = s.missions.find(m => m.id === missionId); if (m) m.status = 'active'; });
  patchRobot(sim.robotId, { status: 'executing' });
  ensureTimer();
  flushPersistence();
}

export function cancelMission(missionId: string) {
  const sim = active.get(missionId);
  mutate(s => {
    const m = s.missions.find(m => m.id === missionId);
    if (m) {
      m.status = 'cancelled';
      m.endedAt = Date.now();
      if (m.startedAt) m.durationSec = Math.round((Date.now() - m.startedAt) / 1000);
      m.outcome = undefined;
    }
    const r = s.robots.find(r => r.id === m?.robotId);
    if (r) { r.status = 'idle'; r.currentMissionId = null; }
  });
  if (sim) { sim.finished = true; active.delete(missionId); }
  pushMissionEvent(missionId, { ts: Date.now(), kind: 'system', severity: 'warning', title: 'Mission cancelled by operator' });
  stopTimerIfIdle();
  flushPersistence();
}

/* ---------------- The tick ---------------- */

function tick() {
  const settings = getSettings();
  const speed = Math.max(0.25, settings.simSpeed);
  active.forEach(sim => {
    if (sim.paused || sim.finished) return;
    sim.tickCount++;
    const mission = getMission(sim.missionId);
    const robot = getRobot(sim.robotId);
    if (!mission || !robot || mission.status !== 'active') return;

    advanceAlongPath(sim, speed);
    if (sim.finished) return; // completed inside advanceAlongPath
    runScenarioLogic(sim, mission, robot);
    updateTelemetry(sim, mission, robot);
    if (sim.tickCount % 10 === 0) checkAutoAbort();
  });
}

function advanceAlongPath(sim: ActiveSim, speed: number) {
  const mission = getMission(sim.missionId);
  if (!mission) return;
  const env = envById(sim.envId);
  const totalSegs = Math.max(1, sim.path.length - 1);
  const segLenPct = 100 / totalSegs;

  sim.segProgress += 3.4 * speed * sim.speedFactor; // percent of whole route per tick

  const progress = Math.min(99.4, sim.segProgress);

  /* Engine-owned completion: the mission finishes when the route is traversed. */
  if (sim.segProgress >= 99.4) {
    mutate(s => {
      const m = s.missions.find(m => m.id === mission.id);
      const r = s.robots.find(r => r.id === sim.robotId);
      if (m) { m.progress = 99.4; if (m.route) m.route.pointIndex = m.route.current.length - 1; }
      if (r) { r.speed = 0; }
    });
    completeMission(mission.id);
    return;
  }
  const segFloat = (progress / 100) * totalSegs;
  const newSegIndex = Math.min(totalSegs - 1, Math.floor(segFloat));
  const segT = segFloat - newSegIndex;

  if (newSegIndex !== sim.segIndex && sim.path[newSegIndex + 1]) {
    sim.segIndex = newSegIndex;
    const arrived = sim.path[newSegIndex];
    const nm = env.nodes.find(n => n.id === arrived)?.name ?? arrived;
    pushMissionEvent(mission.id, {
      ts: Date.now(), kind: 'sim', severity: 'info',
      title: `Checkpoint reached — ${nm}`,
      atNode: arrived
    });
  }

  const a = nodeXY(sim.envId, sim.path[newSegIndex]);
  const b = nodeXY(sim.envId, sim.path[Math.min(sim.path.length - 1, newSegIndex + 1)]);
  const x = a.x + (b.x - a.x) * segT;
  const y = a.y + (b.y - a.y) * segT;

  mutate(s => {
    const m = s.missions.find(m => m.id === mission.id);
    const r = s.robots.find(r => r.id === sim.robotId);
    if (m) {
      m.progress = progress;
      if (m.route) {
        m.route.current = [...sim.path];
        m.route.pointIndex = newSegIndex;
      }
    }
    if (r) { r.x = x; r.y = y; r.speed = 0.8 * speed * sim.speedFactor; }
  });
}

function runScenarioLogic(sim: ActiveSim, mission: Mission, robot: Robot) {
  const progress = mission.progress;
  const settings = getSettings();

  /* --- Scenario 2: obstacle + memory-assisted reroute (or plain reroute) --- */
  if (sim.scenarioId === 'obstacle' && !sim.obstacleFired && progress > 18 && sim.path.length > 2) {
    sim.obstacleFired = true;
    const env = envById(sim.envId);
    const blockedIdx = Math.min(sim.path.length - 2, sim.segIndex + 1);
    const blockedNode = sim.path[blockedIdx];
    const blockedName = env.nodes.find(n => n.id === blockedNode)?.name ?? blockedNode;

    pushMissionEvent(mission.id, {
      ts: Date.now(), kind: 'sim', severity: 'critical',
      title: 'Obstacle detected',
      detail: `${blockedName} is obstructed — unplanned pallet stack on the path.`,
      atNode: blockedNode
    });
    addAlert({ severity: 'critical', title: 'Obstacle detected', detail: `${robot.id} found ${blockedName} blocked during ${mission.code}.`, robotId: robot.id, missionId: mission.id, source: 'mission' });
    sim.problemLog.push(`Obstacle at ${blockedName}`);

    pushMissionEvent(mission.id, {
      ts: Date.now(), kind: 'agent', severity: 'info',
      title: 'Evaluating previous mission experiences…'
    });

    const res = recall({
      robotId: robot.id, envId: sim.envId, destinationNode: mission.destinationNode,
      text: `obstacle blocked ${blockedName}`, limit: 3
    });
    markRetrieved(res.hits.map(h => h.memory.id));

    if (res.hits.length) {
      pushMissionEvent(mission.id, {
        ts: Date.now(), kind: 'memory', severity: 'info',
        title: 'Relevant memory retrieved',
        detail: res.hits.map(h => `${h.memory.id} (${(h.score * 100).toFixed(0)}% simulated relevance): ${h.memory.text}`).join('\n'),
        memoryIds: res.hits.map(h => h.memory.id)
      });
      res.hits.forEach(h => {
        if (!mission.memoryIdsRetrieved.includes(h.memory.id)) mission.memoryIdsRetrieved.push(h.memory.id);
      });
    }

    const applicableHits = res.hits.filter(hit => hit.score >= settings.agentConfidenceThreshold);
    const memoryApplied = applicableHits.length > 0;
    const alt = altRouteAvoiding(sim.envId, sim.path[sim.segIndex], mission.destinationNode, blockedNode);
    const altNames = alt.map(id => env.nodes.find(n => n.id === id)?.name ?? id);
    sim.path = [...sim.path.slice(0, sim.segIndex + 1), ...alt.slice(1)];
    sim.rerouted = true;
    sim.memoryUsed = memoryApplied;

    pushMissionEvent(mission.id, {
      ts: Date.now(), kind: 'decision', severity: 'success',
      title: `Alternative route selected: ${altNames.filter(n => n !== blockedName).slice(0, 3).join(', ')}`,
      detail: memoryApplied
        ? 'Route adapted using previous experience. Route updated on the map.'
        : res.hits.length
          ? 'Retrieved memories were below the configured threshold; agent selected a safe alternative from map topology.'
          : 'No directly relevant memory found — agent selected a safe alternative from map topology.'
    });
    addDecision({
      missionId: mission.id, ts: Date.now(), phase: 'execution',
      decision: `Reroute via ${altNames.join(' → ')} avoiding ${blockedName}`,
      rationale: memoryApplied
        ? `Retrieved memory reported a prior obstruction near ${blockedName}; the alternative matches the previously successful strategy.`
        : 'Map topology offers a clear alternative path; selected the shortest safe detour.',
      sourceMemories: applicableHits.map(h => h.memory.id),
      confidence: memoryApplied ? Math.max(...applicableHits.map(h => h.score)) : 0.7
    });
    addAlert({ severity: 'info', title: 'Route changed', detail: `${robot.id} rerouted via ${altNames.join(' → ')}.`, robotId: robot.id, missionId: mission.id, source: 'mission' });
    return;
  }

  /* --- Scenario 3: low battery --- */
  if (sim.scenarioId === 'battery' && !sim.batteryFired && progress > 30) {
    sim.batteryFired = true;
    sim.speedFactor = 0.8;
    pushMissionEvent(mission.id, {
      ts: Date.now(), kind: 'sim', severity: 'warning',
      title: 'Battery drain above forecast',
      detail: 'Consumption 22% over baseline. Agent reduced cruise speed to conserve charge.'
    });
  }
  if (robot.battery <= settings.lowBatteryThreshold && sim.tickCount % 14 === 0) {
    pushMissionEvent(mission.id, {
      ts: Date.now(), kind: 'sim', severity: 'warning',
      title: `Low battery — ${robot.battery}%`,
      detail: robot.battery <= settings.criticalBatteryThreshold ? 'Critical level. Mission will abort at next checkpoint.' : 'Continue with reduced power budget.'
    });
  }

  /* --- Scenario 4: comms --- */
  if (sim.scenarioId === 'comms' && !sim.commsFired && progress > 38) {
    sim.commsFired = true;
    pushMissionEvent(mission.id, {
      ts: Date.now(), kind: 'sim', severity: 'warning',
      title: 'Signal degradation',
      detail: 'Link quality dropped below 50%. Telemetry reporting switches to batched mode.'
    });
    addAlert({ severity: 'warning', title: 'Communication warning', detail: `${robot.id} signal degraded during ${mission.code}.`, robotId: robot.id, missionId: mission.id, source: 'telemetry' });
    sim.problemLog.push('Temporary signal degradation');
  }

  /* --- Scenario 5: conflicting history --- */
  if (sim.scenarioId === 'conflict' && !sim.conflictHandled && progress > 22) {
    sim.conflictHandled = true;
    pushMissionEvent(mission.id, {
      ts: Date.now(), kind: 'memory', severity: 'warning',
      title: 'Conflicting historical experiences detected',
      detail: 'Older experience recommends one path; a more recent experience reports it obstructed. The agent weights recency and context, then verifies conditions live before committing.'
    });
    addDecision({
      missionId: mission.id, ts: Date.now(), phase: 'planning',
      decision: 'Proceed on planned route with live verification at the contested segment',
      rationale: 'Recent memory (higher recency weight) contradicts an older preference. Neither is treated as automatically correct — the agent confirms current conditions on approach and keeps the alternative ready.',
      sourceMemories: ['M-087', 'M-151'],
      confidence: 0.68
    });
    addAlert({ severity: 'warning', title: 'Memory conflict considered', detail: `Agent weighed conflicting experiences for ${robot.id} in ${mission.code}.`, robotId: robot.id, missionId: mission.id, source: 'memory' });
  }

  /* --- ambient events (controlled) --- */
  const freq = settings.simEventFrequency === 'low' ? 0.008 : settings.simEventFrequency === 'high' ? 0.05 : 0.02;
  if (rndAmbient() < freq) {
    const ambient: Array<[string, MissionEvent['severity'], string]> = [
      ['Checkpoint scan complete', 'info', 'Waypoint imagery and sensor readings archived.'],
      ['Minor speed adjustment', 'info', 'Speed tuned for surface conditions.'],
      ['Temperature rising slightly', 'warning', 'Drive motors 2°C above baseline; within limits.'],
      ['Temporary signal drop', 'warning', 'Packet loss for 3 seconds; link recovered.'],
      [' Lidar recalibrated', 'info', 'Point cloud alignment verified.']
    ];
    const [title, sev, detail] = ambient[Math.floor(rndAmbient() * ambient.length)];
    pushMissionEvent(mission.id, { ts: Date.now(), kind: 'sim', severity: sev, title: title.trim(), detail });
  }
}

function updateTelemetry(sim: ActiveSim, mission: Mission, robot: Robot) {
  const settings = getSettings();
  const drain = (sim.scenarioId === 'battery' ? 0.55 : 0.22) * settings.simSpeed;
  const battery = Math.max(3, Math.round((robot.battery - drain) * 10) / 10);
  const targetSignal = sim.scenarioId === 'comms' && mission.progress > 38 ? 34 : 92;
  const signal = Math.round(robot.signal + (targetSignal - robot.signal) * 0.15 + (rndAmbient() * 4 - 2));
  const temp = Math.round((robot.temperature + (38 - robot.temperature) * 0.1 + (rndAmbient() * 1.4 - 0.7)) * 10) / 10;
  const speed = Math.round((0.9 * settings.simSpeed * sim.speedFactor) * 100) / 100;
  const obstacleDistance = Math.max(0.2, Math.round((2.5 + rndAmbient() * 2) * 10) / 10);

  const sample: TelemetrySample = {
    ts: Date.now(), battery, speed, temperature: temp, signal, obstacleDistance,
    x: robot.x, y: robot.y
  };
  patchRobot(robot.id, {
    battery, signal, temperature: temp, speed,
    lastActivity: new Date().toISOString()
  });
  const sampleIntervalTicks = Math.max(1, Math.ceil(settings.telemetryIntervalSec * 1000 / 900));
  if (sim.tickCount % sampleIntervalTicks === 0) addTelemetrySample(robot.id, sample);

  if (battery <= settings.criticalBatteryThreshold && !sim.problemLog.includes('critical battery')) {
    sim.problemLog.push('critical battery');
    addAlert({ severity: 'critical', title: `Critical battery — ${robot.id}`, detail: `Battery at ${battery}% during ${mission.code}.`, robotId: robot.id, missionId: mission.id, source: 'telemetry' });
    if (settings.notificationsBattery) {
      addNotification({ severity: 'critical', title: 'Critical battery', body: `${robot.id} is at ${battery}% during ${mission.code}.`, route: { view: 'fleet', id: robot.id } });
    }
  }
  if (signal < settings.signalWarning && sim.tickCount % 20 === 0) {
    addAlert({ severity: 'warning', title: `Weak signal — ${robot.id}`, detail: `Signal at ${signal}% during ${mission.code}.`, robotId: robot.id, missionId: mission.id, source: 'telemetry' });
  }
}

/* ---------------- Completion ---------------- */

export function completeMission(missionId: string) {
  const sim = active.get(missionId);
  const mission = getMission(missionId);
  if (!mission) return;
  if (sim?.finished) return;

  const success = mission.progress > 90;
  const durSec = mission.startedAt ? Math.round((Date.now() - mission.startedAt) / 1000) : 0;
  mutate(s => {
    const m = s.missions.find(m => m.id === missionId);
    const r = s.robots.find(r => r.id === mission.robotId);
    if (m) {
      m.status = 'completed';
      m.progress = 100;
      m.endedAt = Date.now();
      m.durationSec = durSec;
      m.outcome = success ? 'success' : 'partial';
      if (sim) m.problems = [...sim.problemLog];
      if (m.route) m.route.pointIndex = m.route.current.length - 1;
    }
    if (r) {
      r.status = 'idle';
      r.currentMissionId = null;
      r.missionCount++;
      if (success) r.successCount++;
      r.location = envById(mission.envId).nodes.find(n => n.id === mission.destinationNode)?.name ?? r.location;
      const d = nodeXY(mission.envId, mission.destinationNode);
      r.x = d.x; r.y = d.y;
    }
  });

  pushMissionEvent(missionId, {
    ts: Date.now(), kind: 'system', severity: 'success',
    title: 'Mission completed',
    detail: `${mission.code} finished in ${Math.max(1, Math.round(durSec / 60))} min${sim?.problemLog.length ? ` — notes: ${sim.problemLog.join('; ')}` : ''}.`
  });
  if (sim) { sim.finished = true; active.delete(missionId); }
  stopTimerIfIdle();

  const settings = getSettings();
  if (settings.notificationsMission) {
    addNotification({
      severity: success ? 'success' : 'warning',
      title: `Mission ${mission.code} completed`,
      body: `${mission.robotId} finished ${mission.type} at ${mission.destinationName}.`,
      route: { view: 'missions', id: missionId }
    });
  }
  flushPersistence();
}

export function failMission(missionId: string, reason: string) {
  const sim = active.get(missionId);
  const mission = getMission(missionId);
  if (!mission) return;
  mutate(s => {
    const m = s.missions.find(m => m.id === missionId);
    const r = s.robots.find(r => r.id === mission.robotId);
    if (m) {
      m.status = 'failed';
      m.endedAt = Date.now();
      m.durationSec = m.startedAt ? Math.round((Date.now() - m.startedAt) / 1000) : 0;
      m.outcome = 'failed';
      m.problems = [...(sim?.problemLog ?? []), reason];
    }
    if (r) { r.status = 'warning'; r.currentMissionId = null; }
  });
  pushMissionEvent(missionId, { ts: Date.now(), kind: 'system', severity: 'critical', title: 'Mission failed', detail: reason });
  addAlert({ severity: 'critical', title: `Mission ${mission.code} failed`, detail: reason, robotId: mission.robotId, missionId, source: 'mission' });
  if (sim) { sim.finished = true; active.delete(missionId); }
  stopTimerIfIdle();
  flushPersistence();
}

/* auto-abort on critical battery (settings driven) */
export function checkAutoAbort() {
  const settings = getSettings();
  active.forEach(sim => {
    if (sim.paused || sim.finished) return;
    const robot = getRobot(sim.robotId);
    const mission = getMission(sim.missionId);
    if (!robot || !mission) return;
    if (robot.battery <= 6 && mission.progress < 90) {
      failMission(sim.missionId, `Battery critically depleted (${robot.battery}%) before mission completion.`);
    }
  });
  void settings;
}

/* ---------------- Post-mission memory generation ---------------- */

export function buildLearnedExperience(mission: Mission): { text: string; category: Mission extends never ? never : import('../data/types').MemoryCategory; tags: string[]; confidence: number } {
  const env = envById(mission.envId);
  const obstacleEvent = mission.events.find(e => e.title === 'Obstacle detected');
  const reroute = mission.decisions.find(d => d.decision.toLowerCase().includes('reroute') || d.decision.toLowerCase().includes('route via'));
  const usedMemory = mission.memoryIdsRetrieved.length > 0;

  if (obstacleEvent && reroute) {
    const blockedNode = obstacleEvent.atNode ? env.nodes.find(n => n.id === obstacleEvent.atNode)?.name : 'the planned path';
    const altDetail = reroute.decision.replace(/Reroute via /, '').split(' avoiding ')[0];
    return {
      text: `${mission.robotId} encountered a blocked passage at ${blockedNode} during ${mission.type} to ${mission.destinationName} (${env.name}). ${altDetail} was used successfully as an alternative route.`,
      category: 'Obstacles',
      tags: [obstacleEvent.atNode ?? 'obstacle', 'obstacle', 'reroute', env.id],
      confidence: 0.9
    };
  }
  if (mission.problems.some(p => p.includes('critical battery'))) {
    return {
      text: `${mission.robotId} reached critical battery during ${mission.type} to ${mission.destinationName}. Charge before assigning similar ${mission.type.toLowerCase()} missions exceeding ${Math.max(15, Math.round(mission.durationSec / 60 - 5))} minutes.`,
      category: 'Battery',
      tags: ['battery', 'charging', env.id],
      confidence: 0.82
    };
  }
  if (mission.problems.some(p => p.toLowerCase().includes('signal'))) {
    return {
      text: `${mission.robotId} experienced signal degradation during ${mission.type} in ${env.name}. Expect reduced telemetry near this area; batch reporting is acceptable.`,
      category: 'Environment',
      tags: ['signal', 'connectivity', env.id],
      confidence: 0.78
    };
  }
  if (usedMemory) {
    return {
      text: `${mission.robotId} completed ${mission.type} to ${mission.destinationName} using ${mission.memoryIdsRetrieved.length} retrieved experience${mission.memoryIdsRetrieved.length > 1 ? 's' : ''}. Previous strategy remains valid for this route.`,
      category: 'Successful Strategies',
      tags: [mission.destinationNode, env.id, 'validated'],
      confidence: 0.86
    };
  }
  return {
    text: `${mission.robotId} completed a clean ${mission.type.toLowerCase()} to ${mission.destinationName} (${env.name}). Route via ${mission.route?.current.map(id => env.nodes.find(n => n.id === id)?.name).join(' → ')} is reliable.`,
    category: 'Navigation',
    tags: [mission.destinationNode, env.id, 'clean-run'],
    confidence: 0.8
  };
}

export function saveExperienceToMemory(mission: Mission): import('../data/types').Memory {
  const learned = buildLearnedExperience(mission);
  const mem = createMemory({
    robotId: mission.robotId,
    missionId: mission.id,
    missionCode: mission.code,
    category: learned.category,
    text: learned.text,
    envId: mission.envId,
    tags: learned.tags,
    confidence: learned.confidence,
    relevance: 0.68
  });
  mutate(s => {
    const m = s.missions.find(m => m.id === mission.id);
    if (m && !m.memoryIdsCreated.includes(mem.id)) m.memoryIdsCreated.push(mem.id);
  });
  return mem;
}

/* Demo-mode helpers */
export function simulateProgressBoost(missionId: string, to: number) {
  const sim = active.get(missionId);
  if (sim) sim.segProgress = Math.min(99, to);
  mutate(s => {
    const m = s.missions.find(m => m.id === missionId);
    if (m) m.progress = Math.min(99, to);
  });
}

export { bumpMissionSeq };
