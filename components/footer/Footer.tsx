// components/layout/Footer.tsx

import db from "@/lib/db";
import Link from "next/link";
import DynamicIcon from "../DynamicIcon";

export default async function Footer() {
  const profile = await db.getOne("myinfo");

  return (
    <footer className="mt-auto border-t border-border py-10">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-cyan-400 text-xs font-bold text-white">
            N
          </div>

          <span className="font-semibold">{profile?.name}</span>
        </div>

        <div className="text-sm text-muted-foreground md:block">
          © {new Date().getFullYear()} All rights reserved
        </div>

        <div className="flex items-center gap-3">
          {profile?.contactLinks?.map((link: any) => (
            <Link
              key={link.name}
              href={link.url}
              target="_blank"
              className="
                group
                flex h-20 w-20 items-center justify-center
                rounded-xl border border-border bg-card
                transition-all duration-300
                hover:-translate-y-1
                hover:border-blue-500
                hover:shadow-lg hover:shadow-blue-500/10
              "
            >
              <DynamicIcon
                iconLibrary={link.iconLibrary}
                icon={link.icon}
                className="
                  text-lg text-muted-foreground
                  transition-colors
                  group-hover:text-blue-500
                "
              />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
