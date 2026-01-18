import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Insight360 Dashboard • Jash Techno",
  description: "Real-time network telemetry dashboard with live WebSocket streaming.",
};

export default function Insight360Page() {
  return (
    <main className="bg-white">
      <section className="max-w-7xl mx-auto px-6 py-10 md:py-14">
        <header className="mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[#111827]">
            Insight360 Dashboard
          </h1>
          <p className="mt-2 text-sm md:text-base text-[#4B5563] max-w-3xl">
            Real-time network telemetry dashboard with live WebSocket streaming and interactive visuals.
          </p>
        </header>

        <div className="rounded-2xl overflow-hidden border border-[#E6EEF9] shadow-[0_12px_28px_rgba(58,141,193,0.18)] bg-white">
          <iframe
            src="/insight360/embed"
            className="w-full h-[calc(100vh-220px)]"
            loading="lazy"
            allow="fullscreen"
          />
        </div>
      </section>
    </main>
  );
}
