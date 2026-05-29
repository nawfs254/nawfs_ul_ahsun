export default function ServicesSection({ services }: { services: any[] }) {
  return (
    <section>
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-blue-500">
        Services
      </p>

      <h2 className="mb-8 text-4xl font-bold">What I Offer</h2>

      <div className="grid gap-4 md:grid-cols-2">
        {services.map((service) => (
          <div
            key={service.title}
            className="rounded-3xl border border-border bg-card p-6"
          >
            <h3 className="mb-3 text-xl font-semibold">{service.title}</h3>

            <p className="text-muted-foreground">{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
