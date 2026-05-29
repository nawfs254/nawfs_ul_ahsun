export default function ExperienceTimeline({
  experiences,
}: {
  experiences: any[];
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-blue-500">
        Work History
      </p>

      <h2 className="mb-8 text-3xl font-bold">Professional Experience</h2>

      <div className="space-y-6">
        {experiences.map((exp) => (
          <div
            key={exp.position}
            className="rounded-3xl border border-border bg-card p-8"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
              <div>
                <h3 className="text-2xl font-semibold">{exp.position}</h3>

                <p className="text-blue-500">{exp.workPlace}</p>
              </div>

              <div className="text-sm text-muted-foreground">
                {exp.timeline.from} — {exp.timeline.to || "Present"}
              </div>
            </div>

            <ul className="mt-6 space-y-2">
              {exp.jobDesc.map((item: string) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>

            <div className="mt-5 flex flex-wrap gap-2">
              {exp.techStack?.map((tech: string) => (
                <span
                  key={tech}
                  className="rounded-full bg-muted px-3 py-1 text-xs"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
