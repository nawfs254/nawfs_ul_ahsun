import DynamicIcon from "../DynamicIcon";

export default function TechStackSection({ techStack }: { techStack: any[] }) {
  return (
    <section className="py-5">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <div className="flex items-center gap-2 text-sm font-semibold text-blue-500 uppercase tracking-widest">
            <div className="h-[2px] w-8 bg-blue-500" />
            Tech Stack
          </div>

          <h2 className="mt-3 text-4xl font-bold">Tools I Work With</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {techStack.map((tech) => (
            <div
              key={tech.name}
              className="
                group
                rounded-2xl
                border border-border
                bg-card
                px-4 py-3
                transition-all duration-300
                hover:-translate-y-1
                hover:border-blue-500/30
                hover:shadow-lg
              "
            >
              <div className="flex items-center gap-4">
                <div
                  className="
                    flex h-10 w-10 items-center justify-center
                    rounded-xl
                    bg-muted
                    group-hover:bg-blue-500/10
                    transition-all
                  "
                >
                  <DynamicIcon
                    iconLibrary={tech.iconLibrary}
                    icon={tech.icon}
                    className="text-lg"
                  />
                </div>

                <div>
                  <h3 className="font-medium">{tech.name}</h3>

                  <p className="text-xs text-muted-foreground">
                    {tech.category}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
