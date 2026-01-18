import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Insight360 Dashboard • Jash Techno",
  description: "Real-time network telemetry dashboard with live WebSocket streaming.",
};

export default function Insight360Page() {
  return (
    <main className="bg-white">
      <section className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-extrabold mb-3">
          Insight360 Dashboard
        </h1>
        <p className="text-gray-600 mb-6">
          Real-time network telemetry with live WebSocket streaming.
        </p>

        <iframe
          src="https://insight360-ui.onrender.com/dashboard"
          title="Insight360"
          className="w-full h-[80vh] border rounded-xl"
        />
      </section>
    </main>
  );
}
