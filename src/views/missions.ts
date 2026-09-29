import type { Mission } from '../data/types';
import { getMissions, getState, getMemories, mutate } from '../data/store';
import { envById } from '../data/environments';
import { icon } from '../components/icons';
import { badge, statusBadge, prioBadge, robotChip, emptyState, toast, confirmDialog, relBar } from '../components/ui';
import { fmtDateTime, fmtDuration, ago, clockFromTs } from '../services/time';
import { navigate } from '../router';
import { drawEnvMap } from '../components/map';
import { saveExperienceToMemory, SCENARIOS } from '../services/simulation';
import { onExperienceSaved, isDemoActive, demoNextHint } from '../demo';

/* Mission History + Mission Report + Post-mortem + Replay. */

let fQuery = '';
let fStatus = '';
let fRobot = '';
let fDate = '';
let sortKey: 'code' | 'startedAt' | 'durationSec' = 'startedAt';
let sortDir: 1 | -1 = -1;
let replayState: { playing: boolean; t: number; speed: number; raf: number } | null = null;

export function renderMissionHistory(el: HTMLElement, param?: string) {
  cleanupReplay();
  if (param) {
    const m = getMissions().find(x => x.id === param || x.code === param);
    if (m) { renderPostmortem(el, m); return; }
  }
  const missions = getMissions();
  const robots = Array.from(new Set(missions.map(m => m.robotId)));

  let filtered = missions.filter(m => {
    if (fQuery && !`${m.code} ${m.type} ${m.destinationName} ${m.robotId} ${m.instructions}`.toLowerCase().includes(fQuery)) return false;
    if (fStatus && m.status !== fStatus) return false;
    if (fRobot && m.robotId !== fRobot) return false;
    if (fDate) {
      const cutoff = fDate === '24h' ? 86400000 : fDate === '7d' ? 7 * 86400000 : fDate === '30d' ? 30 * 86400000 : 90 * 86400000;
      if ((m.startedAt ?? m.createdAt) < Date.now() - cutoff) return false;
    }
    return true;
  });
  filtered = filtered.sort((a, b) => {
    const av = sortKey === 'code' ? a.code : sortKey === 'durationSec' ? a.durationSec : (a.startedAt ?? a.createdAt);
    const bv = sortKey === 'code' ? b.code : sortKey === 'durationSec' ? b.durationSec : (b.startedAt ?? b.createdAt);
    return (av < bv ? -1 : av > bv ? 1 : 0) * sortDir;
  });

  el.innerHTML = `
    <div class="view">
      <div class="view-head">
        <div class="view-title">
          <h1>Mission History</h1>
          <div class="vsub">Every mission recorded with its events, decisions, routes, and the memories it used or created.</div>
        </div>
        <div class="view-head-actions">
          <button class="btn btn-primary" id="mh-new">${icon('plus', 14)} New mission</button>
        </div>
      </div>

      <div class="filter-bar">
        <input id="mh-q" class="input grow" placeholder="Search missions, robots, destinations…" value="${fQuery}" />
        <select id="mh-status" class="input">
          <option value="">All statuses</option>
          ${['active', 'paused', 'queued', 'completed', 'failed', 'cancelled'].map(s => `<option value="${s}" ${fStatus === s ? 'selected' : ''}>${s}</option>`).join('')}
        </select>
        <select id="mh-robot" class="input">
          <option value="">All robots</option>
          ${robots.map(r => `<option value="${r}" ${fRobot === r ? 'selected' : ''}>${r}</option>`).join('')}
        </select>
        <select id="mh-date" class="input">
          <option value="">All time</option>
          ${['24h', '7d', '30d', '90d'].map(d => `<option value="${d}" ${fDate === d ? 'selected' : ''}>Last ${d}</option>`).join('')}
        </select>
        <span class="filter-count">${filtered.length} missions</span>
      </div>

      <section class="panel">
        <div class="panel-body tight">
          ${filtered.length ? `<div class="table-wrap"><table class="data-table">
            <thead><tr>
              <th class="sortable" data-sort="code">Mission ${sortKey === 'code' ? (sortDir === 1 ? '↑' : '↓') : ''}</th>
              <th>Robot</th><th>Type → Destination</th><th>Status</th><th>Outcome</th>
              <th class="sortable" data-sort="startedAt">Started ${sortKey === 'startedAt' ? (sortDir === 1 ? '↑' : '↓') : ''}</th>
              <th class="sortable" data-sort="durationSec">Duration ${sortKey === 'durationSec' ? (sortDir === 1 ? '↑' : '↓') : ''}</th>
              <th>Memories</th><th></th>
            </tr></thead>
            <tbody>
              ${filtered.map(m => `<tr class="clickable" data-mission="${m.id}">
                <td><div class="td-main">${m.code}</div><div class="fs-11 text-dim">${SCENARIOS.find(s => s.id === m.scenarioId)?.name.split('—')[1]?.trim() ?? ''}</div></td>
                <td>${robotChip(m.robotId)}</td>
                <td><span class="fs-12">${m.type}</span><div class="fs-11 text-dim">${m.destinationName}</div></td>
                <td>${statusBadge(m.status)}</td>
                <td>${m.outcome ? statusBadge(m.outcome) : '<span class="text-dim">—</span>'}</td>
                <td class="nowrap text-dim">${fmtDateTime(m.startedAt)}</td>
                <td class="text-dim">${fmtDuration(m.durationSec)}</td>
                <td class="fs-11 text-dim nowrap">${m.memoryIdsRetrieved.length} used · ${m.memoryIdsCreated.length} new</td>
                <td>${icon('chevronRight', 13)}</td>
              </tr>`).join('')}
            </tbody>
          </table></div>` : emptyState('mission', 'No missions match', 'Adjust filters or create a new mission.')}
        </div>
      </section>
    </div>`;

  el.querySelector('#mh-new')?.addEventListener('click', () => navigate('mission'));
  el.querySelector('#mh-q')?.addEventListener('input', e => { fQuery = (e.target as HTMLInputElement).value.toLowerCase(); rerender(); });
  el.querySelector('#mh-status')?.addEventListener('change', e => { fStatus = (e.target as HTMLSelectElement).value; rerender(); });
  el.querySelector('#mh-robot')?.addEventListener('change', e => { fRobot = (e.target as HTMLSelectElement).value; rerender(); });
  el.querySelector('#mh-date')?.addEventListener('change', e => { fDate = (e.target as HTMLSelectElement).value; rerender(); });
  el.querySelectorAll('th.sortable').forEach(th => th.addEventListener('click', () => {
    const k = (th as HTMLElement).dataset.sort as typeof sortKey;
    if (sortKey === k) sortDir = (sortDir * -1) as 1 | -1;
    else { sortKey = k; sortDir = -1; }
    rerender();
  }));
  el.querySelectorAll<HTMLElement>('[data-mission]').forEach(row => row.addEventListener('click', () => navigate(`missions/${row.dataset.mission}`)));
}

function rerender() {
  const root = document.querySelector('.content');
  if (root) renderMissionHistory(root as HTMLElement);
}

/* ---------------- Mission report / post-mortem / replay ---------------- */

function renderPostmortem(el: HTMLElement, m: Mission) {
  const env = envById(m.envId);
  const robot = getState().robots.find(r => r.id === m.robotId);
  const memUsed = m.memoryIdsRetrieved.map(id => getMemories().find(x => x.id === id)).filter(Boolean) as import('../data/types').Memory[];
  const memCreated = m.memoryIdsCreated.map(id => getMemories().find(x => x.id === id)).filter(Boolean) as import('../data/types').Memory[];
  const isNewMission = m.status === 'completed' && m.endedAt && Date.now() - m.endedAt < 1000 * 60 * 10;
  const hasLearned = memCreated.length > 0;
  const finished = m.status === 'completed' || m.status === 'failed' || m.status === 'cancelled';

  const replayable = m.route && m.route.current.length > 1;

  el.innerHTML = `
    <div class="view">
      <div class="view-head">
        <div class="view-title">
          <h1>${m.code} — ${m.status === 'completed' ? 'Post-Mission Report' : 'Mission Report'}</h1>
          <div class="vsub">${robotChip(m.robotId, robot?.name)} · ${m.type} → ${m.destinationName} (${env.name}) · ${prioBadge(m.priority)}</div>
        </div>
        <div class="view-head-actions">
          <button class="btn" id="pm-back">${icon('chevronRight', 13)} History</button>
          ${m.status === 'active' || m.status === 'paused' ? `<button class="btn btn-primary" id="pm-live">${icon('sim', 14)} Open live workspace</button>` : ''}
        </div>
      </div>

      ${m.status === 'completed' ? `
      <div class="pm-banner ${m.outcome === 'success' ? '' : 'fail'}">
        <div class="pm-check">${icon(m.outcome === 'success' ? 'check' : 'warning', 20)}</div>
        <div>
          <h3>Mission outcome: ${m.outcome === 'success' ? 'Completed successfully' : m.outcome === 'partial' ? 'Completed partially' : 'Failed'}</h3>
          <p class="fs-12 text-dim">Duration ${fmtDuration(m.durationSec)} · ${m.distanceM} m planned · ended ${fmtDateTime(m.endedAt)}</p>
        </div>
        ${isNewMission && !hasLearned ? `<button class="btn btn-success ml-auto" id="pm-replay-cta">${icon('history', 14)} Replay mission</button>` : ''}
      </div>` : m.status === 'failed' ? `
      <div class="pm-banner fail">
        <div class="pm-check">${icon('xCircle', 20)}</div>
        <div><h3>Mission failed</h3><p class="fs-12 text-dim">${m.problems.join('; ') || 'See event log for details.'}</p></div>
      </div>` : `
      <div class="info-note mb-16">${icon('info', 15)}<span>This mission is ${m.status}. The post-mission summary is generated when it finishes.</span></div>`}

      <div class="grid-2-1">
        <div class="stack">
          ${replayable ? `
          <section class="panel">
            <div class="panel-head">
              <div><div class="panel-title">${icon('history', 15)} Mission Replay</div>
              <div class="panel-sub">Re-live the route, obstacles, decisions and memory retrievals</div></div>
              <div class="panel-head-actions"><span class="badge badge-cyan">SIMULATED ENVIRONMENT</span></div>
            </div>
            <div class="panel-body">
              <div class="sim-wrap">
                <canvas id="rp-map" class="sim-canvas" aria-label="Mission replay map"></canvas>
                <div class="sim-overlay-tl" id="rp-overlay"></div>
              </div>
              <div class="sim-controls">
                <button class="btn btn-sm" id="rp-play">${icon('play', 13)} Play</button>
                <button class="btn btn-sm" id="rp-restart">${icon('refresh', 13)} Restart</button>
                <input id="rp-slider" type="range" class="input" style="flex:1;min-width:120px" min="0" max="100" value="0" aria-label="Replay timeline" />
                <select id="rp-speed" class="input" style="width:86px" aria-label="Playback speed">
                  <option value="0.5">0.5×</option><option value="1" selected>1×</option><option value="2">2×</option><option value="4">4×</option>
                </select>
                <span class="fs-11 text-dim nowrap" id="rp-clock">${m.code}</span>
              </div>
            </div>
          </section>` : ''}

          <section class="panel">
            <div class="panel-head"><div class="panel-title">${icon('file', 15)} What happened</div></div>
            <div class="panel-body">
              <p class="fs-12" style="color:var(--text-2);line-height:1.7">${whatHappened(m)}</p>
            </div>
          </section>

          ${m.status === 'completed' || m.status === 'failed' ? postMortemSections(m, memUsed, memCreated) : ''}

          <section class="panel">
            <div class="panel-head"><div class="panel-title">${icon('activity', 15)} Event log</div>
            <div class="panel-head-actions"><span class="fs-11 text-dim">${m.events.length} events</span></div></div>
            <div class="panel-body tight">
              ${m.events.length ? m.events.slice().reverse().map(e => `
                <div class="kv-row" style="padding:8px 16px">
                  <span><span class="td-main">${e.title}</span> ${badge(e.kind.toUpperCase(), 'gray')} ${e.detail ? `<div class="fs-11 text-dim" style="white-space:pre-line">${e.detail}</div>` : ''}</span>
                  <span class="fs-11 text-dim nowrap">${clockFromTs(e.ts)}</span>
                </div>`).join('') : emptyState('activity', 'No events', 'This mission has no recorded events.')}
            </div>
          </section>
        </div>

        <div class="stack">
          <section class="panel">
            <div class="panel-head"><div class="panel-title">${icon('info', 15)} Mission facts</div></div>
            <div class="panel-body"><div class="kv-list">
              <div class="kv-row"><span class="k">Status</span><span class="v">${statusBadge(m.status)}</span></div>
              <div class="kv-row"><span class="k">Mode</span><span class="v">${m.mode}</span></div>
              <div class="kv-row"><span class="k">Started</span><span class="v">${fmtDateTime(m.startedAt)}</span></div>
              <div class="kv-row"><span class="k">Ended</span><span class="v">${fmtDateTime(m.endedAt)}</span></div>
              <div class="kv-row"><span class="k">Duration</span><span class="v">${fmtDuration(m.durationSec)}</span></div>
              <div class="kv-row"><span class="k">Scenario</span><span class="v">${SCENARIOS.find(s => s.id === m.scenarioId)?.name ?? 'Custom'}</span></div>
              <div class="kv-row"><span class="k">Route</span><span class="v" style="text-align:right">${m.route?.current.map(id => env.nodes.find(n => n.id === id)?.name ?? id).join(' → ') ?? '—'}</span></div>
            </div></div>
          </section>

          <section class="panel">
            <div class="panel-head"><div class="panel-title">${icon('brain', 15)} Agent decisions</div></div>
            <div class="panel-body">
              ${m.decisions.length ? m.decisions.map(d => `
                <div class="mem-card mb-8">
                  <div class="mem-head"><span class="badge badge-green">DECISION</span><span class="fs-11 text-dim ml-auto">${(d.confidence * 100).toFixed(0)}% simulated score</span></div>
                  <div class="fs-12 mt-8" style="color:var(--text-1);font-weight:600">${d.decision}</div>
                  <div class="fs-11 text-dim mt-8">${d.rationale}</div>
                  ${d.sourceMemories.length ? `<div class="mem-meta"><span>based on ${d.sourceMemories.join(', ')}</span></div>` : ''}
                </div>`).join('') : emptyState('agent', 'No recorded decisions', 'Decisions appear when the agent adapts the plan.')}
            </div>
          </section>

          <section class="panel">
            <div class="panel-head"><div class="panel-title">${icon('warning', 15)} Problems encountered</div></div>
            <div class="panel-body">
              ${m.problems.length ? m.problems.map(p => `<div class="kv-row"><span class="k">${icon('warning', 13)}</span><span class="v">${p}</span></div>`).join('') : '<span class="fs-12 text-dim">None recorded.</span>'}
            </div>
          </section>
        </div>
      </div>
    </div>`;

  el.querySelector('#pm-back')?.addEventListener('click', () => navigate('missions'));
  el.querySelector('#pm-live')?.addEventListener('click', () => navigate(`mission/${m.id}`));

  if (replayable) initReplay(el, m);
  bindPmActions(el, m, hasLearned);
}

function whatHappened(m: Mission): string {
  const obstacle = m.events.find(e => e.title === 'Obstacle detected');
  const routeDecision = m.decisions.find(d => /reroute|route via|alternative/i.test(d.decision));
  const memNote = m.status === 'queued'
    ? 'Memory retrieval has not run because this mission has not started.'
    : m.memoryIdsRetrieved.length
      ? `The agent retrieved ${m.memoryIdsRetrieved.length} relevant experience${m.memoryIdsRetrieved.length > 1 ? 's' : ''} (${m.memoryIdsRetrieved.join(', ')}) and used ${routeDecision ? 'them' : 'this context'} during planning/execution.`
      : 'No prior experiences were strongly relevant, so the agent planned from map topology alone.';
  const obstacleNote = obstacle
    ? `Mid-mission, the robot detected an obstacle at ${envById(m.envId).nodes.find(n => n.id === obstacle.atNode)?.name ?? obstacle.atNode ?? 'the planned path'}. ${routeDecision ? `The agent selected an alternative route: ${routeDecision.decision}.` : ''}`
    : m.status === 'queued' ? 'No mission events are recorded because this mission has not started.' : 'No physical disruptions were recorded.';
  const outcome = m.status === 'completed'
    ? `The mission ${m.outcome === 'success' ? 'completed successfully' : 'completed partially'} in ${fmtDuration(m.durationSec)}.`
    : m.status === 'failed' ? `The mission failed: ${m.problems[0] ?? 'see events'}.`
      : m.status === 'queued' ? 'The mission is queued and has not started.'
        : m.status === 'paused' ? `The mission is paused at ${Math.round(m.progress)}% progress.`
          : m.status === 'cancelled' ? 'The mission was cancelled by the operator.' : 'The mission is in progress.';
  return `${obstacleNote} ${memNote} ${outcome}`;
}

function postMortemSections(m: Mission, memUsed: import('../data/types').Memory[], memCreated: import('../data/types').Memory[]): string {
  return `
    <section class="panel">
      <div class="panel-head"><div class="panel-title">${icon('brain', 15)} Learned experience</div></div>
      <div class="panel-body">
        <div class="learned-box">
          <div class="lb-k">WHAT THE SYSTEM LEARNED</div>
          <p>${learnedSummary(m)}</p>
        </div>
        <div class="flex mt-8" style="gap:9px">
          <button class="btn btn-primary" id="pm-save-mem" ${memCreated.length ? 'disabled' : ''}>${memCreated.length ? icon('check', 14) + ' Experience saved' : icon('memory', 14) + ' Save Experience to Long-Term Memory'}</button>
          ${isDemoActive() && !memCreated.length ? `<span class="fs-11 text-dim" style="align-self:center">${demoNextHint()}</span>` : ''}
        </div>
        ${memCreated.length ? `<div class="mt-8">${memCreated.map(mm => `
          <div class="mem-card flash clickable" data-nav="memory/${mm.id}">
            <div class="mem-head"><span class="mem-id" style="color:var(--green)">${mm.id}</span>${badge(mm.category, 'violet')}<span class="ml-auto fs-11 text-dim">${ago(mm.createdAt)}</span></div>
            <div class="mem-text">${mm.text}</div>
          </div>`).join('')}</div>` : ''}
      </div>
    </section>

    <div class="grid-2">
      <section class="panel">
        <div class="panel-head"><div class="panel-title">${icon('memory', 15)} Memories retrieved</div>
        <div class="panel-head-actions"><span class="fs-11 text-dim">${memUsed.length}</span></div></div>
        <div class="panel-body">
          ${memUsed.length ? memUsed.map(mm => `
            <div class="mem-card mb-8 clickable" data-nav="memory/${mm.id}">
              <div class="mem-head"><span class="mem-id">${mm.id}</span>${badge(mm.category, 'violet')}<span class="ml-auto">${relBar(mm.relevance)}</span></div>
              <div class="mem-text clamp-2">${mm.text}</div>
            </div>`).join('') : '<span class="fs-12 text-dim">No memories were retrieved for this mission.</span>'}
        </div>
      </section>
      <section class="panel">
        <div class="panel-head"><div class="panel-title">${icon('route', 15)} Recommended strategy for future missions</div></div>
        <div class="panel-body fs-12" style="color:var(--text-2);line-height:1.7">${recommendedStrategy(m)}</div>
      </section>
    </div>`;
}

function learnedSummary(m: Mission): string {
  const obstacle = m.events.find(e => e.title === 'Obstacle detected');
  const reroute = m.decisions.find(d => /reroute|route via|alternative/i.test(d.decision));
  if (obstacle && reroute) {
    const at = envById(m.envId).nodes.find(n => n.id === obstacle.atNode)?.name ?? 'the planned path';
    return `${m.robotId} encountered an obstruction at ${at} during ${m.type.toLowerCase()} to ${m.destinationName}. ${reroute.decision} — and the mission completed using the alternative. Future missions to ${m.destinationName} should consider this route proactively.`;
  }
  if (m.problems.some(p => /battery/i.test(p))) return `${m.robotId} reached low battery during this mission. Charge before similar missions, or assign a robot above ${60}% battery.`;
  if (m.outcome === 'success') return `Clean ${m.type.toLowerCase()} to ${m.destinationName}. Route via ${m.route?.current.map(id => envById(m.envId).nodes.find(n => n.id === id)?.name).join(' → ')} proved reliable.`;
  return `Mission outcome was ${m.outcome ?? m.status}. Review the event log before repeating this configuration.`;
}

function recommendedStrategy(m: Mission): string {
  const obstacle = m.events.find(e => e.title === 'Obstacle detected');
  if (obstacle && obstacle.atNode) {
    const at = envById(m.envId).nodes.find(n => n.id === obstacle.atNode)?.name;
    const alt = m.route?.current.map(id => envById(m.envId).nodes.find(n => n.id === id)?.name).join(' → ');
    return `For <b style="color:var(--text-1)">${m.destinationName}</b>: prefer the route that avoids <b style="color:var(--text-1)">${at}</b> (known obstruction). The route that worked here: ${alt}. The agent will propose this automatically when planning similar missions.`;
  }
  if (m.problems.some(p => /battery/i.test(p))) return `Start ${m.type.toLowerCase()} missions for ${m.robotId} at ≥ ${60}% battery or schedule a charge stop. Battery-critical events correlate with failed completions.`;
  return `Current strategy remains valid: ${m.type.toLowerCase()} to ${m.destinationName} via the planned route. Keep retrieving related memories before each run.`;
}

function bindPmActions(el: HTMLElement, m: Mission, hasLearned: boolean) {
  const saveBtn = el.querySelector<HTMLButtonElement>('#pm-save-mem');
  if (saveBtn && !hasLearned) {
    saveBtn.addEventListener('click', () => {
      if (saveBtn.disabled) return;
      saveBtn.disabled = true;
      saveBtn.innerHTML = `<span class="spinner"></span> Saving…`;
      setTimeout(() => {
        const mem = saveExperienceToMemory(m);
        toast('success', 'Experience saved to long-term memory', `${mem.id} created via the memory service.`);
        onExperienceSaved(mem.id);
        rerender();
      }, 500);
    });
  }
}

/* ---------------- Replay ---------------- */

function initReplay(el: HTMLElement, m: Mission) {
  const canvas = el.querySelector<HTMLCanvasElement>('#rp-map')!;
  const slider = el.querySelector<HTMLInputElement>('#rp-slider')!;
  const playBtn = el.querySelector<HTMLButtonElement>('#rp-play')!;
  const restartBtn = el.querySelector<HTMLButtonElement>('#rp-restart')!;
  const speedSel = el.querySelector<HTMLSelectElement>('#rp-speed')!;
  const clock = el.querySelector('#rp-clock')!;
  const overlay = el.querySelector('#rp-overlay')!;

  const total = Math.max(1, m.durationSec);
  replayState = { playing: false, t: 0, speed: 1, raf: 0 };

  const draw = () => {
    const t = replayState!.t;
    const path = m.route!.current;
    const segFloat = (t / 100) * (path.length - 1);
    const idx = Math.min(path.length - 2, Math.floor(segFloat));
    const segT = segFloat - idx;
    const env = envById(m.envId);
    const a = env.nodes.find(n => n.id === path[idx]);
    const b = env.nodes.find(n => n.id === path[Math.min(path.length - 1, idx + 1)]);
    const robotXY = a && b ? { x: a.x + (b.x - a.x) * segT, y: a.y + (b.y - a.y) * segT } : null;

    drawEnvMap(canvas, {
      envId: m.envId,
      route: { ...m.route!, pointIndex: idx, current: path.slice(0, idx + 2) },
      robotXY,
      highlightNodes: [m.destinationNode],
      blockedNodeIds: m.events.filter(e => e.title === 'Obstacle detected').map(e => e.atNode!).filter(Boolean),
      progressPct: t,
      animatePulse: false
    });

    /* event overlay: show events that happened before current replay time */
    const simSec = (t / 100) * total;
    const ev = m.events.filter(x => (x.ts - (m.startedAt ?? m.createdAt)) / 1000 <= simSec).slice(-1)[0];
    overlay.innerHTML = ev ? `<span class="badge ${ev.severity === 'critical' ? 'badge-red' : ev.severity === 'warning' ? 'badge-amber' : 'badge-blue'}">${ev.title}</span>` : `<span class="badge badge-gray">Start</span>`;
    clock.textContent = `${Math.floor(simSec / 60)}:${String(Math.floor(simSec % 60)).padStart(2, '0')} / ${fmtDuration(total)}`;
    if (Math.abs(parseFloat(slider.value) - t) > 1) slider.value = String(Math.round(t));
  };

  const loop = () => {
    if (!replayState!.playing) return;
    replayState!.t = Math.min(100, replayState!.t + 0.35 * replayState!.speed);
    draw();
    if (replayState!.t >= 100) { replayState!.playing = false; playBtn.innerHTML = `${icon('play', 13)} Play`; return; }
    replayState!.raf = requestAnimationFrame(loop);
  };

  playBtn.addEventListener('click', () => {
    if (replayState!.playing) {
      replayState!.playing = false;
      playBtn.innerHTML = `${icon('play', 13)} Play`;
    } else {
      if (replayState!.t >= 100) replayState!.t = 0;
      replayState!.playing = true;
      playBtn.innerHTML = `${icon('pause', 13)} Pause`;
      loop();
    }
  });
  restartBtn.addEventListener('click', () => {
    replayState!.t = 0; replayState!.playing = false;
    playBtn.innerHTML = `${icon('play', 13)} Play`;
    draw();
  });
  slider.addEventListener('input', () => {
    replayState!.t = parseFloat(slider.value);
    replayState!.playing = false;
    playBtn.innerHTML = `${icon('play', 13)} Play`;
    draw();
  });
  speedSel.addEventListener('change', () => { replayState!.speed = parseFloat(speedSel.value); });

  draw();
}

export function cleanupReplay() {
  if (replayState) { cancelAnimationFrame(replayState.raf); replayState = null; }
}

function escHtml(s: string): string { return s.replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
void escHtml; void mutate; void confirmDialog;
