"use client";

import React, { useState } from "react";
import {
  Save,
  Plus,
  Trash2,
  User,
  Mail,
  Phone,
  MapPin,
  FileText,
  Globe,
  Loader2,
  CheckCircle,
} from "lucide-react";
import ImageUpload from "./ImageUpload";

interface PersonalInfoTabProps {
  initialData: any;
  onSave: (updatedData: any) => Promise<void>;
}

export default function PersonalInfoTab({ initialData, onSave }: PersonalInfoTabProps) {
  const [data, setData] = useState(initialData || {});
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(data);
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  // Bio Paragraph Handlers
  const handleBioChange = (index: number, val: string) => {
    const updated = [...(data.bio || [])];
    updated[index] = val;
    setData({ ...data, bio: updated });
  };

  const addBioParagraph = () => {
    setData({ ...data, bio: [...(data.bio || []), ""] });
  };

  const removeBioParagraph = (index: number) => {
    setData({ ...data, bio: (data.bio || []).filter((_: any, i: number) => i !== index) });
  };

  // Social Links Handlers
  const handleSocialChange = (index: number, field: string, val: string) => {
    const updated = [...(data.socialLinks || [])];
    updated[index] = { ...updated[index], [field]: val };
    setData({ ...data, socialLinks: updated });
  };

  const addSocialLink = () => {
    setData({
      ...data,
      socialLinks: [
        ...(data.socialLinks || []),
        { name: "New Link", url: "https://", icon: "FaGlobe", iconLibrary: "fa6" },
      ],
    });
  };

  const removeSocialLink = (index: number) => {
    setData({
      ...data,
      socialLinks: (data.socialLinks || []).filter((_: any, i: number) => i !== index),
    });
  };

  // Stats Handlers
  const handleStatChange = (index: number, field: string, val: string) => {
    const updated = [...(data.stats || [])];
    updated[index] = { ...updated[index], [field]: val };
    setData({ ...data, stats: updated });
  };

  const addStat = () => {
    setData({
      ...data,
      stats: [...(data.stats || []), { label: "New Metric", value: "10+" }],
    });
  };

  const removeStat = (index: number) => {
    setData({
      ...data,
      stats: (data.stats || []).filter((_: any, i: number) => i !== index),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Personal Profile & Hero</h2>
          <p className="text-sm text-muted-foreground">
            Update personal info, biography, contact, social links, and key stats in MongoDB.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {savedMessage && (
            <span className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400 font-medium bg-green-500/10 border border-green-500/20 px-3 py-1.5 rounded-full">
              <CheckCircle size={14} /> Saved in MongoDB!
            </span>
          )}
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all disabled:opacity-50 cursor-pointer"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {saving ? "Saving Changes..." : "Save to MongoDB"}
          </button>
        </div>
      </div>

      {/* Basic Profile Details */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
        <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
          <User size={18} className="text-blue-500" /> General Identity
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={data.name || ""}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Professional Title
            </label>
            <input
              type="text"
              value={data.title || ""}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Hero Tagline
            </label>
            <input
              type="text"
              value={data.tagline || ""}
              onChange={(e) => setData({ ...data, tagline: e.target.value })}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Hiring Status Badge
            </label>
            <input
              type="text"
              value={data.hiringStatus || ""}
              onChange={(e) => setData({ ...data, hiringStatus: e.target.value })}
              placeholder="Available for Hire"
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <ImageUpload
              label="Profile Image"
              folder="profile"
              aspectRatioHint="1:1 square portrait recommended"
              value={data.profileImage || ""}
              onChange={(url) => setData({ ...data, profileImage: url })}
              placeholder="/assets/images/nawfs.jpg"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              CV / Resume PDF URL
            </label>
            <input
              type="text"
              value={data.cvPdfUrl || ""}
              onChange={(e) => setData({ ...data, cvPdfUrl: e.target.value })}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Portfolio Domain URL
            </label>
            <input
              type="text"
              value={data.portfolioUrl || ""}
              onChange={(e) => setData({ ...data, portfolioUrl: e.target.value })}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Contact & Locations */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
        <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
          <Mail size={18} className="text-blue-500" /> Contact & Location Details
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Primary Email
            </label>
            <input
              type="email"
              value={data.email || ""}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Phone Number
            </label>
            <input
              type="text"
              value={data.phone || ""}
              onChange={(e) => setData({ ...data, phone: e.target.value })}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Location Summary
            </label>
            <input
              type="text"
              value={data.location || ""}
              onChange={(e) => setData({ ...data, location: e.target.value })}
              placeholder="Dhaka, Bangladesh || Remote"
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Full Physical Address
            </label>
            <input
              type="text"
              value={data.address || ""}
              onChange={(e) => setData({ ...data, address: e.target.value })}
              className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Objective & Bio Paragraphs */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
        <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
          <FileText size={18} className="text-blue-500" /> Career Objective & Bio Paragraphs
        </h3>

        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1">
            Career Objective
          </label>
          <textarea
            rows={3}
            value={data.objective || ""}
            onChange={(e) => setData({ ...data, objective: e.target.value })}
            className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-sm outline-none focus:border-blue-500"
          />
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-muted-foreground">
              About Bio Paragraphs ({data.bio?.length || 0})
            </label>
            <button
              type="button"
              onClick={addBioParagraph}
              className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 font-semibold cursor-pointer"
            >
              <Plus size={14} /> Add Paragraph
            </button>
          </div>

          {(data.bio || []).map((paragraph: string, idx: number) => (
            <div key={idx} className="flex gap-2 items-start">
              <textarea
                rows={3}
                value={paragraph}
                onChange={(e) => handleBioChange(idx, e.target.value)}
                placeholder={`Paragraph ${idx + 1}...`}
                className="flex-1 rounded-xl border border-border bg-background px-3.5 py-2 text-sm outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={() => removeBioParagraph(idx)}
                className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                title="Remove paragraph"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Key Stats */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-foreground">
            Hero Stat Metrics (e.g. 2+ Years, 5+ Built)
          </h3>
          <button
            type="button"
            onClick={addStat}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 font-semibold cursor-pointer"
          >
            <Plus size={14} /> Add Metric
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(data.stats || []).map((stat: any, idx: number) => (
            <div
              key={idx}
              className="flex items-center gap-2 rounded-xl border border-border bg-background p-3"
            >
              <div className="flex-1 space-y-1">
                <input
                  type="text"
                  value={stat.label || ""}
                  onChange={(e) => handleStatChange(idx, "label", e.target.value)}
                  placeholder="Metric Label"
                  className="w-full text-xs font-medium border-b border-border/50 pb-0.5 outline-none bg-transparent"
                />
                <input
                  type="text"
                  value={stat.value || ""}
                  onChange={(e) => handleStatChange(idx, "value", e.target.value)}
                  placeholder="e.g. 2+ Years"
                  className="w-full text-sm font-bold outline-none bg-transparent"
                />
              </div>
              <button
                type="button"
                onClick={() => removeStat(idx)}
                className="p-1 text-red-500 hover:bg-red-500/10 rounded-lg cursor-pointer"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Social Links */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
            <Globe size={18} className="text-blue-500" /> Social Links & Profiles
          </h3>
          <button
            type="button"
            onClick={addSocialLink}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 font-semibold cursor-pointer"
          >
            <Plus size={14} /> Add Social Link
          </button>
        </div>

        <div className="space-y-3">
          {(data.socialLinks || []).map((social: any, idx: number) => (
            <div
              key={idx}
              className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center rounded-xl border border-border bg-background p-3"
            >
              <div>
                <label className="text-[10px] text-muted-foreground font-semibold">Name</label>
                <input
                  type="text"
                  value={social.name || ""}
                  onChange={(e) => handleSocialChange(idx, "name", e.target.value)}
                  placeholder="GitHub / LinkedIn"
                  className="w-full rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[10px] text-muted-foreground font-semibold">URL</label>
                <input
                  type="text"
                  value={social.url || ""}
                  onChange={(e) => handleSocialChange(idx, "url", e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs outline-none"
                />
              </div>

              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <label className="text-[10px] text-muted-foreground font-semibold">Icon</label>
                  <input
                    type="text"
                    value={social.icon || ""}
                    onChange={(e) => handleSocialChange(idx, "icon", e.target.value)}
                    placeholder="FaGithub"
                    className="w-full rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeSocialLink(idx)}
                  className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg cursor-pointer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}
