import { NextResponse } from "next/server";

export async function GET() {
  // generate a simple helix-ish trajectory + a “current” state
  const n = 200, x:number[]=[], y:number[]=[], z:number[]=[];
  for (let i = 0; i < n; i++) {
    const t = i / 10;
    x.push(t);
    y.push(Math.sin(t));
    z.push(0.5 * Math.cos(t * 0.7));
  }
  const i = n - 1;

  return NextResponse.json({
    position: { x: x[i], y: y[i], z: z[i] },
    heading_rpy: { roll: 0.1, pitch: -0.05, yaw: 1.2 },
    velocity: { vx: 0.9, vy: 0.0, vz: -0.02 },
    accel:    { ax: 0.01, ay: -0.02, az: 0.0 },
    timestamp: new Date().toISOString(),
    trajectory: { x, y, z },
  });
}
