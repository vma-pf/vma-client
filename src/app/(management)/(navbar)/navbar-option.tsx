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
        className={`pl-4 py-3 flex flex-row items-center justify-start hover:bg-emerald-50 hover:dark:bg-zinc-700 hover:text-emerald-500 hover:dark:text-emerald-300 ${
          pathname === path
            ? "bg-emerald-50 text-emerald-500 dark:text-emerald-300 dark:bg-zinc-700 border-r-4 border-emerald-500 dark:border-emerald-500"
            : ""
        }`}
      >
        {icon}
        <p className="ml-5 font-normal">{title}</p>
      </div>
    </Link>
  );
};

export default SideBarOption;
