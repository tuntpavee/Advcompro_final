'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

type Form = {
  width: number;
  length: number;
  height: number;
  gap: number;
  speed: number;
  maxAlt: number;
};

type Path = { x: number[]; y: number[]; z: number[] };

type PathRecord = {
  id: string;
  createdAt: string;
  form: Form;
  path: Path;
};

const DEFAULTS: Form = { width: 20, length: 12, height: 5, gap: 2, speed: 1.5, maxAlt: 3 };
const HISTORY_KEY = 'pathHistory:v1';

export default function PathGeneratorPage() {
  const [form, setForm] = useState<Form>(DEFAULTS);
  const [history, setHistory] = useState<PathRecord[]>([]);

  // load history once
  useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      if (raw) setHistory(JSON.parse(raw));
    } catch {}
  }, []);

  // simple zig-zag path covering a rectangle
  const path: Path = useMemo(() => {
    const { width, length, gap, maxAlt } = form;
    const passes = Math.max(1, Math.round(length / gap));
    const x: number[] = [];
    const y: number[] = [];
    const z: number[] = [];

    for (let i = 0; i <= passes; i++) {
      const yy = Math.min(i * gap, length);
      if (i % 2 === 0) { x.push(0, width); y.push(yy, yy); }
      else { x.push(width, 0); y.push(yy, yy); }
    }
    for (let k = 0; k < x.length; k++) {
      const t = k / Math.max(1, x.length - 1);
      const cruise = maxAlt;
      const alt = t < 0.1 ? cruise * (t / 0.1) : t > 0.9 ? cruise * ((1 - t) / 0.1) : cruise;
      z.push(Math.max(0, alt));
    }
    return { x, y, z };
  }, [form]);

  const saveAndExport = () => {
    const rec: PathRecord = { id: crypto.randomUUID(), createdAt: new Date().toISOString(), form, path };
    const next = [rec, ...history].slice(0, 50);
    setHistory(next);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next));

    const blob = new Blob([JSON.stringify(rec, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `path-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const discard = () => setForm(DEFAULTS);

  const numberInput = (label: string, key: keyof Form, step = 0.1) => (
    <label className="block">
      <span className="block text-white/90 text-sm">{label}</span>
      <input
        type="number"
        step={step}
        value={form[key]}
        onChange={(e) => setForm((f) => ({ ...f, [key]: Number(e.target.value) }))}
        className="mt-1 w-full rounded-md border border-white/40 bg-white/20 px-3 py-2 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-white/60"
      />
    </label>
  );

  return (
    <main className="min-h-screen p-6 bg-gradient-to-b from-orange-300 via-pink-400 to-blue-500">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Top card */}
        <section className="rounded-2xl backdrop-blur bg-white/15 border border-white/30 shadow-xl p-4 md:p-6">
          <h1 className="text-white text-2xl font-semibold mb-3">Path generator</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Plot */}
            <div className="bg-white rounded-xl p-2 shadow">
              <Plot
                data={[{
                  x: path.x, y: path.y, type: 'scatter',
                  mode: 'lines+markers', name: 'Zigzag',
                  line: { shape: 'linear' }, marker: { size: 4 },
                }]}
                layout={{
                  margin: { l: 40, r: 10, t: 10, b: 40 },
                  xaxis: { title: 'x (m)', range: [0, Math.max(1, form.width)] },
                  yaxis: { title: 'y (m)', range: [0, Math.max(1, form.length)] },
                  showlegend: true,
                }}
                style={{ width: '100%', height: 320 }}
                config={{ displaylogo: false, responsive: true }}
              />
            </div>

            {/* Params */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-white/95">
              {numberInput('Warehouse width (m)', 'width')}
              {numberInput('Warehouse length (m)', 'length')}
              {numberInput('Warehouse height (m)', 'height')}
              {numberInput('Zigzag gap (m)', 'gap')}
              {numberInput('Avg speed (m/s)', 'speed')}
              {numberInput('Max altitude (m)', 'maxAlt')}
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <button onClick={saveAndExport} className="rounded-full bg-green-500 hover:bg-green-600 text-white px-6 py-2 text-lg font-semibold shadow">
              Save &amp; Export
            </button>
            <button onClick={discard} className="rounded-full bg-rose-500/90 hover:bg-rose-600 text-white px-6 py-2 text-lg font-semibold shadow">
              Discard
            </button>
          </div>
        </section>

        {/* History */}
        <section className="rounded-2xl backdrop-blur bg-white/15 border border-white/30 shadow-xl p-4 md:p-6">
          <h2 className="text-white text-xl font-semibold mb-3">History</h2>
          <div className="max-h-72 overflow-y-auto pr-2 space-y-3">
            {history.length === 0 && <div className="rounded-lg bg-white/30 p-4 text-white/90">No saved paths yet.</div>}
            {history.map((h) => (
              <div key={h.id} className="rounded-lg bg-white/70 text-slate-800 p-3 flex items-center justify-between shadow">
                <div>
                  <div className="font-semibold">{new Date(h.createdAt).toLocaleString()}</div>
                  <div className="text-sm opacity-80">
                    {`W ${h.form.width}m × L ${h.form.length}m · gap ${h.form.gap}m · speed ${h.form.speed}m/s · maxAlt ${h.form.maxAlt}m`}
                  </div>
                </div>
                <button onClick={() => setForm(h.form)} className="rounded-md bg-sky-600 text-white px-3 py-1 text-sm hover:bg-sky-700">
                  Load
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
