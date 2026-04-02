import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type ListingSeed = {
  slug: string;
  business_name: string;
  owner_name: string;
  email: string;
  phone: string;
  website: string;
  description: string;
  city: string;
  state: string;
  state_abbr: string;
  zip_codes: string[];
  cities_served: string[];
  modalities: string[];
  price_range: string;
  is_mobile: boolean;
  licensed: boolean;
  insured: boolean;
  featured: boolean;
  status: string;
  rating: number;
  review_count: number;
};

type ReviewSeed = {
  listing_slug: string; // resolved to listing_id after upsert
  reviewer_name: string;
  rating: number;
  body: string;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function phone(area: string): string {
  const p1 = String(Math.floor(Math.random() * 900) + 100);
  const p2 = String(Math.floor(Math.random() * 9000) + 1000);
  return `(${area}) ${p1}-${p2}`;
}

function rating(): number {
  return +(4.1 + Math.random() * 0.8).toFixed(2); // 4.10 – 4.90
}

function reviewCount(): number {
  return Math.floor(Math.random() * 112) + 8; // 8 – 120
}

function slugify(name: string, city: string, stateAbbr: string): string {
  return `${name}-${city}-${stateAbbr}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ---------------------------------------------------------------------------
// Seed Data — 50 listings across 10 cities, 5 per city
// ---------------------------------------------------------------------------

interface CityDef {
  city: string;
  state: string;
  state_abbr: string;
  area_code: string;
  zips: string[];
  nearby: string[];
}

const cities: CityDef[] = [
  {
    city: "Los Angeles",
    state: "California",
    state_abbr: "CA",
    area_code: "310",
    zips: ["90001", "90012", "90024", "90036", "90048"],
    nearby: ["Santa Monica", "Beverly Hills", "West Hollywood", "Culver City"],
  },
  {
    city: "New York",
    state: "New York",
    state_abbr: "NY",
    area_code: "212",
    zips: ["10001", "10011", "10019", "10028", "10036"],
    nearby: ["Brooklyn", "Hoboken", "Jersey City", "Long Island City"],
  },
  {
    city: "Chicago",
    state: "Illinois",
    state_abbr: "IL",
    area_code: "312",
    zips: ["60601", "60610", "60614", "60622", "60657"],
    nearby: ["Evanston", "Oak Park", "Naperville", "Schaumburg"],
  },
  {
    city: "Houston",
    state: "Texas",
    state_abbr: "TX",
    area_code: "713",
    zips: ["77001", "77005", "77019", "77024", "77030"],
    nearby: ["Sugar Land", "Katy", "The Woodlands", "Pearland"],
  },
  {
    city: "Phoenix",
    state: "Arizona",
    state_abbr: "AZ",
    area_code: "602",
    zips: ["85001", "85004", "85008", "85016", "85028"],
    nearby: ["Scottsdale", "Tempe", "Mesa", "Chandler"],
  },
  {
    city: "Seattle",
    state: "Washington",
    state_abbr: "WA",
    area_code: "206",
    zips: ["98101", "98103", "98109", "98115", "98122"],
    nearby: ["Bellevue", "Kirkland", "Redmond", "Tacoma"],
  },
  {
    city: "Denver",
    state: "Colorado",
    state_abbr: "CO",
    area_code: "303",
    zips: ["80202", "80205", "80210", "80218", "80220"],
    nearby: ["Aurora", "Lakewood", "Littleton", "Boulder"],
  },
  {
    city: "Miami",
    state: "Florida",
    state_abbr: "FL",
    area_code: "305",
    zips: ["33101", "33125", "33130", "33139", "33142"],
    nearby: ["Miami Beach", "Coral Gables", "Fort Lauderdale", "Hialeah"],
  },
  {
    city: "Atlanta",
    state: "Georgia",
    state_abbr: "GA",
    area_code: "404",
    zips: ["30301", "30305", "30308", "30312", "30318"],
    nearby: ["Decatur", "Sandy Springs", "Marietta", "Alpharetta"],
  },
  {
    city: "Boston",
    state: "Massachusetts",
    state_abbr: "MA",
    area_code: "617",
    zips: ["02101", "02108", "02116", "02127", "02134"],
    nearby: ["Cambridge", "Somerville", "Brookline", "Newton"],
  },
];

// 5 business templates per city — each city gets all 5
interface BusinessTemplate {
  nameTemplate: string;
  owner: string;
  domain: string;
  modalities: string[];
  price_range: string;
  descriptionTemplate: string;
  featured: boolean;
}

const templates: BusinessTemplate[] = [
  {
    nameTemplate: "Serenity Mobile Massage {city}",
    owner: "Sarah Chen",
    domain: "serenitymobilemassage",
    modalities: ["swedish", "deep_tissue", "hot_stone", "couples"],
    price_range: "$100-$180/hr",
    descriptionTemplate:
      "Serenity Mobile Massage brings the spa to your door in {city}. Owner Sarah Chen is a licensed massage therapist with over 12 years of experience specializing in Swedish, deep tissue, and hot stone massage. We serve {city} and surrounding areas with professional in-home massage services. Every session includes a premium massage table, organic oils, heated blankets, and relaxing music. Whether you need stress relief after a long week or targeted deep tissue work for chronic pain, Serenity delivers a five-star experience in the comfort of your home.",
    featured: true,
  },
  {
    nameTemplate: "The Traveling Therapist {city}",
    owner: "Marcus Johnson",
    domain: "thetravelingtherapist",
    modalities: ["deep_tissue", "sports", "trigger_point", "swedish"],
    price_range: "$110-$190/hr",
    descriptionTemplate:
      "The Traveling Therapist is {city}'s premier mobile massage service for athletes and active professionals. Founded by Marcus Johnson, a former collegiate athlete turned licensed massage therapist, we specialize in sports massage, deep tissue therapy, and trigger point release. Marcus brings 10 years of clinical experience directly to your home, office, or hotel room. Our approach combines evidence-based manual therapy with personalized treatment plans to help you recover faster, move better, and perform at your peak.",
    featured: true,
  },
  {
    nameTemplate: "At-Home Wellness Co. {city}",
    owner: "Jennifer Martinez",
    domain: "athomewellnessco",
    modalities: ["swedish", "prenatal", "lymphatic", "couples"],
    price_range: "$95-$170/hr",
    descriptionTemplate:
      "At-Home Wellness Co. provides gentle, nurturing mobile massage services throughout {city} and nearby communities. Jennifer Martinez, LMT, founded the company after seeing a need for accessible prenatal and lymphatic drainage massage in the {city} area. Our therapists are specially trained in prenatal bodywork, lymphatic drainage, Swedish relaxation massage, and couples sessions. We bring everything needed for a professional spa experience — including a heated table, premium linens, and calming aromatherapy — right to your doorstep.",
    featured: false,
  },
  {
    nameTemplate: "Relief Mobile Bodywork {city}",
    owner: "David Park",
    domain: "reliefmobilebodywork",
    modalities: ["deep_tissue", "trigger_point", "sports", "hot_stone"],
    price_range: "$120-$200/hr",
    descriptionTemplate:
      "Relief Mobile Bodywork is a therapeutic massage practice serving the greater {city} area. David Park, LMT, NCBTMB-certified, has over 15 years of experience treating chronic pain, sports injuries, and post-surgical recovery. We specialize in deep tissue massage, trigger point therapy, and myofascial release. David works with each client to develop a personalized treatment plan that addresses the root cause of pain rather than just masking symptoms. All sessions are performed in your home with clinical-grade equipment and techniques.",
    featured: false,
  },
  {
    nameTemplate: "Tranquil Touch Mobile Spa {city}",
    owner: "Lisa Nguyen",
    domain: "tranquiltouchmobilespa",
    modalities: ["swedish", "hot_stone", "couples", "deep_tissue", "prenatal"],
    price_range: "$100-$175/hr",
    descriptionTemplate:
      "Tranquil Touch Mobile Spa transforms your {city} home into a luxury wellness retreat. Lisa Nguyen and her team of licensed therapists offer a full menu of mobile massage services including Swedish, deep tissue, hot stone, prenatal, and couples massage. Every session is customized to your needs and includes premium organic oils, heated blankets, soothing music, and aromatherapy. We proudly serve {city} and all surrounding neighborhoods. Book online or call us for same-week availability.",
    featured: false,
  },
];

// ---------------------------------------------------------------------------
// Build listing and review arrays
// ---------------------------------------------------------------------------

const listings: ListingSeed[] = [];
const reviews: ReviewSeed[] = [];

const reviewTemplates = [
  {
    names: ["Emily R.", "James T.", "Maria S.", "Chris L.", "Aisha K."],
    bodies: [
      "Absolutely incredible experience. {owner} arrived on time, set up quickly, and gave me the best deep tissue massage I have ever had. My chronic back pain was noticeably better for over a week afterward. Already booked my next appointment.",
      "I was nervous about having a massage therapist come to my home for the first time, but {owner} was completely professional from start to finish. The massage was wonderful — firm but not painful — and I loved being able to relax on my own couch afterward instead of driving home from a spa.",
      "Booked a couples massage for our anniversary and it was perfect. Both therapists were skilled, professional, and personable. The setup in our living room looked like a real spa. My partner and I agreed this was better than any spa couples massage we have tried.",
      "I have been getting monthly massages from {business} for six months now and the consistency is outstanding. {owner} remembers my problem areas and adjusts the session every time. The convenience of not leaving my house is a game-changer.",
      "Five stars without hesitation. I booked a prenatal massage at 32 weeks and {owner} made me feel completely comfortable and supported. The side-lying positioning was perfect and my lower back pain improved dramatically. Highly recommend for any expecting moms in {city}.",
      "Best mobile massage service in {city}, hands down. I have tried three other therapists and none compare. The pressure was exactly what I asked for, the oils smelled amazing, and {owner} even showed me stretches to do between sessions. Worth every penny.",
      "I was skeptical that a mobile massage could match a high-end spa experience, but I was wrong. {owner} brought a heated table, premium linens, and a portable speaker with relaxing music. The 90-minute Swedish session was heavenly. I am never going back to a spa.",
      "Booked a last-minute appointment for my mom who was visiting from out of town. {owner} was flexible with scheduling and gave my mom an amazing hot stone massage. Mom said it was the highlight of her trip. Thank you!",
      "As a marathon runner, I need regular sports massage to stay injury-free. {owner} understands athletic bodies and knows exactly how to work out the tightness in my IT band, calves, and hip flexors. Recovery after sessions is noticeably faster.",
      "I have fibromyalgia and finding a therapist who understands the right pressure level has been a challenge. {owner} listened carefully to my needs and delivered a gentle but effective session that left me feeling so much better. Finally found my therapist.",
    ],
  },
];

for (const city of cities) {
  templates.forEach((tpl, idx) => {
    const businessName = tpl.nameTemplate.replace("{city}", city.city);
    const slug = slugify(businessName, city.city, city.state_abbr);
    const rc = reviewCount();

    const listing: ListingSeed = {
      slug,
      business_name: businessName,
      owner_name: tpl.owner,
      email: `hello@${tpl.domain}${city.state_abbr.toLowerCase()}.com`,
      phone: phone(city.area_code),
      website: `https://www.${tpl.domain}${city.state_abbr.toLowerCase()}.com`,
      description: tpl.descriptionTemplate
        .replace(/{city}/g, city.city)
        .replace(/{state}/g, city.state),
      city: city.city,
      state: city.state,
      state_abbr: city.state_abbr,
      zip_codes: city.zips,
      cities_served: [city.city, ...city.nearby],
      modalities: tpl.modalities,
      price_range: tpl.price_range,
      is_mobile: true,
      licensed: true,
      insured: true,
      featured: tpl.featured,
      status: "approved",
      rating: rating(),
      review_count: rc,
    };

    listings.push(listing);

    // 2 reviews per listing
    const r = reviewTemplates[0];
    for (let ri = 0; ri < 2; ri++) {
      const reviewerName = r.names[(idx * 2 + ri) % r.names.length];
      const bodyTemplate = r.bodies[(idx * 2 + ri) % r.bodies.length];
      const body = bodyTemplate
        .replace(/{owner}/g, tpl.owner)
        .replace(/{business}/g, businessName)
        .replace(/{city}/g, city.city);

      reviews.push({
        listing_slug: slug,
        reviewer_name: reviewerName,
        rating: Math.random() > 0.2 ? 5 : 4,
        body,
      });
    }
  });
}

// ---------------------------------------------------------------------------
// Seed the database
// ---------------------------------------------------------------------------

async function seed() {
  console.log(`Seeding ${listings.length} listings...`);

  // Upsert listings
  const { data: upsertedListings, error: listingsError } = await supabase
    .from("mm_listings")
    .upsert(listings, { onConflict: "slug" })
    .select("id, slug");

  if (listingsError) {
    console.error("Error upserting listings:", listingsError);
    process.exit(1);
  }

  console.log(`Upserted ${upsertedListings?.length ?? 0} listings.`);

  // Build slug -> id map
  const slugToId: Record<string, string> = {};
  for (const row of upsertedListings ?? []) {
    slugToId[row.slug] = row.id;
  }

  // Build review rows with resolved listing_id
  const reviewRows = reviews
    .map((r) => ({
      listing_id: slugToId[r.listing_slug],
      reviewer_name: r.reviewer_name,
      rating: r.rating,
      body: r.body,
    }))
    .filter((r) => r.listing_id);

  console.log(`Seeding ${reviewRows.length} reviews...`);

  // Delete existing reviews for these listings to avoid duplicates on re-seed
  const listingIds = Object.values(slugToId);
  if (listingIds.length > 0) {
    const { error: deleteError } = await supabase
      .from("mm_reviews")
      .delete()
      .in("listing_id", listingIds);

    if (deleteError) {
      console.error("Error deleting old reviews:", deleteError);
    }
  }

  // Insert reviews in batches of 50
  for (let i = 0; i < reviewRows.length; i += 50) {
    const batch = reviewRows.slice(i, i + 50);
    const { error: reviewError } = await supabase
      .from("mm_reviews")
      .insert(batch);

    if (reviewError) {
      console.error(`Error inserting review batch ${i}:`, reviewError);
    }
  }

  console.log("Seed complete!");
  console.log(
    `  - ${listings.length} listings across ${cities.length} cities`
  );
  console.log(`  - ${reviewRows.length} reviews`);
  console.log(
    `  - Featured listings: ${listings.filter((l) => l.featured).length}`
  );
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
