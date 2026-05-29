export default function TimelineSection({
  workExp,
  education,
}: {
  workExp: any[];
  education: any[];
}) {
  return (
    <section className="mt-24">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-blue-500">
        My Journey
      </p>

      <h2 className="mb-12 text-4xl font-bold">Timeline & Milestones</h2>

      <div className="relative border-l border-border pl-10">
        {workExp.map((item) => (
          <div key={item.position} className="relative mb-12">
            <div className="absolute -left-[46px] top-2 h-5 w-5 rounded-full border-4 border-blue-500 bg-background" />

            <p className="mb-2 text-sm text-blue-500">
              {item.timeline.from?.slice(0, 4)}
            </p>

            <h3 className="text-xl font-semibold">{item.position}</h3>

            <p className="mt-1 text-muted-foreground">{item.workPlace}</p>

            <p className="mt-3">{item.subtitle}</p>
          </div>
        ))}

        {education.map((item) => (
          <div key={item.degree} className="relative mb-12">
            <div className="absolute -left-[46px] top-2 h-5 w-5 rounded-full border-4 border-cyan-400 bg-background" />

            <p className="mb-2 text-sm text-cyan-400">{item.timeline.from}</p>

            <h3 className="text-xl font-semibold">{item.degree}</h3>

            <p className="mt-1 text-muted-foreground">{item.institute}</p>

            <p className="mt-3">{item.result}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
