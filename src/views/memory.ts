import type { Memory, MemoryCategory } from '../data/types';
import { getMemories, getState, getConflicts, resolveConflict, getSettings } from '../data/store';
import { recall, evolveMemory } from '../services/memory';
import { icon } from '../components/icons';
import { badge, emptyState, relBar, sevBadge, toast, esc, openModal, closeModal } from '../components/ui';
import { ago, fmtDate } from '../services/time';
import { navigate } from '../router';

/* Persistent mission memory center */

const CATS: MemoryCategory[] = ['Navigation', 'Obstacles', 'Battery', 'Environment', 'Mission Strategy', 'Robot Behavior', 'Failures', 'Successful Strategies', 'Safety', 'Operator Preferences'];
const CAT_COLORS: Record<string, string> = {
  Navigation: '#4f8cff', Obstacles: '#f8717f', Battery: '#fbbf24', Environment: '#38d9f5',
  'Mission Strategy': '#8b7cf6', 'Robot Behavior': '#34d399', Failures: '#f8717f',
  'Successful Strategies': '#34d399', Safety: '#fbbf24', 'Operator Preferences': '#9aa7c4'
};

let filterCat = '';
let filterRobot = '';
let filterQuery = '';
let selectedMemoryId: string | null = null;

export function renderMemoryCenter(el: HTMLElement, param?: string) {
  if (param) selectedMemoryId = param;
  const memories = getMemories();
  const conflicts = getConflicts();
  const s = getSettings();

  const filtered = memories.filter(m => {
    if (filterCat && m.category !== filterCat) return false;
    if (filterRobot && m.robotId !== filterRobot) return false;
    if (filterQuery && !`${m.id} ${m.text} ${m.tags.join(' ')}`.toLowerCase().includes(filterQuery)) return false;
    return true;
  });

  const robots = Array.from(new Set(memories.map(m => m.robotId)));
  const sel = selectedMemoryId ? memories.find(m => m.id === selectedMemoryId) : undefined;

  el.innerHTML = `
    <div class="view">
      <div class="view-head">
        <div class="view-title">
          <h1>Persistent Memory Center</h1>
          <div class="vsub">The fleet's accumulated operational knowledge. Every mission can leave experience behind — and every new mission can recall it.</div>
        </div>
        <div class="view-head-actions">
          <span class="badge badge-cyan">SIMULATED · LOCAL STORE</span>
        </div>
      </div>

      <div class="stat-grid memory-stat-grid">
        ${memStat(memories.length, 'Total memories', 'database')}
        ${memStat(memories.filter(m => m.retrievalCount > 0).length, 'Retrieved ≥1×', 'refresh')}
        ${memStat(conflicts.filter(c => c.status === 'open').length, 'Open conflicts', 'warning')}
        ${memStat(getState().memRetrievedToday.count, 'Retrievals today', 'brain')}
      </div>

      <section class="panel mt">
        <div class="panel-head memory-store-head">
          <div><div class="panel-title">${icon('filter', 15)} Memory Store</div><div class="panel-sub">${filtered.length} of ${memories.length} memories</div></div>
          <div class="panel-head-actions">
            <input id="mem-q" class="input" style="width:180px" placeholder="Search memories…" value="${esc(filterQuery)}" />
            <select id="mem-cat" class="input" style="width:150px">
              <option value="">All categories</option>
              ${CATS.map(c => `<option ${filterCat === c ? 'selected' : ''}>${c}</option>`).join('')}
            </select>
            <select id="mem-robot" class="input" style="width:100px">
              <option value="">All robots</option>
              ${robots.map(r => `<option ${filterRobot === r ? 'selected' : ''}>${r}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="panel-body tight">
          ${filtered.length ? `<div class="table-wrap"><table class="data-table">
            <thead><tr><th>Memory</th><th>Robot</th><th>Category</th><th>Created</th><th>Last Retrieved</th><th>Relevance</th><th></th></tr></thead>
            <tbody>
              ${filtered.map(m => `<tr class="clickable ${m.id === selectedMemoryId ? 'sel-row' : ''}" data-mem="${m.id}">
                <td><div class="td-main text-mono" style="font-size:11.5px;color:#b3a8f8">${m.id}</div><div class="clamp-2 fs-11 text-dim" style="max-width:340px">${m.text}</div></td>
                <td class="nowrap">${m.robotId}</td>
                <td>${badge(m.category, 'violet')}</td>
                <td class="nowrap text-dim">${fmtDate(m.createdAt)}</td>
                <td class="nowrap text-dim">${m.lastRetrievedAt ? ago(m.lastRetrievedAt) : 'never'}</td>
                <td>${relBar(m.relevance)}</td>
                <td>${icon('chevronRight', 13)}</td>
              </tr>`).join('')}
            </tbody>
          </table></div>` : emptyState('memory', 'No memories match', 'Adjust the filters, or complete more missions to generate experience.')}
        </div>
      </section>

      ${conflicts.length ? `
      <section class="panel mt">
        <div class="panel-head">
          <div><div class="panel-title">${icon('warning', 15)} Memory Conflicts</div>
          <div class="panel-sub">Contradictory experiences. The system never assumes one side is automatically correct.</div></div>
        </div>
        <div class="panel-body">
          ${conflicts.map(c => conflictCard(c)).join('')}
        </div>
      </section>` : ''}
    </div>`;

  /* detail drawer / modal */
  if (sel) openMemoryDetail(sel);

  el.querySelector('#mem-q')?.addEventListener('input', e => {
    filterQuery = (e.target as HTMLInputElement).value.toLowerCase();
    rerender();
  });
  el.querySelector('#mem-cat')?.addEventListener('change', e => { filterCat = (e.target as HTMLSelectElement).value; rerender(); });
  el.querySelector('#mem-robot')?.addEventListener('change', e => { filterRobot = (e.target as HTMLSelectElement).value; rerender(); });
  el.querySelectorAll<HTMLElement>('[data-mem]').forEach(row => {
    row.addEventListener('click', () => {
      selectedMemoryId = row.dataset.mem!;
      rerender();
    });
  });

  el.querySelectorAll<HTMLButtonElement>('[data-resolve]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.resolve!;
      const strategy = btn.dataset.strategy as 'recency' | 'context-conditional' | 'keep-both';
      const labels: Record<string, string> = {
        recency: 'Recent observation kept as primary guidance; older memory retained as context.',
        'context-conditional': 'Both memories kept with context conditions (time-of-day / environment state).',
        'keep-both': 'Both memories retained; agent will verify live conditions before deciding.'
      };
      resolveConflict(id, strategy, labels[strategy]);
      toast('success', 'Conflict resolved', labels[strategy]);
      rerender();
    });
  });
}

function rerender() {
  const root = document.querySelector('.content');
  if (root) {
    renderMemoryCenter(root as HTMLElement, selectedMemoryId ?? undefined);
    /* re-open detail modal after rerender since modal was cleared by innerHTML */
    if (selectedMemoryId) {
      const m = getMemories().find(x => x.id === selectedMemoryId);
      if (m) openMemoryDetail(m);
    }
  }
}

function memStat(v: number, label: string, ic: string): string {
  return `<div class="stat-card"><div class="stat-top">${icon(ic, 13)}<span>${label}</span></div><div class="stat-value">${v}</div></div>`;
}

function conflictCard(c: import('../data/types').MemoryConflict): string {
  const a = getState().memories.find(m => m.id === c.memoryAId);
  const b = getState().memories.find(m => m.id === c.memoryBId);
  if (!a || !b) return '';
  return `
    <div class="mb-16">
      <div class="flex mb-8" style="gap:8px">
        <span class="td-main" style="color:var(--text-1);font-weight:650">${esc(c.topic)}</span>
        ${sevBadge(c.status === 'open' ? 'warning' : 'success')}
        <span class="badge badge-plain">${c.status.toUpperCase()}</span>
        <span class="fs-11 text-dim ml-auto">detected ${ago(c.detectedAt)}</span>
      </div>
      <div class="conflict-wrap">
        <div class="conflict-side old">
          <div class="fs-11 text-dim mb-8">OLDER EXPERIENCE — ${a.id} · ${fmtDate(a.createdAt)} · confidence ${(a.confidence * 100).toFixed(0)}%</div>
          <div class="fs-12" style="color:var(--text-2)">“${esc(a.text)}”</div>
        </div>
        <div class="conflict-vs"><span>VS</span></div>
        <div class="conflict-side new">
          <div class="fs-11 mb-8" style="color:#b3a8f8">RECENT EXPERIENCE — ${b.id} · ${fmtDate(b.createdAt)} · confidence ${(b.confidence * 100).toFixed(0)}%</div>
          <div class="fs-12" style="color:var(--text-2)">“${esc(b.text)}”</div>
        </div>
      </div>
      ${c.status === 'open' ? `
        <div class="resolve-note">${icon('info', 14)} Conflicting experiences detected. The more recent context may require reevaluation — but the older experience may still hold in different conditions. Choose how the agent should treat this, or keep both and let it verify live conditions.</div>
        <div class="resolve-actions">
          <button class="btn btn-sm" data-resolve="${c.id}" data-strategy="recency">Favor recent observation</button>
          <button class="btn btn-sm" data-resolve="${c.id}" data-strategy="context-conditional">Make context-conditional</button>
          <button class="btn btn-sm" data-resolve="${c.id}" data-strategy="keep-both">Keep both — verify live</button>
        </div>` : `
        <div class="info-note mt-8" style="border-color:rgba(52,211,153,.3)">${icon('checkCircle', 15)}<span><b style="color:var(--text-1)">Resolution (${c.resolvedStrategy}):</b> ${esc(c.resolution ?? '')}</span></div>`}
    </div>`;
}

function openMemoryDetail(m: Memory) {
  const evolution = m.evolution ?? [];
  const recallRes = recall({ robotId: m.robotId, envId: m.envId, text: m.text, limit: 3 });
  const related = recallRes.hits.map(h => h.memory).filter(x => x.id !== m.id);

  openModal({
    title: `${m.id} — ${m.category}`,
    wide: true,
    onClose: () => { selectedMemoryId = null; },
    body: `
      <div class="mem-text" style="font-size:13.5px;color:var(--text-1)">“${esc(m.text)}”</div>
      <div class="flex flex-wrap mt-8" style="gap:6px">${m.tags.map(t => `<span class="tag">${esc(t)}</span>`).join('')}</div>
      <div class="grid-2 mt-16">
        <div class="kv-list">
          <div class="kv-row"><span class="k">Robot</span><span class="v">${m.robotId}</span></div>
          <div class="kv-row"><span class="k">Source mission</span><span class="v">${m.missionCode ?? m.missionId}</span></div>
          <div class="kv-row"><span class="k">Environment</span><span class="v">${m.envId}</span></div>
          <div class="kv-row"><span class="k">Created</span><span class="v">${fmtDate(m.createdAt)}</span></div>
        </div>
        <div class="kv-list">
          <div class="kv-row"><span class="k">Last retrieved</span><span class="v">${m.lastRetrievedAt ? ago(m.lastRetrievedAt) : 'never'}</span></div>
          <div class="kv-row"><span class="k">Retrieval count</span><span class="v">${m.retrievalCount}×</span></div>
          <div class="kv-row"><span class="k">Confidence</span><span class="v">${(m.confidence * 100).toFixed(0)}%</span></div>
          <div class="kv-row"><span class="k">Origin</span><span class="v">Internal simulation</span></div>
        </div>
      </div>

      ${evolution.length ? `
      <div class="panel-title mt-16" style="margin-bottom:8px">${icon('layers', 14)} Memory Evolution</div>
      <div class="evo-track">
        ${evolution.map((e, i) => `
          <div class="evo-step">
            <div class="evo-week">Stage ${i + 1} · ${fmtDate(e.ts)}</div>
            <div class="evo-card">${esc(e.text)}<div class="evo-conf fs-11 text-dim">confidence ${(e.confidence * 100).toFixed(0)}%</div></div>
          </div>`).join('')}
      </div>` : ''}

      ${related.length ? `
      <div class="panel-title mt-16" style="margin-bottom:8px">${icon('link', 14)} Related experiences</div>
      ${related.map(r => `<div class="mem-card mb-8" style="padding:9px 12px"><div class="flex" style="gap:8px"><span class="mem-id">${r.id}</span>${relBar(r.relevance)}</div><div class="fs-11 text-dim clamp-2">${esc(r.text)}</div></div>`).join('')}` : ''}

      <div class="info-note mem-note mt-16">${icon('info', 15)}<span>This memory belongs to the local simulated store. Mission planning can retrieve it through FleetMinder's Memory Service; Hindsight is not connected in this build.</span></div>`,
    footer: `
      <button class="btn" id="md-close">Close</button>
      ${evolution.length ? `<button class="btn" id="md-evolve">${icon('layers', 13)} Record new observation</button>` : `<button class="btn" id="md-evolve">${icon('layers', 13)} Start evolution</button>`}
      <button class="btn btn-primary" id="md-mission">Open source mission</button>`
  });

  document.getElementById('md-close')?.addEventListener('click', closeModal);
  document.getElementById('md-mission')?.addEventListener('click', () => {
    closeModal();
    selectedMemoryId = null;
    navigate(`missions/${m.missionCode ?? ''}`);
  });
  document.getElementById('md-evolve')?.addEventListener('click', () => {
    const newText = window.prompt('New consolidated observation (replaces the memory text):', m.text);
    if (newText && newText.trim() && newText !== m.text) {
      evolveMemory(m.id, { label: 'Manual update', text: newText.trim(), confidence: Math.min(0.97, m.confidence + 0.03) });
      toast('success', 'Memory evolved', `${m.id} now reflects the new observation.`);
      closeModal();
      rerender();
    }
  });
}
