import { getState, markAlertReviewed, markAllAlertsReviewed, addNotification } from '../data/store';
import { icon } from '../components/icons';
import { badge, sevBadge, emptyState, toast, robotChip } from '../components/ui';
import { ago, fmtDateTime } from '../services/time';
import { navigate } from '../router';

/* Alerts & Events — real-time event center. */

let fSeverity = '';
let fReviewed = '';
let fQuery = '';

export function renderAlerts(el: HTMLElement) {
  const alerts = getState().alerts;
  const events = getState().events;
  const filtered = alerts.filter(a => {
    if (fSeverity && a.severity !== fSeverity) return false;
    if (fReviewed === 'open' && a.reviewed) return false;
    if (fReviewed === 'reviewed' && !a.reviewed) return false;
    if (fQuery && !`${a.title} ${a.detail}`.toLowerCase().includes(fQuery)) return false;
    return true;
  });

  const unreviewed = alerts.filter(a => !a.reviewed).length;

  el.innerHTML = `
    <div class="view">
      <div class="view-head">
        <div class="view-title">
          <h1>Alerts & Events</h1>
          <div class="vsub">Real-time event center for the simulated fleet. ${unreviewed} unreviewed alert(s).</div>
        </div>
        <div class="view-head-actions">
          <button class="btn" id="al-markall">${icon('check', 14)} Mark all reviewed</button>
        </div>
      </div>

      <div class="stat-grid" style="grid-template-columns:repeat(4,1fr)">
        ${alertStat(alerts.filter(a => a.severity === 'critical').length, 'Critical', 'red')}
        ${alertStat(alerts.filter(a => a.severity === 'warning').length, 'Warnings', 'amber')}
        ${alertStat(alerts.filter(a => a.severity === 'info').length, 'Info', 'blue')}
        ${alertStat(alerts.filter(a => a.severity === 'success').length, 'Success', 'green')}
      </div>

      <div class="filter-bar mt">
        <input id="al-q" class="input grow" placeholder="Search alerts…" value="${fQuery}" />
        <select id="al-sev" class="input">
          <option value="">All severities</option>
          ${['critical', 'warning', 'info', 'success'].map(s => `<option value="${s}" ${fSeverity === s ? 'selected' : ''}>${s}</option>`).join('')}
        </select>
        <select id="al-reviewed" class="input">
          <option value="">All states</option>
          <option value="open" ${fReviewed === 'open' ? 'selected' : ''}>Unreviewed</option>
          <option value="reviewed" ${fReviewed === 'reviewed' ? 'selected' : ''}>Reviewed</option>
        </select>
        <span class="filter-count">${filtered.length} alerts</span>
      </div>

      <section class="panel">
        <div class="panel-body tight">
          ${filtered.length ? filtered.map(a => `
            <div class="kv-row" style="padding:11px 16px;gap:12px;${a.reviewed ? 'opacity:.62' : ''}">
              <span style="min-width:0">
                <span class="flex flex-wrap" style="gap:7px">
                  ${sevBadge(a.severity)}
                  <span style="color:var(--text-1);font-weight:600">${a.title}</span>
                  ${badge(a.source.toUpperCase(), 'gray')}
                  ${a.reviewed ? '<span class="badge badge-green">REVIEWED</span>' : `<button class="btn btn-sm" data-review="${a.id}">Mark reviewed</button>`}
                </span>
                <span class="fs-11 text-dim" style="display:block;margin-top:3px">${a.detail}</span>
                ${a.robotId ? `<span class="fs-11 text-dim" style="display:block;margin-top:3px">Robot: ${robotChip(a.robotId)}</span>` : ''}
              </span>
              <span class="fs-11 text-dim nowrap" title="${fmtDateTime(a.ts)}">${ago(a.ts)}</span>
            </div>`).join('') : emptyState('checkCircle', 'No alerts match', 'All quiet — adjust filters or wait for new events.')}
        </div>
      </section>

      <section class="panel mt">
        <div class="panel-head">
          <div><div class="panel-title">${icon('activity', 15)} Mission event stream</div>
          <div class="panel-sub">All mission events across the fleet, newest first (${events.length}).</div></div>
        </div>
        <div class="panel-body tight">
          ${events.length ? events.slice(-30).reverse().map(e => `
            <div class="kv-row" style="padding:8px 16px">
              <span><span class="td-main">${e.title}</span> <span class="fs-11 text-dim">· ${e.missionId}</span></span>
              <span class="fs-11 text-dim nowrap">${ago(e.ts)}</span>
            </div>`).join('') : '<div class="empty-state" style="padding:20px"><div class="es-title">No global events yet</div><div class="es-sub">Start a mission to generate events.</div></div>'}
        </div>
      </section>
    </div>`;

  el.querySelector('#al-q')?.addEventListener('input', e => { fQuery = (e.target as HTMLInputElement).value.toLowerCase(); rerender(); });
  el.querySelector('#al-sev')?.addEventListener('change', e => { fSeverity = (e.target as HTMLSelectElement).value; rerender(); });
  el.querySelector('#al-reviewed')?.addEventListener('change', e => { fReviewed = (e.target as HTMLSelectElement).value; rerender(); });
  el.querySelector('#al-markall')?.addEventListener('click', () => {
    markAllAlertsReviewed();
    toast('success', 'All alerts marked reviewed');
    rerender();
  });
  el.querySelectorAll<HTMLButtonElement>('[data-review]').forEach(b => b.addEventListener('click', () => {
    markAlertReviewed(b.dataset.review!);
    rerender();
  }));
  el.querySelectorAll<HTMLElement>('[data-nav]').forEach(n => n.addEventListener('click', e => { e.stopPropagation(); navigate(n.dataset.nav!); }));
}

function alertStat(v: number, label: string, tone: string): string {
  const colors: Record<string, string> = { red: 'var(--red)', amber: 'var(--amber)', blue: 'var(--accent)', green: 'var(--green)' };
  return `<div class="stat-card"><div class="stat-accent-line" style="background:${colors[tone]}"></div>
    <div class="stat-top">${icon('alert', 13)}<span>${label}</span></div><div class="stat-value">${v}</div></div>`;
}

function rerender() {
  const root = document.querySelector('.content');
  if (root) renderAlerts(root as HTMLElement);
}

void addNotification;
