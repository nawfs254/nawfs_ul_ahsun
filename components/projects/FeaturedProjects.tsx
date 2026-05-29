"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProjectCard from "./ProjectCard";

export default function FeaturedProjects({ projects }: { projects: any[] }) {
  return (
    <section className="py-5">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-500">
              Portfolio
            </p>

            <h2 className="text-4xl font-bold">Featured Projects</h2>
          </div>

          <Link
            href="/pages/Projects"
            className="flex items-center gap-2 text-sm font-medium text-blue-500 hover:gap-3 transition-all"
          >
            View all projects
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.slice(0, 3).map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
