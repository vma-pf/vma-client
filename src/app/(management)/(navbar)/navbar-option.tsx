"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const SideBarOption = ({
  path,
  title,
  icon,
}: {
  path: string;
  title: string;
  icon: any;
}) => {
  const pathname = usePathname();

  return (
    <Link href={path}>
      <div
        className={`pl-2 py-3 flex flex-row items-center justify-start hover:bg-zinc-300 dark:hover:bg-zinc-700 rounded-lg ${
          pathname === path ? "bg-zinc-300 dark:bg-zinc-700" : ""
        }`}
      >
        {icon}
        <p className="ml-5 font-normal">{title}</p>
      </div>
    </Link>
  );
};

export default SideBarOption;
