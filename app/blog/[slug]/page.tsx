import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import { MDXRemote } from "next-mdx-remote/rsc";
import { Clock, Calendar } from "lucide-react";
import { blogPosts } from "@/data/blog-posts";
import MvAdBox from "@/components/MvAdBox";
import { SITE_NAME, SITE_URL } from "@/lib/utils";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) return { title: "Post Not Found" };

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.publishedAt,
    },
  };
}

export default async function BlogPost({
  params,
}: {
  params: { slug: string };
}) {
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) notFound();

  let source: string;
  try {
    const filePath = path.join(
      process.cwd(),
      "content",
      "blog",
      `${post.slug}.mdx`
    );
    source = fs.readFileSync(filePath, "utf-8");
  } catch {
    notFound();
  }

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    author: {
      "@type": "Organization",
      name: `${SITE_NAME} Editorial Team`,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
    },
  };

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
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${SITE_URL}/blog/${post.slug}`,
      },
    ],
  };

  const relatedPosts = blogPosts
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <article className="mx-auto max-w-3xl px-4 py-12">
        <nav className="mb-6 text-sm text-cream/50">
          <Link href="/" className="hover:text-sage">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/blog" className="hover:text-sage">
            Blog
          </Link>
          <span className="mx-2">/</span>
          <span className="text-cream">Article</span>
        </nav>

        <header className="mb-8">
          <h1 className="mb-4 font-display text-3xl font-bold leading-tight text-cream md:text-4xl">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-cream/40">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {post.readingTime}
            </span>
          </div>
        </header>

        <div className="prose max-w-none">
          <MDXRemote source={source} />
        </div>

        <MvAdBox slot="content" />

        {/* PDF CTA */}
        <div className="mt-10 rounded-xl bg-card p-6 text-center">
          <h3 className="mb-2 font-display text-lg font-bold text-cream">
            The Mobile Massage Booking Checklist
          </h3>
          <p className="mb-4 text-sm text-cream/50">
            Everything you need to know before booking. Questions to
            ask, red flags, and pricing benchmarks.
          </p>
          <a
            href="https://gumroad.com/YOURPRODUCT"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-sm"
          >
            Download for $19
          </a>
        </div>

        {/* Related posts */}
        <div className="mt-12 border-t border-cream/10 pt-8">
          <h2 className="mb-6 font-display text-xl font-bold text-cream">
            Related Guides
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {relatedPosts.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="card p-4 transition-shadow hover:shadow-md hover:shadow-sage/5"
              >
                <h3 className="mb-1 text-sm font-bold text-cream leading-snug">
                  {p.title}
                </h3>
                <span className="text-xs text-cream/40">{p.readingTime}</span>
              </Link>
            ))}
          </div>
        </div>
      </article>
    </>
  );
}
