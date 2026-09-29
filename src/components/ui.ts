import { icon } from './icons';

/* Reusable UI primitives (string-emitting helpers + imperative widgets). */

export type StatusTone = 'green' | 'blue' | 'amber' | 'red' | 'gray' | 'cyan' | 'violet';

export function badge(text: string, tone: StatusTone = 'gray', dot = false): string {
  return `<span class="badge badge-${tone}">${dot ? '<span class="bdot"></span>' : ''}${text}</span>`;
}

export function statusBadge(status: string): string {
  const map: Record<string, [string, StatusTone]> = {
    online: ['Online', 'green'], executing: ['Executing', 'blue'], idle: ['Idle', 'gray'],
    charging: ['Charging', 'cyan'], warning: ['Warning', 'amber'], offline: ['Offline', 'red'],
    queued: ['Queued', 'gray'], active: ['Active', 'blue'], paused: ['Paused', 'amber'],
    completed: ['Completed', 'green'], failed: ['Failed', 'red'], cancelled: ['Cancelled', 'gray'],
    success: ['Success', 'green'], partial: ['Partial', 'amber'], critical: ['Critical', 'red'],
    info: ['Info', 'blue'], open: ['Open', 'amber'],
    resolved: ['Resolved', 'green'], monitoring: ['Monitoring', 'blue'], low: ['Low', 'gray'],
    normal: ['Normal', 'blue'], high: ['High', 'amber']
  };
  const [label, tone] = map[status] ?? [status, 'gray'];
  return badge(label, tone, true);
}

export function sevBadge(sev: string): string {
  const map: Record<string, StatusTone> = { info: 'blue', warning: 'amber', critical: 'red', success: 'green' };
  return badge(sev.toUpperCase(), map[sev] ?? 'gray');
}

export function prioBadge(p: string): string {
  const map: Record<string, StatusTone> = { Low: 'gray', Normal: 'blue', High: 'amber', Critical: 'red' };
  return badge(p, map[p] ?? 'gray');
}

export function meter(pct: number, color: string): string {
  return `<div class="meter"><span style="width:${Math.max(0, Math.min(100, pct))}%;background:${color}"></span></div>`;
}

export function batteryCell(pct: number): string {
  const color = pct > 50 ? 'var(--green)' : pct > 25 ? 'var(--amber)' : 'var(--red)';
  return `<div class="batt-cell"><div class="meter"><span style="width:${pct}%;background:${color}"></span></div><b class="fs-11 nowrap" style="color:var(--text-2)">${Math.round(pct)}%</b></div>`;
}

export function signalCell(v: number): string {
  const color = v > 70 ? 'var(--green)' : v > 45 ? 'var(--amber)' : 'var(--red)';
  return `<div class="batt-cell"><div class="meter"><span style="width:${v}%;background:${color}"></span></div><b class="fs-11" style="color:var(--text-2)">${v}%</b></div>`;
}

export function robotChip(id: string, name?: string): string {
  const initials = id.replace('R-', '');
  const hues: Record<string, string> = {
    'R-01': '#4f8cff', 'R-02': '#8b7cf6', 'R-03': '#38d9f5',
    'R-04': '#34d399', 'R-05': '#fbbf24'
  };
  const c = hues[id] ?? '#4f8cff';
  return `<span class="robot-chip"><span class="robot-avatar" style="background:${c}1f;color:${c};border-color:${c}55">${initials}</span><span>${id}${name ? ` · ${name}` : ''}</span></span>`;
}

export function emptyState(iconName: string, title: string, sub: string): string {
  return `<div class="empty-state">
    <div class="es-ico">${icon(iconName, 34)}</div>
    <div class="es-title">${title}</div>
    <div class="es-sub">${sub}</div>
  </div>`;
}

export function loadingBlock(label = 'Loading…'): string {
  return `<div class="loading-block"><span class="spinner"></span>${label}</div>`;
}

export function panel(title: string, bodyHtml: string, opts: { headActions?: string; sub?: string; cls?: string; bodyCls?: string } = {}): string {
  return `<section class="panel ${opts.cls ?? ''}">
    <div class="panel-head">
      <div><div class="panel-title">${title}</div>${opts.sub ? `<div class="panel-sub">${opts.sub}</div>` : ''}</div>
      ${opts.headActions ? `<div class="panel-head-actions">${opts.headActions}</div>` : ''}
    </div>
    <div class="panel-body ${opts.bodyCls ?? ''}">${bodyHtml}</div>
  </section>`;
}

export function kv(k: string, v: string, mono = false): string {
  return `<div class="kv-row"><span class="k">${k}</span><span class="v ${mono ? 'mono' : ''}">${v}</span></div>`;
}

export function statCard(label: string, value: string | number, iconName: string, opts: { delta?: string; deltaDir?: 'up' | 'down'; accent?: string; sub?: string } = {}): string {
  return `<div class="stat-card">
    ${opts.accent ? `<div class="stat-accent-line" style="background:${opts.accent}"></div>` : ''}
    <div class="stat-top">${icon(iconName, 13)}<span>${label}</span></div>
    <div class="stat-value">${value}${opts.sub ? `<span class="unit">${opts.sub}</span>` : ''}</div>
    ${opts.delta ? `<div class="stat-delta"><span class="${opts.deltaDir === 'down' ? 'down' : 'up'}">${opts.deltaDir === 'down' ? '▼' : '▲'}</span>${opts.delta}</div>` : ''}
  </div>`;
}

/* ---------------- Modal ---------------- */

export interface ModalOpts {
  title: string;
  body: string;
  footer?: string;
  wide?: boolean;
  onClose: () => void;
}

export function openModal(opts: ModalOpts): HTMLElement {
  closeModal();
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="modal ${opts.wide ? 'wide' : ''}" role="dialog" aria-modal="true" aria-label="${opts.title}">
      <div class="modal-head"><div class="modal-title">${opts.title}</div><button class="modal-x" aria-label="Close">✕</button></div>
      <div class="modal-body">${opts.body}</div>
      ${opts.footer ? `<div class="modal-foot">${opts.footer}</div>` : ''}
    </div>`;
  const close = () => { overlay.remove(); opts.onClose(); };
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  overlay.querySelector('.modal-x')?.addEventListener('click', close);
  document.getElementById('portal-root')!.appendChild(overlay);
  const firstBtn = overlay.querySelector<HTMLElement>('.modal-foot .btn, .modal-x');
  firstBtn?.focus();
  return overlay;
}

export function closeModal() {
  document.querySelector('.modal-overlay')?.remove();
}

export function confirmDialog(title: string, message: string, confirmLabel: string, onConfirm: () => void, danger = false) {
  const wrap = openModal({
    title,
    body: `<p style="color:var(--text-2);font-size:13px;line-height:1.6">${message}</p>`,
    footer: `<button class="btn" data-act="cancel">Cancel</button>
             <button class="btn ${danger ? 'btn-danger' : 'btn-primary'}" data-act="ok">${confirmLabel}</button>`,
    onClose: () => { /* noop */ }
  });
  wrap.querySelector('[data-act="cancel"]')?.addEventListener('click', () => closeModal());
  wrap.querySelector('[data-act="ok"]')?.addEventListener('click', () => { closeModal(); onConfirm(); });
}

/* ---------------- Toasts ---------------- */

const TOAST_ICONS: Record<string, string> = { success: 'checkCircle', error: 'xCircle', info: 'info', warning: 'warning' };
const TOAST_COLORS: Record<string, string> = { success: 'var(--green)', error: 'var(--red)', info: 'var(--accent)', warning: 'var(--amber)' };

export function toast(kind: 'success' | 'error' | 'info' | 'warning', title: string, msg = '', ms = 3800) {
  const stack = document.querySelector('.toast-stack');
  if (!stack) return;
  const el = document.createElement('div');
  el.className = 'toast';
  el.style.borderLeftColor = TOAST_COLORS[kind];
  el.innerHTML = `<span class="toast-ico" style="color:${TOAST_COLORS[kind]}">${icon(TOAST_ICONS[kind], 17)}</span>
    <div><div class="toast-title">${title}</div>${msg ? `<div class="toast-msg">${msg}</div>` : ''}</div>
    <button class="toast-x" aria-label="Dismiss">✕</button>`;
  const kill = () => {
    el.classList.add('leaving');
    setTimeout(() => el.remove(), 180);
  };
  el.querySelector('.toast-x')?.addEventListener('click', kill);
  stack.appendChild(el);
  if (ms > 0) setTimeout(kill, ms);
}

export function ensureToastStack() {
  if (!document.querySelector('.toast-stack')) {
    const d = document.createElement('div');
    d.className = 'toast-stack';
    document.getElementById('portal-root')!.appendChild(d);
  }
}

/* ---------------- Misc ---------------- */

export function relBar(score: number): string {
  const pct = Math.round(score * 100);
  const color = pct > 75 ? 'var(--green)' : pct > 50 ? 'var(--accent)' : 'var(--amber)';
  return `<span class="rel-bar" title="Simulated heuristic relevance" aria-label="Simulated relevance score: ${pct}%"><span style="width:${pct}%;background:${color}"></span></span> ${pct}% <span class="fs-10 text-dim" title="Simulated heuristic score">sim.</span>`;
}

export function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function segGroup(items: Array<{ id: string; label: string }>, activeId: string, onChangeId: string): string {
  return `<div class="seg-group" data-seg="${onChangeId}">${items.map(i =>
    `<button data-seg-id="${i.id}" class="${i.id === activeId ? 'active' : ''}">${i.label}</button>`).join('')}</div>`;
}

export function debounce<T extends (...args: unknown[]) => void>(fn: T, ms: number): T {
  let t: ReturnType<typeof setTimeout> | null = null;
  return ((...args: unknown[]) => {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  }) as T;
}
