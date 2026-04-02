import Link from "next/link";
import type { Metadata } from "next";
import { Clock, ArrowRight } from "lucide-react";
import { blogPosts } from "@/data/blog-posts";
import { SITE_NAME, SITE_URL } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Massage Guides & Tips",
  description:
    "Expert guides on mobile massage, pricing, modalities, finding licensed therapists, and getting the best experience.",
};

export default function BlogIndex() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${SITE_URL}/blog`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="mb-3 font-display text-3xl font-bold text-cream md:text-4xl">
          Massage Guides
        </h1>
        <p className="mb-10 text-lg text-cream/50">
          Expert guides on mobile massage, pricing, modalities, and getting the
          best results from your sessions.
        </p>

        <div className="space-y-6">
          {blogPosts.map((post, i) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className={`block card overflow-hidden transition-shadow hover:shadow-md hover:shadow-sage/5 ${
                i === 0 ? "border-sage/30" : ""
              }`}
            >
              <div className="p-6 md:p-8">
                <div className="mb-3 flex items-center gap-3 text-xs text-cream/40">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{post.readingTime}</span>
                  <span>&middot;</span>
                  <span>
                    {new Date(post.publishedAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <h2 className="mb-2 font-display text-xl font-bold text-cream md:text-2xl">
                  {post.title}
                </h2>
                <p className="mb-4 text-cream/60">{post.description}</p>
                <span className="flex items-center gap-1 text-sm font-medium text-sage">
                  Read more <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
