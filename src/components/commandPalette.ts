import { getRobots, getMissions, getMemories, getMission, getMemory, getRobot, getState } from '../data/store';
import { icon } from './icons';
import { esc } from './ui';
import { ago } from '../services/time';
import type { GlobalSearchResult } from '../data/types';

/* Global search / command palette ("//" or click). Keyboard navigable. */

let overlayEl: HTMLElement | null = null;
let selIndex = 0;
let currentResults: Array<GlobalSearchResult & { onPick: () => void }> = [];

export function openPalette(navigate: (route: string) => void) {
  closePalette();
  overlayEl = document.createElement('div');
  overlayEl.className = 'cmdk-overlay';
  overlayEl.innerHTML = `
    <div class="cmdk" role="dialog" aria-modal="true" aria-label="Global search">
      <div class="cmdk-input">${icon('search', 17)}<input type="text" placeholder="Search robots, missions, memories, events…" aria-label="Search query" /></div>
      <div class="cmdk-list"></div>
      <div class="cmdk-foot"><span><kbd>↑</kbd><kbd>↓</kbd> navigate</span><span><kbd>↵</kbd> open</span><span><kbd>esc</kbd> close</span></div>
    </div>`;
  const input = overlayEl.querySelector('input')!;
  const list = overlayEl.querySelector('.cmdk-list')!;

  const runSearch = () => {
    currentResults = searchAll(input.value);
    renderList(list, navigate);
  };
  input.addEventListener('input', runSearch);
  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); selIndex = Math.min(currentResults.length - 1, selIndex + 1); renderList(list, navigate, true); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); selIndex = Math.max(0, selIndex - 1); renderList(list, navigate, true); }
    else if (e.key === 'Enter') { e.preventDefault(); currentResults[selIndex]?.onPick(); closePalette(); }
  });
  overlayEl.addEventListener('click', e => { if (e.target === overlayEl) closePalette(); });
  document.getElementById('portal-root')!.appendChild(overlayEl);
  input.focus();
  runSearch();
}

function renderList(list: Element, navigate: (route: string) => void, keepScroll = false) {
  if (!currentResults.length) {
    list.innerHTML = `<div class="cmdk-empty">No matches found. Try a robot ID (R-01), mission code (MS-), or memory ID (M-).</div>`;
    return;
  }
  const groups = new Map<string, typeof currentResults>();
  currentResults.forEach(r => {
    const g = r.type;
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g)!.push(r);
  });
  list.innerHTML = '';
  let idx = 0;
  groups.forEach((items, g) => {
    list.insertAdjacentHTML('beforeend', `<div class="cmdk-group-label">${g}s</div>`);
    items.forEach(item => {
      const btn = document.createElement('button');
      btn.className = `cmdk-item ${idx === selIndex ? 'sel' : ''}`;
      btn.innerHTML = `<span class="ci-ico">${icon(item.icon, 15)}</span><span>${esc(item.title)} <span class="text-dim">· ${esc(item.sub)}</span></span><span class="ci-type">${item.type}</span>`;
      btn.addEventListener('click', () => { item.onPick(); closePalette(); });
      btn.addEventListener('mousemove', () => { /* keep sel via keyboard */ });
      list.appendChild(btn);
      idx++;
    });
  });
  void navigate; void keepScroll;
}

export function closePalette() {
  overlayEl?.remove();
  overlayEl = null;
  selIndex = 0;
}

export function searchAll(q: string): Array<GlobalSearchResult & { onPick: () => void }> {
  const query = q.trim().toLowerCase();
  const out: Array<GlobalSearchResult & { onPick: () => void }> = [];
  const nav = (route: string) => { window.dispatchEvent(new CustomEvent('fleetminder:navigate', { detail: route })); };

  getRobots().forEach(r => {
    if (!query || `${r.id} ${r.name} ${r.model} ${r.status}`.toLowerCase().includes(query)) {
      out.push({
        type: 'robot', id: r.id, title: `${r.id} ${r.name}`, sub: `${r.model} · ${r.status} · ${r.battery}%`,
        route: `fleet/${r.id}`, icon: 'robot', onPick: () => nav(`fleet/${r.id}`)
      });
    }
  });
  getMissions().forEach(m => {
    if (!query || `${m.code} ${m.type} ${m.destinationName} ${m.status} ${m.robotId}`.toLowerCase().includes(query)) {
      out.push({
        type: 'mission', id: m.id, title: `${m.code} — ${m.type}`, sub: `${m.robotId} → ${m.destinationName} · ${m.status}`,
        route: `missions/${m.id}`, icon: 'mission', onPick: () => nav(`missions/${m.id}`)
      });
    }
  });
  getMemories().forEach(mem => {
    if (!query || `${mem.id} ${mem.category} ${mem.text} ${mem.robotId} ${mem.tags.join(' ')}`.toLowerCase().includes(query)) {
      out.push({
        type: 'memory', id: mem.id, title: `${mem.id} — ${mem.category}`, sub: `${mem.robotId} · ${ago(mem.createdAt)}`,
        route: `memory/${mem.id}`, icon: 'memory', onPick: () => nav(`memory/${mem.id}`)
      });
    }
  });
  const state = getState();
  const missionById = new Map(state.missions.map(mission => [mission.id, mission]));
  const events = new Map(state.missions.flatMap(mission => mission.events).concat(state.events).map(event => [event.id, event]));
  events.forEach(event => {
    const mission = missionById.get(event.missionId);
    const searchable = `${event.title} ${event.detail ?? ''} ${mission?.code ?? ''} ${mission?.robotId ?? ''}`.toLowerCase();
    if (!query || searchable.includes(query)) {
      out.push({
        type: 'event', id: event.id, title: event.title,
        sub: `${mission?.code ?? event.missionId} · ${mission?.robotId ?? 'Fleet'} · ${ago(event.ts)}`,
        route: mission ? `missions/${mission.id}` : 'alerts', icon: 'activity',
        onPick: () => nav(mission ? `missions/${mission.id}` : 'alerts')
      });
    }
  });
  state.alerts.forEach(alert => {
    const searchable = `${alert.title} ${alert.detail} ${alert.robotId ?? ''} ${alert.severity}`.toLowerCase();
    if (!query || searchable.includes(query)) {
      out.push({
        type: 'alert', id: alert.id, title: alert.title,
        sub: `${alert.severity.toUpperCase()} · ${alert.robotId ?? 'Fleet'} · ${ago(alert.ts)}`,
        route: 'alerts', icon: 'alert', onPick: () => nav('alerts')
      });
    }
  });
  return out.slice(0, 24);
}

/* Missions/memory deep-links used from notifications */
export function paletteHelpers() {
  return { getMission, getMemory, getRobot };
}
