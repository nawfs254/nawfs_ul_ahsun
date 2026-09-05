"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { portfolioData } from "@/data/portfolioData";
import DynamicIcon from "../DynamicIcon";
import {
  Check,
  Copy,
  ExternalLink,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
} from "lucide-react";
import { cardItemVariants, sectionHeaderVariants, staggerContainerVariants } from "../AnimatedSection";

export default function ContactSection() {
  const { personal, faqs } = portfolioData;

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [status, setStatus] = useState<"idle" | "sending" | "success">("idle");
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personal.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(personal.phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      alert("Please fill in your name, email, and message.");
      return;
    }

    setStatus("sending");

    setTimeout(() => {
      setStatus("success");
      const mailtoUrl = `mailto:${personal.email}?subject=${encodeURIComponent(
        form.subject || `Portfolio Inquiry from ${form.name}`
      )}&body=${encodeURIComponent(
        `Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`
      )}`;

      window.open(mailtoUrl, "_blank");
    }, 500);
  };

  return (
    <section id="contact" className="relative py-12 md:py-16 border-t border-border/50">
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
            Let's Connect
          </div>
          <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-tight">
            Get In Touch
          </h2>
          <p className="mt-2 text-muted-foreground text-xs sm:text-sm">
            Have a project in mind, an opportunity to discuss, or just want to connect? My inbox is always open.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Direct Info & Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 space-y-3"
          >
            {/* Status card */}
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 backdrop-blur-xs">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <span className="text-xs sm:text-sm font-bold text-foreground">Available for Immediate Opportunities</span>
              </div>
              <p className="mt-1 text-[11px] sm:text-xs text-muted-foreground">
                Open to Web Developer / Software Engineer roles and impactful contract consultations.
              </p>
            </div>

            {/* Email card with 1-click copy */}
            <div className="rounded-xl border border-border/70 bg-card/60 backdrop-blur-xs p-3.5 hover:border-blue-500/40 transition-all">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
                    <Mail size={16} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                      Direct Email
                    </span>
                    <a
                      href={`mailto:${personal.email}`}
                      className="text-xs sm:text-sm font-semibold text-foreground hover:text-blue-500 transition-colors block truncate"
                    >
                      {personal.email}
                    </a>
                  </div>
                </div>

                <button
                  onClick={handleCopyEmail}
                  className="shrink-0 p-1.5 rounded-lg border border-border/60 hover:bg-muted/70 text-muted-foreground hover:text-foreground transition-all"
                  title="Copy email address"
                >
                  {copiedEmail ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            {/* Phone card with 1-click copy */}
            <div className="rounded-xl border border-border/70 bg-card/60 backdrop-blur-xs p-3.5 hover:border-cyan-500/40 transition-all">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-500">
                    <Phone size={16} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                      Mobile & WhatsApp
                    </span>
                    <a
                      href={`tel:${personal.phone.replace(/\s+/g, "")}`}
                      className="text-xs sm:text-sm font-semibold text-foreground hover:text-cyan-500 transition-colors block truncate"
                    >
                      {personal.phone}
                    </a>
                  </div>
                </div>

                <button
                  onClick={handleCopyPhone}
                  className="shrink-0 p-1.5 rounded-lg border border-border/60 hover:bg-muted/70 text-muted-foreground hover:text-foreground transition-all"
                  title="Copy phone number"
                >
                  {copiedPhone ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            {/* Location card */}
            <div className="rounded-xl border border-border/70 bg-card/60 backdrop-blur-xs p-3.5">
              <div className="flex items-start gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-500/10 text-teal-500">
                  <MapPin size={16} />
                </div>
                <div>
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
                    Location & Residence
                  </span>
                  <p className="text-xs sm:text-sm font-semibold text-foreground mt-0.5">
                    {personal.address}
                  </p>
                </div>
              </div>
            </div>

            {/* Social links grid */}
            <div className="rounded-xl border border-border/70 bg-card/60 backdrop-blur-xs p-3.5">
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider block mb-2.5">
                Connect on Social Networks
              </span>
              <div className="grid grid-cols-2 gap-2">
                {personal.socialLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-2 rounded-lg border border-border/60 bg-muted/30 hover:bg-muted/70 hover:border-blue-500/40 hover:text-blue-500 transition-all text-xs font-semibold"
                  >
                    <div className="flex items-center gap-1.5">
                      <DynamicIcon iconLibrary={link.iconLibrary} icon={link.icon} className="text-sm" />
                      <span>{link.name}</span>
                    </div>
                    <ExternalLink size={11} className="opacity-60" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column: Interactive Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7"
          >
            <div className="rounded-2xl border border-border/70 bg-card/60 backdrop-blur-xs p-5 sm:p-6 shadow-md">
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <span>Send a Direct Message</span>
                <MessageSquare size={17} className="text-blue-500" />
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                Leave a message below to instantly reach out via email.
              </p>

              {status === "success" ? (
                <div className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-center space-y-3">
                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md shadow-emerald-500/30">
                    <Check size={22} />
                  </div>
                  <h4 className="text-base font-bold text-foreground">Message Ready!</h4>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Your email client has been prepared with your message to <strong>{personal.email}</strong>.
                  </p>
                  <button
                    onClick={() => {
                      setStatus("idle");
                      setForm({ name: "", email: "", subject: "", message: "" });
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-5 space-y-3">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="e.g. John Doe"
                        className="w-full rounded-lg border border-border bg-background/70 px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="e.g. john@example.com"
                        className="w-full rounded-lg border border-border bg-background/70 px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      placeholder="e.g. Full-Time Opportunity / Project Discussion"
                      className="w-full rounded-lg border border-border bg-background/70 px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                      Message *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      placeholder="Hi Nawfs, I came across your portfolio and wanted to discuss..."
                      className="w-full rounded-lg border border-border bg-background/70 px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-y"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="inline-flex items-center justify-center gap-1.5 px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-medium text-xs sm:text-sm shadow-md shadow-blue-500/25 hover:shadow-blue-500/35 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer disabled:opacity-60"
                  >
                    {status === "sending" ? (
                      <span>Preparing...</span>
                    ) : (
                      <>
                        <Send size={14} />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>

        {/* FAQs Staggered Cards */}
        {faqs && faqs.length > 0 && (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainerVariants}
            className="mt-12 pt-10 border-t border-border/40"
          >
            <div className="text-center max-w-2xl mx-auto mb-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500">FAQ</span>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight mt-0.5">Frequently Asked Questions</h3>
            </div>

            <div className="grid gap-3 md:grid-cols-3 max-w-5xl mx-auto">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  variants={cardItemVariants}
                  className="rounded-xl border border-border/70 bg-card/60 backdrop-blur-xs p-4 shadow-xs hover:border-blue-500/30 hover:-translate-y-0.5 transition-all"
                >
                  <h4 className="text-xs sm:text-sm font-bold text-foreground mb-1.5">{faq.question}</h4>
                  <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
