"use client";
import { Avatar, Button } from "@nextui-org/react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import React from "react";
import { HiSun, HiMoon } from "react-icons/hi";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  const titleMap: { [key: string]: string } = {
    "/dashboard": "Tổng quan",
    "/pig": "Quản lý heo",
    "/herd": "Quản lý đàn heo",
    "/medicine": "Quản lý thuốc",
    "/vaccination": "Lịch tiêm phòng",
    "/treatment": "Kế hoạch điều trị",
    "/camera": "Camera",
    "/alert": "Cảnh báo",
  };

  const toggleMode = () => setTheme(theme === "light" ? "dark" : "light");
  return (
    <div className="flex justify-between">
      <p className="font-bold text-4xl">{titleMap[pathname] || ""}</p>
      <div className="flex items-center">
        <p>Chào, admin</p>
        <Avatar
          className="mx-2"
          src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
        />
        <Button isIconOnly variant="light" onClick={toggleMode}>
          <HiSun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <HiMoon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
      </div>
    </div>
  );
};

export default Header;
