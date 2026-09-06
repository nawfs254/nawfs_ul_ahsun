"use client";

import React, { useState } from "react";
import { Key, Lock, CheckCircle, Loader2 } from "lucide-react";

export default function AccountTab() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      return;
    }

    if (newPassword.length < 4) {
      setMessage({ type: "error", text: "Password must be at least 4 characters long" });
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("/api/admin/auth/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update password");
      }

      setMessage({ type: "success", text: "Password updated successfully in MongoDB!" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Failed to change password" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl space-y-6">
      <div className="border-b border-border/60 pb-5">
        <h2 className="text-xl font-bold tracking-tight">Admin Account Security</h2>
        <p className="text-sm text-muted-foreground">
          Update the master password for the single-user MongoDB admin account.
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl border text-sm flex items-center gap-2 ${
            message.type === "success"
              ? "bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400"
              : "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400"
          }`}
        >
          {message.type === "success" && <CheckCircle size={16} />}
          <span>{message.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1">
            Admin Username
          </label>
          <input
            type="text"
            disabled
            value="admin"
            className="w-full rounded-xl border border-border bg-muted/40 px-3.5 py-2 text-sm text-muted-foreground font-mono cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1">
            Current Password
          </label>
          <div className="relative">
            <Key size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-border bg-background pl-10 pr-3.5 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1">
            New Password
          </label>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New secure password"
              className="w-full rounded-xl border border-border bg-background pl-10 pr-3.5 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1">
            Confirm New Password
          </label>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repeat new password"
              className="w-full rounded-xl border border-border bg-background pl-10 pr-3.5 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm disabled:opacity-50 cursor-pointer"
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            {saving ? "Updating Password..." : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
}
