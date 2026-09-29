import { getMissions, getMemories, getState } from '../data/store';
import { recall } from '../services/memory';
import { icon } from '../components/icons';
import { badge, emptyState, relBar } from '../components/ui';
import { ago } from '../services/time';
import { navigate } from '../router';

/* Memory Recall Visualization — CURRENT MISSION → SEARCH → FOUND → DECISION. */

let selectedMissionId: string | null = null;

export function renderRecall(el: HTMLElement) {
  const missions = getMissions().filter(m => m.memoryIdsRetrieved.length > 0 || m.status === 'active');
  const mission = missions.find(m => m.id === selectedMissionId) ?? missions[0];

  el.innerHTML = `
    <div class="view">
      <div class="view-head">
        <div class="view-title">
          <h1>Memory Recall Flow</h1>
          <div class="vsub">How a live mission taps the fleet's persistent experience — from context, to search, to decision.</div>
        </div>
        <div class="view-head-actions">
          <select id="rc-mission" class="input" aria-label="Select mission">
            ${missions.map(m => `<option value="${m.id}" ${mission?.id === m.id ? 'selected' : ''}>${m.code} — ${m.robotId} → ${m.destinationName}</option>`).join('')}
          </select>
        </div>
      </div>

      ${!mission ? emptyState('brain', 'No mission with memory activity yet', 'Start a mission — the recall flow will visualize here live.') : `
      <section class="panel">
        <div class="panel-body">
          ${renderFlow(mission.id)}
        </div>
      </section>

      <div class="grid-2 mt">
        <section class="panel">
          <div class="panel-head"><div class="panel-title">${icon('link', 15)} How retrieval scored these memories</div></div>
          <div class="panel-body">
            ${renderScoredHits(mission)}
          </div>
        </section>
        <section class="panel">
          <div class="panel-head"><div class="panel-title">${icon('agent', 15)} Agent's decision context</div></div>
          <div class="panel-body">
            ${mission.decisions.length ? mission.decisions.map(d => `
              <div class="mem-card mb-8">
                <div class="mem-head"><span class="badge badge-green">DECISION</span><span class="fs-11 text-dim ml-auto">${(d.confidence * 100).toFixed(0)}% simulated score</span></div>
                <div class="fs-12 mt-8" style="color:var(--text-1);font-weight:600">${d.decision}</div>
                <div class="fs-11 text-dim mt-8">${d.rationale}</div>
              </div>`).join('') : `
              <div class="info-note">${icon('info', 15)}<span>No reroute decisions recorded for this mission yet. Decisions appear when the agent adapts the route or weighs conflicting memories.</span></div>`}
            <div class="info-note mem-note mt-8">${icon('brain', 15)}<span>Retrieval combines environment match, robot ownership, destination relevance, content overlap, and recency. Percentages are simulated heuristic scores, not probabilities. It runs against the local store; Hindsight is not connected in this build.</span></div>
          </div>
        </section>
      </div>`}
    </div>`;

  el.querySelector('#rc-mission')?.addEventListener('change', e => {
    selectedMissionId = (e.target as HTMLSelectElement).value;
    renderRecall(el);
  });
  el.querySelectorAll<HTMLElement>('[data-nav]').forEach(n => n.addEventListener('click', e => { e.stopPropagation(); navigate(n.dataset.nav!); }));
}

function renderFlow(missionId: string): string {
  const m = getMissions().find(x => x.id === missionId)!;
  const hits = recall({
    robotId: m.robotId, envId: m.envId, destinationNode: m.destinationNode,
    text: `${m.type} ${m.destinationName}`, limit: 3
  }).hits;

  return `
    <div class="recall-flow">
      <div class="rf-node rf-mission">
        <div class="rf-k">Current mission</div>
        <div class="rf-v">${m.code} · ${m.robotId} → ${m.destinationName}</div>
        <div class="rf-d">${m.type} · ${m.envId} · status ${m.status}</div>
      </div>
      <div class="rf-arrow">${icon('arrowDown', 15)}</div>
      <div class="rf-node rf-search">
        <div class="rf-k">Searching persistent memory</div>
        <div class="rf-v">Query: robot ${m.robotId} · ${m.envId} · ${m.destinationName}</div>
        <div class="rf-d">Memory Service → ${getState().robots.length ? 'internal store' : 'store'}</div>
      </div>
      <div class="rf-arrow">${icon('arrowDown', 15)}</div>
      <div class="rf-node">
        <div class="rf-k">Result</div>
        <div class="rf-v">${hits.length} relevant experience${hits.length === 1 ? '' : 's'} found</div>
      </div>
      <div class="rf-arrow">${icon('arrowDown', 15)}</div>
      <div class="rf-mem-row">
        ${hits.length ? hits.map(h => `
          <div class="mem-card clickable flash" data-nav="memory/${h.memory.id}">
            <div class="mem-head">
              <span class="mem-id">${h.memory.id}</span>
              ${badge(h.memory.category, 'violet')}
              <span class="ml-auto">${relBar(h.score)}</span>
            </div>
            <div class="mem-text">${h.memory.text}</div>
            <div class="mem-meta">
              <span>${icon('robot', 11)} ${h.memory.robotId}</span>
              <span>${icon('history', 11)} ${ago(h.memory.createdAt)}</span>
              <span>${icon('refresh', 11)} retrieved ${h.memory.retrievalCount}×</span>
              ${h.reasons[0] ? `<span>${icon('zap', 11)} ${h.reasons[0]}</span>` : ''}
            </div>
          </div>`).join('') : '<div class="fs-12 text-dim" style="text-align:center">No memories passed the relevance threshold for this query.</div>'}
      </div>
      <div class="rf-arrow">${icon('arrowDown', 15)}</div>
      <div class="rf-node rf-decision">
        <div class="rf-k">Mission agent decision</div>
        ${flowDecision(m, hits.map(h => h.memory.id))}
      </div>
    </div>`;
}

function flowDecision(m: import('../data/types').Mission, memIds: string[]): string {
  const d = m.decisions.find(x => x.phase === 'planning') ?? m.decisions[0];
  if (d) {
    return `<div class="rf-v" style="font-size:12.5px">${d.decision}</div><div class="rf-d">${d.rationale}${memIds.length ? ` · based on ${memIds.join(', ')}` : ''}</div>`;
  }
  return `<div class="rf-v" style="font-size:12.5px">${memIds.length ? `Use previous experience (${memIds.join(', ')}) when planning this mission` : 'Proceed with standard plan — no prior experience to apply'}</div><div class="rf-d">Agent will monitor execution and adapt if conditions change.</div>`;
}

function renderScoredHits(m: import('../data/types').Mission): string {
  const res = recall({
    robotId: m.robotId, envId: m.envId, destinationNode: m.destinationNode,
    text: `${m.type} ${m.destinationName}`, limit: 5
  });
  if (!res.hits.length) return '<span class="fs-12 text-dim">No scored hits for this context.</span>';
  return res.hits.map(h => `
    <div class="kv-row">
      <span style="min-width:0"><span class="mem-id">${h.memory.id}</span> <span class="fs-11 text-dim">${h.reasons.join(' · ') || 'baseline relevance'}</span></span>
      <span>${relBar(h.score)}</span>
    </div>`).join('');
}
