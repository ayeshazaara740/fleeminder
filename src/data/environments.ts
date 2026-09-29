import type { Environment } from './types';

/* Three predefined environments with alternative routes between nodes. */

export const ENVIRONMENTS: Environment[] = [
  {
    id: 'wh-a',
    name: 'Warehouse A',
    short: 'WH-A',
    width: 1000,
    height: 640,
    nodes: [
      { id: 'dock', name: 'Dock Bay', x: 90, y: 520, kind: 'dock' },
      { id: 'corridor-a', name: 'Corridor A', x: 280, y: 420, kind: 'checkpoint' },
      { id: 'corridor-b', name: 'Corridor B', x: 470, y: 200, kind: 'checkpoint' },
      { id: 'corridor-c', name: 'Corridor C', x: 430, y: 480, kind: 'checkpoint' },
      { id: 'junction-d', name: 'Junction D', x: 640, y: 360, kind: 'checkpoint' },
      { id: 'zone-a1', name: 'Zone A1', x: 770, y: 180, kind: 'poi' },
      { id: 'zone-a2', name: 'Zone A2', x: 830, y: 430, kind: 'poi' },
      { id: 'charge-1', name: 'Charge Station 1', x: 170, y: 580, kind: 'poi' }
    ],
    edges: [
      { a: 'dock', b: 'corridor-a' },
      { a: 'corridor-a', b: 'corridor-b' },
      { a: 'corridor-a', b: 'corridor-c' },
      { a: 'corridor-b', b: 'junction-d' },
      { a: 'corridor-c', b: 'junction-d' },
      { a: 'junction-d', b: 'zone-a1' },
      { a: 'junction-d', b: 'zone-a2' },
      { a: 'dock', b: 'charge-1' }
    ],
    zones: [
      { id: 'z-rack-1', name: 'Rack Row 1', x: 60, y: 60, w: 220, h: 180 },
      { id: 'z-rack-2', name: 'Rack Row 2', x: 560, y: 60, w: 150, h: 120 },
      { id: 'z-restricted', name: 'Restricted — Automation Cell', x: 700, y: 250, w: 130, h: 110, danger: true }
    ],
    obstacles: [
      { id: 'ob-b1', name: 'Blocked passage (pallet)', x: 470, y: 200, w: 70, h: 26, kind: 'crate' },
      { id: 'ob-m1', name: 'Forklift parked', x: 250, y: 330, w: 56, h: 34, kind: 'vehicle' },
      { id: 'ob-m2', name: 'Conveyor unit', x: 620, y: 480, w: 80, h: 30, kind: 'machine' }
    ]
  },
  {
    id: 'industrial',
    name: 'Industrial Facility',
    short: 'IND',
    width: 1000,
    height: 640,
    nodes: [
      { id: 'gate', name: 'Service Gate', x: 80, y: 320, kind: 'dock' },
      { id: 'hall-n', name: 'North Hall', x: 300, y: 170, kind: 'checkpoint' },
      { id: 'hall-s', name: 'South Hall', x: 300, y: 470, kind: 'checkpoint' },
      { id: 'press-bay', name: 'Press Bay', x: 540, y: 150, kind: 'poi' },
      { id: 'assembly', name: 'Assembly Line', x: 560, y: 460, kind: 'checkpoint' },
      { id: 'qa-cell', name: 'QA Cell', x: 790, y: 300, kind: 'poi' },
      { id: 'chem-store', name: 'Chemical Store', x: 820, y: 540, kind: 'poi' }
    ],
    edges: [
      { a: 'gate', b: 'hall-n' },
      { a: 'gate', b: 'hall-s' },
      { a: 'hall-n', b: 'press-bay' },
      { a: 'hall-s', b: 'assembly' },
      { a: 'press-bay', b: 'qa-cell' },
      { a: 'assembly', b: 'qa-cell' },
      { a: 'assembly', b: 'chem-store' },
      { a: 'hall-n', b: 'hall-s' }
    ],
    zones: [
      { id: 'z-press', name: 'Press Safety Zone', x: 430, y: 60, w: 150, h: 130, danger: true },
      { id: 'z-storage', name: 'Parts Storage', x: 90, y: 470, w: 160, h: 130 }
    ],
    obstacles: [
      { id: 'ob-i1', name: 'Coolant spill', x: 300, y: 320, w: 90, h: 24, kind: 'puddle' },
      { id: 'ob-i2', name: 'Machine housing', x: 700, y: 180, w: 60, h: 60, kind: 'machine' },
      { id: 'ob-i3', name: 'Scrap bin', x: 520, y: 320, w: 46, h: 36, kind: 'crate' }
    ]
  },
  {
    id: 'outdoor',
    name: 'Outdoor Inspection Zone',
    short: 'OUT',
    width: 1000,
    height: 640,
    nodes: [
      { id: 'base', name: 'Base Station', x: 100, y: 480, kind: 'dock' },
      { id: 'perim-w', name: 'West Perimeter', x: 250, y: 300, kind: 'checkpoint' },
      { id: 'perim-n', name: 'North Perimeter', x: 480, y: 150, kind: 'checkpoint' },
      { id: 'substation', name: 'Substation', x: 740, y: 200, kind: 'poi' },
      { id: 'tank-farm', name: 'Tank Farm', x: 640, y: 450, kind: 'checkpoint' },
      { id: 'gate-e', name: 'East Gate', x: 880, y: 340, kind: 'poi' }
    ],
    edges: [
      { a: 'base', b: 'perim-w' },
      { a: 'perim-w', b: 'perim-n' },
      { a: 'perim-n', b: 'substation' },
      { a: 'perim-w', b: 'tank-farm' },
      { a: 'tank-farm', b: 'substation' },
      { a: 'tank-farm', b: 'gate-e' },
      { a: 'substation', b: 'gate-e' }
    ],
    zones: [
      { id: 'z-hv', name: 'High Voltage Enclosure', x: 660, y: 120, w: 120, h: 100, danger: true },
      { id: 'z-drainage', name: 'Drainage Basin', x: 330, y: 430, w: 170, h: 120 }
    ],
    obstacles: [
      { id: 'ob-o1', name: 'Fallen branch', x: 250, y: 300, w: 64, h: 22, kind: 'debris' },
      { id: 'ob-o2', name: 'Service truck', x: 480, y: 300, w: 60, h: 34, kind: 'vehicle' },
      { id: 'ob-o3', name: 'Mud patch', x: 640, y: 450, w: 70, h: 24, kind: 'puddle' }
    ]
  }
];

export const envById = (id: string): Environment =>
  ENVIRONMENTS.find(e => e.id === id) ?? ENVIRONMENTS[0];

export const nodeById = (env: Environment, id: string) =>
  env.nodes.find(n => n.id === id);
