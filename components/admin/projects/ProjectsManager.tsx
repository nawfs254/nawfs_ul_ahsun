"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import ProjectsTable from "./ProjectsTable";
import ProjectFormModal from "./ProjectFormModal";

export default function ProjectsManager() {
  const [projects, setProjects] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const loadProjects = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/admin/projects");

      const json = await res.json();

      if (json.success) {
        setProjects(json.data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const deleteProject = async (id: string) => {
    const confirmDelete = window.confirm("Delete this project?");

    if (!confirmDelete) return;

    await fetch(`/api/admin/projects/${id}`, {
      method: "DELETE",
    });

    loadProjects();
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Projects</h1>

          <p className="mt-2 text-muted-foreground">
            Manage portfolio projects
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedProject(null);
            setOpen(true);
          }}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-white transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Project
        </button>
      </div>

      <ProjectsTable
        projects={projects}
        loading={loading}
        onDelete={deleteProject}
        onEdit={(project) => {
          setSelectedProject(project);
          setOpen(true);
        }}
      />

      <ProjectFormModal
        open={open}
        onClose={() => setOpen(false)}
        project={selectedProject}
        refresh={loadProjects}
      />
    </div>
  );
}
