"use client";

import React, { useEffect, useState } from "react";
import NavBtn from "./NavBtn";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Moon, Sun, X } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleResume = () => {
    const pdfUrl = "/assets/cv.pdf";

    // Open preview in new tab
    window.open(pdfUrl, "_blank");

    // Trigger download
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "Nawfs-Ul-Ahsun_CV.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile menu when pathname changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  return (
    <nav className="relative flex items-center justify-between px-6 py-3 bg-white dark:bg-black border-b border-gray-100 dark:border-gray-800 w-full transition-colors duration-200 z-50">
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-linear-to-tr from-blue-700 to-blue-500 text-white font-bold text-xl shadow-sm">
          N
        </div>
        <span className="font-bold text-gray-900 dark:text-white text-lg tracking-tight">
          nawfs.dev
        </span>
      </div>

      {/* Desktop Nav Links */}
      <div className="hidden lg:flex items-center gap-1">
        <NavBtn
          label="Home"
          href="/pages/home"
          isActive={pathname === "/pages/home" || pathname === "/"}
        />
        <NavBtn
          label="About"
          href="/pages/about"
          isActive={pathname === "/pages/about"}
        />
        <NavBtn
          label="Experience"
          href="/pages/experience"
          isActive={pathname === "/pages/experience"}
        />
        <NavBtn
          label="Projects"
          href="/pages/projects"
          isActive={pathname === "/pages/projects"}
        />
        <NavBtn
          label="Contact"
          href="/pages/contact"
          isActive={pathname === "/pages/contact"}
        />
      </div>

      {/* Desktop Action Buttons & Mobile Controls */}
      <div className="flex items-center gap-3 lg:gap-4">
        {mounted && (
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 transition-all duration-200 hover:scale-105 active:scale-95"
            aria-label="Toggle Dark Mode"
          >
            <motion.div
              animate={{
                rotate: theme === "dark" ? 0 : 180,
                opacity: theme === "dark" ? 1 : 0,
                scale: theme === "dark" ? 1 : 0.8,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute text-yellow-500"
            >
              <Sun size={20} />
            </motion.div>

            <motion.div
              animate={{
                rotate: theme === "dark" ? -180 : 0,
                opacity: theme === "dark" ? 0 : 1,
                scale: theme === "dark" ? 0.8 : 1,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="absolute text-slate-700 dark:text-slate-300"
            >
              <Moon size={20} />
            </motion.div>
          </button>
        )}

        {/* Desktop Buttons */}
        <div className="hidden lg:flex items-center gap-4">
          <button
            onClick={handleResume}
            className="px-5 py-2 text-[15px] font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-transparent border border-gray-200 dark:border-gray-700 rounded-sm hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors shadow-sm dark:shadow-none"
          >
            Resume
          </button>
          <Link
            href={"/pages/contact"}
            className="px-5 py-2 text-[15px] font-medium text-white bg-linear-to-r from-blue-700 to-blue-500 rounded-sm hover:opacity-90 transition-opacity shadow-sm shadow-blue-200/50 dark:shadow-none"
          >
            Hire Me
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex lg:hidden p-2 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Toggle Mobile Menu"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 bg-white dark:bg-black border-b border-gray-100 dark:border-gray-800 shadow-xl lg:hidden flex flex-col p-4 gap-4 z-50 h-[calc(100vh-65px)] overflow-y-auto"
          >
            <div className="flex flex-col gap-2 mt-4">
              <NavBtn
                label="Home"
                href="/pages/home"
                isActive={pathname === "/pages/home" || pathname === "/"}
              />
              <NavBtn
                label="About"
                href="/pages/about"
                isActive={pathname === "/pages/about"}
              />
              <NavBtn
                label="Experience"
                href="/pages/experience"
                isActive={pathname === "/pages/experience"}
              />
              <NavBtn
                label="Projects"
                href="/pages/projects"
                isActive={pathname === "/pages/projects"}
              />
              <NavBtn
                label="Contact"
                href="/pages/contact"
                isActive={pathname === "/pages/contact"}
              />
            </div>
            <div className="h-px bg-gray-100 dark:bg-gray-800 my-4" />
            <div className="flex flex-col gap-4 pb-10">
              <button
                onClick={handleResume}
                className="w-full px-5 py-3 text-[15px] font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-transparent border border-gray-200 dark:border-gray-700 rounded-sm hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                Resume
              </button>
              <Link
                href={"/pages/contact"}
                className="w-full px-5 py-3 text-[15px] font-medium text-white bg-linear-to-r from-blue-700 to-blue-500 rounded-sm hover:opacity-90 transition-opacity"
              >
                Hire Me
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
