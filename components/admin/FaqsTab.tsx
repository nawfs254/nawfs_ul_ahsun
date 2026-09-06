"use client";

import React, { useState } from "react";
import { Plus, Trash2, Edit2, HelpCircle, X, Loader2 } from "lucide-react";

interface FaqsTabProps {
  initialFaqs: any[];
  onRefresh: () => Promise<void>;
}

export default function FaqsTab({ initialFaqs, onRefresh }: FaqsTabProps) {
  const [faqs, setFaqs] = useState<any[]>(initialFaqs || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<any | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const openCreateModal = () => {
    setEditingFaq({ question: "", answer: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (f: any) => {
    setEditingFaq({ ...f });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaq) return;
    setSaving(true);

    try {
      const isExisting = Boolean(editingFaq._id);
      const method = isExisting ? "PUT" : "POST";

      const res = await fetch("/api/admin/data/faqs", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingFaq),
      });

      if (!res.ok) throw new Error("Failed to save FAQ");

      setIsModalOpen(false);
      await onRefresh();
      const updatedRes = await fetch("/api/admin/data/faqs");
      const updatedData = await updatedRes.json();
      if (updatedData.data) setFaqs(updatedData.data);
    } catch (err: any) {
      alert(err.message || "Failed to save FAQ");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (f: any) => {
    if (!confirm(`Delete this FAQ?`)) return;
    setDeletingId(f._id);

    try {
      const res = await fetch(`/api/admin/data/faqs?id=${f._id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete FAQ");
      setFaqs(faqs.filter((item: any) => item._id !== f._id));
      await onRefresh();
    } catch (err: any) {
      alert(err.message || "Failed to delete FAQ");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Frequently Asked Questions</h2>
          <p className="text-sm text-muted-foreground">
            Manage public FAQs in the contact & inquiry section ({faqs.length} in MongoDB).
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all cursor-pointer shrink-0"
        >
          <Plus size={16} /> Add FAQ
        </button>
      </div>

      <div className="space-y-3">
        {faqs.map((f: any, idx: number) => (
          <div
            key={f._id || idx}
            className="rounded-2xl border border-border/80 bg-card p-5 shadow-xs flex items-start justify-between gap-4 hover:border-blue-500/40 transition-all"
          >
            <div className="space-y-1 flex-1">
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <HelpCircle size={16} className="text-blue-500 shrink-0" />
                {f.question}
              </h3>
              <p className="text-xs text-muted-foreground pl-6">{f.answer}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => openEditModal(f)}
                className="p-1.5 text-blue-600 hover:bg-blue-500/10 rounded-lg cursor-pointer"
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={() => handleDelete(f)}
                disabled={deletingId === f._id}
                className="p-1.5 text-red-500 hover:bg-red-500/10 rounded-lg cursor-pointer"
              >
                {deletingId === f._id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && editingFaq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border pb-4 mb-5">
              <h3 className="text-lg font-bold text-foreground">
                {editingFaq._id ? "Edit FAQ" : "Add New FAQ"}
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
                  Question
                </label>
                <input
                  type="text"
                  required
                  value={editingFaq.question || ""}
                  onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                  placeholder="e.g. What is your primary tech stack?"
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1">
                  Answer
                </label>
                <textarea
                  rows={4}
                  required
                  value={editingFaq.answer || ""}
                  onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
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
