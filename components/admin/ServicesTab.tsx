"use client";

import React, { useState } from "react";
import { Plus, Trash2, Edit2, Layers, X, Loader2 } from "lucide-react";

interface ServicesTabProps {
  initialServices: any[];
  onRefresh: () => Promise<void>;
}

export default function ServicesTab({ initialServices, onRefresh }: ServicesTabProps) {
  const [services, setServices] = useState<any[]>(initialServices || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const openCreateModal = () => {
    setEditingService({ title: "", description: "", icon: "Code2" });
    setIsModalOpen(true);
  };

  const openEditModal = (s: any) => {
    setEditingService({ ...s });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    setSaving(true);

    try {
      const isExisting = Boolean(editingService._id);
      const method = isExisting ? "PUT" : "POST";

      const res = await fetch("/api/admin/data/services", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingService),
      });

      if (!res.ok) throw new Error("Failed to save service");

      setIsModalOpen(false);
      await onRefresh();
      const updatedRes = await fetch("/api/admin/data/services");
      const updatedData = await updatedRes.json();
      if (updatedData.data) setServices(updatedData.data);
    } catch (err: any) {
      alert(err.message || "Failed to save service");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (s: any) => {
    if (!confirm(`Delete "${s.title}"?`)) return;
    setDeletingId(s._id);

    try {
      const res = await fetch(`/api/admin/data/services?id=${s._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete service");
      setServices(services.filter((item: any) => item._id !== s._id));
      await onRefresh();
    } catch (err: any) {
      alert(err.message || "Failed to delete service");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Services Offered</h2>
          <p className="text-sm text-muted-foreground">
            Manage offered software engineering & consulting services ({services.length} in MongoDB).
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all cursor-pointer shrink-0"
        >
          <Plus size={16} /> Add Service
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((s: any, idx: number) => (
          <div
            key={s._id || idx}
            className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs flex flex-col justify-between hover:border-blue-500/40 transition-all"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-blue-600 dark:text-blue-400 font-semibold">
                  Icon: {s.icon || "Code2"}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(s)}
                    className="p-1.5 text-blue-600 hover:bg-blue-500/10 rounded-lg cursor-pointer"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(s)}
                    disabled={deletingId === s._id}
                    className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg cursor-pointer"
                  >
                    {deletingId === s._id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  </button>
                </div>
              </div>
              <h3 className="font-bold text-base text-foreground mt-2">{s.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{s.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-5">
              <h3 className="text-lg font-bold text-foreground">
                {editingService._id ? "Edit Service" : "Add New Service"}
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
                  Service Title
                </label>
                <input
                  type="text"
                  required
                  value={editingService.title || ""}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  placeholder="e.g. Frontend Engineering"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Icon Identifier (Code2, Layers, Database, Palette)
                </label>
                <input
                  type="text"
                  value={editingService.icon || ""}
                  onChange={(e) => setEditingService({ ...editingService, icon: e.target.value })}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={editingService.description || ""}
                  onChange={(e) =>
                    setEditingService({ ...editingService, description: e.target.value })
                  }
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
