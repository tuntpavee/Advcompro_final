'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TasksPage() {
  const router = useRouter();

  // (optional) simple guard
  useEffect(() => {
    if (!localStorage.getItem('token')) router.replace('/login');
  }, [router]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-300 via-pink-400 to-blue-500 p-8">
      <h1 className="text-white text-3xl font-semibold italic">Task Selection</h1>

      <div className="mt-6 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/path" className="rounded-2xl bg-white/30 p-8 text-center text-white hover:bg-white/40">
          🧭 Path generator
        </Link>

        {/* ✅ This opens your telemetry page */}
        <Link href="/telemetry" className="rounded-2xl bg-white/30 p-8 text-center text-white hover:bg-white/40">
          📡 Position
        </Link>

        <Link href="/plot" className="rounded-2xl bg-white/30 p-8 text-center text-white hover:bg-white/40">
          🕹️ 3D View
        </Link>
        <Link href="/login" className="rounded-2xl bg-white/30 p-8 text-center text-white hover:bg-white/40">
          🔐 Account
        </Link>
      </div>
    </main>
  );
}
