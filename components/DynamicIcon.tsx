"use client";

import React from "react";
import * as SiIcons from "react-icons/si";
import * as FaIcons from "react-icons/fa";
import * as Fa6Icons from "react-icons/fa6";
import * as LuIcons from "react-icons/lu";
import * as MdIcons from "react-icons/md";
import * as TbIcons from "react-icons/tb";
import * as RiIcons from "react-icons/ri";
import { Code2 } from "lucide-react";

const libraries: Record<string, any> = {
  si: SiIcons,
  fa: FaIcons,
  fa6: Fa6Icons,
  lu: LuIcons,
  md: MdIcons,
  tb: TbIcons,
  ri: RiIcons,
};

export default function DynamicIcon({
  iconLibrary = "fa6",
  icon,
  className = "",
}: {
  iconLibrary?: string;
  icon?: string;
  className?: string;
}) {
  if (!icon) {
    return <Code2 className={className} />;
  }

  const libKey = (iconLibrary || "fa6").toLowerCase();
  const lib = libraries[libKey] || libraries.fa6 || libraries.fa;
  const Icon = lib?.[icon] || SiIcons[icon as keyof typeof SiIcons] || Fa6Icons[icon as keyof typeof Fa6Icons] || FaIcons[icon as keyof typeof FaIcons];

  if (!Icon) {
    return <Code2 className={className} />;
  }

  return <Icon className={className} />;
}
