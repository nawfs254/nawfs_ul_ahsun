// components/common/DynamicIcon.tsx

import * as SiIcons from "react-icons/si";
import * as FaIcons from "react-icons/fa";
import * as LuIcons from "react-icons/lu";
import * as MdIcons from "react-icons/md";

const libraries: Record<string, any> = {
  si: SiIcons,
  fa: FaIcons,
  lu: LuIcons,
  md: MdIcons,
};

export default function DynamicIcon({
  iconLibrary,
  icon,
  className,
}: {
  iconLibrary: string;
  icon: string;
  className?: string;
}) {
  const Icon = libraries[iconLibrary]?.[icon];

  if (!Icon) return null;

  return <Icon className={className} />;
}
