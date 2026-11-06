"use client";

import React from "react";
import { motion } from "framer-motion";
import { portfolioData } from "@/data/portfolioData";
import { usePortfolioData } from "@/context/PortfolioContext";
import { Award, Calendar, GraduationCap, MapPin } from "lucide-react";
import { cardItemVariants, sectionHeaderVariants, staggerContainerVariants } from "../AnimatedSection";

export default function EducationSection() {
  const { education } = usePortfolioData();

  return (
    <section id="education" className="relative z-30 py-12 md:py-16 border-t border-border/50 bg-transparent">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header with Scroll Reveal */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionHeaderVariants}
          className="text-center max-w-3xl mx-auto mb-10"
        >
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-500 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
            Academic Background
          </div>
          <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight">
            Academic Credentials
          </h2>
          <p className="mt-2 text-muted-foreground text-xs sm:text-sm">
            Formal training and engineering degree in Computer Science and Technical Studies.
          </p>
        </motion.div>

        {/* Education Grid with Stagger */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={staggerContainerVariants}
          className="grid gap-4 md:grid-cols-3 max-w-6xl mx-auto"
        >
          {education.map((edu) => (
            <motion.div
              key={edu.degree}
              variants={cardItemVariants}
              className="relative flex flex-col justify-between rounded-2xl border border-border/70 bg-card/90 backdrop-blur-md p-4 sm:p-5 shadow-xs hover:border-blue-500/40 hover:bg-card hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
            >
              <div>
                {/* Top Icon & Year */}
                <div className="flex items-center justify-between gap-2 mb-3.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-xs shadow-blue-500/25">
                    <GraduationCap size={18} />
                  </div>
                  <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground bg-muted/60 px-2.5 py-0.5 rounded-full border border-border/40">
                    <Calendar size={11} className="text-blue-500" />
                    <span>{edu.year}</span>
                  </div>
                </div>

                {/* Degree Name */}
                <h3 className="text-sm sm:text-base font-bold text-foreground leading-snug">
                  {edu.degree}
                </h3>

                {/* Institution & Location */}
                <div className="mt-2 space-y-0.5">
                  <p className="text-xs sm:text-sm font-semibold text-blue-500">
                    {edu.institution}
                  </p>
                  <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <MapPin size={11} />
                    <span>{edu.location}</span>
                  </p>
                </div>

                {/* Description */}
                {edu.description && (
                  <p className="mt-2.5 text-xs text-muted-foreground/90 leading-relaxed line-clamp-3">
                    {edu.description}
                  </p>
                )}
              </div>

              {/* Grade Badge */}
              <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between">
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Award size={13} className="text-cyan-500" />
                  <span>Result</span>
                </div>
                <span className="font-bold text-xs sm:text-sm bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  {edu.grade}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
