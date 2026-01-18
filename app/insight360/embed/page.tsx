export const runtime = "edge"; // optional (fast)

export default function Insight360EmbedPage() {
  return (
    <div className="w-screen h-screen">
      {/* If your dashboard is a separate app/page, render it here */}
      {/* Example: <Insight360App /> */}
      <iframe
        src="/insight360/embed"
        className="w-full h-full"
        loading="lazy"
      />
    </div>
  );
}
