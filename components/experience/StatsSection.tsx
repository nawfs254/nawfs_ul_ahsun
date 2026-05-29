export default function StatsSection({ stats }: { stats: any }) {
  const cards = [
    {
      value: stats?.experienceYears,
      label: "Years Experience",
    },
    {
      value: stats?.projectsDelivered,
      label: "Projects Delivered",
    },
    {
      value: stats?.erpModulesBuilt,
      label: "ERP Modules",
    },
    {
      value: stats?.technologies,
      label: "Technologies",
    },
  ];

  return (
    <div className="mb-20 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-3xl border border-border bg-card p-8 text-center"
        >
          <h2 className="text-4xl font-bold text-blue-500">{card.value}</h2>

          <p className="mt-2 text-sm text-muted-foreground">{card.label}</p>
        </div>
      ))}
    </div>
  );
}
