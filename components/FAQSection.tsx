type FAQ = {
  question: string;
  answer: string;
};

export default function FAQSection({
  faqs,
  city,
}: {
  faqs: FAQ[];
  city?: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <section className="mt-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h2 className="mb-6 font-display text-2xl font-bold text-cream">
        Frequently Asked Questions
        {city ? ` About Mobile Massage in ${city}` : ""}
      </h2>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <details
            key={i}
            className="group rounded-xl border border-cream/10 bg-card"
          >
            <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-left font-semibold text-cream transition-colors hover:text-sage [&::-webkit-details-marker]:hidden">
              <span>{faq.question}</span>
              <span className="ml-4 shrink-0 text-cream/40 transition-transform group-open:rotate-45">
                +
              </span>
            </summary>
            <div className="border-t border-cream/10 px-5 py-4 text-sm leading-relaxed text-cream/70">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
