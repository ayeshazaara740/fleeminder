import { createMission } from '../src/services/simulation';
import { getMissions, getState, resetAllData } from '../src/data/store';

resetAllData();
console.log('before:', getMissions().length, 'seq:', getState().seqMission);
const m = createMission({
  robotId: 'R-01', type: 'Inspection', envId: 'wh-a',
  destinationNode: 'zone-a2', destinationName: 'Zone A2',
  priority: 'Normal', mode: 'autonomous', instructions: 't', scenarioId: 'obstacle'
});
console.log('after :', getMissions().length, 'seq:', getState().seqMission);
console.log('created id:', m.id, 'code:', m.code, 'status:', m.status);
const found = getMissions().find(x => x.id === m.id);
console.log('found by id:', !!found);
