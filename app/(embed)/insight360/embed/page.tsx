export default function Insight360EmbedPage() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <iframe
        src="https://insight360-ui.onrender.com/dashboard"
        style={{ width: "100%", height: "100%", border: 0 }}
        loading="lazy"
        allow="fullscreen"
      />
    </div>
  );
}
