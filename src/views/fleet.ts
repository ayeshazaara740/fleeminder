import type { Robot, Mission } from '../data/types';
import { getRobots, getMissions, getMemories, getState, patchRobot } from '../data/store';
import { icon } from '../components/icons';
import { badge, statusBadge, batteryCell, signalCell, robotChip, emptyState, toast } from '../components/ui';
import { ago, fmtDate, fmtDuration } from '../services/time';
import { navigate } from '../router';
import { lineChart, chartLegend } from '../components/charts';

/* Robot Fleet management + detail profiles. */

let filterStatus = '';
let filterQuery = '';
let compareIds: string[] = [];

export function renderFleet(el: HTMLElement, param?: string) {
  if (param) { renderRobotDetail(el, param); return; }

  const robots = getRobots();
  const missions = getMissions();
  const filtered = robots.filter(r => {
    if (filterStatus && r.status !== filterStatus) return false;
    if (filterQuery && !`${r.id} ${r.name} ${r.model} ${r.location}`.toLowerCase().includes(filterQuery)) return false;
    return true;
  });

  el.innerHTML = `
    <div class="view">
      <div class="view-head">
        <div class="view-title">
          <h1>Robot Fleet</h1>
          <div class="vsub">Each robot accumulates an operational profile derived from its mission history — strengths, issues, and learned preferences.</div>
        </div>
        <div class="view-head-actions">
          <button class="btn" id="cmp-toggle">${icon('compare', 14)} Compare (${compareIds.length})</button>
        </div>
      </div>

      <div class="filter-bar">
        <input id="flt-q" class="input grow" placeholder="Search robots…" value="${filterQuery}" />
        <select id="flt-status" class="input">
          <option value="">All statuses</option>
          ${['online', 'executing', 'idle', 'charging', 'warning', 'offline'].map(s => `<option value="${s}" ${filterStatus === s ? 'selected' : ''}>${s}</option>`).join('')}
        </select>
        <span class="filter-count">${filtered.length} robots</span>
      </div>

      <div class="compare-grid">
        ${filtered.map(r => robotCard(r, missions)).join('')}
      </div>

      <div id="compare-area"></div>
    </div>`;

  el.querySelector('#flt-q')?.addEventListener('input', e => { filterQuery = (e.target as HTMLInputElement).value.toLowerCase(); rerender(); });
  el.querySelector('#flt-status')?.addEventListener('change', e => { filterStatus = (e.target as HTMLSelectElement).value; rerender(); });
  el.querySelector('#cmp-toggle')?.addEventListener('click', () => {
    if (compareIds.length < 2) { toast('info', 'Select robots to compare', 'Click “Add to compare” on at least two robot cards.'); return; }
    renderCompare(el.querySelector('#compare-area')!);
  });

  el.querySelectorAll<HTMLElement>('[data-nav]').forEach(n => n.addEventListener('click', e => { e.stopPropagation(); navigate(n.dataset.nav!); }));
  el.querySelectorAll<HTMLButtonElement>('[data-cmp]').forEach(b => b.addEventListener('click', e => {
    e.stopPropagation();
    const id = b.dataset.cmp!;
    if (compareIds.includes(id)) compareIds = compareIds.filter(x => x !== id);
    else if (compareIds.length < 3) compareIds.push(id);
    else toast('warning', 'Compare limit', 'Up to 3 robots can be compared.');
    rerender();
  }));
}

function rerender() {
  const root = document.querySelector('.content');
  if (root) renderFleet(root as HTMLElement);
}

function robotCard(r: Robot, missions: Mission[]): string {
  const mine = missions.filter(m => m.robotId === r.id);
  const done = mine.filter(m => m.outcome === 'success').length;
  const active = mine.find(m => m.status === 'active');
  return `
    <div class="compare-card clickable" data-nav="fleet/${r.id}" role="button" tabindex="0" style="cursor:pointer">
      <div class="flex" style="gap:10px">
        ${robotChip(r.id, r.name)}
        <span class="ml-auto">${statusBadge(r.status)}</span>
      </div>
      <div class="fs-11 text-dim mt-8">${r.model} · ${r.location}</div>
      <div class="mt-8">${batteryCell(r.battery)}</div>
      <div class="mt-8">${signalCell(r.signal)}</div>
      <div class="compare-row" style="margin-top:8px"><span class="text-dim">Current mission</span><span>${active ? active.code : '—'}</span></div>
      <div class="compare-row"><span class="text-dim">Missions</span><span>${r.missionCount}</span></div>
      <div class="compare-row"><span class="text-dim">Success rate</span><span>${Math.round((r.successCount / Math.max(1, r.missionCount)) * 100)}%</span></div>
      <div class="compare-row"><span class="text-dim">Health</span><span>${badge(`${r.healthScore}/100`, r.healthScore > 85 ? 'green' : r.healthScore > 70 ? 'amber' : 'red')}</span></div>
      <div class="compare-row"><span class="text-dim">Last maintenance</span><span>${fmtDate(new Date(r.lastMaintenance).getTime())}</span></div>
      <div class="flex mt-8">
        <span class="fs-11 text-dim">${mine.length} tracked missions · ${done} successful</span>
        <button class="btn btn-sm btn-ghost ml-auto" data-cmp="${r.id}">${compareIds.includes(r.id) ? '✓ Comparing' : '+ Compare'}</button>
      </div>
    </div>`;
}

function renderCompare(area: Element) {
  const robots = getRobots().filter(r => compareIds.includes(r.id));
  const missions = getMissions();
  const rows: Array<[string, (r: Robot) => string]> = [
    ['Status', r => statusBadge(r.status)],
    ['Battery', r => `${Math.round(r.battery)}%`],
    ['Signal', r => `${r.signal}%`],
    ['Health', r => `${r.healthScore}/100`],
    ['Missions', r => String(r.missionCount)],
    ['Success rate', r => `${Math.round((r.successCount / Math.max(1, r.missionCount)) * 100)}%`],
    ['Avg duration', r => {
      const mine = missions.filter(m => m.robotId === r.id && m.durationSec > 0);
      return mine.length ? fmtDuration(mine.reduce((a, m) => a + m.durationSec, 0) / mine.length) : '—';
    }],
    ['Memories held', r => String(getMemories().filter(m => m.robotId === r.id).length)],
    ['Last maintenance', r => fmtDate(new Date(r.lastMaintenance).getTime())]
  ];
  area.innerHTML = `
    <section class="panel mt">
      <div class="panel-head">
        <div class="panel-title">${icon('compare', 15)} Robot Comparison</div>
        <div class="panel-head-actions"><button class="btn btn-sm" id="cmp-clear">Clear</button></div>
      </div>
      <div class="panel-body">
        <div class="grid-3">
          ${robots.map(r => `
            <div class="compare-card">
              <div class="flex mb-8">${robotChip(r.id, r.name)}<span class="ml-auto">${statusBadge(r.status)}</span></div>
              ${rows.map(([label, fn]) => `<div class="compare-row"><span class="text-dim">${label}</span><span>${fn(r)}</span></div>`).join('')}
            </div>`).join('')}
        </div>
      </div>
    </section>`;
  area.querySelector('#cmp-clear')?.addEventListener('click', () => { compareIds = []; area.innerHTML = ''; rerender(); });
}

/* ---------------- Robot detail ---------------- */

let detailTab = 'overview';

function renderRobotDetail(el: HTMLElement, id: string) {
  const r = getRobots().find(x => x.id === id);
  if (!r) { navigate('fleet'); return; }
  const missions = getMissions().filter(m => m.robotId === id);
  const memories = getMemories().filter(m => m.robotId === id);
  const tele = getState().telemetry[id] ?? [];

  const tabs: Array<[string, string]> = [
    ['overview', 'Overview'], ['missions', 'Mission History'], ['memory', 'Memory'],
    ['performance', 'Performance'], ['telemetry', 'Telemetry'], ['events', 'Events']
  ];

  el.innerHTML = `
    <div class="view">
      <div class="view-head">
        <div class="view-title">
          <h1>${robotChip(r.id, r.name)} <span style="font-weight:400;color:var(--text-3);font-size:14px">· ${r.model}</span></h1>
          <div class="vsub flex flex-wrap" style="gap:6px">${statusBadge(r.status)} ${badge(r.location, 'gray')} ${badge(`${r.battery}% battery`, r.battery > 40 ? 'green' : 'amber')} ${badge(`Health ${r.healthScore}/100`, r.healthScore > 85 ? 'green' : 'amber')}</div>
        </div>
        <div class="view-head-actions">
          <button class="btn" id="rd-back">${icon('chevronRight', 13)} Back to fleet</button>
          ${r.currentMissionId ? `<button class="btn btn-primary" id="rd-mission">${icon('mission', 14)} Current mission</button>` : ''}
        </div>
      </div>

      <div class="tab-bar">
        ${tabs.map(([tid, label]) => `<button data-tab="${tid}" class="${detailTab === tid ? 'active' : ''}">${label}</button>`).join('')}
      </div>
      <div id="rd-body"></div>
    </div>`;

  const body = el.querySelector('#rd-body')!;
  if (detailTab === 'overview') body.innerHTML = overviewTab(r, missions, memories);
  else if (detailTab === 'missions') body.innerHTML = missionsTab(missions);
  else if (detailTab === 'memory') body.innerHTML = memoryTab(memories);
  else if (detailTab === 'performance') body.innerHTML = performanceTab(r, missions);
  else if (detailTab === 'telemetry') { body.innerHTML = telemetryTab(tele); drawTeleCharts(body, tele, r); }
  else body.innerHTML = eventsTab(missions);

  el.querySelectorAll('.tab-bar button').forEach(b => b.addEventListener('click', () => {
    detailTab = (b as HTMLElement).dataset.tab!;
    renderRobotDetail(el, id);
  }));
  el.querySelector('#rd-back')?.addEventListener('click', () => navigate('fleet'));
  el.querySelector('#rd-mission')?.addEventListener('click', () => navigate(`mission/${r.currentMissionId}`));
  el.querySelectorAll<HTMLElement>('[data-nav]').forEach(n => n.addEventListener('click', e => { e.stopPropagation(); navigate(n.dataset.nav!); }));
  el.querySelectorAll<HTMLButtonElement>('[data-review]').forEach(b => b.addEventListener('click', () => {
    patchRobot(r.id, { healthScore: Math.min(100, r.healthScore + 4) });
    toast('success', 'Maintenance logged', `${r.id} health improved after review.`);
    renderRobotDetail(el, id);
  }));
}

function overviewTab(r: Robot, missions: Mission[], memories: import('../data/types').Memory[]): string {
  const strengths = r.knownStrengths.length ? r.knownStrengths : ['Still building profile from mission history'];
  const issues = r.knownIssues.length ? r.knownIssues : ['No recurring issues detected'];
  const prefs = r.learnedPreferences.length ? r.learnedPreferences : ['No learned preferences yet'];
  return `
    <div class="grid-2">
      <section class="panel">
        <div class="panel-head"><div class="panel-title">${icon('robot', 15)} Operational Profile</div>
        <div class="panel-head-actions"><span class="badge badge-cyan">DERIVED FROM MISSION HISTORY</span></div></div>
        <div class="panel-body">
          <div class="kv-list">
            <div class="kv-row"><span class="k">Status</span><span class="v">${statusBadge(r.status)}</span></div>
            <div class="kv-row"><span class="k">Battery</span><span class="v">${batteryCell(r.battery)}</span></div>
            <div class="kv-row"><span class="k">Signal</span><span class="v">${signalCell(r.signal)}</span></div>
            <div class="kv-row"><span class="k">Temperature</span><span class="v">${r.temperature.toFixed(1)} °C</span></div>
            <div class="kv-row"><span class="k">Location</span><span class="v">${r.location}</span></div>
            <div class="kv-row"><span class="k">Connectivity</span><span class="v">${r.signal > 70 ? 'Strong' : r.signal > 45 ? 'Fair' : 'Weak'}</span></div>
            <div class="kv-row"><span class="k">Missions</span><span class="v">${r.missionCount} (${Math.round((r.successCount / Math.max(1, r.missionCount)) * 100)}% success)</span></div>
            <div class="kv-row"><span class="k">Last maintenance</span><span class="v">${fmtDate(new Date(r.lastMaintenance).getTime())} <button class="btn btn-sm btn-ghost" data-review>Log review</button></span></div>
          </div>
        </div>
      </section>
      <div class="stack">
        <section class="panel">
          <div class="panel-head"><div class="panel-title">${icon('checkCircle', 15)} Known strengths</div></div>
          <div class="panel-body">${strengths.map(s => `<div class="kv-row"><span class="k">${icon('check', 13)}</span><span class="v">${s}</span></div>`).join('')}</div>
        </section>
        <section class="panel">
          <div class="panel-head"><div class="panel-title">${icon('warning', 15)} Known issues</div></div>
          <div class="panel-body">${issues.map(s => `<div class="kv-row"><span class="k">${icon('warning', 13)}</span><span class="v">${s}</span></div>`).join('')}</div>
        </section>
        <section class="panel">
          <div class="panel-head"><div class="panel-title">${icon('brain', 15)} Learned preferences</div></div>
          <div class="panel-body">${prefs.map(s => `<div class="kv-row"><span class="k">${icon('memory', 13)}</span><span class="v">${s}</span></div>`).join('')}</div>
        </section>
      </div>
    </div>
    <section class="panel mt">
      <div class="panel-head"><div class="panel-title">${icon('database', 15)} Experience behind this profile</div>
      <div class="panel-head-actions"><span class="fs-11 text-dim">${memories.length} memories · ${missions.length} tracked missions</span></div></div>
      <div class="panel-body">
        ${memories.length ? `<div class="grid-2">${memories.slice(0, 4).map(m => `
          <div class="mem-card clickable" data-nav="memory/${m.id}">
            <div class="mem-head"><span class="mem-id">${m.id}</span>${badge(m.category, 'violet')}<span class="ml-auto fs-11 text-dim">${fmtDate(m.createdAt)}</span></div>
            <div class="mem-text clamp-2">${m.text}</div>
          </div>`).join('')}</div>` : emptyState('memory', 'No memories yet', 'This robot has not generated persistent experience in tracked missions.')}
      </div>
    </section>`;
}

function missionsTab(missions: Mission[]): string {
  if (!missions.length) return emptyState('mission', 'No missions', 'This robot has not run tracked missions yet.');
  return `<section class="panel"><div class="panel-body tight"><div class="table-wrap"><table class="data-table">
    <thead><tr><th>Mission</th><th>Type</th><th>Destination</th><th>Status</th><th>Duration</th><th>Mems</th><th></th></tr></thead>
    <tbody>${missions.map(m => `<tr class="clickable" data-nav="missions/${m.id}">
      <td class="td-main">${m.code}</td><td>${m.type}</td><td>${m.destinationName}</td>
      <td>${statusBadge(m.status)}</td><td class="text-dim">${fmtDuration(m.durationSec)}</td>
      <td class="text-dim">${m.memoryIdsRetrieved.length}↧ / ${m.memoryIdsCreated.length}↥</td>
      <td>${icon('chevronRight', 13)}</td></tr>`).join('')}</tbody>
  </table></div></div></section>`;
}

function memoryTab(memories: import('../data/types').Memory[]): string {
  if (!memories.length) return emptyState('memory', 'No memories', 'Complete missions to build this robot\'s experience.');
  return `<div class="grid-2">${memories.map(m => `
    <div class="mem-card clickable" data-nav="memory/${m.id}">
      <div class="mem-head"><span class="mem-id">${m.id}</span>${badge(m.category, 'violet')}<span class="ml-auto fs-11 text-dim">${m.retrievalCount}× recalled</span></div>
      <div class="mem-text">${m.text}</div>
      <div class="mem-meta"><span>Created ${fmtDate(m.createdAt)}</span><span>Last retrieved ${m.lastRetrievedAt ? ago(m.lastRetrievedAt) : 'never'}</span></div>
    </div>`).join('')}</div>`;
}

function performanceTab(r: Robot, missions: Mission[]): string {
  const done = missions.filter(m => m.durationSec > 0);
  const avg = done.length ? done.reduce((a, m) => a + m.durationSec, 0) / done.length : 0;
  const success = missions.filter(m => m.outcome === 'success').length;
  const rated = missions.filter(m => m.outcome);
  return `
    <div class="stat-grid" style="grid-template-columns:repeat(4,1fr)">
      <div class="stat-card"><div class="stat-top">${icon('checkCircle', 13)}<span>Success rate</span></div><div class="stat-value">${rated.length ? Math.round((success / rated.length) * 100) : 100}<span class="unit">%</span></div></div>
      <div class="stat-card"><div class="stat-top">${icon('clock', 13)}<span>Avg duration</span></div><div class="stat-value">${Math.round(avg / 60)}<span class="unit">min</span></div></div>
      <div class="stat-card"><div class="stat-top">${icon('route', 13)}<span>Total distance</span></div><div class="stat-value">${(missions.reduce((a, m) => a + m.distanceM, 0) / 1000).toFixed(1)}<span class="unit">km</span></div></div>
      <div class="stat-card"><div class="stat-top">${icon('brain', 13)}<span>Memories</span></div><div class="stat-value">${getMemories().filter(m => m.robotId === r.id).length}</div></div>
    </div>
    <section class="panel mt"><div class="panel-head"><div class="panel-title">${icon('analytics', 15)} Mission durations (tracked missions)</div></div>
    <div class="panel-body"><div class="chart-box" style="height:200px"><canvas id="rd-perf" style="height:200px"></canvas></div></div></section>`;
}

function telemetryTab(tele: import('../data/types').TelemetrySample[]): string {
  const last = tele[tele.length - 1];
  if (!last) return emptyState('activity', 'No telemetry yet', 'Telemetry appears while missions run. Start a mission to see live data.');
  return `
    <div class="stat-grid" style="grid-template-columns:repeat(4,1fr)">
      <div class="stat-card"><div class="stat-top">${icon('battery', 13)}<span>Battery</span></div><div class="stat-value">${last.battery}<span class="unit">%</span></div></div>
      <div class="stat-card"><div class="stat-top">${icon('speed', 13)}<span>Speed</span></div><div class="stat-value">${last.speed.toFixed(2)}<span class="unit">m/s</span></div></div>
      <div class="stat-card"><div class="stat-top">${icon('temp', 13)}<span>Temperature</span></div><div class="stat-value">${last.temperature.toFixed(1)}<span class="unit">°C</span></div></div>
      <div class="stat-card"><div class="stat-top">${icon('signal', 13)}<span>Signal</span></div><div class="stat-value">${last.signal}<span class="unit">%</span></div></div>
    </div>
    <section class="panel mt"><div class="panel-head"><div class="panel-title">${icon('activity', 15)} Telemetry history</div>
    <div class="panel-head-actions"><span class="badge badge-cyan">SIMULATED TELEMETRY</span></div></div>
    <div class="panel-body">
      <div class="chart-box" style="height:180px"><canvas id="rd-tele-batt" style="height:180px"></canvas></div>
      <div class="chart-box mt-16" style="height:180px"><canvas id="rd-tele-sig" style="height:180px"></canvas></div>
    </div></section>`;
}

function drawTeleCharts(body: Element, tele: import('../data/types').TelemetrySample[], r: Robot) {
  const batt = body.querySelector<HTMLCanvasElement>('#rd-tele-batt');
  const sig = body.querySelector<HTMLCanvasElement>('#rd-tele-sig');
  if (tele.length && batt) {
    lineChart(batt, tele.map((_, i) => String(i)), [{ label: `${r.id} battery %`, color: '#4f8cff', values: tele.map(t => t.battery) }], { yMin: 0, yMax: 100 });
    batt.insertAdjacentHTML('afterend', chartLegend([{ label: 'Battery %', color: '#4f8cff' }]));
  }
  if (tele.length && sig) {
    lineChart(sig, tele.map((_, i) => String(i)), [{ label: 'Signal %', color: '#38d9f5', values: tele.map(t => t.signal) }], { yMin: 0, yMax: 100 });
    sig.insertAdjacentHTML('afterend', chartLegend([{ label: 'Signal strength %', color: '#38d9f5' }]));
  }
}

function eventsTab(missions: Mission[]): string {
  const evs = missions.flatMap(m => m.events.map(e => ({ ...e, code: m.code }))).sort((a, b) => b.ts - a.ts).slice(0, 40);
  if (!evs.length) return emptyState('activity', 'No events', 'Events appear when missions run.');
  return `<section class="panel"><div class="panel-body tight">${evs.map(e => `
    <div class="kv-row" style="padding:9px 16px">
      <span><span class="td-main">${e.title}</span> <span class="fs-11 text-dim">· ${e.code}</span>${e.detail ? `<div class="fs-11 text-dim">${e.detail}</div>` : ''}</span>
      <span class="fs-11 text-dim nowrap">${ago(e.ts)}</span>
    </div>`).join('')}</div></section>`;
}
