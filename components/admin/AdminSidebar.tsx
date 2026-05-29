"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, FolderGit2, LogOut } from "lucide-react";

import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function AdminSidebar() {
  const pathname = usePathname();

  const logout = async () => {
    await signOut(auth);

    window.location.href = "/admin/login";
  };

  const menus = [
    {
      name: "Personal Info",
      href: "/admin/personalinfo",
      icon: User,
    },
    {
      name: "Projects",
      href: "/admin/projects",
      icon: FolderGit2,
    },
  ];

  return (
    <aside className="w-72 border-r border-border bg-card">
      <div className="border-b border-border p-6">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
      </div>

      <nav className="p-4">
        <div className="space-y-2">
          {menus.map((menu) => {
            const Icon = menu.icon;

            return (
              <Link
                key={menu.href}
                href={menu.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                  pathname === menu.href
                    ? "bg-blue-600 text-white"
                    : "hover:bg-muted"
                }`}
              >
                <Icon size={18} />

                {menu.name}
              </Link>
            );
          })}
        </div>

        <button
          onClick={logout}
          className="mt-10 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-500 hover:bg-red-500/10"
        >
          <LogOut size={18} />
          Logout
        </button>
      </nav>
    </aside>
  );
}
