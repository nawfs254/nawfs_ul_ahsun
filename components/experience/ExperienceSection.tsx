"use client";

import React, { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { portfolioData } from "@/data/portfolioData";
import { usePortfolioData } from "@/context/PortfolioContext";
import { Briefcase, Calendar, CheckCircle2, MapPin } from "lucide-react";
import { cardItemVariants, sectionHeaderVariants, staggerContainerVariants } from "../AnimatedSection";

export default function ExperienceSection() {
  const { experiences } = usePortfolioData();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 80%", "end 20%"],
  });

  const lineHeight = useSpring(useTransform(scrollYProgress, [0, 1], ["0%", "100%"]), {
    stiffness: 100,
    damping: 30,
  });

  return (
    <section ref={sectionRef} id="experience" className="relative py-12 md:py-16 border-t border-border/50">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionHeaderVariants}
          className="text-center max-w-3xl mx-auto mb-10"
        >
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
            Work Experience
          </div>
          <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight">
            Professional Experience
          </h2>
          <p className="mt-2 text-muted-foreground text-xs sm:text-sm">
            My career track in software development, enterprise ERP implementations, and technical R&D.
          </p>
        </motion.div>

        {/* Experience Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Static background line track */}
          <div className="absolute left-4 sm:left-5 top-5 bottom-5 w-0.5 bg-border/40" />

          {/* Animated dynamic line that draws down on scroll */}
          <motion.div
            style={{ height: lineHeight }}
            className="absolute left-4 sm:left-5 top-5 w-0.5 bg-gradient-to-b from-blue-600 via-cyan-400 to-emerald-400 origin-top z-0 shadow-xs shadow-blue-500/50"
          />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={staggerContainerVariants}
            className="space-y-6"
          >
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.role + exp.company}
                variants={cardItemVariants}
                className="relative pl-11 sm:pl-14 group"
              >
                {/* Timeline node icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`absolute left-1.5 sm:left-2.5 top-1 z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                    exp.current
                      ? "border-blue-500 bg-background text-blue-500 shadow-sm shadow-blue-500/30 scale-105"
                      : "border-border bg-card text-muted-foreground group-hover:border-cyan-500 group-hover:text-cyan-500"
                  }`}
                >
                  <Briefcase size={12} />
                </motion.div>

                {/* Experience Card */}
                <div className="rounded-2xl border border-border/70 bg-card/60 backdrop-blur-xs p-5 sm:p-6 shadow-xs hover:border-blue-500/40 hover:bg-card/90 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
                  {/* Top Bar: Role, Company, Period */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border/50">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base sm:text-lg font-bold text-foreground">
                          {exp.role}
                        </h3>
                        {exp.current && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.2 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                            <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                            Current
                          </span>
                        )}
                        <span className="rounded-full bg-muted px-2 py-0.2 text-[10px] font-medium text-muted-foreground">
                          {exp.type}
                        </span>
                      </div>

                      <p className="mt-0.5 text-xs sm:text-sm font-semibold text-blue-500">
                        {exp.company}
                      </p>
                    </div>

                    <div className="flex flex-col sm:items-end gap-0.5 text-[11px] text-muted-foreground shrink-0">
                      <div className="inline-flex items-center gap-1 font-medium">
                        <Calendar size={12} className="text-blue-500" />
                        <span>{exp.period}</span>
                      </div>
                      <div className="inline-flex items-center gap-1">
                        <MapPin size={12} />
                        <span>{exp.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  {exp.summary && (
                    <p className="mt-3 text-xs sm:text-sm text-foreground/90 font-medium">
                      {exp.summary}
                    </p>
                  )}

                  {/* Bullet points from CV */}
                  <ul className="mt-3 space-y-1.5">
                    {exp.responsibilities.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                        <CheckCircle2 size={14} className="text-cyan-500 shrink-0 mt-0.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Tech stack badges */}
                  {exp.techStack?.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-border/40 flex flex-wrap gap-1.5">
                      {exp.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-lg bg-muted/60 border border-border/50 px-2 py-0.5 text-[10px] sm:text-[11px] font-medium text-foreground/80 hover:bg-blue-500/10 hover:border-blue-500/30 hover:text-blue-500 transition-colors"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
