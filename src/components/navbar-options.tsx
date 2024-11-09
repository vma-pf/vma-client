"use client";
import { Tooltip } from "@nextui-org/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

const NavbarOptions = ({ path, prefix, title, icon, open, showText }: { path: string; prefix: string; title: string; icon: any; open: boolean; showText: boolean }) => {
  const pathname = usePathname();
  const filteredPath = pathname
    .split(prefix)
    .filter((x) => x)
    .toString();

  return (
    <Link href={prefix + path}>
      {open ? (
        <div
          className={`py-3 flex flex-row items-center duration-400 justify-start pl-7
         hover:bg-emerald-50 hover:dark:bg-zinc-700 hover:text-emerald-500 hover:dark:text-emerald-300 ${
           filteredPath === path ? "bg-emerald-50 text-emerald-500 dark:text-emerald-300 dark:bg-zinc-700 border-l-4 border-emerald-500 dark:border-emerald-500" : ""
         }`}
        >
          <span>{icon}</span>
          <p className={`duration-400 ml-5 font-normal text-nowrap transition-opacity ${showText ? "opacity-100" : "opacity-0"} ${open ? "block" : "hidden"}`}>{title}</p>
        </div>
      ) : (
        <Tooltip content={title} placement="right" closeDelay={200}>
          <div
            className={`py-3 flex flex-row items-center duration-400 justify-start pl-7
             hover:bg-emerald-50 hover:dark:bg-zinc-700 hover:text-emerald-500 hover:dark:text-emerald-300 ${
               filteredPath === path ? "bg-emerald-50 text-emerald-500 dark:text-emerald-300 dark:bg-zinc-700 border-l-4 border-emerald-500 dark:border-emerald-500" : ""
             }`}
          >
            <span>{icon}</span>
          </div>
        </Tooltip>
      )}
    </Link>
  );
};

export default NavbarOptions;
