import Link from "next/link";
import { MapPin, Star, Phone, ExternalLink, ShieldCheck } from "lucide-react";
import { type Listing } from "@/lib/supabase";
import { formatPriceRange, formatModalityName } from "@/lib/utils";

export default function TherapistCard({ listing }: { listing: Listing }) {
  return (
    <div className="card overflow-hidden">
      {listing.featured && (
        <div className="bg-sage px-4 py-1.5 text-xs font-semibold tracking-wide text-spa-900 uppercase">
          Featured
        </div>
      )}
      <div className="p-5">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <Link
              href={`/listing/${listing.slug}`}
              className="font-display text-lg font-bold text-cream hover:text-sage transition-colors"
            >
              {listing.business_name}
            </Link>
            <div className="mt-1 flex items-center gap-1.5 text-sm text-cream/50">
              <MapPin className="h-3.5 w-3.5" />
              <span>
                {listing.city}, {listing.state_abbr}
              </span>
            </div>
          </div>
          <span className="shrink-0 rounded-lg bg-cream/10 px-2.5 py-1 text-sm font-semibold text-cream/70">
            {formatPriceRange(listing.price_range)}
          </span>
        </div>

        {/* License badge */}
        {listing.licensed && listing.insured && (
          <div className="mb-3 flex items-center gap-1.5 text-xs font-medium text-sage">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Licensed &amp; Insured</span>
          </div>
        )}

        {listing.rating && (
          <div className="mb-3 flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-semibold text-cream">{listing.rating}</span>
            </div>
            <span className="text-sm text-cream/40">
              ({listing.review_count} reviews)
            </span>
          </div>
        )}

        {listing.description && (
          <p className="mb-3 text-sm leading-relaxed text-cream/60 line-clamp-2">
            {listing.description}
          </p>
        )}

        <div className="mb-4 flex flex-wrap gap-1.5">
          {listing.modalities.slice(0, 4).map((modality) => (
            <span key={modality} className="badge-modality">
              {formatModalityName(modality)}
            </span>
          ))}
          {listing.modalities.length > 4 && (
            <span className="badge-modality">
              +{listing.modalities.length - 4}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/listing/${listing.slug}`}
            className="btn-primary flex-1 text-center text-sm py-2.5"
          >
            View Profile
          </Link>
          {listing.phone && (
            <a
              href={`tel:${listing.phone}`}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-cream/20 text-cream/50 transition-colors hover:border-sage hover:text-sage"
              aria-label={`Call ${listing.business_name}`}
            >
              <Phone className="h-4 w-4" />
            </a>
          )}
          {listing.website && (
            <a
              href={listing.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-cream/20 text-cream/50 transition-colors hover:border-sage hover:text-sage"
              aria-label={`Visit ${listing.business_name} website`}
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
