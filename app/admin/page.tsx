"use client";

import React, { useEffect, useState, useCallback } from "react";
import AdminLogin from "@/components/admin/AdminLogin";
import OverviewTab from "@/components/admin/OverviewTab";
import PersonalInfoTab from "@/components/admin/PersonalInfoTab";
import ProjectsTab from "@/components/admin/ProjectsTab";
import ExperienceTab from "@/components/admin/ExperienceTab";
import SkillsTab from "@/components/admin/SkillsTab";
import EducationTab from "@/components/admin/EducationTab";
import ServicesTab from "@/components/admin/ServicesTab";
import HobbiesTab from "@/components/admin/HobbiesTab";
import FaqsTab from "@/components/admin/FaqsTab";
import AccountTab from "@/components/admin/AccountTab";
import MessagesTab from "@/components/admin/MessagesTab";
import {
  LayoutDashboard,
  User,
  FolderGit2,
  Briefcase,
  Code2,
  GraduationCap,
  Layers,
  Palette,
  HelpCircle,
  Key,
  LogOut,
  ExternalLink,
  Loader2,
  Menu,
  X,
  Database,
  Moon,
  Sun,
  Mail,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useRealtimeMessages } from "@/lib/useRealtimeMessages";

export default function AdminPage() {
  const { theme, setTheme } = useTheme();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<string | null>(null);

  // Active Tab state
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Database Data state
  const [loadingData, setLoadingData] = useState(false);
  const [dbStats, setDbStats] = useState<Record<string, number>>({});
  const [portfolioData, setPortfolioData] = useState<any>(null);

  // Check auth session
  const verifyAuth = useCallback(async () => {
    try {
      setCheckingAuth(true);
      const res = await fetch("/api/admin/auth/me");
      const data = await res.json();
      if (res.ok && data.authenticated) {
        setIsAuthenticated(true);
        setAdminUser(data.user?.username || "admin");
      } else {
        setIsAuthenticated(false);
      }
    } catch {
      setIsAuthenticated(false);
    } finally {
      setCheckingAuth(false);
    }
  }, []);

  // Fetch full portfolio data from MongoDB
  const fetchDbData = useCallback(async () => {
    try {
      setLoadingData(true);
      const res = await fetch("/api/portfolio?data=true");
      const json = await res.json();
      if (json.success) {
        setDbStats(json.documentCounts || {});
        setPortfolioData(json.data);
      }
    } catch (err) {
      console.error("Failed to load portfolio database content:", err);
    } finally {
      setLoadingData(false);
    }
  }, []);

  // Fetch unread messages count
  const [unreadMessages, setUnreadMessages] = useState<number>(0);
  const fetchUnreadMessages = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/messages");
      const json = await res.json();
      if (json.success && json.stats) {
        setUnreadMessages(json.stats.unread || 0);
      }
    } catch {
      // ignore
    }
  }, []);

  // Listen for real-time messages when admin is browsing other tabs to update badge immediately
  useRealtimeMessages({
    enabled: isAuthenticated && activeTab !== "messages",
    onNewMessage: () => {
      setUnreadMessages((prev) => prev + 1);
    },
    playAudioAlert: true,
  });

  useEffect(() => {
    verifyAuth();
  }, [verifyAuth]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchDbData();
      fetchUnreadMessages();
    }
  }, [isAuthenticated, fetchDbData, fetchUnreadMessages]);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      setIsAuthenticated(false);
      setAdminUser(null);
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  // Save Personal Info
  const handleSavePersonalInfo = async (updatedData: any) => {
    const res = await fetch("/api/admin/data/personal_information", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    });
    if (!res.ok) throw new Error("Failed to update personal info");
    await fetchDbData();
  };

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm text-muted-foreground font-medium">
            Verifying Admin Session...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    {
      id: "messages",
      label: "Messages & Inbox",
      icon: Mail,
      badge: unreadMessages > 0 ? unreadMessages : undefined,
    },
    { id: "personal", label: "Personal Profile", icon: User },
    { id: "projects", label: "Projects", icon: FolderGit2, badge: dbStats.projects },
    { id: "experiences", label: "Work Experience", icon: Briefcase, badge: dbStats.experiences },
    { id: "skills", label: "Skills", icon: Code2, badge: dbStats.skills },
    { id: "education", label: "Education", icon: GraduationCap, badge: dbStats.education },
    { id: "services", label: "Services", icon: Layers, badge: dbStats.services },
    { id: "hobbies", label: "Hobbies & Arts", icon: Palette, badge: dbStats.hobbies },
    { id: "faqs", label: "FAQs", icon: HelpCircle, badge: dbStats.faqs },
    { id: "account", label: "Security & Account", icon: Key },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur-md px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="md:hidden p-2 rounded-xl text-muted-foreground hover:bg-muted"
          >
            {mobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white font-bold text-base shadow-sm shadow-blue-500/20">
              N
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight">Portfolio Admin</h1>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="font-mono">DB: portfolio</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-xl border border-border text-muted-foreground hover:bg-muted cursor-pointer"
            title="Toggle theme"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* View Live Portfolio */}
          <Link
            href="/"
            target="_blank"
            className="hidden sm:flex items-center gap-1.5 rounded-xl border border-border px-3 py-1.5 text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
          >
            Live Site <ExternalLink size={13} />
          </Link>

          {/* User & Logout */}
          <div className="flex items-center gap-2 pl-2 border-l border-border/60">
            <span className="hidden md:inline-block text-xs font-mono font-medium text-muted-foreground">
              {adminUser || "admin"}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-30 w-64 bg-card border-r border-border transform transition-transform duration-200 md:relative md:translate-x-0 ${
            mobileSidebarOpen ? "translate-x-0 pt-16" : "-translate-x-full md:translate-x-0"
          } flex flex-col`}
        >
          <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="p-3 border-t border-border/60">
            <div className="rounded-xl bg-muted/40 p-3 space-y-1">
              <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                Target Database
              </span>
              <span className="text-xs font-mono font-bold text-foreground block truncate">
                portfolio.mongodb.net
              </span>
            </div>
          </div>
        </aside>

        {/* Backdrop for mobile */}
        {mobileSidebarOpen && (
          <div
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 z-20 bg-background/80 backdrop-blur-xs md:hidden"
          />
        )}

        {/* Main Workspace Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          <div className="max-w-6xl mx-auto">
            {loadingData && !portfolioData ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={32} className="animate-spin text-blue-600" />
              </div>
            ) : (
              <>
                {activeTab === "overview" && (
                  <OverviewTab
                    stats={dbStats}
                    unreadMessages={unreadMessages}
                    onSelectTab={(tabId) => setActiveTab(tabId)}
                  />
                )}

                {activeTab === "messages" && (
                  <MessagesTab onStatsChange={fetchUnreadMessages} />
                )}

                {activeTab === "personal" && (
                  <PersonalInfoTab
                    initialData={portfolioData?.personal}
                    onSave={handleSavePersonalInfo}
                  />
                )}

                {activeTab === "projects" && (
                  <ProjectsTab
                    initialProjects={portfolioData?.projects || []}
                    onRefresh={fetchDbData}
                  />
                )}

                {activeTab === "experiences" && (
                  <ExperienceTab
                    initialExperiences={portfolioData?.experiences || []}
                    onRefresh={fetchDbData}
                  />
                )}

                {activeTab === "skills" && (
                  <SkillsTab
                    initialSkills={portfolioData?.skills || []}
                    onRefresh={fetchDbData}
                  />
                )}

                {activeTab === "education" && (
                  <EducationTab
                    initialEducation={portfolioData?.education || []}
                    onRefresh={fetchDbData}
                  />
                )}

                {activeTab === "services" && (
                  <ServicesTab
                    initialServices={portfolioData?.services || []}
                    onRefresh={fetchDbData}
                  />
                )}

                {activeTab === "hobbies" && (
                  <HobbiesTab
                    initialHobbies={portfolioData?.hobbies || []}
                    onRefresh={fetchDbData}
                  />
                )}

                {activeTab === "faqs" && (
                  <FaqsTab
                    initialFaqs={portfolioData?.faqs || []}
                    onRefresh={fetchDbData}
                  />
                )}

                {activeTab === "account" && <AccountTab />}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
