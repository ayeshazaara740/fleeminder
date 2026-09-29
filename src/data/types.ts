/* FleetMinder domain types */

export type RobotStatus = 'online' | 'executing' | 'idle' | 'charging' | 'warning' | 'offline';
export type MissionStatus = 'queued' | 'active' | 'paused' | 'completed' | 'failed' | 'cancelled';
export type MissionType = 'Inspection' | 'Delivery' | 'Patrol' | 'Mapping' | 'Environmental Monitoring' | 'Search' | 'Infrastructure Check';
export type Priority = 'Low' | 'Normal' | 'High' | 'Critical';
export type EventSeverity = 'info' | 'warning' | 'critical' | 'success';
export type EventKind = 'sim' | 'agent' | 'memory' | 'system' | 'decision';
export type MemoryCategory =
  | 'Navigation' | 'Obstacles' | 'Battery' | 'Environment' | 'Mission Strategy'
  | 'Robot Behavior' | 'Failures' | 'Successful Strategies' | 'Safety' | 'Operator Preferences';
export type EnvId = 'wh-a' | 'industrial' | 'outdoor';
export type MemoryOrigin = 'simulated';

export interface EnvNode { id: string; name: string; x: number; y: number; kind?: 'dock' | 'checkpoint' | 'poi'; }
export interface EnvEdge { a: string; b: string; }
export interface EnvZone { id: string; name: string; x: number; y: number; w: number; h: number; danger?: boolean; }
export interface EnvObstacle { id: string; name: string; x: number; y: number; r?: number; w?: number; h?: number; kind: 'crate' | 'wall' | 'machine' | 'puddle' | 'debris' | 'vehicle'; }
export interface Environment {
  id: EnvId;
  name: string;
  short: string;
  width: number;
  height: number;
  nodes: EnvNode[];
  edges: EnvEdge[];
  zones: EnvZone[];
  obstacles: EnvObstacle[];
}

export interface Robot {
  id: string;
  name: string;
  model: string;
  status: RobotStatus;
  battery: number;
  location: string;
  envId: EnvId;
  signal: number;
  temperature: number;
  speed: number;
  missionCount: number;
  successCount: number;
  lastMaintenance: string;
  healthScore: number;
  lastActivity: string;
  currentMissionId: string | null;
  knownStrengths: string[];
  knownIssues: string[];
  learnedPreferences: string[];
  x: number;
  y: number;
}

export interface MissionEvent {
  id: string;
  missionId: string;
  ts: number;
  kind: EventKind;
  severity: EventSeverity;
  title: string;
  detail?: string;
  memoryIds?: string[];
  atNode?: string;
}

export interface AgentDecision {
  id: string;
  missionId: string;
  ts: number;
  phase: 'planning' | 'execution';
  decision: string;
  rationale: string;
  sourceMemories: string[];
  confidence: number;
  outcome?: string;
}

export interface RoutePoint { x: number; y: number; nodeId?: string; }

export interface MissionRoute {
  envId: EnvId;
  planned: string[];
  current: string[];
  pointIndex: number;
}

export interface Memory {
  id: string;
  robotId: string;
  missionId: string;
  missionCode?: string;
  category: MemoryCategory;
  text: string;
  confidence: number;
  relevance: number;
  createdAt: number;
  lastRetrievedAt: number | null;
  retrievalCount: number;
  envId: EnvId;
  tags: string[];
  origin: MemoryOrigin;
  supersededBy?: string | null;
  evolution?: MemoryEvolutionEntry[];
}

export interface MemoryEvolutionEntry {
  label: string;
  ts: number;
  text: string;
  confidence: number;
}

export interface MemoryConflict {
  id: string;
  memoryAId: string;
  memoryBId: string;
  topic: string;
  status: 'open' | 'resolved' | 'monitoring';
  detectedAt: number;
  resolution?: string;
  resolvedStrategy?: 'recency' | 'context-conditional' | 'keep-both' | 'retire-old';
}

export interface TelemetrySample {
  ts: number;
  battery: number;
  speed: number;
  temperature: number;
  signal: number;
  obstacleDistance: number | null;
  x: number;
  y: number;
}

export interface Alert {
  id: string;
  ts: number;
  severity: EventSeverity;
  title: string;
  detail: string;
  robotId?: string;
  missionId?: string;
  source: 'telemetry' | 'mission' | 'memory' | 'system';
  reviewed: boolean;
}

export interface AppNotification {
  id: string;
  ts: number;
  severity: EventSeverity;
  title: string;
  body: string;
  read: boolean;
  route?: { view: string; id?: string };
}

export interface Mission {
  id: string;
  code: string;
  robotId: string;
  type: MissionType;
  envId: EnvId;
  destinationNode: string;
  destinationName: string;
  priority: Priority;
  mode: 'autonomous' | 'manual';
  instructions: string;
  status: MissionStatus;
  outcome?: 'success' | 'partial' | 'failed';
  progress: number;
  createdAt: number;
  startedAt: number | null;
  endedAt: number | null;
  durationSec: number;
  events: MissionEvent[];
  route: MissionRoute | null;
  decisions: AgentDecision[];
  memoryIdsRetrieved: string[];
  memoryIdsCreated: string[];
  problems: string[];
  distanceM: number;
  scenarioId?: string;
  plannedVsActualNote?: string;
}

export interface MaintenanceRecord {
  id: string;
  robotId: string;
  ts: number;
  kind: string;
  notes: string;
}

export interface FleetSettings {
  autoAssign: boolean;
  lowBatteryThreshold: number;
  criticalBatteryThreshold: number;
  signalWarning: number;
  maxConcurrentMissions: number;
  memoryRecallEnabled: boolean;
  memoryAutoSave: boolean;
  memoryMinRelevance: number;
  memoryConflictDetection: boolean;
  memoryRetentionDays: number;
  memoryBackend: 'internal';
  agentPlanningVerbose: boolean;
  agentAutoReroute: boolean;
  agentConfidenceThreshold: number;
  simSpeed: number;
  simEventFrequency: 'low' | 'normal' | 'high';
  notificationsMission: boolean;
  notificationsMemory: boolean;
  notificationsBattery: boolean;
  notificationsCritical: boolean;
  operatorName: string;
  operatorRole: string;
  requireReviewForCritical: boolean;
  sessionTimeoutMin: number;
  telemetryIntervalSec: number;
}

export interface DemoStep {
  id: number;
  label: string;
  title: string;
  desc: string;
}

export interface GlobalSearchResult {
  type: 'robot' | 'mission' | 'memory' | 'event' | 'alert';
  id: string;
  title: string;
  sub: string;
  route: string;
  icon: string;
}
