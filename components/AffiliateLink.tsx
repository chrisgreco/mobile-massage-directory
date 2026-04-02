import { ExternalLink } from "lucide-react";

export default function AffiliateLink({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer nofollow sponsored"
      className="inline-flex items-center gap-1.5 rounded-lg bg-sage/15 px-3 py-1.5 text-sm font-medium text-sage transition-colors hover:bg-sage/25"
    >
      {label}
      <ExternalLink className="h-3.5 w-3.5" />
    </a>
  );
}
