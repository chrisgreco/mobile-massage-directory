import Link from "next/link";
import { ArrowRight, Search, Star, Shield, Clock, Heart } from "lucide-react";
import CitySearch from "@/components/CitySearch";
import TherapistCard from "@/components/TherapistCard";
import LeadForm from "@/components/LeadForm";
import MvAdBox from "@/components/MvAdBox";
import { getFeaturedListings } from "@/lib/supabase";
import { cities } from "@/data/cities";
import { modalities } from "@/data/modalities";
import { blogPosts } from "@/data/blog-posts";
import { SITE_NAME, SITE_URL, DOMAIN } from "@/lib/utils";

export const revalidate = 3600;

export default async function HomePage() {
  const featuredListings = await getFeaturedListings(12);
  const topCities = cities.filter((c) => c.tier === "metro").slice(0, 20);

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/mobile-massage-{search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "The most comprehensive directory of licensed mobile massage therapists in the USA.",
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: featuredListings.map((listing, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "LocalBusiness",
        name: listing.business_name,
        url: `${SITE_URL}/listing/${listing.slug}`,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      {/* Hero */}
      <section className="bg-spa-900 px-4 py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-4 font-display text-3xl font-bold tracking-tight text-cream md:text-5xl">
            Find Licensed Mobile Massage Near You
          </h1>
          <p className="mb-8 text-lg text-cream/60">
            Compare prices, read reviews, and get free quotes from verified
            mobile massage therapists across 200+ US cities.
          </p>
          <div className="mx-auto max-w-xl">
            <CitySearch size="lg" />
          </div>
        </div>
      </section>

      {/* Modality chips */}
      <section className="border-b border-cream/10 bg-spa-800 px-4 py-6">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-2">
          {modalities.map((m) => (
            <Link
              key={m.slug}
              href={`/${m.slug}`}
              className="rounded-full border border-cream/15 bg-card px-4 py-2 text-sm font-medium text-cream/70 transition-colors hover:border-sage hover:text-sage"
            >
              {m.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Therapists */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-cream">
              Featured Therapists
            </h2>
            <p className="mt-1 text-sm text-cream/50">
              Top-rated licensed mobile massage professionals across the country
            </p>
          </div>
        </div>
        {featuredListings.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredListings.map((listing) => (
              <TherapistCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border-2 border-dashed border-cream/20 py-16 text-center">
            <p className="text-cream/50">
              Listings will appear here once the database is seeded.
            </p>
          </div>
        )}
      </section>

      <MvAdBox slot="in-feed" />

      {/* How It Works */}
      <section className="bg-spa-800 px-4 py-14">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 text-center font-display text-2xl font-bold text-cream">
            How It Works
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Search,
                title: "Search",
                desc: "Enter your city to find licensed mobile massage therapists near you. Filter by modality, price, and ratings.",
              },
              {
                icon: Star,
                title: "Compare",
                desc: "Read reviews, compare pricing, and verify licensing for each therapist in your area.",
              },
              {
                icon: Shield,
                title: "Book",
                desc: "Request free quotes from up to 3 therapists. They come to you with everything needed for a professional session.",
              },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-sage/15">
                  <step.icon className="h-7 w-7 text-sage" />
                </div>
                <h3 className="mb-2 font-display text-lg font-bold text-cream">
                  {step.title}
                </h3>
                <p className="text-sm text-cream/60">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lead Form */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid items-start gap-10 lg:grid-cols-2">
          <div>
            <h2 className="mb-3 font-display text-2xl font-bold text-cream">
              Get Free Quotes in Minutes
            </h2>
            <p className="mb-6 text-cream/60">
              Tell us what you need and we&apos;ll connect you with up to 3
              top-rated mobile massage therapists in your area. No obligation, no cost.
            </p>
            <div className="space-y-4">
              {[
                "Licensed and insured professionals",
                "Free quotes within 24 hours",
                "Compare prices side by side",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sage/20">
                    <svg
                      className="h-3.5 w-3.5 text-sage"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-cream/70">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <LeadForm />
        </div>
      </section>

      {/* Modalities Grid */}
      <section className="bg-spa-800 px-4 py-14">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-8 font-display text-2xl font-bold text-cream">
            Massage Modalities
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {modalities.map((m) => (
              <Link
                key={m.slug}
                href={`/${m.slug}`}
                className="card p-5 transition-all hover:border-sage/30"
              >
                <h3 className="mb-2 font-display text-lg font-bold text-cream">
                  {m.name}
                </h3>
                <p className="mb-3 text-sm text-cream/50 line-clamp-2">
                  {m.description.slice(0, 100)}...
                </p>
                <div className="flex items-center justify-between text-xs text-cream/40">
                  <span>${m.avgCostLow}-${m.avgCostHigh}</span>
                  <span>{m.duration}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Top Cities */}
      <section className="px-4 py-14">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-8 font-display text-2xl font-bold text-cream">
            Mobile Massage by City
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {topCities.map((city) => (
              <Link
                key={city.slug}
                href={`/${city.slug}`}
                className="rounded-lg border border-cream/10 px-4 py-3 text-sm font-medium text-cream/60 transition-colors hover:border-sage hover:text-cream"
              >
                {city.city}, {city.stateAbbr}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Blog preview */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-2xl font-bold text-cream">
            Latest from the Blog
          </h2>
          <Link
            href="/blog"
            className="flex items-center gap-1 text-sm font-medium text-sage hover:underline"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {blogPosts.slice(0, 3).map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="card overflow-hidden transition-shadow hover:shadow-md hover:shadow-sage/5"
            >
              <div className="p-5">
                <div className="mb-2 flex items-center gap-2 text-xs text-cream/40">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{post.readingTime}</span>
                </div>
                <h3 className="mb-2 font-display font-bold text-cream leading-snug">
                  {post.title}
                </h3>
                <p className="text-sm text-cream/50 line-clamp-2">
                  {post.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA for therapists */}
      <section className="bg-sage px-4 py-14">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-3 font-display text-2xl font-bold text-spa-900">
            Are You a Mobile Massage Therapist?
          </h2>
          <p className="mb-6 text-spa-700">
            Get found by thousands of clients searching for massage
            services in your area. List your practice for free.
          </p>
          <Link
            href="/add-listing"
            className="inline-flex items-center gap-2 rounded-xl bg-spa-900 px-8 py-3.5 font-semibold text-cream transition-colors hover:bg-spa-800"
          >
            Add Your Practice <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* PDF CTA */}
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="rounded-2xl bg-card p-8 text-center md:p-12">
          <h2 className="mb-3 font-display text-xl font-bold text-cream md:text-2xl">
            The Mobile Massage Booking Checklist
          </h2>
          <p className="mb-6 text-cream/60">
            What to ask, red flags to watch for, and how to prepare your space.
            The only checklist you need before booking a mobile massage.
          </p>
          <a
            href="https://gumroad.com/YOURPRODUCT"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Download for $19
          </a>
        </div>
      </section>

      {/* Full City List for SEO */}
      <section className="border-t border-cream/10 bg-spa-800 px-4 py-10">
        <div className="mx-auto max-w-7xl">
          <h2 className="mb-6 font-display text-lg font-bold text-cream">
            All Cities We Cover
          </h2>
          <div className="columns-2 gap-4 text-sm sm:columns-3 md:columns-4 lg:columns-5">
            {cities
              .sort((a, b) => a.city.localeCompare(b.city))
              .map((city) => (
                <Link
                  key={city.slug}
                  href={`/${city.slug}`}
                  className="mb-1 block text-cream/40 hover:text-sage"
                >
                  {city.city}, {city.stateAbbr}
                </Link>
              ))}
          </div>
        </div>
      </section>
    </>
  );
}
