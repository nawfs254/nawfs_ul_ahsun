"use client";

import { Calendar, Briefcase, Users, X } from "lucide-react";

export default function ProjectModal({
  project,
  onClose,
}: {
  project: any;
  onClose: () => void;
}) {
  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-border bg-background">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-lg p-2 hover:bg-muted"
        >
          <X size={20} />
        </button>

        <img
          src={project.image}
          alt={project.title}
          className="h-72 w-full object-cover"
        />

        <div className="space-y-8 p-8">
          <div>
            <span className="rounded-full bg-blue-500 px-3 py-1 text-xs text-white">
              {project.category}
            </span>

            <h2 className="mt-4 text-4xl font-bold">{project.title}</h2>

            <p className="mt-4 text-muted-foreground">
              {project.longDescription}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border p-4">
              <Briefcase size={18} />
              <p className="mt-2 text-sm text-muted-foreground">Role</p>
              <p className="font-medium">{project.role}</p>
            </div>

            <div className="rounded-2xl border p-4">
              <Calendar size={18} />
              <p className="mt-2 text-sm text-muted-foreground">Timeline</p>
              <p className="font-medium">
                {project.timeline?.from} - {project.timeline?.to}
              </p>
            </div>

            <div className="rounded-2xl border p-4">
              <Users size={18} />
              <p className="mt-2 text-sm text-muted-foreground">Team Size</p>
              <p className="font-medium">{project.teamSize}</p>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-semibold">Key Features</h3>

            <ul className="space-y-2">
              {project.keyFeatures?.map((feature: string) => (
                <li key={feature}>• {feature}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-semibold">Responsibilities</h3>

            <ul className="space-y-2">
              {project.responsibilities?.map((item: string) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-xl font-semibold">Technologies</h3>

            <div className="flex flex-wrap gap-2">
              {project.technologies?.map((tech: string) => (
                <span key={tech} className="rounded-full bg-muted px-3 py-1">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
