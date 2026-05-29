"use client";

import { useEffect, useState } from "react";
import { User, Briefcase, Mail, MapPin, Link as LinkIcon, Image as ImageIcon, Library, Trash2, Plus, Save } from "lucide-react";

export default function PersonalInfoForm() {
  const [data, setData] = useState<any>(null);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const res = await fetch("/api/admin/personalinfo");

    const json = await res.json();

    setData(json);
  };

  const save = async () => {
    try {
      setSaving(true);

      await fetch("/api/admin/personalinfo", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      alert("Saved successfully!");
    } finally {
      setSaving(false);
    }
  };

  if (!data) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex items-center justify-between rounded-3xl bg-card p-6 shadow-sm border border-border">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Personal Info</h1>
          <p className="text-muted-foreground mt-1">Manage your public profile details</p>
        </div>

        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white shadow-md transition-all hover:bg-blue-700 disabled:opacity-70"
        >
          <Save size={18} />
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-12">
          <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
            <h2 className="mb-6 text-2xl font-semibold tracking-tight">Basic Information</h2>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <User size={16} /> Name
                </label>
                <input
                  value={data.name || ""}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Briefcase size={16} /> Title
                </label>
                <input
                  value={data.title || ""}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                  placeholder="Full Stack Developer"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Mail size={16} /> Email
                </label>
                <input
                  value={data.email || ""}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <MapPin size={16} /> Location
                </label>
                <input
                  value={data.location || ""}
                  onChange={(e) => setData({ ...data, location: e.target.value })}
                  placeholder="New York, USA"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-12">
          <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold tracking-tight">Contact Links</h2>
              <button
                onClick={() =>
                  setData({
                    ...data,
                    contactLinks: [
                      ...(data.contactLinks || []),
                      { name: "", icon: "", iconLibrary: "fa", url: "" },
                    ],
                  })
                }
                className="flex items-center gap-2 rounded-xl bg-blue-50/50 dark:bg-blue-900/20 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 transition-colors hover:bg-blue-100 dark:hover:bg-blue-900/40"
              >
                <Plus size={16} /> Add Link
              </button>
            </div>

            <div className="space-y-4">
              {(!data.contactLinks || data.contactLinks.length === 0) && (
                <div className="rounded-2xl border border-dashed border-border py-8 text-center text-muted-foreground">
                  No contact links added yet. Click "Add Link" to create one.
                </div>
              )}

              {data.contactLinks?.map((link: any, index: number) => (
                <div key={index} className="relative grid gap-4 rounded-2xl border border-border bg-background p-5 shadow-sm sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 items-end">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                      <LinkIcon size={14} /> Name
                    </label>
                    <input
                      value={link.name}
                      onChange={(e) => {
                        const updated = [...data.contactLinks];
                        updated[index].name = e.target.value;
                        setData({ ...data, contactLinks: updated });
                      }}
                      placeholder="e.g. GitHub"
                      className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                      <ImageIcon size={14} /> Icon Class
                    </label>
                    <input
                      value={link.icon}
                      onChange={(e) => {
                        const updated = [...data.contactLinks];
                        updated[index].icon = e.target.value;
                        setData({ ...data, contactLinks: updated });
                      }}
                      placeholder="e.g. fa-github"
                      className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                      <Library size={14} /> Icon Library
                    </label>
                    <input
                      value={link.iconLibrary}
                      onChange={(e) => {
                        const updated = [...data.contactLinks];
                        updated[index].iconLibrary = e.target.value;
                        setData({ ...data, contactLinks: updated });
                      }}
                      placeholder="e.g. fa"
                      className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div className="space-y-2 lg:col-span-2">
                    <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                      <LinkIcon size={14} /> URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        value={link.url}
                        onChange={(e) => {
                          const updated = [...data.contactLinks];
                          updated[index].url = e.target.value;
                          setData({ ...data, contactLinks: updated });
                        }}
                        placeholder="https://"
                        className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      />
                      <button
                        onClick={() => {
                          const updated = data.contactLinks.filter((_: any, i: number) => i !== index);
                          setData({ ...data, contactLinks: updated });
                        }}
                        className="flex shrink-0 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 hover:border-red-300 dark:border-red-900/30 dark:bg-red-900/20 dark:hover:bg-red-900/40 px-3 transition-colors"
                        title="Remove Link"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

