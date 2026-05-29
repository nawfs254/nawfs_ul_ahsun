"use client";

import { useEffect, useState } from "react";
import {
  X,
  Save,
  Image as ImageIcon,
  Link as LinkIcon,
  Tag,
  FileText,
  CheckSquare,
  Layers,
  LayoutList,
} from "lucide-react";

import StringArrayEditor from "./StringArrayEditor";
import ProjectPreview from "./ProjectPreview";
import { FiGithub } from "react-icons/fi";

interface Props {
  open: boolean;
  onClose: () => void;
  project?: any;
  refresh: () => void;
}

const emptyProject = {
  title: "",
  category: "",
  featured: false,
  image: "",
  description: "",
  longDescription: "",
  githubUrl: "",
  liveUrl: "",
  technologies: [],
  keyFeatures: [],
  responsibilities: [],
};

export default function ProjectFormModal({
  open,
  onClose,
  project,
  refresh,
}: Props) {
  const [form, setForm] = useState<any>(emptyProject);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setForm(project || emptyProject);
  }, [project, open]);

  if (!open) return null;

  const save = async () => {
    try {
      setSaving(true);
      const url = project?._id
        ? `/api/admin/projects/${project._id}`
        : "/api/admin/projects";
      const method = project?._id ? "PUT" : "POST";

      await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      refresh();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 sm:p-6 backdrop-blur-sm overflow-hidden">
      <div className="flex h-full max-h-[90vh] w-full max-w-7xl flex-col overflow-hidden rounded-3xl border border-border bg-background shadow-2xl relative">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border bg-card px-6 py-4">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            {project ? "Update Project" : "Create New Project"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full bg-muted/50 p-2 text-foreground transition-colors hover:bg-red-500 hover:text-white"
            title="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Area */}
        <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[1fr_400px] overflow-hidden">
          {/* Main Form Area (Scrollable) */}
          <div className="overflow-y-auto p-6 sm:p-8">
            <div className="mx-auto max-w-3xl space-y-8">
              {/* Basic Details Section */}
              <div className="space-y-4 rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
                <div className="flex items-center gap-2 border-b border-border pb-4">
                  <Tag className="text-blue-500" size={20} />
                  <h3 className="text-lg font-semibold text-foreground">
                    Basic Details
                  </h3>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Project Title
                    </label>
                    <input
                      value={form.title}
                      onChange={(e) =>
                        setForm({ ...form, title: e.target.value })
                      }
                      placeholder="e.g. Awesome E-commerce App"
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Category
                    </label>
                    <input
                      value={form.category}
                      onChange={(e) =>
                        setForm({ ...form, category: e.target.value })
                      }
                      placeholder="e.g. Web Development"
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-foreground"
                    />
                  </div>

                  <div className="flex items-end pb-2">
                    <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 hover:bg-muted/50 transition-colors w-full">
                      <input
                        type="checkbox"
                        checked={form.featured}
                        onChange={(e) =>
                          setForm({ ...form, featured: e.target.checked })
                        }
                        className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="font-medium text-foreground">
                        Highlight as Featured Project
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Media & Links Section */}
              <div className="space-y-4 rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
                <div className="flex items-center gap-2 border-b border-border pb-4">
                  <LinkIcon className="text-green-500" size={20} />
                  <h3 className="text-lg font-semibold text-foreground">
                    Media & Links
                  </h3>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <ImageIcon size={16} /> Cover Image URL
                    </label>
                    <div className="flex gap-3">
                      <input
                        value={form.image}
                        onChange={(e) =>
                          setForm({ ...form, image: e.target.value })
                        }
                        placeholder="https://..."
                        className="flex-1 rounded-xl border border-border bg-background px-4 py-3 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-foreground"
                      />
                    </div>
                    {form.image && (
                      <div className="mt-3 overflow-hidden rounded-xl border border-border bg-muted/30">
                        <img
                          src={form.image}
                          alt="Project Preview"
                          className="h-40 w-full object-cover opacity-90 transition-opacity hover:opacity-100"
                          onError={(e) =>
                            (e.currentTarget.style.display = "none")
                          }
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <FiGithub size={16} /> Github Repository
                      </label>
                      <input
                        value={form.githubUrl}
                        onChange={(e) =>
                          setForm({ ...form, githubUrl: e.target.value })
                        }
                        placeholder="https://github.com/..."
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-foreground"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <LinkIcon size={16} /> Live Demo URL
                      </label>
                      <input
                        value={form.liveUrl}
                        onChange={(e) =>
                          setForm({ ...form, liveUrl: e.target.value })
                        }
                        placeholder="https://..."
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-foreground"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Descriptions Section */}
              <div className="space-y-4 rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
                <div className="flex items-center gap-2 border-b border-border pb-4">
                  <FileText className="text-orange-500" size={20} />
                  <h3 className="text-lg font-semibold text-foreground">
                    Descriptions
                  </h3>
                </div>

                <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Short Summary
                    </label>
                    <textarea
                      rows={2}
                      value={form.description}
                      onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                      }
                      placeholder="Brief 1-2 sentence overview of the project..."
                      className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Detailed Description
                    </label>
                    <textarea
                      rows={5}
                      value={form.longDescription}
                      onChange={(e) =>
                        setForm({ ...form, longDescription: e.target.value })
                      }
                      placeholder="Comprehensive details about the project, the problem it solves, and your approach..."
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-foreground"
                    />
                  </div>
                </div>
              </div>

              {/* Arrays Section */}
              <div className="space-y-6 rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
                <div className="flex items-center gap-2 border-b border-border pb-4">
                  <Layers className="text-purple-500" size={20} />
                  <h3 className="text-lg font-semibold text-foreground">
                    Technical & Features
                  </h3>
                </div>

                <div className="space-y-8">
                  <StringArrayEditor
                    title="Technologies Used"
                    icon={<Tag size={16} className="text-blue-500" />}
                    values={form.technologies}
                    onChange={(items) =>
                      setForm({ ...form, technologies: items })
                    }
                    placeholder="e.g. React, Node.js, MongoDB"
                  />

                  <StringArrayEditor
                    title="Key Features"
                    icon={<CheckSquare size={16} className="text-green-500" />}
                    values={form.keyFeatures}
                    onChange={(items) =>
                      setForm({ ...form, keyFeatures: items })
                    }
                    placeholder="e.g. Real-time chat integration"
                  />

                  <StringArrayEditor
                    title="My Responsibilities"
                    icon={<LayoutList size={16} className="text-orange-500" />}
                    values={form.responsibilities}
                    onChange={(items) =>
                      setForm({ ...form, responsibilities: items })
                    }
                    placeholder="e.g. Designed the database architecture"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Preview (Hidden on small screens) */}
          <div className="hidden flex-col border-l border-border bg-muted/10 lg:flex overflow-hidden">
            {/* <div className="flex-1 overflow-y-auto p-6">
              <ProjectPreview project={form} />
            </div> */}

            {/* Desktop Action Buttons */}
            <div className="shrink-0 border-t border-border bg-card p-6 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 rounded-xl border border-border bg-background px-5 py-3 font-medium transition-colors hover:bg-muted text-foreground"
                >
                  Cancel
                </button>
                <button
                  onClick={save}
                  disabled={saving}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white shadow-md transition-all hover:bg-blue-700 disabled:opacity-70"
                >
                  <Save size={18} />
                  {saving ? "Saving..." : "Save Project"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Action Buttons (Visible only on small screens) */}
        <div className="shrink-0 border-t border-border bg-card p-4 lg:hidden">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl border border-border bg-background px-5 py-3 font-medium transition-colors hover:bg-muted text-foreground"
            >
              Cancel
            </button>
            <button
              onClick={save}
              disabled={saving}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-medium text-white shadow-md transition-all hover:bg-blue-700 disabled:opacity-70"
            >
              <Save size={18} />
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
