"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { portfolioData, ProjectItem } from "@/data/portfolioData";
import GalleryModal from "./GalleryModal";
import {
  ExternalLink,
  Eye,
  FolderGit2,
  CheckCircle2,
  Images,
  Lock,
} from "lucide-react";
import {
  cardItemVariants,
  sectionHeaderVariants,
  staggerContainerVariants,
} from "../AnimatedSection";

export default function ProjectsSection() {
  const { projects } = portfolioData;
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(
    null,
  );

  const categories = useMemo(() => {
    return ["All", "Healthcare ERP", "Enterprise ERP", "R&D Systems"];
  }, []);

  const filteredProjects = useMemo(() => {
    if (activeCategory === "All") return projects;
    return projects.filter((p) => p.category === activeCategory);
  }, [projects, activeCategory]);

  return (
    <section
      id="projects"
      className="relative py-12 md:py-16 border-t border-border/50"
    >
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header with Scroll Reveal */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionHeaderVariants}
          className="text-center max-w-3xl mx-auto mb-8"
        >
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
            Featured Work
          </div>
          <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight">
            Key Enterprise Projects
          </h2>
          <p className="mt-2 text-muted-foreground text-xs sm:text-sm">
            Production-tested healthcare ERP modules, inventory management
            systems, and enterprise R&D frameworks.
          </p>

          {/* Confidentiality & Private Project Disclaimer */}
          <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-amber-500/25 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[11px] sm:text-xs font-medium text-left">
            <Lock size={13} className="shrink-0 text-amber-500" />
            <span>
              <strong>Note:</strong> Enterprise & clinical platforms marked as <strong>Private</strong> cannot have live demo links or source code publicly disclosed due to strict confidentiality (NDA). Personal & open-source projects include direct links.
            </span>
          </div>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex flex-wrap items-center justify-center gap-1.5 mb-8"
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-xs shadow-blue-500/20"
                    : "bg-card border border-border/70 text-muted-foreground hover:text-foreground hover:bg-muted/70 hover:border-blue-500/30"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </motion.div>

        {/* Project Cards Grid with Stagger */}
        <motion.div
          layout
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainerVariants}
          className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                layout
                key={project.id}
                variants={cardItemVariants}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-border/70 bg-card/60 backdrop-blur-xs shadow-xs hover:border-blue-500/40 hover:bg-card/90 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                {/* Image Container with Hover Overlay */}
                <div
                  onClick={() => setSelectedProject(project)}
                  className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-950/80 cursor-pointer"
                >
                  <img
                    src={project.image || (project.images && project.images[0])}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent opacity-60 group-hover:opacity-85 transition-opacity" />

                  {/* Category Pill */}
                  <div className="absolute top-3 left-3">
                    <span className="rounded-md bg-blue-600/90 backdrop-blur-md px-2 py-0.5 text-[10px] font-semibold text-white shadow-xs">
                      {project.category}
                    </span>
                  </div>

                  {/* Image count badge */}
                  {project.images && project.images.length > 1 && (
                    <div className="absolute top-3 right-3 rounded-md bg-black/60 backdrop-blur-md px-2 py-0.5 text-[10px] font-medium text-white/90 flex items-center gap-1 shadow-xs">
                      <Images size={11} />
                      <span>{project.images.length}</span>
                    </div>
                  )}

                  {/* Hover Quick Action */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/40 backdrop-blur-xs">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/95 text-slate-900 px-3.5 py-2 text-xs font-bold shadow-md hover:scale-105 transition-transform">
                      <Eye size={13} className="text-blue-600" />
                      View Details
                    </span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
                  <div>
                    {project.clientOrOrg && (
                      <p className="text-[11px] font-semibold text-cyan-500 tracking-wide mb-1">
                        {project.clientOrOrg}
                      </p>
                    )}

                    <h3 className="text-base font-bold tracking-tight text-foreground group-hover:text-blue-500 transition-colors line-clamp-1">
                      {project.title}
                    </h3>

                    <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                      {project.description}
                    </p>

                    {/* Bullet Highlights */}
                    {project.highlights && project.highlights.length > 0 && (
                      <div className="mt-3 space-y-1 border-t border-border/40 pt-2.5">
                        {project.highlights
                          .slice(0, 2)
                          .map((highlight, hIdx) => (
                            <div
                              key={hIdx}
                              className="flex items-start gap-1.5 text-[11px] text-muted-foreground/90 leading-tight"
                            >
                              <CheckCircle2
                                size={12}
                                className="text-blue-500 shrink-0 mt-0.5"
                              />
                              <span className="line-clamp-1">{highlight}</span>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>

                  {/* Tech stack pills & footer actions */}
                  <div className="mt-4 pt-3 border-t border-border/50">
                    <div className="flex flex-wrap gap-1 mb-3">
                      {project.technologies.slice(0, 5).map((tech) => (
                        <span
                          key={tech}
                          className="rounded-md bg-muted/60 border border-border/40 px-1.5 py-0.5 text-[10px] font-medium text-foreground/80"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 5 && (
                        <span className="rounded-md bg-muted/30 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                          +{project.technologies.length - 5}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <button
                        onClick={() => setSelectedProject(project)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-500 hover:text-blue-600 transition-colors cursor-pointer group/btn"
                      >
                        <Eye
                          size={13}
                          className="group-hover/btn:scale-110 transition-transform"
                        />
                        <span>View Details</span>
                      </button>

                      <div className="flex items-center gap-1.5">
                        {project.isPrivate === 1 ? (
                          <span
                            className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground/75 bg-muted/40 px-2 py-0.5 rounded-md border border-border/40"
                            title="Private Enterprise System (NDA Protected)"
                          >
                            <Lock size={10} className="text-amber-500/70" />
                            <span>Private</span>
                          </span>
                        ) : (
                          <>
                            {project.liveUrl && (
                              <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg border border-border/70 text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
                                title="Live Demo"
                              >
                                <ExternalLink size={13} />
                              </a>
                            )}
                            {project.githubUrl && (
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg border border-border/70 text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors"
                                title="Source Code"
                              >
                                <FolderGit2 size={13} />
                              </a>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Project Details Modal */}
      {selectedProject && (
        <GalleryModal
          open={!!selectedProject}
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
}
