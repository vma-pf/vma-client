"use client";
import { Tooltip } from "@nextui-org/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const SideBarOption = ({
  path,
  title,
  icon,
  open,
}: {
  path: string;
  title: string;
  icon: any;
  open: boolean;
}) => {
  const pathname = usePathname();
  const filteredPath = pathname
    .split("/veterinarian")
    .filter((x) => x)
    .toString();

  return (
    <Link href={"/veterinarian" + path}>
      {open ? (
        <div
          className={`py-3 flex flex-row items-center duration-300 ${
            open ? "justify-start pl-4" : "justify-center"
          } hover:bg-emerald-50 hover:dark:bg-zinc-700 hover:text-emerald-500 hover:dark:text-emerald-300 ${
            filteredPath === path
              ? "bg-emerald-50 text-emerald-500 dark:text-emerald-300 dark:bg-zinc-700 border-r-4 border-emerald-500 dark:border-emerald-500"
              : ""
          }`}
        >
          {icon}
          <p className="ml-5 font-normal">{title}</p>
        </div>
      ) : (
        <Tooltip content={title} placement="right" closeDelay={200}>
          <div
            className={`py-3 flex flex-row items-center duration-300 ${
              open ? "justify-start pl-4" : "justify-center"
            } hover:bg-emerald-50 hover:dark:bg-zinc-700 hover:text-emerald-500 hover:dark:text-emerald-300 ${
              filteredPath === path
                ? "bg-emerald-50 text-emerald-500 dark:text-emerald-300 dark:bg-zinc-700 border-r-4 border-emerald-500 dark:border-emerald-500"
                : ""
            }`}
          >
            {icon}
          </div>
        </Tooltip>
      )}
    </Link>
  );
};

export default SideBarOption;
