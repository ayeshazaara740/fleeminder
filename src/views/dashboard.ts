import { fleetStats, getRobots, getMissions, getMemories, getActiveMissions, getSettings, getState } from '../data/store';
import { icon } from '../components/icons';
import { statCard, statusBadge, batteryCell, signalCell, robotChip, badge, emptyState } from '../components/ui';
import { ago, fmtTime } from '../services/time';
import { navigate } from '../router';

/* Command Center Dashboard */

export function renderDashboard(el: HTMLElement) {
  const stats = fleetStats();
  const robots = getRobots();
  const missions = getMissions();
  const memories = getMemories();
  const activeM = getActiveMissions();
  const recent = missions.slice(0, 6);
  const recentMems = memories.slice(0, 4);
  const sysDegraded = robots.some(r => r.status === 'offline' || r.battery < 20);

  el.innerHTML = `
    <div class="view">
      <div class="view-head">
        <div class="view-title">
          <h1>Command Center</h1>
          <div class="vsub">Fleet overview and live learning-loop status. All robot data is simulated; memory flows are real application state.</div>
        </div>
        <div class="view-head-actions">
          <span class="live-pill ${sysDegraded ? 'paused' : ''}"><span class="ldot"></span>${sysDegraded ? 'Degraded' : 'All systems live'}</span>
          <button class="btn btn-primary" data-nav="mission">${icon('plus', 14)} New Mission</button>
        </div>
      </div>

      <div class="stat-grid">
        ${statCard('Total Robots', stats.total, 'robot', { accent: 'var(--accent)' })}
        ${statCard('Online', stats.online, 'signal', { delta: `${stats.total - stats.online} offline`, deltaDir: 'down' })}
        ${statCard('Active Missions', stats.activeMissions + stats.paused, 'mission', { accent: 'var(--accent-2)', sub: stats.paused ? ` (${stats.paused} paused)` : '' })}
        ${statCard('Completed', stats.completed, 'checkCircle', {})}
        ${statCard('Needs Attention', stats.attention, 'warning', { accent: stats.attention ? 'var(--amber)' : undefined })}
        ${statCard('Avg Battery', stats.avgBattery, 'battery', { sub: '%', accent: stats.avgBattery < 50 ? 'var(--amber)' : 'var(--green)' })}
        ${statCard('Success Rate', stats.successRate, 'target', { sub: '%' })}
        ${statCard('Memories Today', stats.memoriesToday, 'brain', { accent: 'var(--accent-2)' })}
      </div>

      <div class="grid-2-1 mt">
        <section class="panel">
          <div class="panel-head">
            <div>
              <div class="panel-title">${icon('fleet', 15)} Fleet Overview</div>
              <div class="panel-sub">Live robot status — updates with the simulation tick</div>
            </div>
            <div class="panel-head-actions"><button class="btn btn-sm" data-nav="fleet">Manage fleet ${icon('chevronRight', 12)}</button></div>
          </div>
          <div class="panel-body tight">
            <div class="table-wrap">
              <table class="data-table">
                <thead><tr><th>Robot</th><th>Status</th><th>Battery</th><th>Current Mission</th><th>Location</th><th>Signal</th><th>Last Activity</th></tr></thead>
                <tbody>
                  ${robots.map(r => {
                    const m = missions.find(x => x.id === r.currentMissionId);
                    return `<tr class="clickable" data-robot-row="${r.id}" data-nav="fleet/${r.id}">
                      <td><div class="td-main">${robotChip(r.id, r.name)}</div><div class="robot-id">${r.model}</div></td>
                      <td>${statusBadge(r.status)}</td>
                      <td>${batteryCell(r.battery)}</td>
                      <td>${m ? `<span class="tag" data-nav="mission/${m.id}">${m.code}</span>` : '<span class="text-dim">—</span>'}</td>
                      <td>${r.location}</td>
                      <td>${signalCell(r.signal)}</td>
                      <td class="nowrap text-dim">${ago(new Date(r.lastActivity).getTime())}</td>
                    </tr>`;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <div class="stack">
          <section class="panel">
            <div class="panel-head"><div><div class="panel-title">${icon('activity', 15)} System Status</div></div></div>
            <div class="panel-body">
              <div class="flex" style="gap:10px"><span class="status-dot ${sysDegraded ? 'degraded' : ''}" id="dashboard-status-dot"></span><div><b style="color:var(--text-1)" id="dashboard-status-label">${sysDegraded ? 'Degraded — attention needed' : 'Operational'}</b><div class="fs-11 text-dim" id="dashboard-active-label">Simulation engine running · ${activeM.length} mission(s) in flight</div></div></div>
              <hr class="divider" />
              <div class="kv-list">
                  <div class="kv-row"><span class="k">Simulation engine</span><span class="v" id="dashboard-engine-state">${activeM.length ? 'Active' : 'Standby'}</span></div>
                <div class="kv-row"><span class="k">Memory provider</span><span class="v">Internal simulated store</span></div>
                <div class="kv-row"><span class="k">Memory recall</span><span class="v">${getSettings().memoryRecallEnabled ? 'Enabled' : 'Disabled'}</span></div>
                  <div class="kv-row"><span class="k">Sim speed</span><span class="v" id="dashboard-sim-speed">${getSettings().simSpeed}×</span></div>
              </div>
              <button class="btn btn-sm btn-block mt-8" data-nav="settings">${icon('settings', 13)} Open settings</button>
            </div>
          </section>

          <section class="panel">
            <div class="panel-head"><div><div class="panel-title">${icon('brain', 15)} Memory Pulse</div><div class="panel-sub">Latest persistent experiences</div></div></div>
            <div class="panel-body" id="dashboard-memory-pulse">
                ${renderMemoryPulse()}
            </div>
          </section>
        </div>
      </div>

      <div class="grid-2 mt">
        <section class="panel">
          <div class="panel-head">
            <div><div class="panel-title">${icon('mission', 15)} Recent Missions</div></div>
            <div class="panel-head-actions"><button class="btn btn-sm" data-nav="missions">History ${icon('chevronRight', 12)}</button></div>
          </div>
          <div class="panel-body tight">
            <table class="data-table">
              <thead><tr><th>Mission</th><th>Robot</th><th>Status</th><th>Progress</th><th>Started</th></tr></thead>
                <tbody>
                ${recent.map(m => `<tr class="clickable" data-mission-row="${m.id}" data-nav="mission/${m.id}">
                  <td><div class="td-main">${m.code}</div><div class="fs-11 text-dim">${m.type} → ${m.destinationName}</div></td>
                  <td>${robotChip(m.robotId)}</td>
                  <td>${statusBadge(m.status)}</td>
                  <td style="min-width:90px">${m.status === 'active' || m.status === 'paused' ? `<div class="meter"><span style="width:${m.progress}%;background:var(--accent)"></span></div><span class="fs-11 text-dim">${Math.round(m.progress)}%</span>` : `<span class="fs-11 text-dim">${m.outcome ?? m.status}</span>`}</td>
                  <td class="nowrap text-dim">${fmtTime(m.startedAt)}</td>
                </tr>`).join('')}
              </tbody>
            </table>
          </div>
        </section>

        <section class="panel">
          <div class="panel-head">
            <div><div class="panel-title">${icon('alert', 15)} Recent Alerts</div></div>
            <div class="panel-head-actions"><button class="btn btn-sm" data-nav="alerts">Event center ${icon('chevronRight', 12)}</button></div>
          </div>
          <div class="panel-body tight" id="dashboard-recent-alerts">
            ${renderRecentAlerts()}
          </div>
        </section>
      </div>
    </div>`;

  bindNavigation(el);
}

export function refreshDashboardLive() {
  const root = document.getElementById('content');
  if (!root?.querySelector('.view')) return;
  const stats = fleetStats();
  const robots = getRobots();
  const missions = getMissions();
  const memories = getMemories();
  const activeM = getActiveMissions();
  const statValues = root.querySelectorAll<HTMLElement>('.stat-card .stat-value');
  const values = [
    `${stats.total}`,
    `${stats.online}`,
    `${stats.activeMissions + stats.paused}<span class="unit">${stats.paused ? ` (${stats.paused} paused)` : ''}</span>`,
    `${stats.completed}`,
    `${stats.attention}`,
    `${stats.avgBattery}<span class="unit">%</span>`,
    `${stats.successRate}<span class="unit">%</span>`,
    `${stats.memoriesToday}`
  ];
  statValues.forEach((node, index) => { if (values[index] !== undefined) node.innerHTML = values[index]; });

  const offline = stats.total - stats.online;
  const onlineDelta = statValues[1]?.closest('.stat-card')?.querySelector('.stat-delta');
  if (onlineDelta) onlineDelta.innerHTML = `<span class="${offline ? 'down' : 'up'}">${offline ? '▼' : '▲'}</span>${offline} offline`;

  robots.forEach(robot => {
    const row = root.querySelector<HTMLTableRowElement>(`[data-robot-row="${robot.id}"]`);
    if (!row) return;
    const mission = missions.find(item => item.id === robot.currentMissionId);
    row.cells[1].innerHTML = statusBadge(robot.status);
    row.cells[2].innerHTML = batteryCell(robot.battery);
    row.cells[3].innerHTML = mission ? `<span class="tag" data-nav="mission/${mission.id}">${mission.code}</span>` : '<span class="text-dim">—</span>';
    row.cells[4].textContent = robot.location;
    row.cells[5].innerHTML = signalCell(robot.signal);
    row.cells[6].textContent = ago(new Date(robot.lastActivity).getTime());
    bindNavigation(row);
  });

  missions.slice(0, 6).forEach(mission => {
    const row = root.querySelector<HTMLTableRowElement>(`[data-mission-row="${mission.id}"]`);
    if (!row) return;
    row.cells[2].innerHTML = statusBadge(mission.status);
    row.cells[3].innerHTML = mission.status === 'active' || mission.status === 'paused'
      ? `<div class="meter"><span style="width:${mission.progress}%;background:var(--accent)"></span></div><span class="fs-11 text-dim">${Math.round(mission.progress)}%</span>`
      : `<span class="fs-11 text-dim">${mission.outcome ?? mission.status}</span>`;
    row.cells[4].textContent = fmtTime(mission.startedAt);
  });

  const degraded = robots.some(robot => robot.status === 'offline' || robot.battery < 20);
  root.querySelector('#dashboard-status-dot')?.classList.toggle('degraded', degraded);
  const statusLabel = root.querySelector('#dashboard-status-label');
  if (statusLabel) statusLabel.textContent = degraded ? 'Degraded — attention needed' : 'Operational';
  const activeLabel = root.querySelector('#dashboard-active-label');
  if (activeLabel) activeLabel.textContent = `Simulation engine running · ${activeM.length} mission(s) in flight`;
  const engineState = root.querySelector('#dashboard-engine-state');
  if (engineState) engineState.textContent = activeM.length ? 'Active' : 'Standby';
  const speed = root.querySelector('#dashboard-sim-speed');
  if (speed) speed.textContent = `${getSettings().simSpeed}×`;
  const alertRegion = root.querySelector('#dashboard-recent-alerts');
  if (alertRegion) alertRegion.innerHTML = renderRecentAlerts();
  const memoryRegion = root.querySelector('#dashboard-memory-pulse');
  if (memoryRegion) {
    memoryRegion.innerHTML = renderMemoryPulse(memories);
    bindNavigation(memoryRegion);
  }
}

function renderMemoryPulse(memories = getMemories()): string {
  const recentMems = memories.slice(0, 4);
  return `${recentMems.length ? recentMems.map(m => `
    <div class="mem-card mb-8 clickable" data-nav="memory/${m.id}" role="button" tabindex="0">
      <div class="mem-head"><span class="mem-id">${m.id}</span>${badge(m.category, 'violet')}<span class="ml-auto fs-11 text-dim">${ago(m.createdAt)}</span></div>
      <div class="mem-text clamp-2">${m.text}</div>
    </div>`).join('') : emptyState('memory', 'No memories yet', 'Complete missions to build experience.')}
    <button class="btn btn-sm btn-block" data-nav="memory">${icon('memory', 13)} Persistent Memory Center</button>`;
}

function bindNavigation(root: ParentNode) {
  root.querySelectorAll<HTMLElement>('[data-nav]').forEach(node => {
    if (node.dataset.navBound) return;
    node.dataset.navBound = 'true';
    node.addEventListener('click', e => {
      e.stopPropagation();
      navigate(node.dataset.nav!);
    });
  });
}

function renderRecentAlerts(): string {
  const alerts = getState().alerts.slice(0, 5);
  if (!alerts.length) return emptyState('checkCircle', 'No alerts', 'The fleet is operating normally.');
  return alerts.map(a => `
    <div class="kv-row" style="padding:9px 16px">
      <span class="flex" style="gap:8px">${icon(sevIcon(a.severity), 14)}<span><span style="color:var(--text-1);font-weight:600">${a.title}</span><div class="fs-11 text-dim">${a.detail}</div></span></span>
      <span class="fs-11 text-dim nowrap">${ago(a.ts)}</span>
    </div>`).join('');
}

function sevIcon(sev: string): string {
  return sev === 'critical' ? 'xCircle' : sev === 'warning' ? 'warning' : sev === 'success' ? 'checkCircle' : 'info';
}
