import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import TherapistCard from "@/components/TherapistCard";
import LeadForm from "@/components/LeadForm";
import FAQSection from "@/components/FAQSection";
import MvAdBox from "@/components/MvAdBox";
import { getListingsByCity, getListingsByModality } from "@/lib/supabase";
import { cities, type City } from "@/data/cities";
import { modalities } from "@/data/modalities";
import { getPricingByTier, SITE_NAME, SITE_URL, DOMAIN } from "@/lib/utils";

export async function generateStaticParams() {
  const cityParams = cities.map((c) => ({ slug: c.slug }));
  const modalityParams = modalities.map((m) => ({ slug: m.slug }));
  return [...cityParams, ...modalityParams];
}

function findCity(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug);
}

function findModality(slug: string) {
  return modalities.find((m) => m.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const city = findCity(params.slug);
  if (city) {
    return {
      title: `Mobile Massage ${city.city}, ${city.state} — Find Licensed Therapists (2026)`,
      description: `Find the best mobile massage therapists in ${city.city}, ${city.state}. Compare prices, read reviews, and get free quotes from licensed, insured therapists.`,
    };
  }
  const modality = findModality(params.slug);
  if (modality) {
    return {
      title: `${modality.name} Near Me — Find Licensed Mobile Therapists (2026)`,
      description: `Find ${modality.name.toLowerCase()} services near you. Compare prices from $${modality.avgCostLow}-$${modality.avgCostHigh}, read reviews, and book licensed mobile therapists.`,
    };
  }
  return notFound();
}

export default async function SlugPage({
  params,
}: {
  params: { slug: string };
}) {
  const city = findCity(params.slug);
  if (city) return <CityPage city={city} />;

  const modality = findModality(params.slug);
  if (modality) return <ModalityPage modalityData={modality} />;

  notFound();
}

async function CityPage({ city }: { city: City }) {
  const listings = await getListingsByCity(city.city, city.stateAbbr);
  const pricing = getPricingByTier(city.tier);

  const nearbyCities = cities
    .filter(
      (c) =>
        c.stateAbbr === city.stateAbbr &&
        c.slug !== city.slug
    )
    .slice(0, 3);

  const faqs = [
    {
      question: `How much does mobile massage cost in ${city.city}?`,
      answer: `Mobile massage in ${city.city}, ${city.state} typically costs between $${pricing.low} and $${pricing.high} for a 60-minute session. Specialty services like couples massage or hot stone sessions cost more. Pricing varies based on modality, session length, and the therapist's experience. According to ${DOMAIN} data, ${city.tier === "metro" ? "metro areas tend to have higher prices due to demand and cost of living" : city.tier === "mid" ? "mid-size cities offer competitive pricing with strong service quality" : "smaller markets often offer the best value for massage services"}.`,
    },
    {
      question: `What's the difference between mobile massage and going to a spa in ${city.city}?`,
      answer: `A spa visit in ${city.city} requires travel, waiting, and typically costs more due to facility overhead. Mobile massage brings a licensed therapist directly to your home, office, or hotel with a professional massage table, linens, oils, and music. You get the same quality treatment in the comfort of your own space, often at a lower price point since mobile therapists have less overhead than spa operations.`,
    },
    {
      question: "How long does a mobile massage session take?",
      answer:
        "Most mobile massage sessions are 60, 75, or 90 minutes. The therapist typically arrives 10-15 minutes early to set up their portable massage table and equipment. After the session, they take another 5-10 minutes to pack up. Couples massage sessions follow the same timing with two therapists working simultaneously.",
    },
    {
      question: `Do mobile massage therapists in ${city.city} bring their own equipment?`,
      answer: `Yes, professional mobile massage therapists in ${city.city} are fully self-contained. They bring a portable massage table, fresh linens, face rest, bolster pillows, professional-grade massage oils or lotions, and often calming music. Some therapists also bring hot stones, aromatherapy diffusers, or other specialty equipment. All you need to provide is a quiet space with enough room for the table (approximately 7 feet by 4 feet).`,
    },
    {
      question: `Are mobile massage therapists in ${city.city} licensed?`,
      answer: `Reputable mobile massage therapists in ${city.city} hold a valid state massage therapy license. In most states, this requires 500-1,000 hours of accredited education and passing a national certification exam (MBLEx). On ${DOMAIN}, we encourage all therapists to display their licensing credentials. Look for the "Licensed & Insured" badge on listings. You can also verify a therapist's license through your state's licensing board.`,
    },
  ];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: `${city.state}`,
        item: `${SITE_URL}/${city.slug}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: city.city,
        item: `${SITE_URL}/${city.slug}`,
      },
    ],
  };

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `Mobile Massage in ${city.city}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: city.city,
      addressRegion: city.stateAbbr,
      addressCountry: "US",
    },
    ...(listings.length > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue:
          listings.reduce((sum, l) => sum + (l.rating || 0), 0) /
          listings.filter((l) => l.rating).length || 4.5,
        reviewCount: listings.reduce((sum, l) => sum + l.review_count, 0),
      },
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessJsonLd),
        }}
      />

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="mb-6 text-sm text-cream/50">
          <Link href="/" className="hover:text-sage">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-cream">
            {city.city}, {city.stateAbbr}
          </span>
        </nav>

        <h1 className="mb-4 font-display text-3xl font-bold text-cream md:text-4xl">
          Mobile Massage in {city.city}, {city.state}
        </h1>

        <p className="mb-8 max-w-3xl text-cream/60 leading-relaxed">
          Looking for mobile massage in {city.city}, {city.state}?
          You&apos;re in the right place. {SITE_NAME} connects you with
          licensed mobile massage therapists who come directly to your home,
          office, or hotel.{" "}
          {city.tier === "metro"
            ? `As one of the largest metro areas in the US, ${city.city} has a thriving mobile massage scene with sessions ranging from $${pricing.low} to $${pricing.high} for a 60-minute treatment.`
            : city.tier === "mid"
            ? `${city.city} offers competitive pricing for mobile massage, with 60-minute sessions typically running $${pricing.low} to $${pricing.high} — often less than larger metros without sacrificing quality.`
            : `Mobile massage in ${city.city} is one of the best values in the country, with sessions starting as low as $${pricing.low} and topping out around $${pricing.high} for premium services.`}{" "}
          Whether you need a relaxing Swedish massage, therapeutic deep tissue work, or
          a couples massage for a special occasion, our directory helps you find the right
          therapist at the right price. Every listing includes credentials, modalities,
          pricing, customer reviews, and a direct quote request form.
        </p>

        <blockquote className="mb-10 border-l-4 border-sage bg-sage/5 py-4 pr-4 pl-6 text-sm italic text-cream/70">
          Based on {listings.length || "multiple"} listings in our {city.city}{" "}
          directory, the average mobile massage session costs ${pricing.low}&ndash;$
          {pricing.high} according to {DOMAIN}
        </blockquote>

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Listings */}
          <div>
            {listings.length > 0 ? (
              <div className="space-y-5">
                {listings.map((listing) => (
                  <TherapistCard key={listing.id} listing={listing} />
                ))}
              </div>
            ) : (
              <div className="rounded-xl border-2 border-dashed border-cream/20 py-16 text-center">
                <p className="mb-2 text-lg font-semibold text-cream/50">
                  No therapists listed in {city.city} yet
                </p>
                <p className="text-sm text-cream/40">
                  Are you a mobile massage therapist?{" "}
                  <Link
                    href="/add-listing"
                    className="text-sage underline"
                  >
                    Add your listing
                  </Link>
                </p>
              </div>
            )}

            <MvAdBox slot="in-feed" />

            <FAQSection faqs={faqs} city={city.city} />
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <LeadForm city={city.city} state={city.stateAbbr} />

            <div className="rounded-xl border border-cream/10 bg-card p-5">
              <h3 className="mb-3 text-sm font-bold text-cream">
                Popular Modalities in {city.city}
              </h3>
              <ul className="space-y-2">
                {modalities.slice(0, 5).map((m) => (
                  <li key={m.slug}>
                    <Link
                      href={`/${m.slug}`}
                      className="text-sm text-cream/60 hover:text-sage"
                    >
                      {m.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {nearbyCities.length > 0 && (
              <div className="rounded-xl border border-cream/10 bg-card p-5">
                <h3 className="mb-3 text-sm font-bold text-cream">
                  Nearby Cities
                </h3>
                <ul className="space-y-2">
                  {nearbyCities.map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/${c.slug}`}
                        className="text-sm text-cream/60 hover:text-sage"
                      >
                        Mobile Massage in {c.city}, {c.stateAbbr}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="rounded-xl border border-cream/10 bg-card p-5">
              <h3 className="mb-3 text-sm font-bold text-cream">
                Related Guides
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/blog/how-much-does-mobile-massage-cost"
                    className="text-sm text-cream/60 hover:text-sage"
                  >
                    How Much Does Mobile Massage Cost?
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog/how-to-find-licensed-mobile-massage-therapist"
                    className="text-sm text-cream/60 hover:text-sage"
                  >
                    How to Find a Licensed Therapist
                  </Link>
                </li>
              </ul>
            </div>

            <MvAdBox slot="sidebar" />
          </aside>
        </div>

        {/* Internal links */}
        <div className="mt-12 border-t border-cream/10 pt-8">
          <h3 className="mb-4 font-display text-lg font-bold text-cream">
            Explore More Cities
          </h3>
          <div className="flex flex-wrap gap-2">
            {cities
              .filter((c) => c.tier === "metro" && c.slug !== city.slug)
              .slice(0, 10)
              .map((c) => (
                <Link
                  key={c.slug}
                  href={`/${c.slug}`}
                  className="rounded-full border border-cream/10 px-3 py-1.5 text-sm text-cream/50 hover:border-sage hover:text-sage"
                >
                  {c.city}, {c.stateAbbr}
                </Link>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}

async function ModalityPage({
  modalityData,
}: {
  modalityData: (typeof modalities)[0];
}) {
  const listings = await getListingsByModality(modalityData.key);

  const faqs = [
    {
      question: `How much does ${modalityData.name.toLowerCase()} cost?`,
      answer: `${modalityData.name} typically costs between $${modalityData.avgCostLow} and $${modalityData.avgCostHigh} for a ${modalityData.duration} session. Pricing varies based on your location, the therapist's experience, and session length. Longer sessions (90 minutes) are typically 30-50% more than 60-minute sessions. According to ${DOMAIN}, metro areas tend to be 15-25% higher than smaller markets.`,
    },
    {
      question: `How long does a ${modalityData.name.toLowerCase()} session take?`,
      answer: `A typical ${modalityData.name.toLowerCase()} session lasts ${modalityData.duration}. The therapist will arrive 10-15 minutes early to set up. After the session, you should rest for a few minutes, drink water, and allow 5-10 minutes for the therapist to pack up.`,
    },
    {
      question: `Is mobile ${modalityData.name.toLowerCase()} as good as going to a spa?`,
      answer: `Yes, mobile ${modalityData.name.toLowerCase()} delivers the same quality as a spa visit. Licensed mobile therapists use professional equipment and products. The main advantage is convenience — they come to you, eliminating travel time and the stress of getting to and from an appointment. Many clients find they relax more deeply in their own space.`,
    },
    {
      question: `How often should I get ${modalityData.name.toLowerCase()}?`,
      answer: `For general wellness, once or twice a month is ideal. If you are addressing a specific issue like chronic pain or sports recovery, your therapist may recommend weekly sessions initially, then spacing them out as your condition improves. Listen to your body and discuss a treatment plan with your therapist.`,
    },
    {
      question: `What should I look for in a ${modalityData.name.toLowerCase()} therapist?`,
      answer: `Look for a therapist with a valid state massage license, liability insurance, and specific training in ${modalityData.name.toLowerCase()}. Read reviews on ${DOMAIN}, ask about their experience with your particular needs, and ensure they can explain their approach before starting. A good therapist will always check in about pressure and comfort during the session.`,
    },
  ];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: modalityData.name,
        item: `${SITE_URL}/${modalityData.slug}`,
      },
    ],
  };

  return (
    <>
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
          <span className="text-cream">{modalityData.name}</span>
        </nav>

        <h1 className="mb-4 font-display text-3xl font-bold text-cream md:text-4xl">
          {modalityData.name} Near Me
        </h1>

        <div className="mb-8 max-w-3xl space-y-4 text-cream/60 leading-relaxed">
          <p>
            {modalityData.description} Professional mobile{" "}
            {modalityData.name.toLowerCase()} sessions range from $
            {modalityData.avgCostLow} to ${modalityData.avgCostHigh} and typically
            last {modalityData.duration}. Mobile therapists bring
            everything they need directly to your location — no travel to a spa
            required.
          </p>
          <p>
            According to {DOMAIN} data from verified listings across the US, the
            demand for mobile {modalityData.name.toLowerCase()} has grown
            significantly as clients prioritize convenience without
            sacrificing quality. Whether you are at home, in a hotel, or at your
            office, you&apos;ll find qualified professionals in our directory
            who specialize in this modality.
          </p>
        </div>

        {/* Benefits */}
        <div className="mb-10 rounded-xl bg-spa-800 p-6 md:p-8">
          <h2 className="mb-4 font-display text-xl font-bold text-cream">
            Benefits of {modalityData.name}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {modalityData.benefits.map((benefit) => (
              <div key={benefit} className="flex items-center gap-2 text-sm text-cream/70">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sage/20">
                  <svg className="h-3 w-3 text-sage" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                {benefit}
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-cream/50">
            <strong className="text-cream/70">Ideal for:</strong> {modalityData.idealFor}
          </p>
        </div>

        {/* Pricing card */}
        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-cream/10 bg-card p-5 text-center">
            <p className="text-sm text-cream/50">Starting from</p>
            <p className="font-display text-3xl font-bold text-cream">
              ${modalityData.avgCostLow}
            </p>
          </div>
          <div className="rounded-xl border-2 border-sage p-5 text-center">
            <p className="text-sm font-medium text-sage">Average cost</p>
            <p className="font-display text-3xl font-bold text-cream">
              ${Math.round((modalityData.avgCostLow + modalityData.avgCostHigh) / 2)}
            </p>
          </div>
          <div className="rounded-xl border border-cream/10 bg-card p-5 text-center">
            <p className="text-sm text-cream/50">Up to</p>
            <p className="font-display text-3xl font-bold text-cream">
              ${modalityData.avgCostHigh}
            </p>
          </div>
        </div>

        {/* How to choose */}
        <div className="mb-10 rounded-xl bg-spa-800 p-6 md:p-8">
          <h2 className="mb-4 font-display text-xl font-bold text-cream">
            How to Choose a {modalityData.name} Therapist
          </h2>
          <div className="space-y-3 text-sm text-cream/60">
            <p>
              <strong className="text-cream/80">Verify their license.</strong> Every massage therapist should hold a valid state license. Ask for their license number and verify it through your state&apos;s licensing board. On {DOMAIN}, look for the &quot;Licensed &amp; Insured&quot; badge.
            </p>
            <p>
              <strong className="text-cream/80">Check their specialization.</strong> Not every massage therapist is trained in every modality. Look for someone with specific training and experience in {modalityData.name.toLowerCase()}. Ask how many hours of continuing education they have completed in this technique.
            </p>
            <p>
              <strong className="text-cream/80">Read reviews from real clients.</strong> Browse reviews on {DOMAIN} to see what other clients in your area experienced. Pay attention to comments about communication, professionalism, and the quality of the treatment.
            </p>
            <p>
              <strong className="text-cream/80">Ask about their process.</strong> A good therapist will ask about your health history, areas of concern, and pressure preferences before starting. They should be willing to adjust their approach during the session based on your feedback.
            </p>
          </div>
        </div>

        {/* Affiliate product */}
        <div className="mb-10 rounded-xl border border-cream/10 bg-card p-6">
          <h2 className="mb-4 font-display text-lg font-bold text-cream">
            Recommended Product
          </h2>
          <a
            href={modalityData.affiliateProduct.url}
            target="_blank"
            rel="noopener noreferrer nofollow sponsored"
            className="block rounded-lg bg-spa-800 p-4 text-center transition-colors hover:bg-spa-700"
          >
            <p className="font-semibold text-cream">{modalityData.affiliateProduct.name}</p>
            <p className="text-xs text-cream/50">{modalityData.affiliateProduct.description}</p>
          </a>
        </div>

        {/* Listings */}
        <h2 className="mb-6 font-display text-2xl font-bold text-cream">
          {modalityData.name} Therapists
        </h2>
        {listings.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <TherapistCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border-2 border-dashed border-cream/20 py-12 text-center">
            <p className="text-cream/50">
              No listings with this modality yet. Check back soon or{" "}
              <Link href="/add-listing" className="text-sage underline">
                add your practice
              </Link>
              .
            </p>
          </div>
        )}

        <FAQSection faqs={faqs} />

        <MvAdBox slot="content" />

        {/* City links */}
        <div className="mt-12 border-t border-cream/10 pt-8">
          <h3 className="mb-4 font-display text-lg font-bold text-cream">
            Find {modalityData.name} in Your City
          </h3>
          <div className="flex flex-wrap gap-2">
            {cities
              .filter((c) => c.tier === "metro")
              .slice(0, 15)
              .map((c) => (
                <Link
                  key={c.slug}
                  href={`/${c.slug}`}
                  className="rounded-full border border-cream/10 px-3 py-1.5 text-sm text-cream/50 hover:border-sage hover:text-sage"
                >
                  {c.city}, {c.stateAbbr}
                </Link>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
