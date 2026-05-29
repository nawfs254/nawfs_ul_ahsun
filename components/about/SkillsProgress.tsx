export default function SkillsProgress({ skills }: { skills: any[] }) {
  const topSkills = [...skills]
    .sort((a, b) => b.proficiency - a.proficiency)
    .slice(0, 6);

  return (
    <section>
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-blue-500">
        Skills
      </p>

      <h2 className="mb-8 text-4xl font-bold">Technical Proficiency</h2>

      <div className="space-y-8">
        {topSkills.map((skill) => (
          <div key={skill.name}>
            <div className="mb-2 flex justify-between">
              <span>{skill.name}</span>

              <span>{skill.proficiency}%</span>
            </div>

            <div className="h-2 rounded-full bg-muted">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                style={{
                  width: `${skill.proficiency}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
