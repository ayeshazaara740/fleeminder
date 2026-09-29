/* Dependency-free canvas charts with tooltips. */

export interface ChartSeries {
  label: string;
  color: string;
  values: number[];
}

function setupCanvas(canvas: HTMLCanvasElement): { ctx: CanvasRenderingContext2D; w: number; h: number } {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const w = rect.width || 300;
  const h = rect.height || 160;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  const ctx = canvas.getContext('2d')!;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, w, h };
}

function grid(ctx: CanvasRenderingContext2D, w: number, h: number, pad: { l: number; r: number; t: number; b: number }, maxV: number, unit = '') {
  ctx.strokeStyle = 'rgba(148,163,203,0.1)';
  ctx.fillStyle = 'rgba(148,163,203,0.55)';
  ctx.font = '10px ui-sans-serif, system-ui';
  ctx.textAlign = 'right';
  const lines = 4;
  for (let i = 0; i <= lines; i++) {
    const v = Math.round((maxV / lines) * i);
    const y = pad.t + (h - pad.t - pad.b) * (1 - i / lines);
    ctx.beginPath();
    ctx.moveTo(pad.l, y);
    ctx.lineTo(w - pad.r, y);
    ctx.stroke();
    ctx.fillText(`${v}${unit}`, pad.l - 6, y + 3);
  }
}

export function barChart(canvas: HTMLCanvasElement, labels: string[], series: ChartSeries[], opts: { unit?: string } = {}) {
  const { ctx, w, h } = setupCanvas(canvas);
  const pad = { l: 34, r: 8, t: 10, b: 22 };
  const maxV = Math.max(1, ...series.flatMap(s => s.values)) * 1.15;
  const innerW = w - pad.l - pad.r;
  const innerH = h - pad.t - pad.b;
  const n = labels.length;
  const groupW = innerW / Math.max(1, n);
  const barW = Math.max(2, (groupW * 0.62) / series.length);

  grid(ctx, w, h, pad, Math.ceil(maxV), opts.unit ?? '');

  labels.forEach((lb, i) => {
    const gx = pad.l + i * groupW;
    series.forEach((s, si) => {
      const v = s.values[i] ?? 0;
      const bh = (v / maxV) * innerH;
      const x = gx + (groupW - barW * series.length) / 2 + si * barW;
      ctx.fillStyle = s.color;
      ctx.beginPath();
      const r = Math.min(3, barW / 2, bh / 2);
      const y = h - pad.b - bh;
      ctx.roundRect(x, y, barW - 1, bh, [r, r, 0, 0]);
      ctx.fill();
    });
    ctx.fillStyle = 'rgba(148,163,203,0.6)';
    ctx.font = '9.5px ui-sans-serif, system-ui';
    ctx.textAlign = 'center';
    if (n <= 14 || i % Math.ceil(n / 12) === 0) ctx.fillText(lb, gx + groupW / 2, h - pad.b + 13);
  });

  attachHover(canvas, (mx) => {
    const i = Math.floor(((mx - pad.l) / innerW) * n);
    if (i < 0 || i >= n) return null;
    const parts = series.map(s => `${s.label}: <b>${s.values[i] ?? 0}${opts.unit ?? ''}</b>`).join('<br>');
    return { label: labels[i], html: parts };
  });
}

export function lineChart(canvas: HTMLCanvasElement, labels: string[], series: ChartSeries[], opts: { unit?: string; yMin?: number; yMax?: number } = {}) {
  const { ctx, w, h } = setupCanvas(canvas);
  const pad = { l: 34, r: 8, t: 10, b: 22 };
  const vals = series.flatMap(s => s.values);
  let maxV = Math.max(1, ...vals);
  let minV = Math.min(0, ...vals);
  if (opts.yMax !== undefined) maxV = opts.yMax;
  if (opts.yMin !== undefined) minV = opts.yMin;
  const range = maxV - minV || 1;
  const innerW = w - pad.l - pad.r;
  const innerH = h - pad.t - pad.b;
  const n = Math.max(1, labels.length);

  grid(ctx, w, h, pad, Math.round(maxV), opts.unit ?? '');

  const xAt = (i: number) => pad.l + (innerW * i) / Math.max(1, n - 1);
  const yAt = (v: number) => pad.t + innerH * (1 - (v - minV) / range);

  series.forEach(s => {
    ctx.strokeStyle = s.color;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    s.values.forEach((v, i) => {
      const x = xAt(i); const y = yAt(v);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();
    if (n <= 30) {
      s.values.forEach((v, i) => {
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(xAt(i), yAt(v), 1.8, 0, Math.PI * 2);
        ctx.fill();
      });
    }
  });

  /* x labels */
  ctx.fillStyle = 'rgba(148,163,203,0.6)';
  ctx.font = '9.5px ui-sans-serif, system-ui';
  ctx.textAlign = 'center';
  const step = Math.max(1, Math.ceil(n / 8));
  labels.forEach((lb, i) => { if (i % step === 0) ctx.fillText(lb, xAt(i), h - pad.b + 13); });

  attachHover(canvas, (mx) => {
    const i = Math.round(((mx - pad.l) / innerW) * (n - 1));
    if (i < 0 || i >= n) return null;
    const parts = series.map(s => `${s.label}: <b>${(s.values[i] ?? 0).toFixed(1)}${opts.unit ?? ''}</b>`).join('<br>');
    return { label: labels[i], html: parts };
  });
}

export function donutChart(canvas: HTMLCanvasElement, items: Array<{ label: string; value: number; color: string }>, centerLabel?: string) {
  const { ctx, w, h } = setupCanvas(canvas);
  const cx = w / 2, cy = h / 2;
  const r = Math.min(w, h) / 2 - 8;
  const total = items.reduce((a, b) => a + b.value, 0) || 1;
  let angle = -Math.PI / 2;
  items.forEach(it => {
    const slice = (it.value / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(cx, cy, r, angle, angle + slice);
    ctx.strokeStyle = it.color;
    ctx.lineWidth = Math.max(10, r * 0.3);
    ctx.stroke();
    angle += slice;
  });
  if (centerLabel) {
    ctx.fillStyle = 'rgba(232,237,247,0.95)';
    ctx.font = '700 18px ui-sans-serif, system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(centerLabel, cx, cy + 2);
  }
  attachHover(canvas, (mx, my) => {
    const dx = mx - cx, dy = my - cy;
    const dist = Math.hypot(dx, dy);
    if (dist < r * 0.6 || dist > r + 4) return null;
    let a = Math.atan2(dy, dx) + Math.PI / 2;
    while (a < 0) a += Math.PI * 2;
    let acc = 0;
    for (const it of items) {
      const slice = (it.value / total) * Math.PI * 2;
      if (a >= acc && a < acc + slice) return { label: it.label, html: `<b>${it.value}</b> items` };
      acc += slice;
    }
    return null;
  });
}

export function hBarChart(canvas: HTMLCanvasElement, items: Array<{ label: string; value: number; color?: string }>) {
  const { ctx, w, h } = setupCanvas(canvas);
  const pad = { l: 118, r: 30, t: 6, b: 6 };
  const maxV = Math.max(1, ...items.map(i => i.value));
  const rowH = (h - pad.t - pad.b) / Math.max(1, items.length);
  items.forEach((it, i) => {
    const y = pad.t + i * rowH;
    const bw = ((w - pad.l - pad.r) * it.value) / maxV;
    ctx.fillStyle = 'rgba(148,163,203,0.08)';
    ctx.beginPath(); ctx.roundRect(pad.l, y + rowH * 0.2, w - pad.l - pad.r, rowH * 0.6, 3); ctx.fill();
    ctx.fillStyle = it.color ?? 'var(--accent)';
    ctx.beginPath(); ctx.roundRect(pad.l, y + rowH * 0.2, Math.max(2, bw), rowH * 0.6, 3); ctx.fill();
    ctx.fillStyle = 'rgba(154,167,196,0.95)';
    ctx.font = '10.5px ui-sans-serif, system-ui';
    ctx.textAlign = 'right';
    ctx.fillText(it.label, pad.l - 8, y + rowH * 0.5 + 3.5);
    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(232,237,247,0.9)';
    ctx.fillText(String(it.value), pad.l + Math.max(2, bw) + 6, y + rowH * 0.5 + 3.5);
  });
}

interface TipState { el: HTMLElement; canvas: HTMLCanvasElement }
const tipMap = new WeakMap<HTMLCanvasElement, TipState>();

function attachHover(canvas: HTMLCanvasElement, resolve: (mx: number, my: number) => { label: string; html: string } | null) {
  let tip = tipMap.get(canvas);
  if (!tip) {
    const el = document.createElement('div');
    el.className = 'chart-tip';
    el.style.display = 'none';
    canvas.parentElement?.appendChild(el);
    tip = { el, canvas };
    tipMap.set(canvas, tip);
    canvas.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      const r = resolve(e.clientX - rect.left, e.clientY - rect.top);
      if (r) {
        el.innerHTML = `<div class="text-dim fs-11">${r.label}</div>${r.html}`;
        el.style.display = 'block';
        el.style.left = `${e.clientX - rect.left}px`;
        el.style.top = `${e.clientY - rect.top}px`;
      } else el.style.display = 'none';
    });
    canvas.addEventListener('mouseleave', () => { el.style.display = 'none'; });
  }
}

export function chartLegend(items: Array<{ label: string; color: string }>): string {
  return `<div class="chart-legend">${items.map(i => `<span><span class="lg-swatch" style="background:${i.color}"></span>${i.label}</span>`).join('')}</div>`;
}
