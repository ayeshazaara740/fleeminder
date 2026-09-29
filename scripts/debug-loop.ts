import { createMission, startMission, completeMission } from '../src/services/simulation';
import { getMissions, getMemories, resetAllData, getState } from '../src/data/store';

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function main() {
  resetAllData();
  const m1 = createMission({
    robotId: 'R-01', type: 'Inspection', envId: 'wh-a',
    destinationNode: 'zone-a2', destinationName: 'Zone A2',
    priority: 'Normal', mode: 'autonomous', instructions: 't', scenarioId: 'obstacle'
  });
  startMission(m1, 'obstacle');
  const names = (ids: string[]) => ids.map(i => getState().robots.length ? i : i).join(' | ');

  const t0 = Date.now();
  while (Date.now() - t0 < 45000) {
    await sleep(400);
    const m = getMissions().find(x => x.id === m1.id)!;
    if (m.status !== 'active') break;
  }
  const m = getMissions().find(x => x.id === m1.id)!;
  console.log('status:', m.status, 'progress:', m.progress.toFixed(1));
  console.log('planned :', m.route?.planned.join(' > '));
  console.log('current :', m.route?.current.join(' > '));
  console.log('--- events ---');
  m.events.forEach(e => console.log(` [${e.kind}/${e.severity}] ${e.title}${e.atNode ? ' @' + e.atNode : ''}`));
  console.log('--- decisions ---');
  m.decisions.forEach(d => console.log(` * ${d.phase}: ${d.decision}`));
  console.log('--- retrieved ---', m.memoryIdsRetrieved.join(', '));
  console.log('--- mem text (new) ---');
  getMemories().slice(0, 2).forEach(x => console.log(' ', x.id, x.text));
  process.exit(0);
}
main().catch(e => { console.error(e); process.exit(1); });
