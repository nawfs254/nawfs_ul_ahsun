"use client";

import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  Briefcase,
  Calendar,
  MapPin,
  CheckCircle,
  X,
  Loader2,
} from "lucide-react";
import { WorkExperienceItem } from "@/data/portfolioData";

interface ExperienceTabProps {
  initialExperiences: WorkExperienceItem[];
  onRefresh: () => Promise<void>;
}

export default function ExperienceTab({
  initialExperiences,
  onRefresh,
}: ExperienceTabProps) {
  const [experiences, setExperiences] = useState<WorkExperienceItem[]>(
    initialExperiences || []
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);

  const openCreateModal = () => {
    setEditingExp({
      role: "",
      company: "",
      location: "Dhaka, Bangladesh",
      period: "2024 – Present",
      startDate: "2024-10-01",
      endDate: null,
      current: true,
      type: "Full-Time",
      summary: "",
      responsibilities: [""],
      techStack: ["React", "JavaScript"],
    });
    setIsModalOpen(true);
  };

  const openEditModal = (exp: WorkExperienceItem, idx: number) => {
    setEditingExp({
      ...exp,
      _originalIndex: idx,
      responsibilities: exp.responsibilities?.length ? exp.responsibilities : [""],
      techStack: exp.techStack?.length ? exp.techStack : [""],
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExp) return;
    setSaving(true);

    try {
      let updatedList = [...experiences];
      if (editingExp._originalIndex !== undefined) {
        const idx = editingExp._originalIndex;
        delete editingExp._originalIndex;
        updatedList[idx] = editingExp;
      } else {
        delete editingExp._originalIndex;
        updatedList.unshift(editingExp);
      }

      // Re-save entire collection to preserve custom ordering
      const res = await fetch("/api/admin/data/experiences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingExp),
      });

      if (!res.ok) throw new Error("Failed to save experience");

      setIsModalOpen(false);
      await onRefresh();
      const updatedRes = await fetch("/api/admin/data/experiences");
      const updatedData = await updatedRes.json();
      if (updatedData.data) setExperiences(updatedData.data);
    } catch (err: any) {
      alert(err.message || "Failed to save experience");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (exp: any, idx: number) => {
    if (!confirm(`Delete experience "${exp.role} at ${exp.company}"?`)) return;
    setDeletingIndex(idx);

    try {
      const id = exp._id;
      if (id) {
        await fetch(`/api/admin/data/experiences?id=${id}`, { method: "DELETE" });
      }
      setExperiences(experiences.filter((_, i) => i !== idx));
      await onRefresh();
    } catch (err: any) {
      alert(err.message || "Failed to delete experience");
    } finally {
      setDeletingIndex(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Work Experience & Leadership</h2>
          <p className="text-sm text-muted-foreground">
            Manage professional employment, internships, and roles ({experiences.length} in MongoDB).
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all cursor-pointer shrink-0"
        >
          <Plus size={16} /> Add Experience
        </button>
      </div>

      <div className="space-y-4">
        {experiences.map((exp: any, idx: number) => (
          <div
            key={exp._id || idx}
            className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs flex flex-col md:flex-row md:items-start justify-between gap-4 hover:border-blue-500/40 transition-all"
          >
            <div className="space-y-2 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-base text-foreground">{exp.role}</h3>
                <span className="text-sm text-muted-foreground font-medium">@ {exp.company}</span>
                <span className="rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 px-2 py-0.5 text-[11px] font-semibold">
                  {exp.type}
                </span>
                {exp.current && (
                  <span className="rounded-md bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20 px-2 py-0.5 text-[11px] font-semibold">
                    Current
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar size={13} /> {exp.period}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={13} /> {exp.location}
                </span>
              </div>

              <p className="text-xs text-muted-foreground/90 pt-1">{exp.summary}</p>

              {/* Responsibilities */}
              {exp.responsibilities?.length > 0 && (
                <ul className="list-disc list-inside text-xs text-muted-foreground/80 space-y-1 pt-1">
                  {exp.responsibilities.slice(0, 3).map((r: string, rIdx: number) => (
                    <li key={rIdx} className="line-clamp-1">
                      {r}
                    </li>
                  ))}
                  {exp.responsibilities.length > 3 && (
                    <li className="text-[11px] font-semibold text-blue-500 list-none">
                      +{exp.responsibilities.length - 3} more responsibilities...
                    </li>
                  )}
                </ul>
              )}

              {/* Tech stack */}
              <div className="flex flex-wrap gap-1 pt-2">
                {(exp.techStack || []).map((tech: string, tIdx: number) => (
                  <span
                    key={tIdx}
                    className="rounded bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 self-end md:self-start">
              <button
                onClick={() => openEditModal(exp, idx)}
                className="p-2 text-blue-600 hover:bg-blue-500/10 rounded-lg cursor-pointer"
                title="Edit Experience"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => handleDelete(exp, idx)}
                disabled={deletingIndex === idx}
                className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg cursor-pointer"
                title="Delete Experience"
              >
                {deletingIndex === idx ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Trash2 size={16} />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && editingExp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-3xl border border-border bg-card p-6 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-5">
              <h3 className="text-lg font-bold text-foreground">
                {editingExp._id ? "Edit Work Experience" : "Add Work Experience"}
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
                    Job Title / Role
                  </label>
                  <input
                    type="text"
                    required
                    value={editingExp.role || ""}
                    onChange={(e) => setEditingExp({ ...editingExp, role: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    required
                    value={editingExp.company || ""}
                    onChange={(e) => setEditingExp({ ...editingExp, company: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={editingExp.location || ""}
                    onChange={(e) => setEditingExp({ ...editingExp, location: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Period String (e.g. October 2024 – Present)
                  </label>
                  <input
                    type="text"
                    value={editingExp.period || ""}
                    onChange={(e) => setEditingExp({ ...editingExp, period: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Type
                  </label>
                  <select
                    value={editingExp.type || "Full-Time"}
                    onChange={(e) => setEditingExp({ ...editingExp, type: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Internship">Internship</option>
                    <option value="Leadership / Academic">Leadership / Academic</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingExp.current || false}
                      onChange={(e) => setEditingExp({ ...editingExp, current: e.target.checked })}
                      className="rounded border-border"
                    />
                    <span className="font-semibold">Currently Working Here</span>
                  </label>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Role Summary
                  </label>
                  <textarea
                    rows={2}
                    value={editingExp.summary || ""}
                    onChange={(e) => setEditingExp({ ...editingExp, summary: e.target.value })}
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Tech Stack (comma separated)
                  </label>
                  <input
                    type="text"
                    value={(editingExp.techStack || []).join(", ")}
                    onChange={(e) =>
                      setEditingExp({
                        ...editingExp,
                        techStack: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Responsibilities list */}
              <div className="pt-3 border-t border-border/60 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-muted-foreground">
                    Responsibilities / Key Achievements
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setEditingExp({
                        ...editingExp,
                        responsibilities: [...(editingExp.responsibilities || []), ""],
                      })
                    }
                    className="text-xs text-blue-600 font-semibold cursor-pointer"
                  >
                    + Add Bullet
                  </button>
                </div>

                {(editingExp.responsibilities || []).map((resp: string, rIdx: number) => (
                  <div key={rIdx} className="flex gap-2">
                    <input
                      type="text"
                      value={resp}
                      onChange={(e) => {
                        const updated = [...editingExp.responsibilities];
                        updated[rIdx] = e.target.value;
                        setEditingExp({ ...editingExp, responsibilities: updated });
                      }}
                      className="flex-1 rounded-xl border border-border bg-background px-3 py-1.5 text-xs outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = editingExp.responsibilities.filter(
                          (_: any, idx: number) => idx !== rIdx
                        );
                        setEditingExp({ ...editingExp, responsibilities: updated });
                      }}
                      className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>

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
                  {saving ? "Saving..." : "Save to MongoDB"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
