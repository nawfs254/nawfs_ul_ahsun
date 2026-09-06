"use client";

import React, { useState } from "react";
import { Plus, Trash2, Edit2, Palette, X, Loader2 } from "lucide-react";

interface HobbiesTabProps {
  initialHobbies: any[];
  onRefresh: () => Promise<void>;
}

export default function HobbiesTab({ initialHobbies, onRefresh }: HobbiesTabProps) {
  const [hobbies, setHobbies] = useState<any[]>(initialHobbies || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHobby, setEditingHobby] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const openCreateModal = () => {
    setEditingHobby({ name: "", icon: "FaGuitar", iconLibrary: "fa6" });
    setIsModalOpen(true);
  };

  const openEditModal = (h: any) => {
    setEditingHobby({ ...h });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingHobby) return;
    setSaving(true);

    try {
      const isExisting = Boolean(editingHobby._id);
      const method = isExisting ? "PUT" : "POST";

      const res = await fetch("/api/admin/data/hobbies", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingHobby),
      });

      if (!res.ok) throw new Error("Failed to save hobby");

      setIsModalOpen(false);
      await onRefresh();
      const updatedRes = await fetch("/api/admin/data/hobbies");
      const updatedData = await updatedRes.json();
      if (updatedData.data) setHobbies(updatedData.data);
    } catch (err: any) {
      alert(err.message || "Failed to save hobby");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (h: any) => {
    if (!confirm(`Delete "${h.name}"?`)) return;
    setDeletingId(h._id);

    try {
      const res = await fetch(`/api/admin/data/hobbies?id=${h._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete hobby");
      setHobbies(hobbies.filter((item: any) => item._id !== h._id));
      await onRefresh();
    } catch (err: any) {
      alert(err.message || "Failed to delete hobby");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Hobbies & Creative Interests</h2>
          <p className="text-sm text-muted-foreground">
            Manage personal interests, musical pursuits, and hobbies ({hobbies.length} in MongoDB).
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all cursor-pointer shrink-0"
        >
          <Plus size={16} /> Add Hobby
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {hobbies.map((h: any, idx: number) => (
          <div
            key={h._id || idx}
            className="rounded-2xl border border-border/80 bg-card p-4 shadow-xs flex items-center justify-between hover:border-blue-500/40 transition-all"
          >
            <div>
              <h3 className="font-bold text-sm text-foreground">{h.name}</h3>
              <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                {h.icon} ({h.iconLibrary})
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => openEditModal(h)}
                className="p-1.5 text-blue-600 hover:bg-blue-500/10 rounded-lg cursor-pointer"
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={() => handleDelete(h)}
                disabled={deletingId === h._id}
                className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg cursor-pointer"
              >
                {deletingId === h._id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && editingHobby && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="relative w-full max-w-sm rounded-3xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-5">
              <h3 className="text-lg font-bold text-foreground">
                {editingHobby._id ? "Edit Hobby" : "Add New Hobby"}
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
                  Hobby Name
                </label>
                <input
                  type="text"
                  required
                  value={editingHobby.name || ""}
                  onChange={(e) => setEditingHobby({ ...editingHobby, name: e.target.value })}
                  placeholder="e.g. Photography"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Icon Identifier (e.g. FaGuitar, FaMicrophone)
                </label>
                <input
                  type="text"
                  value={editingHobby.icon || ""}
                  onChange={(e) => setEditingHobby({ ...editingHobby, icon: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Icon Library
                </label>
                <select
                  value={editingHobby.iconLibrary || "fa6"}
                  onChange={(e) => setEditingHobby({ ...editingHobby, iconLibrary: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-blue-500"
                >
                  <option value="fa6">FontAwesome 6 (fa6)</option>
                  <option value="si">SimpleIcons (si)</option>
                  <option value="tb">Tabler (tb)</option>
                  <option value="ri">Remix (ri)</option>
                </select>
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
