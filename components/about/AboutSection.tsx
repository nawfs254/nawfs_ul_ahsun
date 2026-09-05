"use client";

import React from "react";
import { motion } from "framer-motion";
import { portfolioData } from "@/data/portfolioData";
import DynamicIcon from "../DynamicIcon";
import {
  Briefcase,
  Code2,
  Database,
  GraduationCap,
  Layers,
  Mail,
  MapPin,
  Palette,
  Sparkles,
} from "lucide-react";
import { cardItemVariants, sectionHeaderVariants, staggerContainerVariants } from "../AnimatedSection";

export default function AboutSection() {
  const { personal, services, hobbies } = portfolioData;

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case "Code2":
        return <Code2 className="text-blue-500" size={18} />;
      case "Layers":
        return <Layers className="text-cyan-500" size={18} />;
      case "Database":
        return <Database className="text-teal-500" size={18} />;
      case "Palette":
        return <Palette className="text-indigo-500" size={18} />;
      default:
        return <Sparkles className="text-blue-500" size={18} />;
    }
  };

  return (
    <section id="about" className="relative py-12 md:py-16 border-t border-border/50">
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
            About Me
          </div>
          <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight">
            Passion for Code, Driven by Purpose
          </h2>
          <p className="mt-2 text-muted-foreground text-xs sm:text-sm">
            A software engineer crafting fast, intuitive frontend experiences and mission-critical enterprise systems.
          </p>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Bio & Quick Facts */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 space-y-4"
          >
            <div className="rounded-2xl border border-border/70 bg-card/60 backdrop-blur-xs p-5 sm:p-6 shadow-xs hover:border-blue-500/30 transition-all duration-300">
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <span>Who I Am</span>
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              </h3>

              <div className="mt-3 space-y-2.5 text-muted-foreground leading-relaxed text-xs sm:text-sm">
                {personal.bio.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              {/* Quick Info Grid */}
              <div className="mt-6 pt-4 border-t border-border/60 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-muted/30 border border-border/40 hover:border-blue-500/40 hover:bg-muted/50 transition-all">
                  <Briefcase size={16} className="text-blue-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Current Role</span>
                    <span className="text-xs font-semibold text-foreground">Junior Software Engineer</span>
                    <span className="text-[10px] text-muted-foreground block">Orange Solutions LTD</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-muted/30 border border-border/40 hover:border-cyan-500/40 hover:bg-muted/50 transition-all">
                  <GraduationCap size={16} className="text-cyan-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Education</span>
                    <span className="text-xs font-semibold text-foreground">B.Tech in CSE</span>
                    <span className="text-[10px] text-muted-foreground block">RIMT University (CGPA 7.68)</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-muted/30 border border-border/40 hover:border-emerald-500/40 hover:bg-muted/50 transition-all">
                  <MapPin size={16} className="text-emerald-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Location</span>
                    <span className="text-xs font-semibold text-foreground">Dhaka, Bangladesh</span>
                    <span className="text-[10px] text-muted-foreground block">Adabor, Dhaka-1207</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-muted/30 border border-border/40 hover:border-indigo-500/40 hover:bg-muted/50 transition-all">
                  <Mail size={16} className="text-indigo-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Email & Phone</span>
                    <a href={`mailto:${personal.email}`} className="text-xs font-semibold text-blue-500 hover:underline block truncate">
                      {personal.email}
                    </a>
                    <span className="text-[10px] text-muted-foreground block">{personal.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Hobbies & Creative Side */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={staggerContainerVariants}
              className="rounded-2xl border border-border/70 bg-card/60 backdrop-blur-xs p-4 sm:p-5 shadow-xs"
            >
              <h4 className="text-sm font-bold text-foreground mb-3">Beyond the Terminal & Code</h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {hobbies.map((hobby) => (
                  <motion.div
                    key={hobby.name}
                    variants={cardItemVariants}
                    className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-muted/30 border border-border/50 text-center hover:border-blue-500/40 hover:bg-muted/60 hover:-translate-y-0.5 transition-all duration-200 shadow-xs"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500 mb-1.5">
                      <DynamicIcon iconLibrary={hobby.iconLibrary} icon={hobby.icon} className="text-sm" />
                    </div>
                    <span className="text-[11px] font-semibold text-foreground">{hobby.name}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Services & Core Value Add */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainerVariants}
            className="lg:col-span-5 space-y-3"
          >
            <div className="mb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500">Core Services</span>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight mt-0.5">What I Bring to the Table</h3>
            </div>

            {services.map((service) => (
              <motion.div
                key={service.title}
                variants={cardItemVariants}
                className="group rounded-xl border border-border/70 bg-card/60 backdrop-blur-xs p-3.5 hover:border-blue-500/40 hover:bg-card/90 transition-all duration-300 shadow-xs hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 group-hover:scale-105 transition-all">
                    {getServiceIcon(service.icon)}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-foreground group-hover:text-blue-500 transition-colors">
                      {service.title}
                    </h4>
                    <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
