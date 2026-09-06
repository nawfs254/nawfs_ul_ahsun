"use client";

import React from "react";
import {
  FolderGit2,
  Briefcase,
  Code2,
  GraduationCap,
  Layers,
  Palette,
  HelpCircle,
  User,
  Database,
  ArrowRight,
  ExternalLink,
  Mail,
} from "lucide-react";
import Link from "next/link";

interface OverviewTabProps {
  stats: Record<string, number>;
  unreadMessages?: number;
  onSelectTab: (tabId: string) => void;
}

export default function OverviewTab({ stats, unreadMessages = 0, onSelectTab }: OverviewTabProps) {
  const cards = [
    {
      id: "messages",
      label: "Messages & Inbox",
      count: stats.messages || 0,
      description: "Visitor inquiries from contact form & direct email replies",
      icon: Mail,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      badge: unreadMessages > 0 ? `${unreadMessages} new` : undefined,
    },
    {
      id: "personal",
      label: "Personal Profile",
      count: stats.personal_information || 1,
      description: "Hero tagline, bio, contact details, social URLs",
      icon: User,
      color: "text-cyan-500",
      bg: "bg-cyan-500/10",
    },
    {
      id: "projects",
      label: "Projects",
      count: stats.projects || 0,
      description: "Enterprise ERPs, web apps, screenshots & gallery",
      icon: FolderGit2,
      color: "text-cyan-500",
      bg: "bg-cyan-500/10",
    },
    {
      id: "experiences",
      label: "Work Experience",
      count: stats.experiences || 0,
      description: "Employment timeline, roles, responsibilities & stacks",
      icon: Briefcase,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
    },
    {
      id: "skills",
      label: "Technical Skills",
      count: stats.skills || 0,
      description: "Languages, web frameworks, databases, design tools",
      icon: Code2,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      id: "education",
      label: "Education",
      count: stats.education || 0,
      description: "Degrees, institutions, GPA scores & certifications",
      icon: GraduationCap,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      id: "services",
      label: "Services",
      count: stats.services || 0,
      description: "Professional services offered to clients & employers",
      icon: Layers,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      id: "hobbies",
      label: "Hobbies & Arts",
      count: stats.hobbies || 0,
      description: "Creative interests, musical instruments & digital art",
      icon: Palette,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
    },
    {
      id: "faqs",
      label: "FAQs",
      count: stats.faqs || 0,
      description: "Commonly asked questions & answers in contact section",
      icon: HelpCircle,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-3xl border border-blue-500/20 bg-gradient-to-r from-blue-600/10 via-cyan-500/10 to-transparent p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
                MongoDB Atlas: Live & Connected
              </span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Welcome back, Administrator
            </h2>
            <p className="text-sm text-muted-foreground max-w-xl">
              All 8 collections are synced with your live portfolio database. Select any section below to view, add, or update documents in real time.
            </p>
          </div>

          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 self-start rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold hover:bg-muted/50 transition-colors shadow-xs"
          >
            Preview Portfolio <ExternalLink size={15} />
          </Link>
        </div>
      </div>

      {/* Grid of Collection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.id}
              onClick={() => onSelectTab(c.id)}
              className="group rounded-2xl border border-border/80 bg-card p-5 shadow-xs hover:border-blue-500/50 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${c.bg} ${c.color}`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex items-center gap-2">
                    {c.badge && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
                        {c.badge}
                      </span>
                    )}
                    <span className="text-xl font-mono font-bold text-foreground">
                      {c.count}
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-sm text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {c.label}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                  {c.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs font-semibold text-blue-600 dark:text-blue-400">
                <span>Manage Collection</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
