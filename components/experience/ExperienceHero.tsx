import { Download } from "lucide-react";

export default function ExperienceHero({ data }: { data: any }) {
  return (
    <div className="mb-14">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-blue-500">
        Resume
      </p>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="max-w-xl text-5xl font-bold lg:text-6xl">
            {data.experienceHero?.title}
          </h1>

          <p className="mt-5 max-w-2xl text-muted-foreground">
            {data.experienceHero?.subtitle}
          </p>
        </div>

        <a
          href={data.resumeUrl}
          className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
        >
          <Download size={18} />
          Download Resume
        </a>
      </div>
    </div>
  );
}
