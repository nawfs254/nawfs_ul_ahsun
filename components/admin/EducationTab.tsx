"use client";

import React, { useState } from "react";
import { Plus, Trash2, Edit2, GraduationCap, X, Loader2 } from "lucide-react";
import { EducationItem } from "@/data/portfolioData";

interface EducationTabProps {
  initialEducation: EducationItem[];
  onRefresh: () => Promise<void>;
}

export default function EducationTab({
  initialEducation,
  onRefresh,
}: EducationTabProps) {
  const [education, setEducation] = useState<EducationItem[]>(
    initialEducation || []
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const openCreateModal = () => {
    setEditingEdu({
      degree: "",
      institution: "",
      location: "",
      year: "",
      grade: "",
      gradeScale: "",
      description: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (edu: any) => {
    setEditingEdu({ ...edu });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEdu) return;
    setSaving(true);

    try {
      const isExisting = Boolean(editingEdu._id);
      const method = isExisting ? "PUT" : "POST";

      const res = await fetch("/api/admin/data/education", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingEdu),
      });

      if (!res.ok) throw new Error("Failed to save education entry");

      setIsModalOpen(false);
      await onRefresh();
      const updatedRes = await fetch("/api/admin/data/education");
      const updatedData = await updatedRes.json();
      if (updatedData.data) setEducation(updatedData.data);
    } catch (err: any) {
      alert(err.message || "Failed to save education entry");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (edu: any) => {
    if (!confirm(`Delete "${edu.degree}"?`)) return;
    setDeletingId(edu._id);

    try {
      const res = await fetch(`/api/admin/data/education?id=${edu._id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete education entry");
      setEducation(education.filter((e: any) => e._id !== edu._id));
      await onRefresh();
    } catch (err: any) {
      alert(err.message || "Failed to delete education entry");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Academic Credentials & Education</h2>
          <p className="text-sm text-muted-foreground">
            Manage degrees, institutions, GPA scores, and academic achievements ({education.length} in MongoDB).
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all cursor-pointer shrink-0"
        >
          <Plus size={16} /> Add Degree
        </button>
      </div>

      <div className="space-y-4">
        {education.map((edu: any, idx: number) => (
          <div
            key={edu._id || idx}
            className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs flex flex-col md:flex-row md:items-start justify-between gap-4 hover:border-blue-500/40 transition-all"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <GraduationCap size={18} className="text-blue-500" />
                <h3 className="font-bold text-base text-foreground">{edu.degree}</h3>
                <span className="rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 px-2 py-0.5 text-[11px] font-semibold">
                  {edu.year}
                </span>
              </div>

              <p className="text-xs font-medium text-muted-foreground">
                {edu.institution} • {edu.location}
              </p>

              {edu.grade && (
                <p className="text-xs font-semibold text-foreground">
                  Score: <span className="font-mono text-blue-600">{edu.grade}</span> ({edu.gradeScale})
                </p>
              )}

              {edu.description && (
                <p className="text-xs text-muted-foreground pt-1">{edu.description}</p>
              )}
            </div>

            <div className="flex items-center gap-2 self-end md:self-start">
              <button
                onClick={() => openEditModal(edu)}
                className="p-2 text-blue-600 hover:bg-blue-500/10 rounded-lg cursor-pointer"
              >
                <Edit2 size={16} />
              </button>
              <button
                onClick={() => handleDelete(edu)}
                disabled={deletingId === edu._id}
                className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg cursor-pointer"
              >
                {deletingId === edu._id ? (
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
      {isModalOpen && editingEdu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="relative w-full max-w-xl rounded-3xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-5">
              <h3 className="text-lg font-bold text-foreground">
                {editingEdu._id ? "Edit Academic Degree" : "Add Academic Degree"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:bg-muted"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Degree / Certificate Title
                </label>
                <input
                  type="text"
                  required
                  value={editingEdu.degree || ""}
                  onChange={(e) => setEditingEdu({ ...editingEdu, degree: e.target.value })}
                  placeholder="e.g. Bachelor of Technology in Computer Science"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Institution / University
                </label>
                <input
                  type="text"
                  required
                  value={editingEdu.institution || ""}
                  onChange={(e) => setEditingEdu({ ...editingEdu, institution: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={editingEdu.location || ""}
                    onChange={(e) => setEditingEdu({ ...editingEdu, location: e.target.value })}
                    placeholder="Punjab, India"
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Years Attended
                  </label>
                  <input
                    type="text"
                    value={editingEdu.year || ""}
                    onChange={(e) => setEditingEdu({ ...editingEdu, year: e.target.value })}
                    placeholder="2019 – 2023"
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Grade / Result
                  </label>
                  <input
                    type="text"
                    value={editingEdu.grade || ""}
                    onChange={(e) => setEditingEdu({ ...editingEdu, grade: e.target.value })}
                    placeholder="CGPA 7.68 / 10"
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Grade Scale
                  </label>
                  <input
                    type="text"
                    value={editingEdu.gradeScale || ""}
                    onChange={(e) => setEditingEdu({ ...editingEdu, gradeScale: e.target.value })}
                    placeholder="10.0 scale"
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Description / Major Courses
                </label>
                <textarea
                  rows={3}
                  value={editingEdu.description || ""}
                  onChange={(e) => setEditingEdu({ ...editingEdu, description: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
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
