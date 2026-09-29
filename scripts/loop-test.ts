/* End-to-end logic test: full memory loop without a browser. */
import { createMission, startMission, cancelMission, completeMission, saveExperienceToMemory, getActiveSim } from '../src/services/simulation';
import { getMissions, getMemories, getState, resetAllData } from '../src/data/store';
import { recall } from '../src/services/memory';

let failures = 0;
function assert(cond: boolean, label: string) {
  if (cond) console.log(`  ✓ ${label}`);
  else { failures++; console.error(`  ✗ FAIL: ${label}`); }
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function main() {
  console.log('— Resetting to seed data —');
  resetAllData();

  console.log('— Mission 1: obstacle scenario (R-01, Warehouse A) —');
  const m1 = createMission({
    robotId: 'R-01', type: 'Inspection', envId: 'wh-a',
    destinationNode: 'zone-a2', destinationName: 'Zone A2',
    priority: 'Normal', mode: 'autonomous',
    instructions: 'test', scenarioId: 'obstacle'
  });
  startMission(m1, 'obstacle');
  assert(getState().missions[0].status === 'active', 'mission 1 active after start');

  let obstacleSeen = false, rerouteSeen = false, memRetrieved = false;
  const t0 = Date.now();
  while (Date.now() - t0 < 60000) {
    await sleep(500);
    const m = getMissions().find(x => x.id === m1.id)!;
    const titles = m.events.map(e => e.title);
    if (titles.includes('Obstacle detected')) obstacleSeen = true;
    if (titles.some(t => t.startsWith('Alternative route selected'))) rerouteSeen = true;
    if (m.memoryIdsRetrieved.length > 0) memRetrieved = true;
    if (m.status === 'completed' || m.status === 'failed') break;
  }
  const m1f = getMissions().find(x => x.id === m1.id)!;
  assert(obstacleSeen, 'obstacle detected during mission');
  assert(rerouteSeen, 'alternative route selected after obstacle');
  assert(memRetrieved, 'memory retrieved during execution');
  assert(m1f.status === 'completed', `mission 1 completed (status=${m1f.status}, progress=${m1f.progress.toFixed(0)})`);
  assert(m1f.route!.current.join(',') !== m1f.route!.planned.join(','), 'route changed vs original plan');

  console.log('— Save learned experience —');
  const memCountBefore = getMemories().length;
  const mem = saveExperienceToMemory(m1f);
  assert(getMemories().length === memCountBefore + 1, 'new memory stored');
  assert(mem.category === 'Obstacles', `memory category Obstacles (${mem.category})`);
  assert(mem.text.includes('Corridor'), 'memory mentions the corridor');

  console.log('— Mission 2: same destination, clean scenario —');
  const m2 = createMission({
    robotId: 'R-01', type: 'Inspection', envId: 'wh-a',
    destinationNode: 'zone-a2', destinationName: 'Zone A2',
    priority: 'Normal', mode: 'autonomous',
    instructions: 'test 2', scenarioId: 'clean'
  });
  startMission(m2, 'clean');
  const m2s = getMissions().find(x => x.id === m2.id)!;
  const planningMems = m2s.memoryIdsRetrieved;
  assert(planningMems.includes(mem.id) || planningMems.length > 0, `agent retrieved memory during planning (${planningMems.join(', ') || 'none'})`);
  const preemptive = m2s.decisions.some(d => d.phase === 'planning' && /route via/i.test(d.decision));
  assert(preemptive, 'agent preemptively rerouted during planning (learned behavior)');

  const t1 = Date.now();
  while (Date.now() - t1 < 60000) {
    await sleep(500);
    const m = getMissions().find(x => x.id === m2.id)!;
    if (m.status === 'completed' || m.status === 'failed') break;
  }
  const m2f = getMissions().find(x => x.id === m2.id)!;
  assert(m2f.status === 'completed', `mission 2 completed (status=${m2f.status})`);
  assert(!m2f.events.some(e => e.title === 'Obstacle detected'), 'no obstacle encountered (avoided proactively)');

  console.log('— Recall sanity —');
  const r = recall({ robotId: 'R-01', envId: 'wh-a', destinationNode: 'zone-a2', text: 'Inspection Zone A2', limit: 3 });
  assert(r.hits.length > 0, `recall returns hits (${r.hits.length})`);
  assert(r.hits[0].memory.tags.includes('corridor-c') || r.hits[0].score > 0.5, 'top hit is relevant');

  console.log('— Pause/Resume/Cancel —');
  const m3 = createMission({
    robotId: 'R-02', type: 'Patrol', envId: 'wh-a', destinationNode: 'zone-a1', destinationName: 'Zone A1',
    priority: 'Low', mode: 'manual', instructions: 'x', scenarioId: 'clean'
  });
  startMission(m3, 'clean');
  assert(!!getActiveSim(m3.id), 'sim registered');
  cancelMission(m3.id);
  assert(getMissions().find(x => x.id === m3.id)!.status === 'cancelled', 'mission cancelled');

  console.log(failures === 0 ? '\nALL TESTS PASSED' : `\n${failures} FAILURES`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch(e => { console.error('FATAL', e); process.exit(1); });
