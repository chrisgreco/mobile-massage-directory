export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  readingTime: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "how-much-does-mobile-massage-cost",
    title: "How Much Does Mobile Massage Cost in 2026?",
    description:
      "Complete pricing guide for mobile massage services. Compare costs by modality, session length, and city tier across the US.",
    publishedAt: "2026-01-15",
    readingTime: "7 min read",
  },
  {
    slug: "mobile-vs-spa-massage",
    title: "Mobile Massage vs Spa Massage: Which Is Better?",
    description:
      "Side-by-side comparison of mobile massage and traditional spa massage on price, convenience, quality, and overall experience.",
    publishedAt: "2026-02-01",
    readingTime: "5 min read",
  },
  {
    slug: "how-to-find-licensed-mobile-massage-therapist",
    title:
      "How to Find a Licensed Mobile Massage Therapist (7 Things to Check)",
    description:
      "Seven critical things to verify before booking a mobile massage therapist, from licensing and insurance to reviews and red flags.",
    publishedAt: "2026-02-15",
    readingTime: "6 min read",
  },
  {
    slug: "best-massage-for-back-pain",
    title: "Best Massage for Back Pain: Modality Comparison Guide",
    description:
      "Which massage type is best for back pain? We compare deep tissue, Swedish, trigger point, and sports massage for back pain relief.",
    publishedAt: "2026-03-01",
    readingTime: "6 min read",
  },
  {
    slug: "couples-massage-at-home-guide",
    title: "The Complete Guide to Couples Massage at Home",
    description:
      "Everything you need to know about booking a couples massage at home. Planning tips, what to expect, cost breakdown, and how to prepare.",
    publishedAt: "2026-03-15",
    readingTime: "5 min read",
  },
  {
    slug: "deep-tissue-vs-swedish-massage",
    title: "Deep Tissue vs Swedish Massage: Which One Do You Need?",
    description:
      "A detailed comparison of deep tissue and Swedish massage covering pressure, benefits, pain levels, cost, and which is right for you.",
    publishedAt: "2026-03-28",
    readingTime: "5 min read",
  },
];
