import { getState, getSettings, updateSettings, getMissions, getMemories, getConflicts } from '../data/store';
import { answerQuestion, planningNarrative, type AssistantReply } from '../services/agent';
import { recall } from '../services/memory';
import { icon } from '../components/icons';
import { badge, emptyState, toast } from '../components/ui';
import { fmtDateTime } from '../services/time';
import { navigate } from '../router';
import type { Mission } from '../data/types';

/* AI Mission Agent overview + Operations Assistant chat. */

export function renderAgent(el: HTMLElement, param?: string) {
  if (param === 'assistant') { renderAssistant(el); return; }

  const missions = getMissions();
  const active = missions.find(m => m.status === 'active') ?? missions.find(m => m.status === 'paused');
  const memories = getMemories();
  const conflicts = getConflicts();
  const s = getSettings();

  el.innerHTML = `
    <div class="view">
      <div class="view-head">
        <div class="view-title">
          <h1>AI Mission Agent</h1>
          <div class="vsub">The agent plans missions, retrieves experiences, explains its decisions, and adapts when conditions change. All reasoning is derived from real application state — never invented.</div>
        </div>
        <div class="view-head-actions">
          <button class="btn btn-primary" id="ag-chat">${icon('agent', 14)} Operations Assistant</button>
        </div>
      </div>

      <div class="grid-2-1">
        <div class="stack">
          ${active ? agentTimelineCard(active) : `
          <section class="panel">
            <div class="panel-head"><div class="panel-title">${icon('agent', 15)} Agent activity</div></div>
            ${emptyState('agent', 'No mission in progress', 'Start a mission and the agent\'s planning timeline will appear here, step by step.')}
          </section>`}

          <section class="panel">
            <div class="panel-head"><div class="panel-title">${icon('checkCircle', 15)} Recent decisions</div></div>
            <div class="panel-body">
              ${missions.filter(m => m.decisions.length).slice(0, 5).flatMap(m => m.decisions.map(d => `
                <div class="mem-card mb-8">
                  <div class="mem-head">
                    <span class="badge badge-green">DECISION</span>
                    <span class="fs-11 text-dim">${m.code} · ${d.phase}</span>
                    <span class="fs-11 text-dim ml-auto">${(d.confidence * 100).toFixed(0)}% confidence</span>
                  </div>
                  <div class="fs-12 mt-8" style="color:var(--text-1);font-weight:600">${d.decision}</div>
                  <div class="fs-11 text-dim mt-8">${d.rationale}</div>
                  ${d.sourceMemories.length ? `<div class="mem-meta"><span>memory: ${d.sourceMemories.join(', ')}</span></div>` : ''}
                </div>`)).join('') || emptyState('agent', 'No decisions yet', 'Agent decisions are recorded when routes change or memory conflicts are weighed.')}
            </div>
          </section>
        </div>

        <div class="stack">
          <section class="panel">
            <div class="panel-head"><div class="panel-title">${icon('settings', 15)} Agent configuration</div></div>
            <div class="panel-body">
              <label class="checkbox-row mb-8"><input type="checkbox" id="ag-recall" ${s.memoryRecallEnabled ? 'checked' : ''}/> Memory recall during planning</label>
              <label class="checkbox-row mb-8"><input type="checkbox" id="ag-reroute" ${s.agentAutoReroute ? 'checked' : ''}/> Auto-reroute on obstacles</label>
              <label class="checkbox-row mb-8"><input type="checkbox" id="ag-verbose" ${s.agentPlanningVerbose ? 'checked' : ''}/> Verbose planning timeline</label>
              <div class="field mt-8">
                <label>Confidence threshold — ${(s.agentConfidenceThreshold * 100).toFixed(0)}%</label>
                <input type="range" id="ag-conf" min="0.3" max="0.95" step="0.05" value="${s.agentConfidenceThreshold}" />
                <span class="hint">Minimum memory confidence before the agent applies a retrieved experience without asking.</span>
              </div>
            </div>
          </section>

          <section class="panel">
            <div class="panel-head"><div class="panel-title">${icon('database', 15)} Knowledge base</div></div>
            <div class="panel-body"><div class="kv-list">
              <div class="kv-row"><span class="k">Memories</span><span class="v">${memories.length}</span></div>
              <div class="kv-row"><span class="k">Retrievals today</span><span class="v">${getState().memRetrievedToday.count}</span></div>
              <div class="kv-row"><span class="k">Open conflicts</span><span class="v">${conflicts.filter(c => c.status === 'open').length}</span></div>
              <div class="kv-row"><span class="k">Backend</span><span class="v">${s.memoryBackend}</span></div>
            </div></div>
          </section>
        </div>
      </div>
    </div>`;

  el.querySelector('#ag-chat')?.addEventListener('click', () => navigate('agent/assistant'));
  el.querySelector('#ag-recall')?.addEventListener('change', e => updateSettings({ memoryRecallEnabled: (e.target as HTMLInputElement).checked }));
  el.querySelector('#ag-reroute')?.addEventListener('change', e => updateSettings({ agentAutoReroute: (e.target as HTMLInputElement).checked }));
  el.querySelector('#ag-verbose')?.addEventListener('change', e => updateSettings({ agentPlanningVerbose: (e.target as HTMLInputElement).checked }));
  el.querySelector('#ag-conf')?.addEventListener('change', e => updateSettings({ agentConfidenceThreshold: parseFloat((e.target as HTMLInputElement).value) }));
}

function agentTimelineCard(m: Mission): string {
  const robot = getState().robots.find(r => r.id === m.robotId)!;
  const memHits = m.memoryIdsRetrieved.map(id => getMemories().find(x => x.id === id)).filter(Boolean) as import('../data/types').Memory[];
  const steps = planningNarrative(m, robot, memHits);
  return `
    <section class="panel">
      <div class="panel-head">
        <div><div class="panel-title">${icon('agent', 15)} Mission Agent — ${m.code}</div>
        <div class="panel-sub">Explainable planning & monitoring narrative for the current mission</div></div>
        <div class="panel-head-actions"><span class="live-pill"><span class="ldot"></span>${m.status.toUpperCase()}</span></div>
      </div>
      <div class="panel-body">
        <div class="timeline">
          ${steps.map(st => `
            <div class="tl-item">
              <div class="tl-rail"><div class="tl-dot done">${icon(st.kind === 'memory' ? 'memory' : st.kind === 'decision' ? 'check' : st.kind === 'sim' ? 'sim' : 'agent', 11)}</div></div>
              <div class="tl-body">
                <div class="tl-title">${st.title} <span class="tl-kind ${st.kind}">${st.kind}</span></div>
                ${st.detail ? `<div class="tl-desc">${st.detail}</div>` : ''}
              </div>
            </div>`).join('')}
          ${m.events.slice(-3).reverse().map(e => `
            <div class="tl-item">
              <div class="tl-rail"><div class="tl-dot ${e.severity === 'critical' ? 'crit' : e.severity === 'warning' ? 'warn' : 'info'}">${icon('activity', 11)}</div></div>
              <div class="tl-body">
                <div class="tl-title">${e.title} <span class="tl-kind sim">live</span></div>
                ${e.detail ? `<div class="tl-desc">${e.detail}</div>` : ''}
              </div>
            </div>`).join('')}
        </div>
      </div>
    </section>`;
}

/* ---------------- Operations Assistant ---------------- */

interface ChatMsg { role: 'user' | 'agent'; text: string; reply?: AssistantReply; ts: number; }
let chatHistory: ChatMsg[] = [];
let pendingQuestion: string | null = null;

const SUGGESTIONS = [
  'Why did R-01 choose Corridor C?',
  'What happened during the previous Warehouse A mission?',
  'Which robots have experienced battery problems?',
  'What does R-03 remember about the South Hall?',
  'Show missions where obstacles caused rerouting.',
  'Which previous experience is relevant to this mission?'
];

export function renderAssistant(el: HTMLElement) {
  if (pendingQuestion) {
    const q = pendingQuestion;
    pendingQuestion = null;
    chatHistory.push({ role: 'user', text: q, ts: Date.now() });
    const reply = answerQuestion(q);
    chatHistory.push({ role: 'agent', text: q, reply, ts: Date.now() });
  }

  el.innerHTML = `
    <div class="view" style="max-width:1000px">
      <div class="view-head">
        <div class="view-title">
          <h1>Operations Assistant</h1>
          <div class="vsub">Ask about missions, robots, and memory. Every answer cites its source.</div>
        </div>
        <div class="view-head-actions">
          <button class="btn" id="as-clear">Clear chat</button>
          <button class="btn" id="as-back">${icon('chevronRight', 13)} Agent</button>
        </div>
      </div>
      <section class="panel chat-panel">
        <div class="chat-scroll" id="as-scroll">
          ${chatHistory.length ? chatHistory.map(renderMsg).join('') : `
            <div class="chat-msg agent">
              <div class="chat-avatar" style="background:var(--accent-soft);color:var(--accent)">${icon('agent', 15)}</div>
              <div class="chat-bubble">I'm the FleetMinder operations assistant. I answer from <b>live fleet state</b>, <b>historical missions</b>, and <b>persistent memory</b> — and I label where each fact comes from. What would you like to know?</div>
            </div>`}
        </div>
        <div class="chat-sugg">
          ${SUGGESTIONS.map(s => `<button data-sugg="${s}">${s}</button>`).join('')}
        </div>
        <div class="chat-input-row">
          <input id="as-input" class="input" placeholder="Ask about missions, robots, memories…" aria-label="Ask the operations assistant" />
          <button class="btn btn-primary" id="as-send">${icon('send', 14)} Ask</button>
        </div>
      </section>
    </div>`;

  const input = el.querySelector<HTMLInputElement>('#as-input')!;
  const scroll = el.querySelector('#as-scroll')!;
  scroll.scrollTop = scroll.scrollHeight;

  const ask = () => {
    const q = input.value.trim();
    if (!q) return;
    pendingQuestion = q;
    renderAssistant(el);
  };
  el.querySelector('#as-send')?.addEventListener('click', ask);
  input.addEventListener('keydown', e => { if (e.key === 'Enter') ask(); });
  el.querySelectorAll<HTMLButtonElement>('[data-sugg]').forEach(b => b.addEventListener('click', () => {
    pendingQuestion = b.dataset.sugg!;
    renderAssistant(el);
  }));
  el.querySelector('#as-clear')?.addEventListener('click', () => { chatHistory = []; renderAssistant(el); });
  el.querySelector('#as-back')?.addEventListener('click', () => navigate('agent'));

  el.querySelectorAll<HTMLElement>('[data-link]').forEach(n => n.addEventListener('click', () => {
    navigate(n.dataset.link!);
  }));
}

function renderMsg(m: ChatMsg): string {
  if (m.role === 'user') {
    return `<div class="chat-msg user">
      <div class="chat-avatar" style="background:var(--bg-raised);color:var(--text-2)">${icon('users', 15)}</div>
      <div class="chat-bubble">${m.text}</div>
    </div>`;
  }
  return `<div class="chat-msg agent">
    <div class="chat-avatar" style="background:var(--accent-soft);color:var(--accent)">${icon('agent', 15)}</div>
    <div class="chat-bubble">
      ${m.reply!.sources.map(src => `<span class="chat-src ${src.cls}">${src.label}</span>`).join('')}
      <div style="white-space:pre-line">${fmtAssistantText(m.reply!.text)}</div>
      ${m.reply!.links?.length ? `<div class="flex flex-wrap mt-8" style="gap:6px">${m.reply!.links.map(l => `<button class="btn btn-sm" data-link="${l.route}">${icon('link', 12)} ${l.label}</button>`).join('')}</div>` : ''}
      <div class="fs-10 text-dim mt-8">${fmtDateTime(m.ts)}</div>
    </div>
  </div>`;
}

function fmtAssistantText(text: string): string {
  return text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/\*\*(.+?)\*\*/g, '<b style="color:var(--text-1)">$1</b>')
    .replace(/“(.+?)”/g, '“<span style="color:var(--text-2)">$1</span>”');
}

void toast; void badge; void recall;
