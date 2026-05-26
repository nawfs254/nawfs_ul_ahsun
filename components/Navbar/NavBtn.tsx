import React from "react";
import Link from "next/link";

interface NavBtnProps {
  label: string;
  href: string;
  isActive?: boolean;
}

const NavBtn = ({ label, href, isActive }: NavBtnProps) => {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center justify-center px-4 py-1 rounded-sm text-[15px] font-medium transition-colors duration-200 
      ${
        isActive
          ? "bg-[#f3f4f8] text-gray-900 dark:bg-[#202538] dark:text-gray-100"
          : "text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-slate-800/40"
      }`}
    >
      <span>{label}</span>
      {isActive ? (
        <span className="w-4 h-[3px] bg-blue-500 rounded-full mt-1" />
      ) : (
        <span className="w-4 h-[3px] opacity-0 mt-1" />
      )}
    </Link>
  );
};

export default NavBtn;
