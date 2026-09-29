import { getSettings, updateSettings, getMemories, getState } from '../data/store';
import { icon } from '../components/icons';
import { badge, toast, confirmDialog } from '../components/ui';
import { resetDemo } from '../demo';

/* Settings — all sections, with secret handling rules enforced. */

const SECTIONS: Array<[string, string]> = [
  ['general', 'General'], ['fleet', 'Fleet Configuration'], ['simulation', 'Simulation Settings'],
  ['memory', 'Memory Settings'], ['agent', 'AI Agent Settings'], ['notifications', 'Notifications'],
  ['security', 'Security'], ['api', 'API Configuration']
];

let activeSection = 'general';

export function renderSettings(el: HTMLElement) {
  const s = getSettings();

  el.innerHTML = `
    <div class="view">
      <div class="view-head">
        <div class="view-title">
          <h1>Settings</h1>
          <div class="vsub">Platform configuration. Changes apply immediately and persist locally.</div>
        </div>
      </div>

      <div class="settings-layout">
        <nav class="settings-nav" aria-label="Settings sections">
          ${SECTIONS.map(([id, label]) => `<button data-sec="${id}" class="${activeSection === id ? 'active' : ''}">${label}</button>`).join('')}
        </nav>

        <div class="settings-section" id="set-body"></div>
      </div>
    </div>`;

  const body = el.querySelector('#set-body')!;

  if (activeSection === 'general') {
    body.innerHTML = `
      ${panel('General', `
        <div class="form-row">
          <div class="field"><label for="st-name">Operator name</label><input id="st-name" class="input" value="${s.operatorName}" /></div>
          <div class="field"><label for="st-role">Role</label><input id="st-role" class="input" value="${s.operatorRole}" /></div>
        </div>
        <div class="info-note mt-16">${icon('info', 15)}<span>FleetMinder is a browser-based prototype. Robot telemetry and the internal memory provider are simulated; application state is persisted in this browser.</span></div>
      `)}
      ${panel('Danger zone', `
        <div class="flex" style="gap:10px;align-items:center;flex-wrap:wrap">
          <span class="fs-12 text-dim">Reset all missions, memories, alerts and settings to the initial demo dataset.</span>
          <button class="btn btn-danger ml-auto" id="st-reset">${icon('trash', 14)} Reset all data</button>
        </div>
      `)}`;
    body.querySelector('#st-name')?.addEventListener('change', e => updateSettings({ operatorName: (e.target as HTMLInputElement).value }));
    body.querySelector('#st-role')?.addEventListener('change', e => updateSettings({ operatorRole: (e.target as HTMLInputElement).value }));
    body.querySelector('#st-reset')?.addEventListener('click', () => {
      confirmDialog('Reset everything?', 'All missions, memories, alerts and settings will be restored to the initial demo dataset. This cannot be undone.', 'Reset all data', () => {
        resetDemo();
      }, true);
    });
  }

  if (activeSection === 'fleet') {
    body.innerHTML = `
      ${panel('Fleet Configuration', `
        <label class="checkbox-row mb-8"><input type="checkbox" id="st-auto" ${s.autoAssign ? 'checked' : ''}/> Auto-assign robots when creating missions</label>
        <div class="form-row-3 mt-8">
          <div class="field"><label>Low battery threshold (%)</label><input id="st-low" type="number" min="5" max="60" class="input" value="${s.lowBatteryThreshold}" /></div>
          <div class="field"><label>Critical battery threshold (%)</label><input id="st-crit" type="number" min="3" max="40" class="input" value="${s.criticalBatteryThreshold}" /></div>
          <div class="field"><label>Signal warning (%)</label><input id="st-sig" type="number" min="10" max="90" class="input" value="${s.signalWarning}" /></div>
        </div>
        <div class="form-row mt-8">
          <div class="field"><label>Max concurrent missions</label><input id="st-max" type="number" min="1" max="10" class="input" value="${s.maxConcurrentMissions}" /></div>
          <div class="field"><label>Telemetry sample interval (sec)</label><input id="st-tel" type="number" min="2" max="60" class="input" value="${s.telemetryIntervalSec}" /></div>
        </div>
      `)}`;
    bindNum(body, 'st-low', v => updateSettings({ lowBatteryThreshold: v }));
    bindNum(body, 'st-crit', v => updateSettings({ criticalBatteryThreshold: v }));
    bindNum(body, 'st-sig', v => updateSettings({ signalWarning: v }));
    bindNum(body, 'st-max', v => updateSettings({ maxConcurrentMissions: v }));
    bindNum(body, 'st-tel', v => updateSettings({ telemetryIntervalSec: v }));
    body.querySelector('#st-auto')?.addEventListener('change', e => updateSettings({ autoAssign: (e.target as HTMLInputElement).checked }));
  }

  if (activeSection === 'simulation') {
    body.innerHTML = `
      ${panel('Simulation Settings', `
        <div class="form-row">
          <div class="field">
            <label>Simulation speed — ${s.simSpeed}×</label>
            <input id="st-speed" type="range" min="0.5" max="4" step="0.5" value="${s.simSpeed}" />
            <span class="hint">Controls robot movement speed and event cadence.</span>
          </div>
          <div class="field">
            <label for="st-freq">Event frequency</label>
            <select id="st-freq" class="input">
              ${['low', 'normal', 'high'].map(f => `<option ${s.simEventFrequency === f ? 'selected' : ''}>${f}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="info-note sim-note mt-16">${icon('sim', 15)}<span>The robot, environment and telemetry are <b>simulated</b>. The UI labels simulated data everywhere it appears.</span></div>
      `)}`;
    body.querySelector('#st-speed')?.addEventListener('input', e => {
      const v = parseFloat((e.target as HTMLInputElement).value);
      updateSettings({ simSpeed: v });
      const lbl = (e.target as HTMLInputElement).closest('.field')?.querySelector('label');
      if (lbl) lbl.textContent = `Simulation speed — ${v}×`;
    });
    body.querySelector('#st-freq')?.addEventListener('change', e => updateSettings({ simEventFrequency: (e.target as HTMLSelectElement).value as 'low' | 'normal' | 'high' }));
  }

  if (activeSection === 'memory') {
    body.innerHTML = `
      ${panel('Memory Settings', `
        <label class="checkbox-row mb-8"><input type="checkbox" id="st-recall" ${s.memoryRecallEnabled ? 'checked' : ''}/> Retrieve memories during mission planning</label>
        <label class="checkbox-row mb-8"><input type="checkbox" id="st-autosave" ${s.memoryAutoSave ? 'checked' : ''}/> Auto-save proposed experiences after missions</label>
        <label class="checkbox-row mb-8"><input type="checkbox" id="st-conflict" ${s.memoryConflictDetection ? 'checked' : ''}/> Detect conflicting memories</label>
        <div class="form-row mt-8">
          <div class="field">
            <label>Minimum relevance — ${(s.memoryMinRelevance * 100).toFixed(0)}%</label>
            <input id="st-minrel" type="range" min="0.2" max="0.8" step="0.05" value="${s.memoryMinRelevance}" />
          </div>
          <div class="field"><label>Retrieval retention window (days)</label><input id="st-ret" type="number" min="30" max="730" class="input" value="${s.memoryRetentionDays}" /><span class="hint">Older memories remain in history but are excluded from retrieval.</span></div>
        </div>
        <div class="kv-list mt-16">
          <div class="kv-row"><span class="k">Memories in store</span><span class="v">${getMemories().length}</span></div>
          <div class="kv-row"><span class="k">Retrievals today</span><span class="v">${getState().memRetrievedToday.count}</span></div>
        </div>
      `)}`;
    body.querySelector('#st-recall')?.addEventListener('change', e => updateSettings({ memoryRecallEnabled: (e.target as HTMLInputElement).checked }));
    body.querySelector('#st-autosave')?.addEventListener('change', e => updateSettings({ memoryAutoSave: (e.target as HTMLInputElement).checked }));
    body.querySelector('#st-conflict')?.addEventListener('change', e => updateSettings({ memoryConflictDetection: (e.target as HTMLInputElement).checked }));
    body.querySelector('#st-minrel')?.addEventListener('input', e => {
      const v = parseFloat((e.target as HTMLInputElement).value);
      updateSettings({ memoryMinRelevance: v });
      const lbl = (e.target as HTMLInputElement).closest('.field')?.querySelector('label');
      if (lbl) lbl.textContent = `Minimum relevance — ${(v * 100).toFixed(0)}%`;
    });
    bindNum(body, 'st-ret', v => updateSettings({ memoryRetentionDays: v }));
  }

  if (activeSection === 'agent') {
    body.innerHTML = `
      ${panel('AI Agent Settings', `
        <label class="checkbox-row mb-8"><input type="checkbox" id="st-verbose" ${s.agentPlanningVerbose ? 'checked' : ''}/> Verbose planning timeline</label>
        <label class="checkbox-row mb-8"><input type="checkbox" id="st-reroute" ${s.agentAutoReroute ? 'checked' : ''}/> Apply high-confidence memory routes during planning</label>
        <div class="field mt-8">
          <label>Confidence threshold — ${(s.agentConfidenceThreshold * 100).toFixed(0)}%</label>
          <input id="st-conf" type="range" min="0.3" max="0.95" step="0.05" value="${s.agentConfidenceThreshold}" />
          <span class="hint">Below this confidence, the agent verifies live conditions before applying a memory.</span>
        </div>
        <div class="info-note mt-16">${icon('agent', 15)}<span>The agent runs entirely on local application logic in this prototype. Its reasoning is explainable and always traceable to stored memories or mission events.</span></div>
      `)}`;
    body.querySelector('#st-verbose')?.addEventListener('change', e => updateSettings({ agentPlanningVerbose: (e.target as HTMLInputElement).checked }));
    body.querySelector('#st-reroute')?.addEventListener('change', e => updateSettings({ agentAutoReroute: (e.target as HTMLInputElement).checked }));
    body.querySelector('#st-conf')?.addEventListener('input', e => {
      const v = parseFloat((e.target as HTMLInputElement).value);
      updateSettings({ agentConfidenceThreshold: v });
      const lbl = (e.target as HTMLInputElement).closest('.field')?.querySelector('label');
      if (lbl) lbl.textContent = `Confidence threshold — ${(v * 100).toFixed(0)}%`;
    });
  }

  if (activeSection === 'notifications') {
    body.innerHTML = `
      ${panel('Notifications', `
        <label class="checkbox-row mb-8"><input type="checkbox" id="st-nm" ${s.notificationsMission ? 'checked' : ''}/> Mission completed / failed</label>
        <label class="checkbox-row mb-8"><input type="checkbox" id="st-nmem" ${s.notificationsMemory ? 'checked' : ''}/> Memory created & important retrievals</label>
        <label class="checkbox-row mb-8"><input type="checkbox" id="st-nb" ${s.notificationsBattery ? 'checked' : ''}/> Battery warnings</label>
        <label class="checkbox-row mb-8"><input type="checkbox" id="st-nc" ${s.notificationsCritical ? 'checked' : ''}/> Critical robot warnings</label>
      `)}`;
    body.querySelector('#st-nm')?.addEventListener('change', e => updateSettings({ notificationsMission: (e.target as HTMLInputElement).checked }));
    body.querySelector('#st-nmem')?.addEventListener('change', e => updateSettings({ notificationsMemory: (e.target as HTMLInputElement).checked }));
    body.querySelector('#st-nb')?.addEventListener('change', e => updateSettings({ notificationsBattery: (e.target as HTMLInputElement).checked }));
    body.querySelector('#st-nc')?.addEventListener('change', e => updateSettings({ notificationsCritical: (e.target as HTMLInputElement).checked }));
  }

  if (activeSection === 'security') {
    body.innerHTML = `
      ${panel('Security', `
        <div class="form-row">
          <div class="field"><label for="st-timeout">Session timeout (min)</label><input id="st-timeout" type="number" min="5" max="240" class="input" value="${s.sessionTimeoutMin}" /></div>
        </div>
        <label class="checkbox-row mt-8"><input type="checkbox" id="st-review" ${s.requireReviewForCritical ? 'checked' : ''}/> Require operator review before executing Critical-priority missions</label>
        <div class="info-note mt-16">${icon('lock', 15)}<span>Authentication and session controls are informational in this prototype. There is no server-side session or API credential handling.</span></div>
      `)}`;
    bindNum(body, 'st-timeout', v => updateSettings({ sessionTimeoutMin: v }));
    body.querySelector('#st-review')?.addEventListener('change', e => updateSettings({ requireReviewForCritical: (e.target as HTMLInputElement).checked }));
  }

  if (activeSection === 'api') {
    body.innerHTML = `
      ${panel('Memory Integration', `
        <div class="kv-list">
          <div class="kv-row"><span class="k">Active provider</span><span class="v">Internal simulated store</span></div>
          <div class="kv-row"><span class="k">Hindsight connection</span><span class="v">Not connected</span></div>
          <div class="kv-row"><span class="k">Memory service</span><span class="v">Local application layer</span></div>
        </div>
        <div class="info-note mem-note mt-16">${icon('info', 15)}<span>This browser-only prototype does not call Hindsight and has no server-side memory API. Mission memories are simulated application data persisted in this browser. No API credentials are accepted or stored here. Connect a real Hindsight provider through a server-side adapter before enabling external memory.</span></div>
      `)}`;
  }

  el.querySelectorAll('.settings-nav button').forEach(b => b.addEventListener('click', () => {
    activeSection = (b as HTMLElement).dataset.sec!;
    renderSettings(el);
  }));
}

function panel(title: string, inner: string): string {
  return `<section class="panel mb-16"><div class="panel-head"><div class="panel-title">${title}</div></div><div class="panel-body">${inner}</div></section>`;
}

function bindNum(root: Element, id: string, apply: (v: number) => void) {
  root.querySelector(`#${id}`)?.addEventListener('change', e => {
    const v = parseInt((e.target as HTMLInputElement).value, 10);
    if (!isNaN(v)) apply(v);
  });
}

void badge;
