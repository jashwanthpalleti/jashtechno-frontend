export default function Insight360EmbedPage() {
  return (
    <div className="w-screen h-screen">
      <iframe
        src="https://insight360-ui.onrender.com/dashboard"
        className="w-full h-full border-0"
        loading="lazy"
        allow="fullscreen"
      />
    </div>
  );
}
