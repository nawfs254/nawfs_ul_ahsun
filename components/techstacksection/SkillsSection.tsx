"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { portfolioData } from "@/data/portfolioData";
import { usePortfolioData } from "@/context/PortfolioContext";
import DynamicIcon from "../DynamicIcon";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cardItemVariants, sectionHeaderVariants, staggerContainerVariants } from "../AnimatedSection";

export default function SkillsSection() {
  const { skills } = usePortfolioData();
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [showAll, setShowAll] = useState<boolean>(false);

  const categories = useMemo(() => {
    return [
      "All",
      "Web Development",
      "Programming Languages",
      "Databases",
      "Design Software",
      "Media & Audio",
      "Tools & Productivity",
    ];
  }, []);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setShowAll(false);
  };

  const filteredSkills = useMemo(() => {
    if (activeCategory === "All") return skills;
    return skills.filter((s) => s.category === activeCategory);
  }, [skills, activeCategory]);

  const displayedSkills = useMemo(() => {
    if (showAll || filteredSkills.length <= 10) {
      return filteredSkills;
    }
    return filteredSkills.slice(0, 10);
  }, [filteredSkills, showAll]);

  return (
    <section id="skills" className="relative py-12 md:py-16 border-t border-border/50 bg-muted/15">
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
            Skills & Tools
          </div>
          <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight">
            Technical Proficiency
          </h2>
          <p className="mt-2 text-muted-foreground text-xs sm:text-sm">
            Technologies, frameworks, databases, and creative software I work with.
          </p>
        </motion.div>

        {/* Category Filter Pills */}
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
                onClick={() => handleCategoryChange(cat)}
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

        {/* Smaller, sleeker skill cards grid (10 visible initially) */}
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5"
        >
          <AnimatePresence mode="popLayout">
            {displayedSkills.map((skill) => (
              <motion.div
                layout
                key={skill.name}
                initial={{ opacity: 0, y: 15, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.97 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="group relative rounded-xl border border-border/70 bg-card/75 backdrop-blur-xs p-2.5 sm:p-3 flex flex-col justify-between hover:border-blue-500/40 hover:bg-card hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex items-center justify-between gap-1.5">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 group-hover:scale-105 transition-all duration-200">
                    <DynamicIcon
                      iconLibrary={skill.iconLibrary}
                      icon={skill.icon}
                      className="text-sm text-blue-500"
                    />
                  </div>
                  {skill.level && (
                    <span className="text-[10px] font-bold text-muted-foreground group-hover:text-blue-500 transition-colors">
                      {skill.level}%
                    </span>
                  )}
                </div>

                <div className="mt-2">
                  <h3 className="text-xs font-bold text-foreground group-hover:text-blue-500 transition-colors truncate">
                    {skill.name}
                  </h3>
                  <p className="text-[9px] text-muted-foreground truncate">
                    {skill.category}
                  </p>

                  {/* Level progress bar */}
                  {skill.level && (
                    <div className="mt-1.5 h-1 w-full rounded-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                        className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-400"
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Show More / Show Less Button */}
        {filteredSkills.length > 10 && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border/80 bg-card hover:bg-muted/70 text-foreground font-semibold text-xs transition-all shadow-xs hover:border-blue-500/40 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <span>
                {showAll ? "Show Less" : `Show More Skills (${filteredSkills.length - 10} more)`}
              </span>
              {showAll ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
