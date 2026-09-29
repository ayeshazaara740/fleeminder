import { getMissions, getMemories } from '../data/store';
import {
  filterMissionsByRange, successRate, avgDuration, obstacleCount, rerouteCount,
  memoryAssistedCount, dayBuckets, robotUtilization, batteryTrend, impactStats,
  buildInsights, memCategoryBreakdown, retrievalLeaders
} from '../services/analytics';
import { barChart, lineChart, donutChart, hBarChart, chartLegend } from '../components/charts';
import { icon } from '../components/icons';
import { statCard } from '../components/ui';

/* Analytics — mission and memory-effect analytics over simulated data. */

let range: '24h' | '7d' | '30d' | '90d' = '30d';
const RANGE_DAYS: Record<string, number> = { '24h': 1, '7d': 7, '30d': 30, '90d': 90 };

export function renderAnalytics(el: HTMLElement) {
  const days = RANGE_DAYS[range];
  const missions = filterMissionsByRange(days);
  const memories = getMemories();
  const imp = impactStats();
  const insights = buildInsights();

  el.innerHTML = `
    <div class="view">
      <div class="view-head">
        <div class="view-title">
          <h1>Analytics</h1>
          <div class="vsub">Mission performance and the measurable effect of persistent memory. Computed from ${missions.length} missions in range.</div>
        </div>
        <div class="view-head-actions">
          <div class="seg-group" id="an-range">
            ${(['24h', '7d', '30d', '90d'] as const).map(r => `<button data-r="${r}" class="${range === r ? 'active' : ''}">${r}</button>`).join('')}
          </div>
        </div>
      </div>

      <div class="stat-grid" style="grid-template-columns:repeat(4,1fr)">
        ${statCard('Success Rate', successRate(missions), 'target', { sub: '%', accent: 'var(--green)' })}
        ${statCard('Avg Duration', avgDuration(missions), 'clock', { sub: 'min' })}
        ${statCard('Obstacles', obstacleCount(missions), 'warning', { accent: obstacleCount(missions) ? 'var(--amber)' : undefined })}
        ${statCard('Route Changes', rerouteCount(missions), 'route', { accent: 'var(--accent)' })}
        ${statCard('Memory-Assisted', memoryAssistedCount(missions), 'brain', { accent: 'var(--accent-2)' })}
        ${statCard('Memories Stored', memories.length, 'database', {})}
        ${statCard('Repeat Obstacles', imp.repeatObstacles, 'refresh', { delta: imp.repeatObstacles === 0 ? 'none recurring' : 'recurring segments', deltaDir: imp.repeatObstacles ? 'down' : 'up' })}
        ${statCard('Analysis Basis', imp.sampleNote.split(' ')[0], 'file', { sub: 'missions' })}
      </div>

      <div class="grid-2 mt">
        <section class="panel">
          <div class="panel-head"><div class="panel-title">${icon('analytics', 15)} Mission volume & failures</div></div>
          <div class="panel-body">
            <div class="chart-box" style="height:220px"><canvas id="ch-volume" style="height:220px"></canvas></div>
          </div>
        </section>
        <section class="panel">
          <div class="panel-head"><div class="panel-title">${icon('route', 15)} Obstacles & route changes</div></div>
          <div class="panel-body">
            <div class="chart-box" style="height:220px"><canvas id="ch-obstacles" style="height:220px"></canvas></div>
            ${chartLegend([{ label: 'Obstacles', color: '#f8717f' }, { label: 'Route changes', color: '#4f8cff' }])}
          </div>
        </section>
      </div>

      <div class="grid-2 mt">
        <section class="panel">
          <div class="panel-head"><div class="panel-title">${icon('clock', 15)} Mission duration trend</div></div>
          <div class="panel-body">
            <div class="chart-box" style="height:200px"><canvas id="ch-duration" style="height:200px"></canvas></div>
          </div>
        </section>
        <section class="panel">
          <div class="panel-head"><div class="panel-title">${icon('battery', 15)} Battery trends (fleet)</div>
          <div class="panel-head-actions"><span class="badge badge-cyan">SIMULATED</span></div></div>
          <div class="panel-body">
            <div class="chart-box" style="height:200px"><canvas id="ch-battery" style="height:200px"></canvas></div>
          </div>
        </section>
      </div>

      <div class="grid-2 mt">
        <section class="panel">
          <div class="panel-head"><div class="panel-title">${icon('fleet', 15)} Robot utilization</div></div>
          <div class="panel-body">
            <div class="chart-box" style="height:180px"><canvas id="ch-util" style="height:180px"></canvas></div>
          </div>
        </section>
        <section class="panel">
          <div class="panel-head"><div class="panel-title">${icon('brain', 15)} Memory retrieval frequency</div></div>
          <div class="panel-body">
            <div class="chart-box" style="height:200px"><canvas id="ch-memory" style="height:200px"></canvas></div>
            ${chartLegend([{ label: 'Memory retrievals', color: '#8b7cf6' }, { label: 'Memory-assisted successes', color: '#34d399' }])}
          </div>
        </section>
      </div>

      <!-- Memory impact — the key demonstration -->
      <section class="panel mt">
        <div class="panel-head">
          <div><div class="panel-title">${icon('zap', 15)} Memory Impact — without vs with persistent memory</div>
          <div class="panel-sub">Computed from ${imp.sampleNote}. Memory-assisted missions are those where experiences were retrieved during planning or execution.</div></div>
        </div>
        <div class="panel-body">
          <div class="impact-grid">
            <div class="impact-col no-mem">
              <div class="impact-head">${icon('xCircle', 16)}<h4>WITHOUT MEMORY</h4></div>
              <div class="impact-steps">
                ${impactStep('New mission assigned')}
                ${impactStep('Obstacle encountered — no prior knowledge')}
                ${impactStep('Replan from scratch under time pressure')}
                ${impactStep('Repeated detours & delays')}
              </div>
              <div class="impact-result" style="color:var(--red)">Success rate<div class="impact-metric">${imp.noMemSuccessPct}%</div></div>
              <div class="fs-11 text-dim mt-8">${imp.obstacleNoMem} obstacle encounter(s) in non-memory-assisted missions</div>
            </div>
            <div class="impact-col with-mem">
              <div class="impact-head">${icon('checkCircle', 16)}<h4>WITH PERSISTENT MEMORY</h4></div>
              <div class="impact-steps">
                ${impactStep('New mission assigned')}
                ${impactStep('Past experience retrieved before departure')}
                ${impactStep('Risk identified: prior obstruction known')}
                ${impactStep('Alternative route selected up front')}
              </div>
              <div class="impact-result" style="color:var(--green)">Success rate<div class="impact-metric">${imp.memAssistedSuccessPct}%</div></div>
              <div class="fs-11 text-dim mt-8">${imp.memAssisted} memory-assisted mission(s) · ${imp.obstacleWithMem} obstacle encounter(s)</div>
            </div>
          </div>
          ${imp.memAssisted < 3 ? `<div class="info-note mt-8">${icon('info', 15)}<span>Sample size is still small (${imp.memAssisted} memory-assisted missions). Run more missions — or use Demo Mode — to strengthen the comparison.</span></div>` : ''}
        </div>
      </section>

      <div class="grid-2 mt">
        <section class="panel">
          <div class="panel-head"><div class="panel-title">${icon('layers', 15)} Memory categories</div></div>
          <div class="panel-body">
            <div class="chart-box" style="height:220px"><canvas id="ch-cats" style="height:220px"></canvas></div>
          </div>
        </section>
        <section class="panel">
          <div class="panel-head"><div class="panel-title">${icon('refresh', 15)} Most-retrieved memories</div></div>
          <div class="panel-body">
            <div class="chart-box" style="height:220px"><canvas id="ch-retrieval" style="height:220px"></canvas></div>
          </div>
        </section>
      </div>

      <section class="panel mt">
        <div class="panel-head"><div class="panel-title">${icon('zap', 15)} Insights</div>
        <div class="panel-head-actions"><span class="badge badge-cyan">DATA-DRIVEN — SHOWN ONLY WHEN SUPPORTED</span></div></div>
        <div class="panel-body">
          ${insights.map(i => `
            <div class="info-note ${i.tone === 'positive' ? 'mem-note' : ''} mb-8">
              ${icon(i.tone === 'positive' ? 'checkCircle' : i.tone === 'warning' ? 'warning' : 'info', 15)}
              <span>${i.text}</span>
            </div>`).join('')}
        </div>
      </section>
    </div>`;

  /* range switcher */
  el.querySelectorAll('#an-range button').forEach(b => b.addEventListener('click', () => {
    range = (b as HTMLElement).dataset.r as typeof range;
    renderAnalytics(el);
  }));

  drawCharts(el, days, missions);
}

function impactStep(text: string): string {
  return `<div class="impact-step"><span class="is-dot">${icon('arrowRight', 11)}</span><span>${text}</span></div><div class="impact-line"></div>`;
}

function drawCharts(el: HTMLElement, days: number, missions: import('../data/types').Mission[]) {
  const buckets = dayBuckets(missions, getMemories(), days);
  const labels = buckets.map(b => b.label);

  const vol = el.querySelector<HTMLCanvasElement>('#ch-volume');
  if (vol) barChart(vol, labels, [
    { label: 'Missions', color: '#4f8cff', values: buckets.map(b => b.missions) },
    { label: 'Failures', color: '#f8717f', values: buckets.map(b => b.failures) }
  ]);

  const obst = el.querySelector<HTMLCanvasElement>('#ch-obstacles');
  if (obst) barChart(obst, labels, [
    { label: 'Obstacles', color: '#f8717f', values: buckets.map(b => b.obstacles) },
    { label: 'Route changes', color: '#4f8cff', values: buckets.map(b => b.reroutes) }
  ]);

  const dur = el.querySelector<HTMLCanvasElement>('#ch-duration');
  if (dur) lineChart(dur, labels, [{ label: 'Avg duration (min)', color: '#38d9f5', values: buckets.map(b => b.avgDurationMin) }]);

  const batt = el.querySelector<HTMLCanvasElement>('#ch-battery');
  if (batt) {
    const trend = batteryTrend();
    lineChart(batt, trend.map(t => t.label), [{ label: 'Fleet avg battery %', color: '#34d399', values: trend.map(t => Math.round(Object.values(t.values).reduce((a, v) => a + v, 0) / Math.max(1, Object.values(t.values).length))) }], { yMin: 0, yMax: 100 });
  }

  const util = el.querySelector<HTMLCanvasElement>('#ch-util');
  if (util) hBarChart(util, robotUtilization().map(r => ({ label: `${r.robotId} ${r.name}`, value: r.missions, color: '#8b7cf6' })));

  const mem = el.querySelector<HTMLCanvasElement>('#ch-memory');
  if (mem) lineChart(mem, labels, [
    { label: 'Retrievals', color: '#8b7cf6', values: buckets.map(b => b.memRetrievals) },
    { label: 'Mem-assisted successes', color: '#34d399', values: buckets.map(b => b.memAssisted) }
  ]);

  const cats = el.querySelector<HTMLCanvasElement>('#ch-cats');
  if (cats) {
    const colors = ['#4f8cff', '#8b7cf6', '#38d9f5', '#34d399', '#fbbf24', '#f8717f', '#9aa7c4', '#7c6cf8', '#38bdf8', '#a3e635'];
    donutChart(cats, memCategoryBreakdown().map((c, i) => ({ label: c.cat, value: c.n, color: colors[i % colors.length] })), String(getMemories().length));
  }

  const retr = el.querySelector<HTMLCanvasElement>('#ch-retrieval');
  if (retr) hBarChart(retr, retrievalLeaders(6).map(r => ({ label: r.id, value: r.count, color: '#8b7cf6' })));
}
