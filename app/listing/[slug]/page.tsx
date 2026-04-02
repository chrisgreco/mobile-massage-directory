import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import {
  MapPin,
  Star,
  Phone,
  Globe,
  CheckCircle,
  ShieldCheck,
} from "lucide-react";
import LeadForm from "@/components/LeadForm";
import TherapistCard from "@/components/TherapistCard";
import LicenseBadge from "@/components/LicenseBadge";
import {
  getListingBySlug,
  getReviewsForListing,
  getListingsByCity,
  getAllApprovedSlugs,
} from "@/lib/supabase";
import { formatModalityName, formatPriceRange, SITE_URL } from "@/lib/utils";

export async function generateStaticParams() {
  const slugs = await getAllApprovedSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const listing = await getListingBySlug(params.slug);
  if (!listing) return { title: "Listing Not Found" };

  return {
    title: `${listing.business_name} — Mobile Massage in ${listing.city}, ${listing.state_abbr}`,
    description: `${listing.business_name} offers mobile massage in ${listing.city}, ${listing.state}. ${listing.description?.slice(0, 120)}`,
  };
}

export default async function ListingPage({
  params,
}: {
  params: { slug: string };
}) {
  const listing = await getListingBySlug(params.slug);
  if (!listing) notFound();

  const reviews = await getReviewsForListing(listing.id);
  const similarListings = (
    await getListingsByCity(listing.city, listing.state_abbr)
  )
    .filter((l) => l.id !== listing.id)
    .slice(0, 3);

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: listing.business_name,
    telephone: listing.phone,
    url: listing.website,
    priceRange: formatPriceRange(listing.price_range),
    address: {
      "@type": "PostalAddress",
      addressLocality: listing.city,
      addressRegion: listing.state_abbr,
      addressCountry: "US",
    },
    ...(listing.rating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: listing.rating,
        reviewCount: listing.review_count,
      },
    }),
    areaServed: listing.cities_served.map((c) => ({
      "@type": "City",
      name: c,
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: `${listing.city}, ${listing.state_abbr}`,
        item: `${SITE_URL}/mobile-massage-${listing.city.toLowerCase().replace(/\s+/g, "-")}-${listing.state_abbr.toLowerCase()}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: listing.business_name,
        item: `${SITE_URL}/listing/${listing.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="mx-auto max-w-7xl px-4 py-8">
        <nav className="mb-6 text-sm text-cream/50">
          <Link href="/" className="hover:text-sage">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link
            href={`/mobile-massage-${listing.city.toLowerCase().replace(/\s+/g, "-")}-${listing.state_abbr.toLowerCase()}`}
            className="hover:text-sage"
          >
            {listing.city}, {listing.state_abbr}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-cream">{listing.business_name}</span>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Main content */}
          <div>
            <div className="mb-6">
              {listing.featured && (
                <span className="badge-featured mb-3 inline-block">
                  Featured Therapist
                </span>
              )}
              <h1 className="font-display text-3xl font-bold text-cream">
                {listing.business_name}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-cream/50">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {listing.city}, {listing.state}
                </span>
                {listing.rating && (
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    {listing.rating} ({listing.review_count} reviews)
                  </span>
                )}
                <span className="font-semibold text-cream">
                  {formatPriceRange(listing.price_range)}
                </span>
              </div>
              <div className="mt-3">
                <LicenseBadge licensed={listing.licensed} insured={listing.insured} size="md" />
              </div>
            </div>

            {/* Photo gallery placeholder */}
            {listing.photos && listing.photos.length > 0 && (
              <div className="mb-8 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {listing.photos.slice(0, 5).map((photo, i) => (
                  <div
                    key={i}
                    className="aspect-video rounded-lg bg-spa-800"
                  />
                ))}
              </div>
            )}

            {/* Description */}
            {listing.description && (
              <div className="mb-8">
                <h2 className="mb-3 font-display text-xl font-bold text-cream">
                  About {listing.business_name}
                </h2>
                <p className="leading-relaxed text-cream/60">
                  {listing.description}
                </p>
              </div>
            )}

            {/* Modalities */}
            <div className="mb-8">
              <h2 className="mb-3 font-display text-xl font-bold text-cream">
                Modalities Offered
              </h2>
              <div className="flex flex-wrap gap-2">
                {listing.modalities.map((modality) => (
                  <span
                    key={modality}
                    className="flex items-center gap-1.5 rounded-lg bg-spa-800 px-3 py-2 text-sm font-medium text-cream/70"
                  >
                    <CheckCircle className="h-3.5 w-3.5 text-sage" />
                    {formatModalityName(modality)}
                  </span>
                ))}
              </div>
            </div>

            {/* Service area */}
            {listing.cities_served.length > 0 && (
              <div className="mb-8">
                <h2 className="mb-3 font-display text-xl font-bold text-cream">
                  Service Area
                </h2>
                <div className="flex flex-wrap gap-2">
                  {listing.cities_served.map((c) => (
                    <span
                      key={c}
                      className="rounded-full border border-cream/10 px-3 py-1 text-sm text-cream/60"
                    >
                      {c}
                    </span>
                  ))}
                </div>
                {listing.zip_codes.length > 0 && (
                  <p className="mt-2 text-sm text-cream/30">
                    Zip codes: {listing.zip_codes.join(", ")}
                  </p>
                )}
              </div>
            )}

            {/* Contact info */}
            <div className="mb-8 flex flex-wrap gap-4">
              {listing.phone && (
                <a
                  href={`tel:${listing.phone?.replace(/\D/g, "")}`}
                  className="btn-primary gap-2"
                >
                  <Phone className="h-4 w-4" />
                  {listing.phone}
                </a>
              )}
              {listing.website && (
                <a
                  href={listing.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary gap-2"
                >
                  <Globe className="h-4 w-4" />
                  Visit Website
                </a>
              )}
            </div>

            {/* Reviews */}
            <div className="mb-8">
              <h2 className="mb-4 font-display text-xl font-bold text-cream">
                Client Reviews
                {listing.review_count > 0 &&
                  ` (${listing.review_count})`}
              </h2>
              {reviews.length > 0 ? (
                <div className="space-y-4">
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      className="rounded-xl border border-cream/10 bg-card p-5"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-semibold text-cream">
                          {review.reviewer_name || "Anonymous"}
                        </span>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-cream/20"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      {review.body && (
                        <p className="text-sm text-cream/60">{review.body}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-cream/50">
                  No reviews yet. Be the first to leave a review!
                </p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-lg border border-cream/10 bg-card p-4 text-center">
              <p className="text-sm text-cream/60">
                Own this business?{" "}
                <Link href="/add-listing" className="font-semibold text-sage hover:underline">
                  Claim your listing.
                </Link>
              </p>
            </div>
            <LeadForm city={listing.city} state={listing.state_abbr} />

            {/* Similar therapists */}
            {similarListings.length > 0 && (
              <div>
                <h3 className="mb-4 font-display text-lg font-bold text-cream">
                  Similar Therapists in {listing.city}
                </h3>
                <div className="space-y-4">
                  {similarListings.map((l) => (
                    <TherapistCard key={l.id} listing={l} />
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </>
  );
}
