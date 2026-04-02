import { ShieldCheck } from "lucide-react";

export default function LicenseBadge({
  licensed,
  insured,
  size = "md",
}: {
  licensed: boolean;
  insured: boolean;
  size?: "sm" | "md" | "lg";
}) {
  if (!licensed && !insured) return null;

  const sizeClasses = {
    sm: "px-2 py-1 text-xs gap-1",
    md: "px-3 py-1.5 text-sm gap-1.5",
    lg: "px-4 py-2 text-base gap-2",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  const labels: string[] = [];
  if (licensed) labels.push("Licensed");
  if (insured) labels.push("Insured");

  return (
    <div
      className={`inline-flex items-center rounded-lg bg-sage/15 font-medium text-sage ${sizeClasses[size]}`}
    >
      <ShieldCheck className={iconSizes[size]} />
      <span>{labels.join(" & ")}</span>
    </div>
  );
}
