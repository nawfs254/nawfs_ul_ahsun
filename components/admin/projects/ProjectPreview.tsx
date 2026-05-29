interface Props {
  project: any;
}

export default function ProjectPreview({ project }: Props) {
  return (
    <div className="sticky top-6 rounded-2xl border border-border bg-card p-5">
      <h3 className="mb-4 font-semibold">Preview</h3>

      {project.image && (
        <img
          src={project.image}
          alt=""
          className="mb-4 h-40 w-full rounded-xl object-cover"
        />
      )}

      <h2 className="text-xl font-bold">{project.title || "Project Title"}</h2>

      <p className="mt-2 text-sm text-muted-foreground">
        {project.description}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {project.technologies?.map((tech: string) => (
          <span key={tech} className="rounded-full bg-muted px-3 py-1 text-xs">
            {tech}
          </span>
        ))}
      </div>
    </div>
  );
}
