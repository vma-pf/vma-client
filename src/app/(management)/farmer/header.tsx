"use client";
import {
  Avatar,
  Badge,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import React from "react";
import { FaBell } from "react-icons/fa6";
import { HiSun, HiMoon } from "react-icons/hi";

const FarmerHeader = () => {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const filteredPath = pathname
    .split("/farmer")
    .filter((x) => x)
    .toString();

  const titleMap: { [key: string]: string } = {
    "/dashboard": "Tổng quan",
    "/herd": "Quản lý đàn heo",
    "/medicine": "Quản lý thuốc",
    "/vaccination": "Lịch tiêm phòng",
    "/treatment": "Kế hoạch điều trị",
    "/cage": "Quản lý chuồng",
    "/alert": "Cảnh báo",
  };

  const toggleMode = () => setTheme(theme === "light" ? "dark" : "light");
  return (
    <div className="bg-slate-200 dark:bg-zinc-800 px-4 py-2 rounded-2xl flex justify-between">
      <p className="font-bold text-4xl">{titleMap[filteredPath] || ""}</p>
      <div className="flex items-center">
        <p>Chào, Farmer</p>
        <Avatar
          className="mx-2"
          src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
        />
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Button isIconOnly variant="light">
              <Badge content="5" size="sm" color="primary" shape="circle">
                <FaBell className="text-2xl text-yellow-400" />
              </Badge>
            </Button>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem key={"1"}>Thông báo 1</DropdownItem>
            <DropdownItem key={"2"}>Thông báo 2</DropdownItem>
            <DropdownItem key={"3"}>Thông báo 3</DropdownItem>
          </DropdownMenu>
        </Dropdown>
        <Button isIconOnly variant="light" onClick={toggleMode}>
          <HiSun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <HiMoon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
      </div>
    </div>
  );
};

export default FarmerHeader;
