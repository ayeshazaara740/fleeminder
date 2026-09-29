import type { Mission, MissionType, Priority, EnvId, Robot } from '../data/types';
import { getRobots, getActiveMissions, getMissions, getSettings, mutate, addDecision, getState, addNotification, addAlert } from '../data/store';
import { ENVIRONMENTS, envById } from '../data/environments';
import { createMission, startMission, pauseMission, resumeMission, cancelMission, completeMission, SCENARIOS, getActiveSim, robotHomeNode, saveExperienceToMemory } from '../services/simulation';
import { planningNarrative } from '../services/agent';
import { recall } from '../services/memory';
import { drawEnvMap, animateMap } from '../components/map';
import { icon } from '../components/icons';
import { badge, statusBadge, prioBadge, batteryCell, robotChip, emptyState, toast, confirmDialog, sevBadge } from '../components/ui';
import { ago, fmtTime, fmtDuration, clockFromTs } from '../services/time';
import { navigate } from '../router';
import { onExperienceSaved } from '../demo';

/* Mission Control — creation form + live mission workspace. */

let stopMapAnim: (() => void) | null = null;
let workspaceMissionId: string | null = null;
let wsTicker: ReturnType<typeof setInterval> | null = null;

export function renderMissionControl(el: HTMLElement, param?: string) {
  cleanupWorkspace();
  if (param) {
    renderWorkspace(el, param);
  } else {
    renderControl(el);
  }
}

export function cleanupWorkspace() {
  if (stopMapAnim) { stopMapAnim(); stopMapAnim = null; }
  if (wsTicker) { clearInterval(wsTicker); wsTicker = null; }
  workspaceMissionId = null;
}

/* ---------------- Creation view ---------------- */

function renderControl(el: HTMLElement) {
  const robots = getRobots();
  const active = getActiveMissions();
  const settings = getSettings();
  const capacityReached = active.length >= Math.max(1, settings.maxConcurrentMissions);
  const preferredRobotId = settings.autoAssign
    ? robots.find(r => ['idle', 'online'].includes(r.status) && r.battery > settings.lowBatteryThreshold)?.id
    : undefined;
  const recent = getMissions().slice(0, 8);

  el.innerHTML = `
    <div class="view">
      <div class="view-head">
        <div class="view-title">
          <h1>Mission Control</h1>
          <div class="vsub">Create missions, control execution, and watch the AI agent work. Robot behavior is simulated; decisions and memory flows are real.</div>
        </div>
        <div class="view-head-actions">
          <span class="live-pill"><span class="ldot"></span>${active.length} active</span>
        </div>
      </div>

      <div class="grid-2-1">
        <section class="panel">
          <div class="panel-head"><div class="panel-title">${icon('plus', 15)} New Mission</div></div>
          <div class="panel-body">
            <form id="mission-form">
              <div class="form-row">
                <div class="field">
                  <label for="mc-robot">Robot</label>
                  <select id="mc-robot" class="input" required>
                    <option value="" disabled ${preferredRobotId ? '' : 'selected'}>Select an available robot</option>
                    ${robots.map(r => {
                      return `<option value="${r.id}" ${r.id === preferredRobotId ? 'selected' : ''} ${r.status === 'offline' ? 'disabled' : ''}>${r.id} · ${r.name} — ${r.status} (${r.battery}%)</option>`;
                    }).join('')}
                  </select>
                </div>
                <div class="field">
                  <label for="mc-type">Mission type</label>
                  <select id="mc-type" class="input">
                    ${['Inspection', 'Delivery', 'Patrol', 'Mapping', 'Environmental Monitoring', 'Search', 'Infrastructure Check'].map(t => `<option>${t}</option>`).join('')}
                  </select>
                </div>
              </div>
              <div class="form-row mt-8">
                <div class="field">
                  <label for="mc-env">Environment</label>
                  <select id="mc-env" class="input">
                    ${ENVIRONMENTS.map(e => `<option value="${e.id}">${e.name}</option>`).join('')}
                  </select>
                </div>
                <div class="field">
                  <label for="mc-dest">Destination</label>
                  <select id="mc-dest" class="input"></select>
                </div>
              </div>
              <div class="form-row-3 mt-8">
                <div class="field">
                  <label for="mc-prio">Priority</label>
                  <select id="mc-prio" class="input">
                    ${['Low', 'Normal', 'High', 'Critical'].map(p => `<option ${p === 'Normal' ? 'selected' : ''}>${p}</option>`).join('')}
                  </select>
                </div>
                <div class="field">
                  <label for="mc-mode">Mode</label>
                  <select id="mc-mode" class="input">
                    <option value="autonomous">Autonomous (agent-driven)</option>
                    <option value="manual">Manual (supervised)</option>
                  </select>
                </div>
                <div class="field">
                  <label for="mc-scenario">Simulation scenario</label>
                  <select id="mc-scenario" class="input">
                    ${SCENARIOS.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
                  </select>
                </div>
              </div>
              <div class="field mt-8">
                <label for="mc-instr">Mission instructions</label>
                <textarea id="mc-instr" class="input" rows="3" placeholder="e.g. Inspect all checkpoints and report anomalies with photos.">Inspect all checkpoints and report anomalies.</textarea>
              </div>
              <div id="mc-scenario-note" class="info-note sim-note mt-8">${icon('info', 15)}<span>${esc2(SCENARIOS[0].desc)}</span></div>
              ${capacityReached ? `<div class="info-note mt-8" style="border-color:rgba(251,191,36,.35);color:var(--amber)">${icon('warning', 15)}<span>Fleet capacity reached (${active.length}/${settings.maxConcurrentMissions}). You can queue a mission or wait for an active run to finish.</span></div>` : ''}
              <div class="flex mt-16" style="gap:9px">
                <button type="submit" class="btn btn-primary btn-lg" id="mc-start" ${capacityReached ? 'disabled' : ''}>${icon('play', 15)} Start Mission</button>
                <button type="button" class="btn btn-lg" id="mc-queue">Queue only</button>
              </div>
            </form>
          </div>
        </section>

        <div class="stack">
          <section class="panel">
            <div class="panel-head"><div class="panel-title">${icon('activity', 15)} Active & Recent</div></div>
            <div class="panel-body tight">
              ${recent.length ? recent.map(m => `
                <div class="kv-row clickable" data-nav="mission/${m.id}" style="padding:9px 16px">
                  <span><span class="td-main">${m.code}</span> <span class="fs-11 text-dim">${m.type} → ${m.destinationName}</span></span>
                  <span class="flex" style="gap:7px">${statusBadge(m.status)}${icon('chevronRight', 13)}</span>
                </div>`).join('') : emptyState('mission', 'No missions yet', 'Create your first mission on the left.')}
            </div>
          </section>
          <section class="panel">
            <div class="panel-head"><div class="panel-title">${icon('info', 15)} How the agent plans</div></div>
            <div class="panel-body fs-12" style="color:var(--text-2);line-height:1.7">
              1. Parses your instructions and mission parameters.<br/>
              2. Reviews the robot's history and health.<br/>
              3. <b style="color:var(--text-1)">Retrieves relevant experiences from persistent memory.</b><br/>
              4. Identifies previous risks on the planned route.<br/>
              5. Selects the safest route and explains its decision.<br/>
              6. Monitors execution and adapts when conditions change.
            </div>
          </section>
        </div>
      </div>
    </div>`;

  /* destination options follow environment */
  const envSel = el.querySelector<HTMLSelectElement>('#mc-env')!;
  const destSel = el.querySelector<HTMLSelectElement>('#mc-dest')!;
  const fillDests = () => {
    const env = envById(envSel.value);
    const robotSel = el.querySelector<HTMLSelectElement>('#mc-robot');
    if (!robotSel) return;
    const robotId = robotSel.value;
    const from = robotHomeNode(robotId, env.id as EnvId);
    destSel.innerHTML = env.nodes
      .filter(n => n.id !== from && n.kind !== 'dock')
      .map(n => `<option value="${n.id}">${n.name}</option>`).join('');
  };
  fillDests();
  envSel.addEventListener('change', fillDests);
  el.querySelector('#mc-robot')?.addEventListener('change', fillDests);

  const scenSel = el.querySelector<HTMLSelectElement>('#mc-scenario')!;
  const scenNote = el.querySelector('#mc-scenario-note')!;
  scenSel.addEventListener('change', () => {
    const s = SCENARIOS.find(x => x.id === scenSel.value);
    if (s) scenNote.innerHTML = `${icon('info', 15)}<span>${esc2(s.desc)}</span>`;
  });

  el.querySelector('#mission-form')?.addEventListener('submit', e => {
    e.preventDefault();
    submitMission(el, true);
  });
  el.querySelector('#mc-queue')?.addEventListener('click', () => submitMission(el, false));

  el.querySelectorAll<HTMLElement>('[data-nav]').forEach(node => {
    node.addEventListener('click', e => { e.stopPropagation(); navigate(node.dataset.nav!); });
  });
}

function submitMission(el: HTMLElement, startNow: boolean, reviewedCritical = false) {
  const q = (sel: string) => el.querySelector<HTMLInputElement>(sel);
  const robotId = q('#mc-robot')!.value;
  const priority = q('#mc-prio')!.value as Priority;
  const settings = getSettings();

  const robot = getRobots().find(item => item.id === robotId);
  if (startNow && (!robot || ['offline', 'executing', 'charging'].includes(robot.status) || !!robot.currentMissionId)) {
    toast('warning', 'Robot unavailable', 'Choose an idle robot or queue this mission for later.');
    return;
  }
  if (startNow && getActiveMissions().length >= Math.max(1, settings.maxConcurrentMissions)) {
    toast('warning', 'Fleet capacity reached', `Maximum ${settings.maxConcurrentMissions} concurrent missions.`);
    return;
  }
  if (startNow && priority === 'Critical' && settings.requireReviewForCritical && !reviewedCritical) {
    confirmDialog(
      'Review critical mission',
      `Confirm ${robotId} is ready for this Critical-priority mission before execution.`,
      'Approve and start',
      () => submitMission(el, startNow, true),
      true
    );
    return;
  }

  const startBtn = el.querySelector<HTMLButtonElement>('#mc-start')!;
  if (startNow && startBtn.disabled) return; // prevent duplicate starts
  if (startNow) {
    startBtn.disabled = true;
    startBtn.innerHTML = `<span class="spinner"></span> Planning…`;
  }

  const type = q('#mc-type')!.value as MissionType;
  const envId = q('#mc-env')!.value as EnvId;
  const destId = q('#mc-dest')!.value;
  const env = envById(envId);
  const dest = env.nodes.find(n => n.id === destId);
  const mode = q('#mc-mode')!.value as 'autonomous' | 'manual';
  const scenario = q('#mc-scenario')!.value;
  const instructions = (q('#mc-instr')?.value || '').trim() || 'Standard mission procedures.';

  try {
    const mission = createMission({
      robotId, type, envId, destinationNode: destId, destinationName: dest?.name ?? destId,
      priority, mode, instructions, scenarioId: scenario
    });
    if (startNow) {
      startMission(mission, scenario, reviewedCritical);
      toast('success', `${mission.code} started`, `${robotId} → ${dest?.name}. Agent is planning with memory recall.`);
      navigate(`mission/${mission.id}`);
    } else {
      mutate(s => { const m = s.missions.find(x => x.id === mission.id); if (m) m.status = 'queued'; });
      toast('info', `${mission.code} queued`, 'Start it from Mission History or Mission Control.');
      navigate(`missions/${mission.id}`);
    }
  } catch (err) {
    toast('error', 'Could not start mission', err instanceof Error ? err.message : 'Unknown error');
    startBtn.disabled = false;
    startBtn.innerHTML = `${icon('play', 15)} Start Mission`;
  }
}

function esc2(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
}

/* ---------------- Live workspace ---------------- */

function renderWorkspace(el: HTMLElement, missionId: string) {
  const mission = getState().missions.find(m => m.id === missionId) ?? getMissions()[0];
  if (!mission) { navigate('mission'); return; }
  workspaceMissionId = mission.id;
  const robot = getState().robots.find(r => r.id === mission.robotId)!;
  const sim = getActiveSim(mission.id);
  const env = envById(mission.envId);

  const mems = mission.memoryIdsRetrieved.map(id => getState().memories.find(m => m.id === id)).filter(Boolean) as import('../data/types').Memory[];

  el.innerHTML = `
    <div class="view">
      <div class="view-head">
        <div class="view-title">
          <h1>${mission.code} <span style="color:var(--text-3);font-weight:400">· ${mission.type}</span></h1>
          <div class="vsub">${robotChip(mission.robotId, robot?.name)} → ${mission.destinationName} (${env.name}) · ${prioBadge(mission.priority)} ${mission.mode === 'autonomous' ? badge('Autonomous', 'blue') : badge('Manual', 'gray')}</div>
        </div>
        <div class="view-head-actions" id="ws-actions"></div>
      </div>

      <div class="grid-2-1">
        <div class="stack">
          <section class="panel">
            <div class="panel-head">
              <div>
                <div class="panel-title">${icon('sim', 15)} Live Simulation — ${env.name}</div>
                <div class="panel-sub">Simulated robot and environment · explainable local planning logic</div>
              </div>
              <div class="panel-head-actions" id="ws-progress-badge"></div>
            </div>
            <div class="panel-body">
              <div class="sim-wrap">
                <canvas id="ws-map" class="sim-canvas" aria-label="2D mission map"></canvas>
                <div class="sim-overlay-tl">
                  <span class="badge badge-blue"><span class="bdot"></span>SIMULATED ENVIRONMENT</span>
                  ${sim ? `<span class="live-pill"><span class="ldot"></span>LIVE</span>` : ''}
                </div>
                <div class="sim-overlay-tr" id="ws-map-badges"></div>
                <div class="sim-legend">
                  <span><span class="lg-swatch" style="background:#34d399"></span>Robot</span>
                  <span><span class="lg-swatch" style="background:#4f8cff"></span>Active route</span>
                  <span><span class="lg-swatch" style="background:rgba(148,163,203,0.4)"></span>Original route</span>
                  <span><span class="lg-swatch" style="background:#f8717f"></span>Obstacle</span>
                  <span><span class="lg-swatch" style="background:rgba(79,140,255,0.5)"></span>Checkpoint</span>
                </div>
              </div>
              <div class="mt-8" id="ws-progress">
                <div class="meter-label"><span>Mission progress</span><b id="ws-progress-pct">0%</b></div>
                <div class="meter" style="height:8px"><span id="ws-progress-bar" style="width:0%;background:linear-gradient(90deg,var(--accent),var(--accent-2))"></span></div>
                <div class="flex fs-11 text-dim mt-8" style="gap:14px">
                  <span>0%</span><span style="margin-left:auto"></span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
                </div>
              </div>
            </div>
          </section>

          <section class="panel">
            <div class="panel-head">
              <div><div class="panel-title">${icon('agent', 15)} Mission Agent — explainable timeline</div>
              <div class="panel-sub">Distinguishes simulated actions, AI reasoning, memory and system events</div></div>
              <div class="panel-head-actions">
                <span class="badge badge-plain">SIM</span><span class="badge badge-plain" style="color:#8ab2ff">AGENT</span><span class="badge badge-plain" style="color:#b3a8f8">MEMORY</span><span class="badge badge-plain" style="color:var(--green)">DECISION</span>
              </div>
            </div>
            <div class="panel-body">
              <div class="timeline" id="ws-timeline"></div>
            </div>
          </section>
        </div>

        <div class="stack">
          <section class="panel">
            <div class="panel-head"><div class="panel-title">${icon('temp', 15)} Telemetry</div><div class="panel-head-actions"><span class="badge badge-cyan">SIMULATED</span></div></div>
            <div class="panel-body">
              <div class="kv-list" id="ws-telemetry"></div>
            </div>
          </section>

          <section class="panel">
            <div class="panel-head"><div class="panel-title">${icon('memory', 15)} Memory in use</div></div>
            <div class="panel-body">
              <div id="ws-memories" class="stack" style="gap:8px"></div>
            </div>
          </section>

          <section class="panel">
            <div class="panel-head"><div class="panel-title">${icon('route', 15)} Mission details</div></div>
            <div class="panel-body">
              <div class="kv-list">
                <div class="kv-row"><span class="k">Instructions</span><span class="v">${mission.instructions}</span></div>
                <div class="kv-row"><span class="k">Started</span><span class="v">${fmtTime(mission.startedAt)}</span></div>
                <div class="kv-row"><span class="k">Distance</span><span class="v">${mission.distanceM} m</span></div>
                <div class="kv-row"><span class="k">Scenario</span><span class="v">${SCENARIOS.find(s => s.id === mission.scenarioId)?.name ?? 'Custom'}</span></div>
                <div class="kv-row"><span class="k">Route</span><span class="v" style="text-align:right">${mission.route?.current.map(id => envById(mission.envId).nodes.find(n => n.id === id)?.name ?? id).join(' → ') ?? '—'}</span></div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>`;

  /* actions */
  renderActions(el, mission);

  /* map animation */
  const canvas = el.querySelector<HTMLCanvasElement>('#ws-map')!;
  stopMapAnim = animateMap(canvas, () => {
    const m = getState().missions.find(x => x.id === missionId);
    const r = getState().robots.find(x => x.id === (m?.robotId ?? ''));
    return {
      envId: m?.envId ?? 'wh-a',
      route: m?.route ?? null,
      robotXY: r ? { x: r.x, y: r.y } : null,
      highlightNodes: m ? [m.destinationNode] : [],
      blockedNodeIds: m?.events.filter(e => e.title === 'Obstacle detected').map(e => e.atNode!).filter(Boolean) ?? [],
      progressPct: m?.progress,
      animatePulse: m?.status === 'active'
    };
  });

  /* UI refresh ticker (map animates via rAF; rest on interval) */
  const refresh = () => {
    const m = getState().missions.find(x => x.id === missionId);
    if (!m) return;
    updateProgress(el, m);
    updateTimeline(el, m);
    updateTelemetry(el, m);
    updateMemories(el, m);
    renderActions(el, m, true);
  };
  refresh();
  wsTicker = setInterval(refresh, 1000);
}

function renderActions(el: HTMLElement, mission: Mission, silent = false) {
  const holder = el.querySelector('#ws-actions');
  if (!holder) return;
  const active = !!getActiveSim(mission.id) && !getActiveSim(mission.id)!.finished;
  const paused = mission.status === 'paused';
  let html = '';
  if (mission.status === 'active') {
    html = `<button class="btn" id="act-pause">${icon('pause', 14)} Pause</button>
            <button class="btn btn-danger" id="act-cancel">${icon('stop', 14)} Cancel</button>`;
  } else if (mission.status === 'paused') {
    html = `<button class="btn btn-success" id="act-resume">${icon('play', 14)} Resume</button>
            <button class="btn btn-danger" id="act-cancel">${icon('stop', 14)} Cancel</button>`;
  } else if (mission.status === 'queued') {
    html = `<button class="btn btn-primary" id="act-start">${icon('play', 14)} Start Mission</button>`;
  } else {
    html = `<button class="btn" id="act-replay">${icon('history', 14)} View report</button>
            <button class="btn btn-primary" id="act-new">${icon('plus', 14)} New mission</button>`;
  }
  holder.innerHTML = html;
  el.querySelector('#act-pause')?.addEventListener('click', () => { pauseMission(mission.id); toast('info', 'Mission paused'); });
  el.querySelector('#act-resume')?.addEventListener('click', () => { resumeMission(mission.id); toast('success', 'Mission resumed'); });
  el.querySelector('#act-cancel')?.addEventListener('click', () => {
    confirmDialog('Cancel mission?', `${mission.code} will stop and the robot will return to idle. This cannot be undone.`, 'Cancel mission', () => {
      cancelMission(mission.id);
      toast('warning', 'Mission cancelled', mission.code);
    }, true);
  });
  el.querySelector('#act-start')?.addEventListener('click', () => {
    const start = (approved = false) => {
      try {
        startMission(mission, mission.scenarioId, approved);
        toast('success', 'Mission started', mission.code);
      } catch (err) {
        toast('error', 'Could not start mission', err instanceof Error ? err.message : 'Unexpected error');
      }
    };
    if (mission.priority === 'Critical' && getSettings().requireReviewForCritical) {
      confirmDialog('Review critical mission', `Confirm the plan for ${mission.code} before execution.`, 'Approve and start', () => start(true), true);
    } else start();
  });
  el.querySelector('#act-replay')?.addEventListener('click', () => navigate(`missions/${mission.id}`));
  el.querySelector('#act-new')?.addEventListener('click', () => navigate('mission'));
  if (!silent) void active;
}

function updateProgress(el: HTMLElement, m: Mission) {
  const pct = el.querySelector('#ws-progress-pct');
  const bar = el.querySelector('#ws-progress-bar') as HTMLElement | null;
  if (pct) pct.textContent = `${Math.round(m.progress)}%`;
  if (bar) bar.style.width = `${m.progress}%`;
  const badgeEl = el.querySelector('#ws-progress-badge');
  if (badgeEl) badgeEl.innerHTML = `${statusBadge(m.status)} <span class="fs-11 text-dim nowrap">${fmtDuration(elapsed(m))}</span>`;
}

function elapsed(m: Mission): number {
  if (!m.startedAt) return 0;
  return m.status === 'active' ? (Date.now() - m.startedAt) / 1000 : m.durationSec;
}

function updateTimeline(el: HTMLElement, m: Mission) {
  const tl = el.querySelector('#ws-timeline');
  if (!tl) return;
  const prevCount = tl.querySelectorAll('.tl-item').length;
  const evs = m.events;
  if (evs.length === prevCount) { /* still update last active state */ }
  tl.innerHTML = evs.slice().reverse().map((e, i) => `
    <div class="tl-item">
      <div class="tl-rail"><div class="tl-dot ${dotClass(e)} ${i === 0 && m.status === 'active' ? 'active' : ''}">${tlIcon(e)}</div></div>
      <div class="tl-body">
        <div class="tl-title">${e.title} <span class="tl-kind ${e.kind}">${e.kind}</span><span class="tl-time">${clockFromTs(e.ts)}</span></div>
        ${e.detail ? `<div class="tl-desc">${e.detail.replace(/\n/g, '<br/>')}</div>` : ''}
      </div>
    </div>`).join('');
}

function dotClass(e: import('../data/types').MissionEvent): string {
  if (e.kind === 'memory') return 'mem';
  if (e.severity === 'critical') return 'crit';
  if (e.severity === 'warning') return 'warn';
  if (e.severity === 'success' || e.kind === 'decision') return 'done';
  if (e.kind === 'agent') return 'info';
  return '';
}

function tlIcon(e: import('../data/types').MissionEvent): string {
  if (e.kind === 'memory') return icon('memory', 11);
  if (e.kind === 'decision') return icon('check', 11);
  if (e.severity === 'critical') return icon('xCircle', 11);
  if (e.severity === 'warning') return icon('warning', 11);
  if (e.kind === 'sim') return icon('sim', 11);
  return icon('checkCircle', 11);
}

function updateTelemetry(el: HTMLElement, m: Mission) {
  const box = el.querySelector('#ws-telemetry');
  if (!box) return;
  const r = getState().robots.find(x => x.id === m.robotId);
  if (!r) return;
  const tele = (getState().telemetry[m.robotId] ?? []).slice(-1)[0];
  box.innerHTML = `
    <div class="kv-row"><span class="k">Battery</span><span class="v">${batteryCell(r.battery)}</span></div>
    <div class="kv-row"><span class="k">Speed</span><span class="v">${r.speed.toFixed(2)} m/s</span></div>
    <div class="kv-row"><span class="k">Temperature</span><span class="v">${r.temperature.toFixed(1)} °C</span></div>
    <div class="kv-row"><span class="k">Signal</span><span class="v">${r.signal}%</span></div>
    <div class="kv-row"><span class="k">Obstacle distance</span><span class="v">${tele?.obstacleDistance != null ? `${tele.obstacleDistance} m` : '—'}</span></div>
    <div class="kv-row"><span class="k">Coordinates</span><span class="v mono">${Math.round(r.x)}, ${Math.round(r.y)}</span></div>`;
}

function updateMemories(el: HTMLElement, m: Mission) {
  const box = el.querySelector('#ws-memories');
  if (!box) return;
  const mems = m.memoryIdsRetrieved.map(id => getState().memories.find(x => x.id === id)).filter(Boolean) as import('../data/types').Memory[];
  const created = m.memoryIdsCreated.map(id => getState().memories.find(x => x.id === id)).filter(Boolean) as import('../data/types').Memory[];
  let html = '';
  if (mems.length) {
    html += mems.map(mem => `
      <div class="mem-card clickable" data-nav="memory/${mem.id}">
        <div class="mem-head"><span class="mem-id">${mem.id}</span>${badge(mem.category, 'violet')}</div>
        <div class="mem-text clamp-2">${mem.text}</div>
      </div>`).join('');
  } else {
    html += `<div class="fs-12 text-dim">No memories retrieved ${m.status === 'active' ? 'yet' : 'for this mission'}.</div>`;
  }
  if (created.length) {
    html += `<div class="fs-11 text-dim" style="margin-top:4px">Created this mission:</div>`;
    html += created.map(mem => `<div class="mem-card flash" style="border-color:rgba(52,211,153,.4)"><div class="mem-head"><span class="mem-id" style="color:var(--green)">${mem.id}</span><span class="badge badge-green">NEW</span></div><div class="mem-text clamp-2">${mem.text}</div></div>`).join('');
  }
  box.innerHTML = html;
  box.querySelectorAll<HTMLElement>('[data-nav]').forEach(n => n.addEventListener('click', e => { e.stopPropagation(); navigate(n.dataset.nav!); }));
}

/* ---------------- Post-mission summary trigger helper ---------------- */

export function maybeGenerateSummary(mission: Mission): void {
  /* Called by main.ts when a mission transitions to completed. */
  void mission;
  void mutate; void addDecision; void addNotification; void addAlert; void saveExperienceToMemory;
  void recall; void planningNarrative; void completeMission; void maybeGenerateSummary;
}
