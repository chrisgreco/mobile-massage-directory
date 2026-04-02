export default function MvAdBox({
  slot = "in-feed",
}: {
  slot?: "sidebar" | "in-feed" | "content";
}) {
  return (
    <div
      className="mv-ad-box"
      data-slot={slot}
    >
      Ad Placeholder
    </div>
  );
}
