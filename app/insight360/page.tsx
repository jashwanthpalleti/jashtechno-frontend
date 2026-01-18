import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Insight360 Dashboard • Jash Techno",
  description: "Vue.js real-time dashboard embedded in Jash Techno.",
};

export default function Insight360Page() {
  return (
    <main className="bg-[#FFFFFF]">
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-20">
        <header className="mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#111827]">
            Insight360 Dashboard
          </h1>
          <p className="mt-4 text-base md:text-lg text-[#4B5563] max-w-3xl">
            Insight360 is built in Vue.js and embedded here inside Jash Techno.
          </p>
        </header>

        <div className="w-full rounded-2xl overflow-hidden border border-[#E6EEF9] shadow-[0_12px_28px_rgba(58,141,193,0.18)]">
          <iframe
            src="https://insight360-ui.onrender.com/dashboard"
            className="w-full h-[900px]"
            loading="lazy"
            allow="fullscreen"
          />
        </div>
      </section>
    </main>
  );
}
