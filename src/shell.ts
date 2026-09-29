import { subscribe, getState, getSettings, fleetStats, markAllNotificationsRead, markNotificationRead, clearNotifications, getMission, getRobot } from './data/store';
import { navigate, onRoute, currentRoute, startRouter } from './router';
import { icon } from './components/icons';
import { toast, ensureToastStack, segGroup, confirmDialog } from './components/ui';
import { openPalette, closePalette } from './components/commandPalette';
import { ago } from './services/time';
import { renderDashboard, refreshDashboardLive } from './views/dashboard';
import { ENVIRONMENTS } from './data/environments';
import { renderMissionControl, cleanupWorkspace } from './views/missionControl';
import { renderMissionHistory, cleanupReplay } from './views/missions';
import { renderMemoryCenter } from './views/memory';
import { renderRecall } from './views/recall';
import { renderFleet } from './views/fleet';
import { renderAnalytics } from './views/analytics';
import { renderAlerts } from './views/alerts';
import { renderAgent, renderAssistant } from './views/assistant';
import { renderSettings } from './views/settings';
import { startDemo, stopDemo, resetDemo, isDemoActive, setDemoUI, DEMO_STEPS, demoProgressLabels, getDemoState, skipToNextPhase } from './demo';

/* App shell — persistent sidebar (desktop) / drawer (mobile), topbar, notifications. */

const NAV: Array<{ section?: string; items: Array<[string, string, string]> }> = [
  {
    section: 'Operations',
    items: [
      ['dashboard', 'Dashboard', 'dashboard'],
      ['mission', 'Mission Control', 'mission'],
      ['sim', 'Live Simulation', 'sim'],
      ['fleet', 'Robot Fleet', 'fleet']
    ]
  },
  {
    section: 'Intelligence',
    items: [
      ['memory', 'Memory Center', 'memory'],
      ['recall', 'Memory Recall Flow', 'brain'],
      ['agent', 'AI Mission Agent', 'agent'],
      ['analytics', 'Analytics', 'analytics']
    ]
  },
  {
    section: 'Records',
    items: [
      ['missions', 'Mission History', 'history'],
      ['alerts', 'Alerts & Events', 'alert']
    ]
  },
  {
    section: 'System',
    items: [
      ['settings', 'Settings', 'settings']
    ]
  }
];

const TITLES: Record<string, string> = {
  dashboard: 'Command Center', mission: 'Mission Control', sim: 'Live Simulation',
  fleet: 'Robot Fleet', memory: 'Persistent Memory Center', recall: 'Memory Recall Flow',
  agent: 'AI Mission Agent', analytics: 'Analytics', missions: 'Mission History',
  alerts: 'Alerts & Events', settings: 'Settings'
};

let sidebarOpen = false;
let notifOpen = false;
let simSpeedTicker: ReturnType<typeof setInterval> | null = null;

export function initShell(root: HTMLElement) {
  ensureToastStack();

  root.innerHTML = `
    <div class="app-root">
      <div class="sidebar-backdrop mobile-only" id="sb-backdrop" style="display:none;position:fixed;inset:0;background:rgba(4,8,16,.6);z-index:55"></div>
      <aside class="sidebar" id="sidebar" aria-label="Main navigation">
        <div class="sidebar-head">
          <div class="brand-mark">${icon('brain', 18)}</div>
          <div><div class="brand-name">FleetMinder</div><div class="brand-sub">Mission Learning</div></div>
        </div>
        <nav class="sidebar-nav" id="sb-nav"></nav>
        <div class="sidebar-foot">
          <div class="sys-status" id="sb-sysstatus"><span class="status-dot"></span><span class="sys-txt"><b>Operational</b></span><span class="sys-sub" id="sb-clock"></span></div>
        </div>
      </aside>
      <div class="main-col">
        <header class="topbar">
          <button class="icon-btn mobile-only" id="tb-menu" aria-label="Open navigation">${icon('grid', 17)}</button>
          <div><div class="topbar-title" id="tb-title">Command Center</div><div class="topbar-crumb" id="tb-crumb">Overview</div></div>
          <div class="topbar-spacer"></div>
          <button class="topbar-search" id="tb-search" aria-label="Global search">
            ${icon('search', 14)}<span class="ts-label">Search everything…</span><kbd>/</kbd>
          </button>
          <span id="tb-demo"></span>
          <span id="tb-simctl"></span>
          <button class="icon-btn" id="tb-notif" aria-label="Notifications">${icon('bell', 17)}<span class="dot hidden" id="tb-notif-dot"></span></button>
        </header>
        <main class="content" id="content" tabindex="-1"></main>
      </div>
    </div>`;

  renderNav();
  bindTopbar();
  bindKeyboard();
  initSimControl();
  initDemoGuide();

  onRoute((view, param) => {
    renderView(view, param);
    renderNav();
    closeMobileSidebar();
    closeNotif();
  });
  startRouter();

  /* store-driven refreshes */
  let lastNotifCount = -1;
  let lastAlerts = -1;
  subscribe(() => {
    const st = getState();
    const unread = st.notifications.filter(n => !n.read).length;
    const dot = document.getElementById('tb-notif-dot');
    if (dot) dot.classList.toggle('hidden', unread === 0);
    if (unread !== lastNotifCount && lastNotifCount >= 0 && unread > lastNotifCount && !notifOpen) {
      const { view, param } = currentRoute();
      if (view === 'dashboard') refreshDashboardLive();
      else if (view === 'alerts' || view === 'memory') renderView(view, param);
    }
    lastNotifCount = unread;
    const unreviewed = st.alerts.filter(a => !a.reviewed).length;
    updateNavBadges(unreviewed);
    lastAlerts = unreviewed;
    void lastAlerts;
    updateSysStatus();
    if (notifOpen) renderNotifPanel();
  });

  /* live clock + periodic view refresh for dashboard */
  simSpeedTicker = setInterval(() => {
    const clock = document.getElementById('sb-clock');
    if (clock) clock.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const { view, param } = currentRoute();
    if (view === 'dashboard') refreshDashboardLive();
  }, 5000);

  /* initial */
  const { view, param } = currentRoute();
  renderView(view, param);
}

function renderNav() {
  const nav = document.getElementById('sb-nav');
  if (!nav) return;
  const { view } = currentRoute();
  const stats = fleetStats();
  const st = getState();
  const unreviewed = st.alerts.filter(a => !a.reviewed).length;
  const openConflicts = st.conflicts.filter(c => c.status === 'open').length;

  nav.innerHTML = NAV.map(group => `
    ${group.section ? `<div class="nav-section-label">${group.section}</div>` : ''}
    ${group.items.map(([id, label, ic]) => `
      <button class="nav-item ${view === id || (id === 'mission' && view === 'mission') ? 'active' : ''}" data-route="${id}" aria-label="${label}">
        <span class="nav-ico">${icon(ic, 17)}</span><span class="lbl">${label}</span>
        ${id === 'alerts' && unreviewed ? `<span class="nav-badge warn">${unreviewed}</span>` : ''}
        ${id === 'memory' && openConflicts ? `<span class="nav-badge crit">${openConflicts}</span>` : ''}
        ${id === 'mission' && stats.activeMissions ? `<span class="nav-badge">${stats.activeMissions}</span>` : ''}
      </button>`).join('')}`).join('') + `
    <div class="nav-section-label">Guided</div>
    <button class="nav-item demo-item ${isDemoActive() ? 'active' : ''}" id="nav-demo" aria-label="Demo mode">
      <span class="nav-ico">${icon('demo', 17)}</span><span class="lbl">Demo Mode</span>
    </button>`;

  nav.querySelectorAll<HTMLElement>('[data-route]').forEach(b => b.addEventListener('click', () => navigate(b.dataset.route!)));
  nav.querySelector('#nav-demo')?.addEventListener('click', () => {
    if (isDemoActive()) stopDemo('user');
    else startDemo();
  });
  updateNavBadges(unreviewed);
}

function updateNavBadges(unreviewed: number) {
  document.querySelectorAll('.nav-item[data-route="alerts"] .nav-badge').forEach(el => {
    el.textContent = String(unreviewed);
    el.classList.toggle('hidden', unreviewed === 0);
  });
}

function bindTopbar() {
  document.getElementById('tb-search')?.addEventListener('click', () => openPalette(navigate));
  document.getElementById('tb-menu')?.addEventListener('click', () => {
    sidebarOpen = !sidebarOpen;
    const sb = document.getElementById('sidebar');
    const bd = document.getElementById('sb-backdrop');
    if (sb) sb.style.transform = sidebarOpen ? 'translateX(0)' : '';
    if (bd) bd.style.display = sidebarOpen ? 'block' : 'none';
  });
  document.getElementById('sb-backdrop')?.addEventListener('click', closeMobileSidebar);
  document.getElementById('tb-notif')?.addEventListener('click', () => { notifOpen ? closeNotif() : openNotif(); });
  window.addEventListener('fleetminder:navigate', (e) => navigate((e as CustomEvent).detail));
}

function closeMobileSidebar() {
  sidebarOpen = false;
  const bd = document.getElementById('sb-backdrop');
  if (bd) bd.style.display = 'none';
  const sb = document.getElementById('sidebar');
  if (sb && window.innerWidth <= 768) sb.style.transform = 'translateX(-100%)';
}

/* ---------------- Notifications ---------------- */

function openNotif() {
  notifOpen = true;
  renderNotifPanel();
}

function closeNotif() {
  notifOpen = false;
  document.querySelector('.notif-pop')?.remove();
}

function renderNotifPanel() {
  document.querySelector('.notif-pop')?.remove();
  const st = getState();
  const unread = st.notifications.filter(n => !n.read).length;
  const pop = document.createElement('div');
  pop.className = 'notif-pop';
  pop.innerHTML = `
    <div class="notif-head">
      <b style="font-size:13px">Notifications</b>
      ${unread ? `<span class="badge badge-blue">${unread} new</span>` : '<span class="badge badge-gray">All read</span>'}
      <div class="ml-auto flex" style="gap:4px">
        <button class="btn btn-sm btn-ghost" id="nf-readall">${icon('check', 12)} All read</button>
        <button class="btn btn-sm btn-ghost" id="nf-clear">${icon('trash', 12)}</button>
      </div>
    </div>
    <div class="notif-list">
      ${st.notifications.length ? st.notifications.map(n => `
        <div class="notif-item ${n.read ? '' : 'unread'}" data-nid="${n.id}" data-route="${n.route?.view ?? ''}" data-param="${n.route?.id ?? ''}">
          <div class="notif-ico" style="${sevColor(n.severity)}">${icon(sevIcon(n.severity), 14)}</div>
          <div style="min-width:0">
            <div class="notif-title">${n.title}</div>
            <div class="notif-body clamp-2">${n.body}</div>
            <div class="notif-time">${ago(n.ts)}</div>
          </div>
        </div>`).join('') : '<div class="empty-state" style="padding:26px"><div class="es-title">No notifications</div><div class="es-sub">Mission and memory events will appear here.</div></div>'}
    </div>`;
  document.getElementById('portal-root')!.appendChild(pop);

  pop.querySelector('#nf-readall')?.addEventListener('click', () => { markAllNotificationsRead(); renderNotifPanel(); });
  pop.querySelector('#nf-clear')?.addEventListener('click', () => { clearNotifications(); closeNotif(); });
  pop.querySelectorAll<HTMLElement>('.notif-item').forEach(item => item.addEventListener('click', () => {
    markNotificationRead(item.dataset.nid!);
    const route = item.dataset.route;
    const param = item.dataset.param;
    closeNotif();
    if (route) navigate(param ? `${route}/${param}` : route);
  }));
}

function sevIcon(sev: string): string {
  return sev === 'critical' ? 'xCircle' : sev === 'warning' ? 'warning' : sev === 'success' ? 'checkCircle' : 'info';
}

function sevColor(sev: string): string {
  const map: Record<string, string> = {
    success: 'background:var(--green-soft);color:var(--green)',
    critical: 'background:var(--red-soft);color:var(--red)',
    warning: 'background:var(--amber-soft);color:var(--amber)',
    info: 'background:var(--accent-soft);color:var(--accent)'
  };
  return map[sev] ?? map.info;
}

/* ---------------- Simulation quick control ---------------- */

function initSimControl() {
  const holder = document.getElementById('tb-simctl');
  if (!holder) return;
  const render = () => {
    const s = getSettings();
    holder.innerHTML = `
      <div class="seg-group" title="Simulation speed">
        <button data-sp="0.5" class="${s.simSpeed === 0.5 ? 'active' : ''}">0.5×</button>
        <button data-sp="1" class="${s.simSpeed === 1 ? 'active' : ''}">1×</button>
        <button data-sp="2" class="${s.simSpeed === 2 ? 'active' : ''}">2×</button>
        <button data-sp="4" class="${s.simSpeed === 4 ? 'active' : ''}">4×</button>
      </div>`;
    holder.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
      const { updateSettings } = require_store();
      updateSettings({ simSpeed: parseFloat(b.dataset.sp!) });
      render();
      toast('info', `Simulation speed ${b.dataset.sp}×`);
    }));
  };
  render();
}

function require_store(): typeof import('./data/store') {
  return storeMod;
}
import * as storeMod from './data/store';

/* ---------------- Demo guide ---------------- */

function initDemoGuide() {
  setDemoUI({ renderGuide: renderDemoGuide });
  renderDemoGuide(getDemoState());
}

function renderDemoGuide(_unused?: unknown): void {
  void _unused;
  document.querySelector('.demo-guide')?.remove();
  const bannerHolder = document.getElementById('tb-demo');
  if (bannerHolder) bannerHolder.innerHTML = isDemoActive() ? `<span class="live-pill paused" title="Demo Mode active"><span class="ldot"></span>DEMO</span>` : '';

  const st = getDemoState();
  if (!st.active) return;
  const step = DEMO_STEPS[Math.min(DEMO_STEPS.length - 1, Math.max(0, st.step - 1))];
  const guide = document.createElement('div');
  guide.className = 'demo-guide';
  guide.innerHTML = `
    <div class="dg-top">
      <span class="dg-step-k">DEMO · STEP ${Math.min(st.step, DEMO_STEPS.length)} OF ${DEMO_STEPS.length}</span>
      <button class="btn btn-sm btn-ghost ml-auto" id="dg-reset">Reset Demo</button>
      <button class="btn btn-sm btn-ghost" id="dg-exit">Exit demo</button>
    </div>
    <div class="dg-title">${step.title}</div>
    <div class="dg-desc">${step.desc}</div>
    ${step.hint ? `<div class="dg-desc text-dim">💡 ${step.hint}</div>` : ''}
    <div class="dg-top dg-steps" style="margin-top:9px;gap:6px">
      ${demoProgressLabels().map((label, i) => {
        const idx = i + 1;
        const cls = idx < st.step ? 'done' : idx === st.step ? 'current' : '';
        return `<span class="demo-step-pill ${cls}"><span class="dsp-n">${idx < st.step ? '✓' : idx}</span>${label}</span>${i < demoProgressLabels().length - 1 ? '<span class="demo-connector"></span>' : ''}`;
      }).join('')}
    </div>
    <div class="dg-actions">
      <div class="dg-prog"><span style="width:${(Math.min(st.step, DEMO_STEPS.length) / DEMO_STEPS.length) * 100}%"></span></div>
      <button class="btn btn-sm" id="dg-skip">Advance</button>
    </div>`;
  document.getElementById('portal-root')!.appendChild(guide);
  guide.querySelector('#dg-reset')?.addEventListener('click', () => confirmDialog(
    'Reset FleetMinder demo?',
    'This restores the initial demo dataset and clears local missions, memories, alerts, and settings changes.',
    'Reset Demo',
    resetDemo
  ));
  guide.querySelector('#dg-exit')?.addEventListener('click', () => stopDemo('user'));
  guide.querySelector('#dg-skip')?.addEventListener('click', () => skipToNextPhase());
}

/* ---------------- View dispatch ---------------- */

function renderView(view: string, param?: string) {
  const content = document.getElementById('content');
  if (!content) return;
  cleanupWorkspace();
  cleanupReplay();
  closeNotif();

  document.getElementById('tb-title')!.textContent = TITLES[view] ?? 'FleetMinder';
  const crumbs: Record<string, string> = {
    dashboard: 'Fleet overview & live status', mission: 'Create & control missions',
    sim: '2D environment simulation', fleet: 'Robots & operational profiles',
    memory: 'Persistent experience store', recall: 'Retrieval in action',
    agent: 'Explainable mission intelligence', analytics: 'Performance & memory impact',
    missions: 'Complete mission records', alerts: 'Real-time event center', settings: 'Platform configuration'
  };
  document.getElementById('tb-crumb')!.textContent = crumbs[view] ?? '';

  try {
    switch (view) {
      case 'dashboard': renderDashboard(content); break;
      case 'mission': renderMissionControl(content, param); break;
      case 'sim': renderSimView(content); break;
      case 'fleet': renderFleet(content, param); break;
      case 'memory': renderMemoryCenter(content, param); break;
      case 'recall': renderRecall(content); break;
      case 'agent': param === 'assistant' ? renderAssistant(content) : renderAgent(content); break;
      case 'analytics': renderAnalytics(content); break;
      case 'missions': renderMissionHistory(content, param); break;
      case 'alerts': renderAlerts(content); break;
      case 'settings': renderSettings(content); break;
      default:
        content.innerHTML = `<div class="view">${errorState('Page not found', `No view named “${view}”.`, 'dashboard', 'Back to dashboard')}</div>`;
    }
  } catch (err) {
    console.error('View render failed:', err);
    content.innerHTML = `<div class="view">${errorState('Something went wrong', err instanceof Error ? err.message : 'Unexpected rendering error', 'dashboard', 'Back to dashboard')}</div>`;
  }
}

export function errorState(title: string, sub: string, route: string, label: string): string {
  return `<div class="empty-state" style="padding:60px 20px">
    <div class="es-ico">${icon('warning', 36)}</div>
    <div class="es-title" style="font-size:15px">${title}</div>
    <div class="es-sub">${sub}</div>
    <button class="btn mt-16" onclick="location.hash='#/${route}'">${label}</button>
  </div>`;
}

/* ---------------- Live Simulation view (wraps mission workspace) ---------------- */

function renderSimView(content: HTMLElement) {
  const activeM = getState().missions.find(m => m.status === 'active' || m.status === 'paused');
  if (activeM) {
    renderMissionControl(content, activeM.id);
    return;
  }
  const recent = getMission(getState().missions[0]?.id ?? '');
  content.innerHTML = `
    <div class="view">
      <div class="view-head">
        <div class="view-title">
          <h1>Live Simulation</h1>
          <div class="vsub">A 2D simulated environment with obstacles, restricted zones, checkpoints and alternative routes. Start a mission to watch a robot navigate it.</div>
        </div>
        <div class="view-head-actions">
          <button class="btn btn-primary" id="sv-new">${icon('play', 14)} Start a mission</button>
        </div>
      </div>
      <section class="panel">
        <div class="panel-head"><div class="panel-title">${icon('sim', 15)} Environments</div></div>
        <div class="panel-body grid-3">
          ${envCards()}
        </div>
      </section>
      <div class="info-note sim-note mt">${icon('info', 15)}<span>${recent ? `Most recent mission: <b style="color:var(--text-1)">${recent.code}</b> — open it from Mission History to replay.` : 'No missions recorded yet.'}</span></div>
    </div>`;
  document.getElementById('sv-new')?.addEventListener('click', () => navigate('mission'));
  content.querySelectorAll<HTMLElement>('[data-nav]').forEach(n => n.addEventListener('click', () => navigate(n.dataset.nav!)));
}

function envCards(): string {
  return ENVIRONMENTS.map(e => `
    <div class="compare-card">
      <div class="panel-title mb-8">${icon('layers', 14)} ${e.name}</div>
      <div class="kv-list">
        <div class="kv-row"><span class="k">Checkpoints</span><span class="v">${e.nodes.length}</span></div>
        <div class="kv-row"><span class="k">Obstacles</span><span class="v">${e.obstacles.length}</span></div>
        <div class="kv-row"><span class="k">Zones</span><span class="v">${e.zones.length}</span></div>
      </div>
    </div>`).join('');
}

/* ---------------- Keyboard ---------------- */

function bindKeyboard() {
  document.addEventListener('keydown', e => {
    const inInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName);
    if (e.key === '/' && !inInput) {
      e.preventDefault();
      openPalette(navigate);
    } else if (e.key === 'Escape') {
      closePalette();
      closeNotif();
      closeMobileSidebar();
    } else if (e.key === 'g' && !inInput) {
      /* quick nav: g then d/m/f */
      const handler = (ev: KeyboardEvent) => {
        document.removeEventListener('keydown', handler);
        if (ev.key === 'd') navigate('dashboard');
        else if (ev.key === 'm') navigate('mission');
        else if (ev.key === 'f') navigate('fleet');
        else if (ev.key === 'h') navigate('missions');
      };
      document.addEventListener('keydown', handler, { once: true });
    }
  });
}

function updateSysStatus() {
  const st = getState();
  const degraded = st.robots.some(r => r.status === 'offline' || r.battery < 15);
  const el = document.querySelector('#sb-sysstatus');
  if (el) {
    el.innerHTML = `<span class="status-dot ${degraded ? 'degraded' : ''}"></span><span class="sys-txt"><b>${degraded ? 'Degraded' : 'Operational'}</b></span><span class="sys-sub" id="sb-clock">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>`;
  }
}

void segGroup; void getRobot; void getMission;
