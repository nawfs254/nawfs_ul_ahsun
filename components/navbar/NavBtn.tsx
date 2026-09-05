"use client";

import React from "react";

interface NavBtnProps {
  label: string;
  href: string;
  isActive?: boolean;
  onClick?: () => void;
}

const NavBtn = ({ label, href, isActive, onClick }: NavBtnProps) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.substring(1);
      const element = document.getElementById(targetId);
      if (element) {
        const offset = 80; // height of sticky navbar
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }
    onClick?.();
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
        isActive
          ? "text-blue-600 dark:text-blue-400 bg-blue-500/10 font-semibold shadow-xs"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
      }`}
    >
      <span>{label}</span>
      {isActive && (
        <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
      )}
    </a>
  );
};

export default NavBtn;
