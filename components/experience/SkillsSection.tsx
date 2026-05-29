export default function SkillsSection({ skills }: { skills: any[] }) {
  const grouped = skills.reduce((acc: any, skill: any) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }

    acc[skill.category].push(skill);

    return acc;
  }, {});

  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-blue-500">
        Skills
      </p>

      <h2 className="mb-8 text-3xl font-bold">Tech Categories</h2>

      <div className="space-y-8">
        {Object.entries(grouped).map(([category, items]: any) => (
          <div key={category}>
            <h3 className="mb-3 text-sm font-semibold uppercase text-blue-500">
              {category}
            </h3>

            <div className="flex flex-wrap gap-2">
              {items.map((skill: any) => (
                <span
                  key={skill.name}
                  className="rounded-full border border-border bg-card px-3 py-2 text-sm"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
