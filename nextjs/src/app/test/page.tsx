// src/app/test/page.tsx
import Image from "next/image";

export default function TestPage() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold">ละหมาดยัง</h1>
      <p>Hee</p>

      <div className="mt-6">
        <Image src="/Arsenal.png" alt="demo" width={800} height={800} />
      </div>
    </main>
  );
}

