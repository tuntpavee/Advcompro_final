import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-300 via-pink-400 to-blue-500 p-6">
      <div className="mx-auto max-w-5xl">
        {/* Top-right button */}
        <div className="flex justify-end">
          <Link
            href="/login"
            className="rounded-full bg-green-600 px-4 py-2 text-white font-semibold shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-white/60"
          >
            Get started
          </Link>
        </div>

        {/* Logo card (optional image at /public/yim-bot.png) */}
        <div className="mt-6 rounded-2xl bg-white/10 backdrop-blur border border-white/30 p-4 shadow-xl">
          <div className="rounded-2xl bg-white p-4 md:p-6">
            <Image
              src="/Arsenal.png"     // put a file in /public or change name
              alt="YIM BOT"
              width={1200}
              height={400}
              className="w-full h-auto rounded-xl"
              priority
            />
          </div>
        </div>
      </div>
    </main>
  );
}
