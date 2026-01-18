export const runtime = "edge"; // optional

export default function Insight360EmbedPage() {
  return (
    <div className="w-screen h-screen">
    <iframe
  src="/insight360/embed"
  className="w-full h-[calc(100vh-220px)]"
  loading="lazy"
  allow="fullscreen"
/>

    </div>
  );
}
