'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Form = { email: string; password: string; firstName?: string; lastName?: string };

export default function LoginPage() {
  const [form, setForm] = useState<Form>({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const router = useRouter();

  const url = '/api/mock/login'; // swap to your FastAPI later

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setMsg(null);
    try {
      const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? 'Login failed');
      if (json?.token) localStorage.setItem('token', json.token);
      router.push('/tasks');
    } catch (err: any) {
      setMsg(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-300 via-pink-400 to-blue-500 p-6">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl bg-white p-6 md:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <Image src="/Arsenal.png" alt="YIM BOT" width={40} height={40} />
            <h1 className="text-2xl font-semibold text-slate-800">YIM BOT</h1>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-600 mb-1">Email</label>
              <input className="w-full rounded-md border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-sky-400"
                     type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} required />
            </div>
            <div>
              <label className="block text-sm text-slate-600 mb-1">Password</label>
              <input className="w-full rounded-md border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-sky-400"
                     type="password" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} required />
            </div>
            <button type="submit" disabled={loading}
              className="w-full rounded-lg bg-sky-500 text-white py-3 font-medium disabled:opacity-50 hover:bg-sky-600">
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
            {msg && <p className="text-center text-sm text-rose-600">{msg}</p>}
          </form>
        </div>
      </div>
    </main>
  );
}
