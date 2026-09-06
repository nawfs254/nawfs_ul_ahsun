"use client";

import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Edit2,
  Code2,
  X,
  Loader2,
  Check,
} from "lucide-react";
import { SkillItem } from "@/data/portfolioData";

interface SkillsTabProps {
  initialSkills: SkillItem[];
  onRefresh: () => Promise<void>;
}

const CATEGORIES = [
  "Programming Languages",
  "Web Development",
  "Databases",
  "Design Software",
  "Media & Audio",
  "Tools & Productivity",
];

export default function SkillsTab({ initialSkills, onRefresh }: SkillsTabProps) {
  const [skills, setSkills] = useState<SkillItem[]>(initialSkills || []);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredSkills = skills.filter((s) =>
    activeCategory === "All" ? true : s.category === activeCategory
  );

  const openCreateModal = () => {
    setEditingSkill({
      name: "",
      category: activeCategory === "All" ? "Web Development" : activeCategory,
      level: 85,
      icon: "SiReact",
      iconLibrary: "si",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (skill: any) => {
    setEditingSkill({ ...skill });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill) return;
    setSaving(true);

    try {
      const isExisting = skills.some(
        (s: any) => (s._id && s._id === editingSkill._id) || (s.name && s.name === editingSkill.name && s._id)
      );

      const method = isExisting ? "PUT" : "POST";

      const res = await fetch("/api/admin/data/skills", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingSkill),
      });

      if (!res.ok) throw new Error("Failed to save skill");

      setIsModalOpen(false);
      await onRefresh();
      const updatedRes = await fetch("/api/admin/data/skills");
      const updatedData = await updatedRes.json();
      if (updatedData.data) setSkills(updatedData.data);
    } catch (err: any) {
      alert(err.message || "Failed to save skill");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (skill: any) => {
    const id = skill._id || skill.name;
    if (!confirm(`Delete skill "${skill.name}"?`)) return;
    setDeletingId(id);

    try {
      const res = await fetch(`/api/admin/data/skills?id=${skill._id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete skill");
      setSkills(skills.filter((s: any) => (s._id || s.name) !== id));
      await onRefresh();
    } catch (err: any) {
      alert(err.message || "Failed to delete skill");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Technical Skills & Stacks</h2>
          <p className="text-sm text-muted-foreground">
            Manage skills, proficiencies, and icon sets ({skills.length} in MongoDB).
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all cursor-pointer shrink-0"
        >
          <Plus size={16} /> Add Skill
        </button>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {["All", ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
              activeCategory === cat
                ? "bg-blue-600 text-white shadow-xs"
                : "border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted/50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredSkills.map((skill: any, idx: number) => {
          const id = skill._id || idx;
          return (
            <div
              key={id}
              className="rounded-2xl border border-border/80 bg-card p-4 shadow-xs flex flex-col justify-between hover:border-blue-500/40 transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-bold text-sm text-foreground">{skill.name}</h3>
                  <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                    {skill.level || 85}%
                  </span>
                </div>

                <span className="text-[11px] text-muted-foreground block mt-0.5">
                  {skill.category}
                </span>

                {/* Progress bar */}
                <div className="w-full h-1.5 rounded-full bg-muted mt-2.5 overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${skill.level || 85}%` }}
                  />
                </div>

                <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono mt-2">
                  <span>Icon: {skill.icon || "N/A"}</span>
                  <span>Lib: {skill.iconLibrary || "si"}</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-1 mt-3 pt-2 border-t border-border/60">
                <button
                  onClick={() => openEditModal(skill)}
                  className="p-1.5 text-blue-600 hover:bg-blue-500/10 rounded-lg cursor-pointer"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  onClick={() => handleDelete(skill)}
                  disabled={deletingId === (skill._id || skill.name)}
                  className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg cursor-pointer"
                >
                  {deletingId === (skill._id || skill.name) ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Trash2 size={14} />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {isModalOpen && editingSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-5">
              <h3 className="text-lg font-bold text-foreground">
                {editingSkill._id ? "Edit Skill" : "Add New Skill"}
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
                  Skill Name
                </label>
                <input
                  type="text"
                  required
                  value={editingSkill.name || ""}
                  onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                  placeholder="e.g. Next.js, Docker, Python"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Category
                </label>
                <select
                  value={editingSkill.category || "Web Development"}
                  onChange={(e) =>
                    setEditingSkill({ ...editingSkill, category: e.target.value })
                  }
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-blue-500"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-muted-foreground">
                    Proficiency Level
                  </label>
                  <span className="text-xs font-bold text-blue-600">
                    {editingSkill.level || 80}%
                  </span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={editingSkill.level || 80}
                  onChange={(e) =>
                    setEditingSkill({ ...editingSkill, level: Number(e.target.value) })
                  }
                  className="w-full cursor-pointer accent-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Icon Name
                  </label>
                  <input
                    type="text"
                    value={editingSkill.icon || ""}
                    onChange={(e) =>
                      setEditingSkill({ ...editingSkill, icon: e.target.value })
                    }
                    placeholder="SiNextdotjs"
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1">
                    Library
                  </label>
                  <select
                    value={editingSkill.iconLibrary || "si"}
                    onChange={(e) =>
                      setEditingSkill({ ...editingSkill, iconLibrary: e.target.value })
                    }
                    className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="si">SimpleIcons (si)</option>
                    <option value="fa6">FontAwesome 6 (fa6)</option>
                    <option value="tb">Tabler (tb)</option>
                    <option value="ri">Remix (ri)</option>
                    <option value="lu">Lucide (lu)</option>
                  </select>
                </div>
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
