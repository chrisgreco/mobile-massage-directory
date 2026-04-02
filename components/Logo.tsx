import Link from "next/link";

export default function Logo({ size = "default" }: { size?: "default" | "small" }) {
  const h = size === "small" ? "h-7" : "h-9";
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <svg
        className={`${h} w-auto`}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Two hands — healing/massage */}
        <path
          d="M8 28C8 28 10 20 14 16C18 12 20 14 20 14"
          stroke="#7FAE8A"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M32 28C32 28 30 20 26 16C22 12 20 14 20 14"
          stroke="#7FAE8A"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Leaf/wellness accent */}
        <path
          d="M20 8C20 8 16 12 16 16C16 20 20 20 20 20C20 20 24 20 24 16C24 12 20 8 20 8Z"
          fill="#7FAE8A"
          opacity="0.3"
        />
        <line x1="20" y1="10" x2="20" y2="20" stroke="#7FAE8A" strokeWidth="1" opacity="0.5" />
      </svg>
      <div className="flex flex-col leading-none">
        <span className="font-display text-lg font-bold text-off-white">
          Still<span className="text-sage">Point</span>
        </span>
        {size === "default" && (
          <span className="text-[10px] font-medium tracking-widest text-off-white/40 uppercase">
            Mobile Massage
          </span>
        )}
      </div>
    </Link>
  );
}
