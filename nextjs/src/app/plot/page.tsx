'use client';
import dynamic from 'next/dynamic';
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

export default function Page() {
  const x = Array.from({ length: 200 }, (_, i) => i / 10);
  const y = x.map(v => Math.sin(v));
  const z = x.map((v, i) => Math.cos(v) * y[i]);

  return (
    <main style={{ height: '100vh', padding: 16 }}>
      <h1>3D Scatter (Plotly)</h1>
      <Plot
        data={[{ x, y, z, type: 'scatter3d', mode: 'markers', marker: { size: 3 } }]}
        layout={{ margin: { l: 0, r: 0, t: 30, b: 0 }, scene: { aspectmode: 'cube' }, title: 'Demo' }}
        style={{ width: '100%', height: '85vh' }}
      />
    </main>
  );
}
