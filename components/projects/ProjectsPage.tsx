"use client";

import { useMemo, useState } from "react";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";

export default function ProjectsPage({ projects }: { projects: any[] }) {
  const [category, setCategory] = useState("All");

  const ITEMS_PER_PAGE = 6;

  const [currentPage, setCurrentPage] = useState(1);

  const categories = useMemo(
    () => ["All", ...new Set(projects.map((p) => p.category))],
    [projects],
  );

  const handleCategoryChange = (category: string) => {
    setCategory(category);
    setCurrentPage(1);
  };

  const filteredProjects =
    category === "All"
      ? projects
      : projects.filter((p) => p.category === category);

  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);

  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const [selectedProject, setSelectedProject] = useState<any>(null);

  return (
    <section className="py-5">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-10">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-500">
            Portfolio
          </p>

          <h1 className="text-5xl font-bold">My Projects</h1>

          <p className="mt-4 max-w-2xl text-muted-foreground">
            A curated collection of projects ranging from enterprise ERP systems
            to modern web applications.
          </p>
        </div>

        <div className="mb-10 flex flex-wrap gap-3">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => handleCategoryChange(item)}
              className={`rounded-full px-4 py-2 text-sm transition-all
                ${
                  category === item
                    ? "bg-blue-600 text-white"
                    : "bg-muted hover:bg-muted/70"
                }
              `}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {paginatedProjects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onClick={setSelectedProject}
            />
          ))}
        </div>

        <div className="mt-10 flex items-center justify-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="rounded-lg border px-4 py-2 disabled:opacity-50"
          >
            Previous
          </button>

          {Array.from({ length: totalPages }).map((_, index) => {
            const page = index + 1;

            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`h-10 w-10 rounded-lg transition-all ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "border hover:bg-muted"
                }`}
              >
                {page}
              </button>
            );
          })}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="rounded-lg border px-4 py-2 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
}
