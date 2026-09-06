"use client";

import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  FolderGit2,
  ExternalLink,
  Lock,
  Star,
  Check,
  X,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import { ProjectItem } from "@/data/portfolioData";
import ImageUpload from "./ImageUpload";
import GalleryUpload from "./GalleryUpload";

interface ProjectsTabProps {
  initialProjects: ProjectItem[];
  onRefresh: () => Promise<void>;
}

export default function ProjectsTab({ initialProjects, onRefresh }: ProjectsTabProps) {
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects || []);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredProjects = projects.filter((p) =>
    (p.title || "").toLowerCase().includes(search.toLowerCase()) ||
    (p.category || "").toLowerCase().includes(search.toLowerCase())
  );

  const openCreateModal = () => {
    setEditingProject({
      id: `project-${Date.now()}`,
      title: "",
      subtitle: "",
      clientOrOrg: "",
      category: "Web Applications",
      description: "",
      highlights: [""],
      technologies: ["React", "Tailwind CSS"],
      featured: false,
      isPrivate: 0,
      image: "/projects/dynamic-notifications/thumbnail.png",
      images: ["/projects/dynamic-notifications/thumbnail.png"],
      liveUrl: "",
      githubUrl: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (proj: ProjectItem) => {
    setEditingProject({
      ...proj,
      highlights: proj.highlights?.length ? proj.highlights : [""],
      technologies: proj.technologies?.length ? proj.technologies : [""],
      images: proj.images?.length ? proj.images : [proj.image || ""],
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    setSaving(true);

    try {
      const isExisting = projects.some(
        (p: any) => (p._id && p._id === editingProject._id) || (p.id && p.id === editingProject.id)
      );

      const method = isExisting ? "PUT" : "POST";

      const res = await fetch("/api/admin/data/projects", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingProject),
      });

      if (!res.ok) throw new Error("Failed to save project");

      setIsModalOpen(false);
      await onRefresh();
      // update local
      const updatedRes = await fetch("/api/admin/data/projects");
      const updatedData = await updatedRes.json();
      if (updatedData.data) setProjects(updatedData.data);
    } catch (err: any) {
      alert(err.message || "Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (proj: any) => {
    const id = proj._id || proj.id;
    if (!confirm(`Are you sure you want to delete project "${proj.title}"?`)) return;
    setDeletingId(id);

    try {
      const res = await fetch(`/api/admin/data/projects?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete project");
      setProjects(projects.filter((p: any) => (p._id || p.id) !== id));
      await onRefresh();
    } catch (err: any) {
      alert(err.message || "Failed to delete project");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Enterprise & Portfolio Projects</h2>
          <p className="text-sm text-muted-foreground">
            Manage projects, screenshots, categories, and technologies ({projects.length} in MongoDB).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-xl border border-border bg-background px-3.5 py-2 text-sm outline-none focus:border-blue-500 w-48 sm:w-64"
          />
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all cursor-pointer shrink-0"
          >
            <Plus size={16} /> Add Project
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProjects.map((proj: any, idx: number) => {
          const id = proj._id || proj.id;
          return (
            <div
              key={id || idx}
              className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs flex flex-col hover:border-blue-500/40 transition-all"
            >
              {/* Image preview */}
              <div className="relative h-44 w-full bg-muted/40 overflow-hidden border-b border-border/60">
                {proj.image ? (
                  <img
                    src={proj.image}
                    alt={proj.title}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                    <ImageIcon size={32} />
                  </div>
                )}

                {/* Badges */}
                <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5">
                  <span className="rounded-md bg-background/90 backdrop-blur-md px-2 py-0.5 text-[11px] font-semibold text-foreground border border-border/50">
                    {proj.category}
                  </span>
                  {proj.featured && (
                    <span className="flex items-center gap-1 rounded-md bg-amber-500/90 text-white px-2 py-0.5 text-[11px] font-bold">
                      <Star size={10} fill="currentColor" /> Featured
                    </span>
                  )}
                  {proj.isPrivate === 1 && (
                    <span className="flex items-center gap-1 rounded-md bg-red-500/90 text-white px-2 py-0.5 text-[11px] font-semibold">
                      <Lock size={10} /> Private
                    </span>
                  )}
                </div>
              </div>

              {/* Details */}
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-base text-foreground line-clamp-1">
                  {proj.title}
                </h3>
                {proj.subtitle && (
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                    {proj.subtitle}
                  </p>
                )}
                <p className="text-xs text-muted-foreground/90 line-clamp-3 mt-2.5 flex-1">
                  {proj.description}
                </p>

                {/* Tech tags preview */}
                <div className="flex flex-wrap gap-1 mt-3.5">
                  {(proj.technologies || []).slice(0, 4).map((tech: string, i: number) => (
                    <span
                      key={i}
                      className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                  {(proj.technologies || []).length > 4 && (
                    <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                      +{proj.technologies.length - 4}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground font-mono">
                    ID: {proj.id || "N/A"}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(proj)}
                      className="p-1.5 text-blue-600 hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer"
                      title="Edit Project"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(proj)}
                      disabled={deletingId === id}
                      className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                      title="Delete Project"
                    >
                      {deletingId === id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit / Create Modal */}
      {isModalOpen && editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-3xl border border-border bg-card p-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-5">
              <h3 className="text-lg font-bold text-foreground">
                {editingProject._id ? "Edit Project" : "Add New Project"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:bg-muted"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Unique Project ID (slug)
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProject.id || ""}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, id: e.target.value })
                    }
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Category
                  </label>
                  <select
                    value={editingProject.category || "Web Applications"}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, category: e.target.value })
                    }
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="Healthcare ERP">Healthcare ERP</option>
                    <option value="Enterprise ERP">Enterprise ERP</option>
                    <option value="Web Applications">Web Applications</option>
                    <option value="R&D Systems">R&D Systems</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Project Title
                  </label>
                  <input
                    type="text"
                    required
                    value={editingProject.title || ""}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, title: e.target.value })
                    }
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={editingProject.subtitle || ""}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, subtitle: e.target.value })
                    }
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Client or Organization
                  </label>
                  <input
                    type="text"
                    value={editingProject.clientOrOrg || ""}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, clientOrOrg: e.target.value })
                    }
                    placeholder="e.g. Orange Solutions LTD"
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <ImageUpload
                    label="Main Thumbnail Image"
                    required
                    value={editingProject.image || ""}
                    onChange={(url) =>
                      setEditingProject({ ...editingProject, image: url })
                    }
                    placeholder="/projects/eprescription-system/thumbnail.png"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={editingProject.description || ""}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, description: e.target.value })
                    }
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                {/* Technologies CSV */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Technologies (comma separated)
                  </label>
                  <input
                    type="text"
                    value={(editingProject.technologies || []).join(", ")}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        technologies: e.target.value
                          .split(",")
                          .map((t) => t.trim())
                          .filter(Boolean),
                      })
                    }
                    placeholder="React, Next.js, Java, Spring Boot, MS SQL Server"
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                {/* Gallery Screenshots */}
                <div className="md:col-span-2">
                  <GalleryUpload
                    images={editingProject.images || []}
                    onChange={(newImages) =>
                      setEditingProject({ ...editingProject, images: newImages })
                    }
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Live Demo URL
                  </label>
                  <input
                    type="text"
                    value={editingProject.liveUrl || ""}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, liveUrl: e.target.value })
                    }
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    GitHub Repo URL
                  </label>
                  <input
                    type="text"
                    value={editingProject.githubUrl || ""}
                    onChange={(e) =>
                      setEditingProject({ ...editingProject, githubUrl: e.target.value })
                    }
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                {/* Checkboxes */}
                <div className="flex items-center gap-6 md:col-span-2 pt-2">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProject.featured || false}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, featured: e.target.checked })
                      }
                      className="rounded border-border"
                    />
                    <span className="font-semibold">Featured on Homepage</span>
                  </label>

                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingProject.isPrivate === 1}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          isPrivate: e.target.checked ? 1 : 0,
                        })
                      }
                      className="rounded border-border"
                    />
                    <span className="font-semibold">Private Enterprise Project</span>
                  </label>
                </div>
              </div>

              {/* Highlights */}
              <div className="pt-3 border-t border-border/60 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-muted-foreground">
                    Key Highlights / Bullet Points
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setEditingProject({
                        ...editingProject,
                        highlights: [...(editingProject.highlights || []), ""],
                      })
                    }
                    className="text-xs text-blue-600 font-semibold cursor-pointer"
                  >
                    + Add Bullet
                  </button>
                </div>

                {(editingProject.highlights || []).map((h: string, i: number) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="text"
                      value={h}
                      onChange={(e) => {
                        const updated = [...editingProject.highlights];
                        updated[i] = e.target.value;
                        setEditingProject({ ...editingProject, highlights: updated });
                      }}
                      className="flex-1 rounded-xl border border-border bg-background px-3 py-1.5 text-xs outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = editingProject.highlights.filter(
                          (_: any, idx: number) => idx !== i
                        );
                        setEditingProject({ ...editingProject, highlights: updated });
                      }}
                      className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Footer Buttons */}
              <div className="pt-5 border-t border-border flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:bg-muted cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-5 py-2 text-sm font-semibold text-white shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  {saving ? "Saving..." : "Save Project to MongoDB"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
