import type { Environment, MissionRoute } from '../data/types';
import { envById } from '../data/environments';

/* Canvas renderer for the simulated environment. Used by Live Simulation and Replay. */

export interface MapRenderState {
  envId: string;
  route?: MissionRoute | null;
  robotXY?: { x: number; y: number } | null;
  highlightNodes?: string[];
  blockedNodeIds?: string[];
  obstacleActive?: string[];
  progressPct?: number;
  showPlannedDashed?: boolean;
  animatePulse?: boolean;
}

let raf = 0;
let lastFrame = 0;
const pulse = () => (Math.sin(Date.now() / 400) + 1) / 2;

export function drawEnvMap(canvas: HTMLCanvasElement, st: MapRenderState): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const env = envById(st.envId);
  const dpr = window.devicePixelRatio || 1;
  const W = env.width, H = env.height;
  const rect = canvas.getBoundingClientRect();
  const cssW = rect.width || 600;
  const cssH = cssW * (H / W);
  canvas.style.height = `${cssH}px`;
  canvas.width = cssW * dpr;
  canvas.height = cssH * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, cssW, cssH);
  const sx = cssW / W, sy = cssH / H;

  /* background */
  const g = ctx.createLinearGradient(0, 0, 0, cssH);
  g.addColorStop(0, '#0b101c');
  g.addColorStop(1, '#0d1322');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, cssW, cssH);

  /* subtle grid */
  ctx.strokeStyle = 'rgba(148,163,203,0.05)';
  ctx.lineWidth = 1;
  for (let x = 0; x < W; x += 50) { ctx.beginPath(); ctx.moveTo(x * sx, 0); ctx.lineTo(x * sx, cssH); ctx.stroke(); }
  for (let y = 0; y < H; y += 50) { ctx.beginPath(); ctx.moveTo(0, y * sy); ctx.lineTo(cssW, y * sy); ctx.stroke(); }

  /* zones */
  env.zones.forEach(z => {
    ctx.fillStyle = z.danger ? 'rgba(248,113,113,0.07)' : 'rgba(79,140,255,0.05)';
    ctx.strokeStyle = z.danger ? 'rgba(248,113,113,0.4)' : 'rgba(79,140,255,0.25)';
    ctx.lineWidth = 1;
    ctx.setLineDash(z.danger ? [6, 4] : []);
    ctx.beginPath();
    ctx.roundRect(z.x * sx, z.y * sy, z.w * sx, z.h * sy, 6);
    ctx.fill(); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = z.danger ? 'rgba(248,113,113,0.85)' : 'rgba(122,152,255,0.7)';
    ctx.font = '600 10px ui-sans-serif, system-ui';
    ctx.textAlign = 'left';
    ctx.fillText(z.name.toUpperCase(), z.x * sx + 7, z.y * sy + 14);
  });

  /* edges */
  env.edges.forEach(e => {
    const a = env.nodes.find(n => n.id === e.a);
    const b = env.nodes.find(n => n.id === e.b);
    if (!a || !b) return;
    ctx.strokeStyle = 'rgba(148,163,203,0.16)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(a.x * sx, a.y * sy);
    ctx.lineTo(b.x * sx, b.y * sy);
    ctx.stroke();
  });

  /* planned route (dashed, if different from current) */
  if (st.route?.planned && st.showPlannedDashed) {
    drawPath(ctx, env, st.route.planned, sx, sy, 'rgba(148,163,203,0.35)', true);
  }

  /* current route */
  if (st.route?.current?.length) {
    const grad = ctx.createLinearGradient(0, 0, cssW, cssH);
    grad.addColorStop(0, 'rgba(79,140,255,0.9)');
    grad.addColorStop(1, 'rgba(124,108,248,0.9)');
    ctx.shadowColor = 'rgba(79,140,255,0.55)';
    ctx.shadowBlur = 8;
    drawPath(ctx, env, st.route.current, sx, sy, grad, false, 3.2);
    ctx.shadowBlur = 0;
  }

  /* obstacles */
  env.obstacles.forEach(o => {
    const active = st.obstacleActive?.includes(o.id);
    const w = (o.w ?? 30) * sx, h = (o.h ?? 20) * sy;
    const x = o.x * sx - w / 2, y = o.y * sy - h / 2;
    ctx.fillStyle = active ? 'rgba(248,113,113,0.85)' : 'rgba(148,163,203,0.2)';
    ctx.strokeStyle = active ? 'rgba(248,113,113,1)' : 'rgba(148,163,203,0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, 4);
    ctx.fill(); ctx.stroke();
    if (active) {
      const p = pulse();
      ctx.strokeStyle = `rgba(248,113,113,${0.7 - p * 0.5})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(x - 4 - p * 4, y - 4 - p * 4, w + 8 + p * 8, h + 8 + p * 8, 6);
      ctx.stroke();
    }
  });

  /* nodes */
  env.nodes.forEach(n => {
    const highlighted = st.highlightNodes?.includes(n.id);
    const blocked = st.blockedNodeIds?.includes(n.id);
    const isDest = highlighted && n.id === st.highlightNodes![st.highlightNodes!.length - 1];
    const r = n.kind === 'dock' || n.kind === 'poi' ? 6 : 4.5;
    ctx.beginPath();
    ctx.arc(n.x * sx, n.y * sy, r + (highlighted ? 2 : 0), 0, Math.PI * 2);
    if (blocked) {
      ctx.fillStyle = '#f8717f';
    } else if (highlighted) {
      ctx.fillStyle = '#4f8cff';
    } else {
      ctx.fillStyle = 'rgba(148,163,203,0.5)';
    }
    ctx.fill();
    if (isDest) {
      const p = pulse();
      ctx.strokeStyle = `rgba(79,140,255,${0.8 - p * 0.5})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(n.x * sx, n.y * sy, r + 6 + p * 5, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.fillStyle = highlighted || blocked ? '#e8edf7' : 'rgba(154,167,196,0.85)';
    ctx.font = `${highlighted || blocked ? '600 ' : ''}10px ui-sans-serif, system-ui`;
    ctx.textAlign = 'center';
    ctx.fillText(n.name, n.x * sx, n.y * sy - 11);
  });

  /* robot */
  if (st.robotXY) {
    const x = st.robotXY.x * sx, y = st.robotXY.y * sy;
    const p = st.animatePulse === false ? 0.5 : pulse();
    ctx.shadowColor = 'rgba(52,211,153,0.9)';
    ctx.shadowBlur = 12;
    ctx.fillStyle = '#34d399';
    ctx.beginPath();
    ctx.arc(x, y, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.strokeStyle = 'rgba(52,211,153,0.8)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(x, y, 10 + p * 6, 0, Math.PI * 2);
    ctx.stroke();
    /* heading line */
    if (st.route?.current && st.route.pointIndex < st.route.current.length - 1) {
      const nxt = env.nodes.find(n => n.id === st.route!.current[st.route!.pointIndex + 1]);
      if (nxt) {
        ctx.strokeStyle = 'rgba(52,211,153,0.5)';
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(nxt.x * sx, nxt.y * sy);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    }
  }

  /* progress bar strip */
  if (st.progressPct !== undefined) {
    ctx.fillStyle = 'rgba(10,14,22,0.7)';
    ctx.beginPath();
    ctx.roundRect(cssW / 2 - 80, cssH - 10, 160, 4, 2);
    ctx.fill();
    ctx.fillStyle = '#4f8cff';
    ctx.beginPath();
    ctx.roundRect(cssW / 2 - 80, cssH - 10, 160 * (st.progressPct / 100), 4, 2);
    ctx.fill();
  }
}

function drawPath(
  ctx: CanvasRenderingContext2D,
  env: Environment,
  nodeIds: string[],
  sx: number, sy: number,
  style: string | CanvasGradient,
  dashed: boolean,
  width = 2
) {
  if (nodeIds.length < 2) return;
  ctx.strokeStyle = style;
  ctx.lineWidth = width;
  ctx.setLineDash(dashed ? [5, 5] : []);
  ctx.beginPath();
  nodeIds.forEach((id, i) => {
    const n = env.nodes.find(nn => nn.id === id);
    if (!n) return;
    const x = n.x * sx, y = n.y * sy;
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.stroke();
  ctx.setLineDash([]);
}

/* Continuous animation loop for a map canvas; returns stop function. */
export function animateMap(canvas: HTMLCanvasElement, getState: () => MapRenderState): () => void {
  let running = true;
  const loop = () => {
    if (!running) return;
    drawEnvMap(canvas, getState());
    raf = requestAnimationFrame(loop);
  };
  loop();
  return () => { running = false; cancelAnimationFrame(raf); };
}

export function stopAllMapAnimations() {
  if (raf) cancelAnimationFrame(raf);
  raf = 0;
}
