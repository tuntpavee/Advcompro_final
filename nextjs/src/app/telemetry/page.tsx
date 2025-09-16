'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';

// Plotly must be dynamically imported on the client
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

// ---- Minimal TypeScript types for the payload ----
type Vec3 = { x: number; y: number; z: number };
type Telemetry = {
  position: Vec3;
  heading_rpy: { roll: number; pitch: number; yaw: number };
  velocity: { vx: number; vy: number; vz: number };
  accel:    { ax: number; ay: number; az: number };
  timestamp: string;
  trajectory?: { x: number[]; y: number[]; z: number[] };
};

export default function TelemetryPage() {
  const [data, setData] = useState<Telemetry | null>(null);
  const [loading, setLoading] = useState(false);

  // If you later run FastAPI on :8000, set NEXT_PUBLIC_API_BASE in .env.local
  const apiBase = process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, '');
  const url = apiBase ? `${apiBase}/vehicle_odometry` : '/api/mock/odometry';

  const fetchOnce = async () => {
    setLoading(true);
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error(await res.text());
      const json: Telemetry = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOnce(); }, []); // load once

  const plotData = useMemo(() => {
    if (data?.trajectory) {
      const { x, y, z } = data.trajectory;
      return [{ x, y, z, type: 'scatter3d' as const, mode: 'markers', marker: { size: 3 } }];
    }
    // fallback demo if no data yet
    const x = Array.from({ length: 200 }, (_, i) => i / 10);
    const y = x.map(v => Math.sin(v));
    const z = x.map((v, i) => Math.cos(v) * y[i]);
    return [{ x, y, z, type: 'scatter3d' as const, mode: 'markers', marker: { size: 3 } }];
  }, [data]);

  return (
    <main className="min-h-screen p-6 bg-gradient-to-b from-orange-300 via-pink-400 to-blue-500">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-white/95 text-3xl font-semibold mb-4">Position Visualize</h1>

        <div className="rounded-2xl backdrop-blur bg-white/10 border border-white/30 shadow-xl p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

            {/* Left: 3D plot */}
            <div className="bg-white rounded-2xl shadow p-2">
              <Plot
                data={plotData as any}
                layout={{
                  margin: { l: 0, r: 0, t: 0, b: 0 },
                  scene: {
                    aspectmode: 'cube',
                    xaxis: { title: 'x' }, yaxis: { title: 'y' }, zaxis: { title: 'z' }
                  }
                }}
                style={{ width: '100%', height: '420px' }}
                config={{ displaylogo: false, responsive: true }}
              />
            </div>

            {/* Right: vehicle info */}
            <div className="text-white/95">
              <h2 className="text-2xl font-semibold mb-3">vehicle_odometry</h2>
              <ul className="space-y-2 text-white/90">
                <li>
                  <span className="font-medium">Drone local position</span><br/>
                  <code className="text-white/80">
                    x: {data?.position?.x.toFixed(3) ?? '-'} ,&nbsp;
                    y: {data?.position?.y.toFixed(3) ?? '-'} ,&nbsp;
                    z: {data?.position?.z.toFixed(3) ?? '-'}
                  </code>
                </li>
                <li>
                  <span className="font-medium">Heading (roll, pitch, yaw)</span><br/>
                  <code className="text-white/80">
                    {data ? `${data.heading_rpy.roll.toFixed(2)}, ${data.heading_rpy.pitch.toFixed(2)}, ${data.heading_rpy.yaw.toFixed(2)}` : '-'}
                  </code>
                </li>
                <li>
                  <span className="font-medium">Velocity (vx, vy, vz)</span><br/>
                  <code className="text-white/80">
                    {data ? `${data.velocity.vx.toFixed(2)}, ${data.velocity.vy.toFixed(2)}, ${data.velocity.vz.toFixed(2)}` : '-'}
                  </code>
                </li>
                <li>
                  <span className="font-medium">Accelerometer (ax, ay, az)</span><br/>
                  <code className="text-white/80">
                    {data ? `${data.accel.ax.toFixed(2)}, ${data.accel.ay.toFixed(2)}, ${data.accel.az.toFixed(2)}` : '-'}
                  </code>
                </li>
                <li>
                  <span className="font-medium">Timestamp</span><br/>
                  <code className="text-white/80">{data?.timestamp ?? '-'}</code>
                </li>
              </ul>

              <button
                onClick={fetchOnce}
                disabled={loading}
                className="mt-6 inline-flex items-center rounded-full bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white px-6 py-2 text-lg font-medium shadow"
              >
                {loading ? 'Refreshing…' : 'Refresh'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
