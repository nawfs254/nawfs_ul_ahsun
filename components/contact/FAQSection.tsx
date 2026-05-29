export default function FAQSection({ faq }: { faq: any[] }) {
  if (!faq.length) return null;

  return (
    <section className="mt-24">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-blue-500">
        FAQ
      </p>

      <h2 className="mb-10 text-4xl font-bold">Quick Answers</h2>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {faq.map((item) => (
          <div
            key={item.question}
            className="rounded-3xl border border-border bg-card p-6"
          >
            <h3 className="mb-3 font-semibold">{item.question}</h3>

            <p className="text-muted-foreground">{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
